import { supabase } from '../config/supabaseClient';

// ‼️ IMPORTANT: Yahaan apna IP daalein (wahi IP jo aapne journalApi.js mein daala tha)
const BACKEND_URL = 'http://10.182.87.36:8001'; 

// Helper function: Current user ka token nikaalne ke liye
const getAuthToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    console.error("groupApi: Session nahi mila", error);
    return null;
  }
  return session.access_token;
};

// 1. Naya Group Banayein
export const createGroup = async (groupData) => {
  console.log("groupApi: createGroup function called");
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(groupData), // { name, subject, description, isPrivate }
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Group create nahi hua");
  }
  return await response.json();
};

// 2. User ke Apne Groups Fetch Karein
export const getMyGroups = async () => {
  console.log("groupApi: getMyGroups function called");
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/groups/my-groups`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "My Groups fetch nahi hue");
  }
  return await response.json();
};

// 3. Saare Public Groups Fetch Karein (Discover ke liye)
export const getAllPublicGroups = async () => {
  console.log("groupApi: getAllPublicGroups function called");
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/groups/public`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Public Groups fetch nahi hue");
  }
  return await response.json();
};

// 4. Ek Group Join Karein
export const joinGroup = async (groupId) => {
  console.log("groupApi: joinGroup function called for group:", groupId);
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/groups/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ group_id: groupId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Group join nahi kar paaye");
  }
  return await response.json();
};
