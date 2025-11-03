import { supabase } from '../config/supabaseClient';

// ‼️ IMPORTANT: Yahaan apna IP daalein (wahi IP jo aapne journalApi.js mein daala tha)
const BACKEND_URL = 'http://10.21.1.179:8001'; 

// Helper function: Current user ka token nikaalne ke liye
const getAuthToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    console.error("chatApi: Session nahi mila", error);
    return null;
  }
  return session.access_token;
};

// 1. Ek group ke saare messages fetch karein
export const getMessages = async (groupId) => {
  console.log("chatApi: getMessages function called for group:", groupId);
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/chat/${groupId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Messages fetch nahi hue");
  }
  return await response.json();
};

// 2. Naya message bhej/save karein
export const sendMessage = async (messageData) => {
  console.log("chatApi: sendMessage function called");
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(messageData), // { group_id, text }
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Message bhej nahi paaye");
  }
  return await response.json();
};
