// import { supabase } from '../config/supabaseClient';

// // ‼️ IMPORTANT: Yahaan apna IP daalein
// const BACKEND_URL = 'http://10.193.206.36:8001'; 

// // Helper function: Current user ka token nikaalne ke liye
// const getAuthToken = async () => {
//   const { data: { session }, error } = await supabase.auth.getSession();
//   if (error || !session) {
//     console.error("Session nahi mila", error);
//     return null;
//   }
//   return session.access_token;
// };

// // Nayi entry banayein
// export const createEntry = async (entryData) => {
//   const token = await getAuthToken();
//   if (!token) throw new Error("Not authenticated");

//   const response = await fetch(`${BACKEND_URL}/api/v1/journal`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//     body: JSON.stringify(entryData),
//   });
  
//   if (!response.ok) {
//     const err = await response.json();
//     throw new Error(err.message || "Entry save nahi hui");
//   }
//   return await response.json();
// };

// // Recent 3 entries laayein
// export const getRecentEntries = async () => {
//   const token = await getAuthToken();
//   if (!token) throw new Error("Not authenticated");

//   const response = await fetch(`${BACKEND_URL}/api/v1/journal/recent`, {
//     headers: { 'Authorization': `Bearer ${token}` },
//   });

//   if (!response.ok) {
//     const err = await response.json();
//     throw new Error(err.message || "Entries fetch nahi hui");
//   }
//   return await response.json();
// };

// // Sabhi entries laayein (filter ke saath)
// export const getAllEntries = async (month, year) => {
//   const token = await getAuthToken();
//   if (!token) throw new Error("Not authenticated");

//   let url = `${BACKEND_URL}/api/v1/journal/all`;
  
//   if (month && year) {
//     url += `?month=${month}&year=${year}`; // Query params
//   }

//   const response = await fetch(url, {
//     headers: { 'Authorization': `Bearer ${token}` },
//   });

//   if (!response.ok) {
//     const err = await response.json();
//     throw new Error(err.message || "Entries fetch nahi hui");
//   }
//   return await response.json();
// };




// src/services/journalApi.js

// import { supabase } from '../config/supabaseClient';

// // ‼️ CHECK 1: Kya yeh IP address abhi bhi sahi hai?
// const BACKEND_URL = 'http://10.21.1.179:8001';

// // Helper function: Current user ka token nikaalne ke liye
// const getAuthToken = async () => {
//   const { data: { session }, error } = await supabase.auth.getSession();
//   if (error || !session) {
//     console.error(" journalApi: Session nahi mila", error); // Added log
//     return null;
//   }
//   return session.access_token;
// };

// // Nayi entry banayein
// export const createEntry = async (entryData) => {
//   console.log("journalApi: createEntry function called with data:", entryData); // Added log
//   const token = await getAuthToken();
//   if (!token) {
//     console.error("journalApi: Token nahi mila, cannot create entry"); // Added log
//     throw new Error("Not authenticated");
//   }

//   // ‼️ CHECK 2: Kya yeh URL sahi hai? '/api/v1/journal' (singular)?
//   const url = `${BACKEND_URL}/api/v1/journal`;
//   console.log("journalApi: Sending POST request to:", url); // Added log

//   try {
//     const response = await fetch(url, {
//       method: 'POST', // ‼️ CHECK 3: Kya method POST hai?
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify(entryData),
//     });

//     console.log("journalApi: Received response status:", response.status); // Added log

//     if (!response.ok) {
//       const err = await response.json();
//       console.error("journalApi: Error saving entry:", err); // Added log
//       throw new Error(err.message || "Entry save nahi hui");
//     }
//     const result = await response.json();
//     console.log("journalApi: Entry saved successfully:", result); // Added log
//     return result;
//   } catch (error) {
//      console.error("journalApi: Network or fetch error:", error); // Added log for network errors
//      throw error; // Re-throw the error
//   }
// };

// ... (getRecentEntries aur getAllEntries functions neeche hain)
// ... unmein bhi URL aur Authorization header check karein ...




import { supabase } from '../config/supabaseClient';

// ‼️ CHECK 1: Aapka IP address (Yeh sahi hai)
const BACKEND_URL = 'https://ucdfinal1.onrender.com';

// Helper function: Current user ka token nikaalne ke liye
const getAuthToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    console.error(" journalApi: Session nahi mila", error); // Added log
    return null;
  }
  return session.access_token;
};

// Nayi entry banayein
export const createEntry = async (entryData) => {
  console.log("journalApi: createEntry function called with data:", entryData); // Added log
  const token = await getAuthToken();
  if (!token) {
    console.error("journalApi: Token nahi mila, cannot create entry"); // Added log
    throw new Error("Not authenticated");
  }

  const url = `${BACKEND_URL}/api/v1/journal`;
  console.log("journalApi: Sending POST request to:", url); // Added log

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(entryData),
    });

    console.log("journalApi: Received response status:", response.status); // Added log

    if (!response.ok) {
      const err = await response.json();
      console.error("journalApi: Error saving entry:", err); // Added log
      throw new Error(err.message || "Entry save nahi hui");
    }
    const result = await response.json();
    console.log("journalApi: Entry saved successfully:", result); // Added log
    return result;
  } catch (error) {
     console.error("journalApi: Network or fetch error:", error); // Added log for network errors
     throw error; // Re-throw the error
  }
};

// ===== YEH FUNCTIONS MISSING THE =====

// Recent 3 entries laayein
export const getRecentEntries = async () => {
  console.log("journalApi: getRecentEntries function called"); // Added log
  const token = await getAuthToken();
  if (!token) {
    console.error("journalApi: Token nahi mila, cannot get recent"); // Added log
    throw new Error("Not authenticated");
  }

  const url = `${BACKEND_URL}/api/v1/journal/recent`;
  console.log("journalApi: Sending GET request to:", url); // Added log
  
  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    console.log("journalApi: Received response status:", response.status); // Added log

    if (!response.ok) {
      const err = await response.json();
      console.error("journalApi: Error fetching recent:", err); // Added log
      throw new Error(err.message || "Entries fetch nahi hui");
    }
    const result = await response.json();
    console.log("journalApi: Recent entries fetched:", result); // Added log
    return result;
  } catch (error) {
     console.error("journalApi: Network or fetch error:", error); // Added log for network errors
     throw error;
  }
};

// Sabhi entries laayein (filter ke saath)
export const getAllEntries = async (month, year) => {
  console.log(`journalApi: getAllEntries function called with month=${month}, year=${year}`); // Added log
  const token = await getAuthToken();
  if (!token) {
    console.error("journalApi: Token nahi mila, cannot get all"); // Added log
    throw new Error("Not authenticated");
  }

  let url = `${BACKEND_URL}/api/v1/journal/all`;
  
  if (month && year) {
    url += `?month=${month}&year=${year}`; // Query params
  }
  
  console.log("journalApi: Sending GET request to:", url); // Added log

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    console.log("journalApi: Received response status:", response.status); // Added log

    if (!response.ok) {
      const err = await response.json();
      console.error("journalApi: Error fetching all:", err); // Added log
      throw new Error(err.message || "Entries fetch nahi hui");
    }
    const result = await response.json();
    console.log("journalApi: All entries fetched:", result); // Added log
    return result;
  } catch (error) {
     console.error("journalApi: Network or fetch error:", error); // Added log for network errors
     throw error;
  }
};

