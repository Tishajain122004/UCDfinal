// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const API_URL = 'https://ucdfinal1.onrender.com';

// // // Get auth token
// // const getAuthToken = async () => {
// //   try {
// //     const token = await AsyncStorage.getItem('authToken');
// //     return token;
// //   } catch (error) {
// //     console.error('Error getting token:', error);
// //     return null;
// //   }
// // };

// // // ✅ Save today's analytics
// // export const saveTodayAnalytics = async (analyticsData) => {
// //   try {
// //     const token = await getAuthToken();

// //     if (!token) {
// //       throw new Error('No auth token found. Please login.');
// //     }

// //     console.log('📤 Sending to:', `${API_URL}/api/v1/analytics/today`);

// //     const response = await axios.post(
// //       `${API_URL}/api/v1/analytics/today`,
// //       {
// //         total_screen_time_ms: analyticsData.totalScreenTime,
// //         app_usage_data: analyticsData.apps,
// //       },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           'Content-Type': 'application/json',
// //         },
// //       }
// //     );

// //     return response.data;
// //   } catch (error) {
// //     console.error('❌ Save analytics error:', error.response?.data || error.message);
// //     throw error;
// //   }
// // };

// // // ✅ Get weekly analytics
// // export const getWeeklyAnalytics = async () => {
// //   try {
// //     const token = await getAuthToken();

// //     if (!token) {
// //       throw new Error('No auth token found. Please login.');
// //     }

// //     console.log('📥 Fetching weekly analytics from:', `${API_URL}/api/v1/analytics/weekly`);

// //     const response = await axios.get(`${API_URL}/api/v1/analytics/weekly`, {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //     });

// //     return response.data;
// //   } catch (error) {
// //     console.error('❌ Get weekly analytics error:', error.response?.data || error.message);
// //     throw error;
// //   }
// // };


// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // ✅ Backend URL
// const API_URL = 'https://ucdfinal1.onrender.com';

// // Get auth token
// const getAuthToken = async () => {
//   try {
//     const token = await AsyncStorage.getItem('authToken');
//     if (!token) {
//       console.warn('⚠️ No auth token found in AsyncStorage');
//     }
//     return token;
//   } catch (error) {
//     console.error('❌ Error getting token:', error);
//     return null;
//   }
// };

// // ✅ Save today's analytics
// export const saveTodayAnalytics = async (analyticsData) => {
//   try {
//     const token = await getAuthToken();

//     if (!token) {
//       throw new Error('Authentication required. Please login again.');
//     }

//     console.log('📤 Saving analytics to:', `${API_URL}/api/v1/analytics/today`);
//     console.log('📊 Data size:', analyticsData.apps?.length || 0, 'apps');

//     const response = await axios.post(
//       `${API_URL}/api/v1/analytics/today`,
//       {
//         total_screen_time_ms: analyticsData.totalScreenTime,
//         app_usage_data: analyticsData.apps,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         timeout: 15000, // 15 seconds timeout
//       }
//     );

//     console.log('✅ Save successful:', response.data.message || 'OK');
//     return response.data;

//   } catch (error) {
//     console.error('❌ Save analytics failed:');
    
//     if (error.response) {
//       // Server responded with error
//       console.error('   Status:', error.response.status);
//       console.error('   Message:', error.response.data?.message || error.response.data);
      
//       if (error.response.status === 401) {
//         throw new Error('Session expired. Please login again.');
//       } else if (error.response.status === 500) {
//         throw new Error('Server error. Please try again later.');
//       } else {
//         throw new Error(error.response.data?.message || 'Failed to save analytics');
//       }
//     } else if (error.request) {
//       // Network error
//       console.error('   Network error - No response received');
//       throw new Error('Network error. Check your internet connection.');
//     } else {
//       // Other errors
//       console.error('   Error:', error.message);
//       throw error;
//     }
//   }
// };

// // ✅ Get weekly analytics
// export const getWeeklyAnalytics = async () => {
//   try {
//     const token = await getAuthToken();

//     if (!token) {
//       throw new Error('Authentication required. Please login again.');
//     }

//     console.log('📥 Fetching weekly analytics from:', `${API_URL}/api/v1/analytics/weekly`);

//     const response = await axios.get(
//       `${API_URL}/api/v1/analytics/weekly`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         timeout: 10000, // 10 seconds timeout
//       }
//     );

//     console.log('✅ Weekly data received:', response.data.data?.daily_stats?.length || 0, 'days');
//     return response.data;

//   } catch (error) {
//     console.error('❌ Get weekly analytics failed:');
    
//     if (error.response) {
//       console.error('   Status:', error.response.status);
//       console.error('   Message:', error.response.data?.message || error.response.data);
      
//       if (error.response.status === 401) {
//         throw new Error('Session expired. Please login again.');
//       } else if (error.response.status === 404) {
//         throw new Error('No analytics data found. Use the app for a few days.');
//       } else {
//         throw new Error(error.response.data?.message || 'Failed to fetch analytics');
//       }
//     } else if (error.request) {
//       console.error('   Network error - No response received');
//       throw new Error('Network error. Check your internet connection.');
//     } else {
//       console.error('   Error:', error.message);
//       throw error;
//     }
//   }
// };

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://ucdfinal1.onrender.com';

// Get auth token - SAME AS YOUR OTHER SERVICES
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    console.log('🔑 Token check:', token ? 'Found ✅' : 'Missing ❌');
    return token;
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
};

// Save today's analytics
export const saveTodayAnalytics = async (analyticsData) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.log('⚠️ Skipping sync - no token (this is OK for local usage)');
      return null; // Return null, don't throw error
    }

    console.log('📤 ===== SAVING ANALYTICS =====');
    console.log('Total time (ms):', analyticsData.totalScreenTime);
    console.log('Apps count:', analyticsData.apps?.length);
    console.log('First app sample:', JSON.stringify(analyticsData.apps?.[0], null, 2));
    console.log('API URL:', `${API_URL}/api/v1/analytics/today`);
    console.log('Token preview:', token.substring(0, 30) + '...');

    const requestBody = {
      total_screen_time_ms: analyticsData.totalScreenTime,
      app_usage_data: analyticsData.apps || []
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      `${API_URL}/api/v1/analytics/today`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    console.log('✅ Response status:', response.status);
    console.log('✅ Response data:', JSON.stringify(response.data, null, 2));
    console.log('=============================');
    
    return response.data;
    
  } catch (error) {
    console.error('❌ ===== SAVE FAILED =====');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received from server');
      console.error('Request was:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    console.error('========================');
    
    throw error;
  }
};

// Get weekly analytics
export const getWeeklyAnalytics = async () => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.log('⚠️ No token for weekly fetch');
      return null;
    }

    console.log('📥 Fetching weekly analytics...');

    const response = await axios.get(
      `${API_URL}/api/v1/analytics/weekly`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      }
    );

    console.log('✅ Weekly data received');
    return response.data;
    
  } catch (error) {
    console.error('❌ Fetch error:', error.response?.status, error.response?.data?.message || error.message);
    
    if (error.response?.status === 404) {
      console.log('ℹ️ No data found (normal for new users)');
      return null;
    }
    
    throw error;
  }
};

// Check if today's data already saved
export const checkTodayDataSaved = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const lastSaved = await AsyncStorage.getItem('lastAnalyticsSaveDate');
    return lastSaved === today;
  } catch (error) {
    return false;
  }
};

// Mark today as saved
export const markTodayAsSaved = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem('lastAnalyticsSaveDate', today);
  } catch (error) {
    console.error('❌ Error marking date:', error);
  }
};
