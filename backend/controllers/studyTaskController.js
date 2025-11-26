const supabase = require('../config/supabaseClient');

// Helper function: Auth ID se internal User ID nikaalne ke liye
// (Yeh journalController se copy kar sakte hain ya common helper bana sakte hain)
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

// 1. Naya task banayein
exports.createTask = async (req, res) => {
  try {
    const auth_id = req.user.id; // Middleware se mila
    const user_id = await getInternalUserId(auth_id);
    const { title, priority } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title zaroori hai' });
    }

    const { data, error } = await supabase
      .from('study_tasks')
      .insert([
        { 
          user_id,
          title,
          priority: priority || 'Medium',
          status: 'Active',
          subtasks: '[]' // Empty array se shuruaat
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. User ke saare tasks fetch karein
exports.getAllTasks = async (req, res) => {
  try {
    const auth_id = req.user.id;
    const user_id = await getInternalUserId(auth_id);

    const { data, error } = await supabase
      .from('study_tasks')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false }); // Naye tasks upar

    if (error) throw error;
    res.status(200).json({ success: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Task ko update karein (Priority, Status, ya Subtasks)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params; // Task ki ID (task.id)
    const auth_id = req.user.id;
    const user_id = await getInternalUserId(auth_id);

    // Frontend se naya data lein
    const { title, status, priority, subtasks } = req.body;

    // Check karein ki user is task ka owner hai ya nahi (extra security)
    const { data: existingTask, error: ownerError } = await supabase
      .from('study_tasks')
      .select('id')
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (ownerError || !existingTask) {
      return res.status(404).json({ success: false, message: 'Task not found or permission denied' });
    }

    // Update karne ke liye data object banayein
    const updateData = {};
    if (title) updateData.title = title;
    if (status) updateData.status = status; // 'Active' ya 'Completed'
    if (priority) updateData.priority = priority;
    if (subtasks) updateData.subtasks = subtasks; // Poora naya subtask array

    const { data, error } = await supabase
      .from('study_tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ success: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Task ko delete karein
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params; // Task ki ID
    const auth_id = req.user.id;
    const user_id = await getInternalUserId(auth_id);

    const { error } = await supabase
      .from('study_tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id); // Sirf apna task hi delete kar sakte hain

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Task deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
