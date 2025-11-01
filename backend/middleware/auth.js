const supabase = require('../config/supabaseClient');

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'Authentication token nahi mila' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: 'Invalid token ya user nahi mila', error });
    }

    // User ki details ko request object mein add kar dein taaki agle controllers use kar sakein
    req.user = data.user;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = verifyUser;