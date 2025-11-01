const supabase = require('../config/supabaseClient');

// Helper function: Auth ID se internal User ID nikaalne ke liye
// (Yeh function aapke dusre controllers mein bhi hai, ise ek common file mein daalna behtar hai)
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

// 1. Naya Group Banayein
exports.createGroup = async (req, res) => {
  try {
    const auth_id = req.user.id; // Middleware se mila
    const user_id = await getInternalUserId(auth_id);
    const { name, subject, description, is_private } = req.body; // 'subject' add kiya

    if (!name || !subject) { // 'subject' ko required banaya
      return res.status(400).json({ success: false, message: 'Group name and subject are required' });
    }

    // Step 1: Naya group 'groups' table mein banayein
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert({
        name,
        subject, // 'subject' save karein
        description,
        is_private,
        created_by: user_id // Creator ko admin banayein
      })
      .select()
      .single();
    
    if (groupError) throw groupError;

    // Step 2: Creator ko automatically 'group_members' table mein add karein
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: groupData.id,
        user_id: user_id
      });
    
    if (memberError) {
        // Agar member add nahi hua (rare case), toh group delete kar dein
        await supabase.from('groups').delete().eq('id', groupData.id);
        throw memberError;
    }

    res.status(201).json({ success: true, data: groupData });

  } catch (err) {
    console.error("Error in createGroup:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Ek Group ko Join Karein
exports.joinGroup = async (req, res) => {
  try {
    const auth_id = req.user.id;
    const user_id = await getInternalUserId(auth_id);
    const { group_id } = req.body; // Frontend se group_id bhejein

    if (!group_id) {
      return res.status(400).json({ success: false, message: 'Group ID is required' });
    }

    // Yahaan check karein ki group private toh nahi hai
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('is_private')
      .eq('id', group_id)
      .single();

    if (groupError || !group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    
    // Aapke plan ke mutabik: Private groups ko join nahi kar sakte (sirf link se)
    if (group.is_private) {
      return res.status(403).json({ success: false, message: 'This is a private group and can only be joined via an invite link.' });
    }
    
    // Group join karein
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: group_id,
        user_id: user_id
      })
      .select()
      .single();
    
    if (error) {
      // Agar user pehle se member hai (unique constraint error)
      if (error.code === '23505') {
        return res.status(409).json({ success: false, message: 'You are already a member of this group' });
      }
      throw error;
    }

    res.status(201).json({ success: true, data });

  } catch (err) {
    console.error("Error in joinGroup:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Ek Group ko Chhodein (Leave)
exports.leaveGroup = async (req, res) => {
  try {
    const auth_id = req.user.id;
    const user_id = await getInternalUserId(auth_id);
    const { group_id } = req.params; // URL se group_id lein (e.g., /api/v1/groups/leave/:group_id)

    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', group_id)
      .eq('user_id', user_id); // Sirf khud ko delete karein

    if (error) throw error;
    
    res.status(200).json({ success: true, message: 'Successfully left the group' });

  } catch (err) {
    console.error("Error in leaveGroup:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Sirf woh groups fetch karein jismein user member hai
exports.getMyGroups = async (req, res) => {
  try {
    const auth_id = req.user.id;
    const user_id = await getInternalUserId(auth_id);

    // Pehle user ki member waali entries dhoondhein, aur fir unse judi group info le aayein
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        groups (
          id,
          name,
          subject,
          description,
          is_private
        )
      `)
      .eq('user_id', user_id);

    if (error) throw error;
    
    // Data nest hoke aayega (e.g., [{ groups: {...} }, ...]), use clean karein
    const userGroups = data.map(item => item.groups).filter(Boolean); // .filter(Boolean) taaki null values hat jaayein
    res.status(200).json({ success: true, data: userGroups });

  } catch (err) {
    console.error("Error in getMyGroups:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. Sabhi public groups fetch karein (Discover page ke liye)
exports.getAllPublicGroups = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('is_private', false) // Sirf public groups
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, data });

  } catch (err) {
    console.error("Error in getAllPublicGroups:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

