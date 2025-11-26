import { supabase } from '../config/supabaseClient';

// ‼️ IMPORTANT: Yahaan apna deployed URL (ya local IP) daalein
const BACKEND_URL = 'https://ucdfinal1.onrender.com'; 

// Helper function: Current user ka token nikaalne ke liye
const getAuthToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    console.error("rewardApi: Session nahi mila", error);
    return null;
  }
  return session.access_token;
};

// 1. User ke saare unlocked achievements fetch karein
export const getMyRewards = async () => {
  console.log("rewardApi: getMyRewards function called");
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/rewards`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Rewards fetch nahi hue");
  }
  return await response.json();
};