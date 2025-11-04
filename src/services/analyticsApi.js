import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'https://ucdfinal1.onrender.com';
// Get auth token
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Save today's analytics
export const saveTodayAnalytics = async (analyticsData) => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.post(
      `${API_URL}/api/v1/analytics/today`,
      {
        total_screen_time_ms: analyticsData.totalScreenTime,
        app_usage_data: analyticsData.apps
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Save analytics error:', error.response?.data || error.message);
    throw error;
  }
};

// Get weekly analytics
export const getWeeklyAnalytics = async () => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.get(
      `${API_URL}/api/v1/analytics/weekly`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Get weekly analytics error:', error.response?.data || error.message);
    throw error;
  }
};