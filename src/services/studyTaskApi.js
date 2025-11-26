import { supabase } from '../config/supabaseClient';

// ‼️ IMPORTANT: Yahaan apna IP daalein (journalApi.js se copy kar lein)
const BACKEND_URL = 'https://ucdfinal1.onrender.com'; 

// Helper function: Current user ka token nikaalne ke liye
const getAuthToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    console.error("studyTaskApi: Session nahi mila", error);
    return null;
  }
  return session.access_token;
};

// 1. Naya task banayein
export const createTask = async (taskData) => {
  console.log("studyTaskApi: createTask called with:", taskData);
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(taskData), // { title, priority }
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Task save nahi hua");
  }
  return await response.json();
};

// 2. Saare tasks fetch karein
export const getAllTasks = async () => {
  console.log("studyTaskApi: getAllTasks called");
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/tasks`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Tasks fetch nahi hue");
  }
  return await response.json();
};

// 3. Task ko update karein (status, priority, subtasks, etc.)
export const updateTask = async (taskId, updateData) => {
  console.log(`studyTaskApi: updateTask called for ID ${taskId} with:`, updateData);
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Task update nahi hua");
  }
  return await response.json();
};

// 4. Task ko delete karein
export const deleteTask = async (taskId) => {
  console.log(`studyTaskApi: deleteTask called for ID ${taskId}`);
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BACKEND_URL}/api/v1/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Task delete nahi hua");
  }
  return await response.json();
};
