import { supabase } from '../config/supabaseClient';

// ‼️ IMPORTANT: Yahaan apna IP daalein
const BACKEND_URL = 'http://10.21.1.179:8001'; 

// Helper function: Current user ka token nikaalne ke liye
const getAuthToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    console.error("focusTimerApi: Session nahi mila", error);
    return null;
  }
  return session.access_token;
};

// Nayi focus session banayein
export const createFocusSession = async (sessionData) => {
  console.log("focusTimerApi: createFocusSession called with:", sessionData);
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/focus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(sessionData),
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Session save nahi hua");
    }
    return await response.json();
  } catch (error) {
    console.error("focusTimerApi: createFocusSession Error:", error);
    throw error;
  }
};

// Sabhi sessions fetch karein
export const getAllFocusSessions = async () => {
  console.log("focusTimerApi: getAllFocusSessions called");
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/focus`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Sessions fetch nahi hui");
    }
    return await response.json();
  } catch (error) {
    console.error("focusTimerApi: getAllFocusSessions Error:", error);
    throw error;
  }
};
