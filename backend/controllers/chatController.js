const supabase = require('../config/supabaseClient');

// Helper function: Auth ID se internal User ID nikaalne ke liye
async function getInternalUserId(authId) {
  if (!authId) {
    throw new Error('Authentication ID is missing');
  }
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', authId)
    .single();
  
  if (error || !data) {
    console.error('getInternalUserId error:', error);
    throw new Error('User profile not found for auth ID: ' + authId);
  }
  return data.id;
}

// 1. Ek group ke saare messages fetch karein
exports.getMessagesForGroup = async (req, res) => {
  try {
    const { group_id } = req.params; // URL se group_id lein

    // Messages fetch karein aur saath mein user ka naam join karein
    const { data, error } = await supabase
      .from('group_messages')
      .select(`
        id,
        created_at,
        text,
        users ( id, name ) 
      `)
      .eq('group_id', group_id)
      .order('created_at', { ascending: true }); // Purane se naye

    if (error) throw error;

    // Data ko clean karein (nested 'users' object ko top level par laayein)
    const formattedData = data.map(msg => ({
      id: msg.id,
      created_at: msg.created_at,
      text: msg.text,
      sender: { // 'users' object ko 'sender' object banayein
        id: msg.users.id,
        name: msg.users.name || 'Unknown User'
      }
    }));

    res.status(200).json({ success: true, data: formattedData });

  } catch (err) {
    console.error("Error in getMessagesForGroup:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Naya message bhej/save karein
exports.sendMessage = async (req, res) => {
  try {
    const auth_id = req.user.id; // Middleware se mila
    const user_id = await getInternalUserId(auth_id);
    const { group_id, text } = req.body;

    if (!group_id || !text) {
      return res.status(400).json({ success: false, message: 'Group ID and text are required' });
    }

    const { data, error } = await supabase
      .from('group_messages')
      .insert({
        group_id,
        text,
        user_id
      })
      .select()
      .single();

    if (error) throw error;

    // Realtime ke liye, humein naya message sender info ke saath waapas bhejna hoga
    // Lekin Realtime subscription yeh frontend par handle kar lega.
    res.status(201).json({ success: true, data });

  } catch (err) {
    console.error("Error in sendMessage:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
