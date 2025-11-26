const supabase = require('../config/supabaseClient');

// Helper function: Auth ID se internal User ID nikaalne ke liye
async function getInternalUserId(authId) {
  if (!authId) throw new Error('Authentication ID is missing');
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', authId)
    .single();
  if (error || !data) throw new Error('User profile not found for auth ID: ' + authId);
  return data.id;
}

// 1. User ke saare unlocked achievements fetch karein (Nayi screen ke liye)
exports.getMyAchievements = async (req, res) => {
  try {
    const auth_id = req.user.id;
    const user_id = await getInternalUserId(auth_id);

    // User ke achievements (user_achievements) aur unki details (achievements) ko join karein
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        unlocked_at,
        achievements (
          id,
          title,
          description,
          icon
        )
      `)
      .eq('user_id', user_id)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, data });

  } catch (err) {
    console.error("Error in getMyAchievements:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};


// 2. Naye achievements check aur grant karein (Yeh internal function hai)
// Isko 'focusSessionController' call karega
exports.checkAndGrantAchievements = async (userId) => {
  try {
    // Step A: User ka total focus time calculate karein
    const { data: focusData, error: focusError } = await supabase
      .from('focus_sessions')
      .select('duration')
      .eq('user_id', userId);
      
    if (focusError) throw focusError;

    const totalFocusTime = focusData.reduce((acc, session) => acc + session.duration, 0);

    // Step B: Saare possible achievements fetch karein
    const { data: allAchievements, error: achError } = await supabase
      .from('achievements')
      .select('*')
      .lte('benchmark_seconds', totalFocusTime); // Sirf woh benchmarks laayein jo user cross kar chuka hai
      
    if (achError) throw achError;

    // Step C: User ke puraane achievements fetch karein
    const { data: userAchievements, error: userAchError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);
      
    if (userAchError) throw userAchError;

    const unlockedIds = userAchievements.map(ua => ua.achievement_id);

    // Step D: Naye (unlocked) achievements dhoondhein
    const newAchievementsToGrant = allAchievements.filter(ach => 
      !unlockedIds.includes(ach.id) // Check karein ki user ke paas yeh pehle se nahi hai
    );

    if (newAchievementsToGrant.length > 0) {
      // Step E: Naye achievements ko database mein save karein
      const newEntries = newAchievementsToGrant.map(ach => ({
        user_id: userId,
        achievement_id: ach.id
      }));

      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert(newEntries);
        
      if (insertError) throw insertError;
      
      console.log(`User ${userId} unlocked ${newAchievementsToGrant.length} new achievements!`);
      // Frontend ko batane ke liye naye achievements return karein
      return newAchievementsToGrant; 
    }

    return []; // Koi naya achievement nahi mila

  } catch (err) {
    console.error("Error in checkAndGrantAchievements:", err.message);
    return []; // Error ho toh empty return karein
  }
};