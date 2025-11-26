// const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config();

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// module.exports = supabase;




const { createClient } = require('@supabase/supabase-js');
// Path ko adjust karein agar .env file root folder mein hai, warna default chhod dein
// Example: require('dotenv').config({ path: '../.env' });
require('dotenv').config(); 

// === DEBUG LOGS ADD KIYE GAYE HAIN ===
console.log("DEBUG: Loading .env variables...");
console.log("DEBUG: SUPABASE_URL =", process.env.SUPABASE_URL); 
console.log("DEBUG: SUPABASE_SERVICE_KEY =", process.env.SUPABASE_SERVICE_KEY ? "Loaded (hidden)" : "NOT LOADED or EMPTY"); // Key ko print nahi karenge
// ===================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; 

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("ERROR: .env variables missing or incorrect."); // Extra log
  throw new Error('Supabase URL ya SERVICE KEY .env file mein nahi hai ya galat hai'); 
}

console.log("DEBUG: Supabase Client initializing..."); // Success log before creating client

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log("DEBUG: Supabase Client initialized successfully."); // Success log after creating client

module.exports = supabase;