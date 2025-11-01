import 'react-native-url-polyfill/auto'; // Supabase ke liye zaroori hai
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Yeh details aapko Supabase dashboard -> Project Settings -> API se milengi
const supabaseUrl = 'https://zxhcdbyrezaysmmefzvm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aGNkYnlyZXpheXNtbWVmenZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzExMDYsImV4cCI6MjA3NzE0NzEwNn0.Ngns7zcXdx-h1eMOgWmNuF7VFBBuTXaiRubsuIq1mGs'; // Yeh ANON key hai, Service key nahi

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,      // Session ko phone par store karega
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});