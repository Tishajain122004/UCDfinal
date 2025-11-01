const supabase = require('../config/supabaseClient');

// Helper function: Auth ID se internal User ID nikaalne ke liye
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

// 1. Nayi journal entry banayein
exports.createJournalEntry = async (req, res) => {
  try {
    const auth_id = req.user.id; // Middleware se mila
    const user_id = await getInternalUserId(auth_id);

    // Frontend se data lein (mood aur tag hata diye gaye)
    const { title, content, grateful, accomplished, date } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content zaroori hai' });
    }

    const { data, error } = await supabase
      .from('journals')
      .insert([
        { 
          user_id, 
          date: date || new Date().toISOString().split('T')[0], // YYYY-MM-DD
          title: title || 'New Entry',
          content,
          grateful,
          accomplished
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

// 2. Sirf 3 recent entries fetch karein
exports.getRecentJournalEntries = async (req, res) => {
  try {
    const auth_id = req.user.id;
    const user_id = await getInternalUserId(auth_id);

    const { data, error } = await supabase
      .from('journals')
      .select('*') // * ab mood aur tag nahi layega
      .eq('user_id', user_id)
      .order('date', { ascending: false }) 
      .limit(3);

    if (error) throw error;
    res.status(200).json({ success: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Sabhi entries fetch karein (Filter ke saath)
exports.getAllJournalEntries = async (req, res) => {
  try {
    const auth_id = req.user.id;
    const user_id = await getInternalUserId(auth_id);
    const { month, year } = req.query;

    let query = supabase
      .from('journals')
      .select('*') // * ab mood aur tag nahi layega
      .eq('user_id', user_id)
      .order('date', { ascending: false });

    if (month && year) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      query = query
        .gte('date', startDate)
        .lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.status(200).json({ success: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

