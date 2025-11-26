const supabase = require('../config/supabaseClient');

// Helper function: Auth ID se internal User ID nikaalne ke liye
// NOTE: Is function ko ek common 'utils/dbHelpers.js' file mein rakhna behtar hai
async function getInternalUserId(authId) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', authId)
    .single();
  
  if (error || !data) {
    throw new Error('User profile not found for auth ID');
  }
  return data.id;
}

// 1. Nayi focus session banayein
exports.createFocusSession = async (req, res) => {
  try {
    const auth_id = req.user.id; // Middleware se mila
    const user_id = await getInternalUserId(auth_id);

    const { duration, mode, completed } = req.body;

    // ===== YEH RAHI AAPKI 5 MINUTE WAALI CONDITION =====
    // 5 minutes = 300 seconds
    if (!duration || duration < 120) {
      return res.status(200).json({ 
        success: true, 
        message: 'Session 2 minute se kam tha, save nahi kiya gaya.',
        data: null 
      });
    }
    // =================================================

    const { data, error } = await supabase
      .from('focus_sessions')
      .insert([
        { 
          user_id, 
          duration,
          mode,
          completed
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });

  } catch (err) {
    console.error("FocusSession Controller Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. User ke saare sessions fetch karein
exports.getAllFocusSessions = async (req, res) => {
  try {
    const auth_id = req.user.id;
    const user_id = await getInternalUserId(auth_id);

    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false }); // Sabse naya pehle

    if (error) throw error;
    res.status(200).json({ success: true, data });

  } catch (err) {
    console.error("FocusSession Controller Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
