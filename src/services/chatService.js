// Hum aapka existing supabase client import karenge
import { supabase } from '../config/supabaseClient';

// Chat History Functions
export const chatService = {
  
  // Save a message to Supabase
  async saveMessage(userId, message, isUser) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: userId,
            message: message,
            is_user: isUser,
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  },

  // Get chat history for a user
  async getChatHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true }) // History ko sahi order mein laayein
        .limit(limit);
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  // (Clear history function, abhi ke liye skip kar rahe hain)
};

// Get current user (Auth ID)
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

