import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANT: Ensure these are correctly set with your Supabase keys
const SUPABASE_URL = 'https://zxhcdbyrezaysmmefzvm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aGNkYnlyZXpheXNtbWVmenZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzExMDYsImV4cCI6MjA3NzE0NzEwNn0.Ngns7zcXdx-h1eMOgWmNuF7VFBBuTXaiRubsuIq1mGs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 👤 Function to get the current authenticated user (returns a UUID or null)
export const getCurrentUser = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error("Error fetching current user:", error.message);
        return null; 
    }
};

// 💬 Chat History and Context Service
export const chatService = {
    // 🟢 Save a message to the 'chat_messages' table
    async saveMessage(userId, messageContent, isUser) {
        // Enforce user ID presence for database interaction
        if (!userId) throw new Error("User ID is required to save a message.");
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .insert({
                    user_id: userId,
                    message: messageContent,
                    is_user: isUser,
                })
                .select(); // Use .select() to return the inserted data

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error saving message:', error);
            throw error;
        }
    },

    // 📜 Fetch chat history
    async getChatHistory(userId, limit = 50) {
        // Return empty array if no user ID is provided (no history to fetch)
        if (!userId) return [];
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw error;
        }
    },

    // 🧹 Clear chat history
    async clearChatHistory(userId) {
        if (!userId) throw new Error("User ID is required to clear history.");
        try {
            const { error } = await supabase
                .from('chat_messages')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error clearing chat history:', error);
            throw error;
        }
    },

    // 🧠 Save conversation context (memory) using upsert
    async saveContext(userId, contextJson) {
        if (!userId) throw new Error("User ID is required to save context.");
        try {
            const { data, error } = await supabase
                .from('chat_context')
                .upsert(
                    { user_id: userId, context: contextJson }, 
                    { onConflict: 'user_id' } // Ensures only one row per user_id
                )
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error saving context:', error);
            throw error;
        }
    },
    
    // 🔍 Get saved context
    async getContext(userId) {
        if (!userId) return null;
        try {
            const { data, error } = await supabase
                .from('chat_context')
                .select('context')
                .eq('user_id', userId)
                .single();

            // PGRST116 means 'no rows found', which is expected for new users.
            if (error && error.code !== 'PGRST116') throw error;
            return data?.context || null;
        } catch (error) {
            console.error('Error fetching context:', error);
            return null;
        }
    },
};