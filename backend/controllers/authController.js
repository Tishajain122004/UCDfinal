const supabase = require('../config/supabaseClient');

// Yeh function tab call hoga jab user frontend se signup kar lega
// Hum yahaan public.users table mein ek profile banayenge
exports.createProfile = async (req, res) => {
    // === LOGS (Pehle se hain) ===
    console.log('>>> Inside createProfile controller');
    console.log('User from middleware:', req.user); // Check karein user mila ya nahi
    console.log('Request Body:', req.body); // Check karein 'name' aaya ya nahi
    // ========================

    try {
        // req.user.id aur req.user.email middleware se aa raha hai
        const auth_id = req.user.id;
        const email = req.user.email;
        const { name } = req.body; // User ka naam frontend se aa raha hai

        if (!name) {
            console.error('ERROR: Name is missing in request body'); // Error log
            return res.status(400).json({ message: 'Name zaroori hai' });
        }

        console.log(`Attempting to insert profile: auth_id=${auth_id}, email=${email}, name=${name}`); // Log before insert

        const { data, error } = await supabase
            .from('users')
            .insert([
                { auth_id: auth_id, email: email, name: name }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error); // Supabase error log
            // Agar profile pehle se hai (unique constraint error)
            if (error.code === '23505') {
                console.log('Profile already exists, returning 200');
                return res.status(200).json({ message: 'Profile pehle se hai', exists: true });
            }
            throw error; // Baaki errors ko throw karein
        }

        console.log('Profile created successfully:', data); // Success log
        res.status(201).json({ success: true, userProfile: data });

    } catch (error) {
        // ===== CATCH BLOCK UPDATE YAHAA HAI =====
        console.error('>>> CATCH BLOCK ERROR in createProfile:');
        console.error('Error Object:', error); // Poora error object print karein
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack); // Stack trace bhi print karein
        // ======================================
        res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
};
