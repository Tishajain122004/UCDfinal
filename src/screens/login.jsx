// import React, { useState } from 'react';
// import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
// import { supabase } from '../config/supabaseClient'; // Client ko import karein

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSignIn = async () => {
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     });

//     if (error) {
//       Alert.alert('Sign In Error', error.message);
//     }
//     // Login hone ke baad App.jsx automatically user ko home le jayega
//     setLoading(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome Back!</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Login" onPress={handleSignIn} disabled={loading} />
//       {/* Yahaan Sign Up button/link daalein */}
//     </View>
//   );
// };

// // Styles ko SignUp.jsx se copy kar sakte hain
// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
//   input: { borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 15, borderRadius: 5 },
// });

// export default Login;




import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../config/supabaseClient'; // Client ko import karein

// ===== NAYA IMPORT (Google Sign-In ke liye) =====
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// ===============================================

// Backend URL (Aapke SignUp file se copy kiya gaya)
const BACKEND_URL = 'https://ucdfinal1.onrender.com'; // <-- Yahaan apna IP daalein

const Login = ({ navigation }) => { // <-- navigation prop ko receive karein
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // Google ke liye alag loading

  // ===== NAYA FUNCTION (Google se login/signup ke liye profile banana) =====
  // Yeh function check karega ki user ka profile aapke 'users' table mein hai ya nahi
  const createProfileOnBackend = async (token, userName) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/create-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: userName }), // Google se mila naam
      });
      const data = await response.json();
      if (!response.ok && !data.exists) { // 'exists' ko error na maanein
        throw new Error(data.message || 'Profile create nahi hua');
      }
      if (data.exists) {
        console.log("Profile pehle se hai, login kar rahe hain.");
      } else {
        Alert.alert('Success', 'Profile successfully ban gaya!');
      }
    } catch (error) {
      Alert.alert('Profile Error', error.message);
    }
  };
  // ========================================================================

  // Email/Password se Sign In
  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Sign In Error', error.message);
    }
    // Login hone ke baad App.jsx automatically user ko home le jayega
    setLoading(false);
  };

  // ===== YEH FUNCTION UPDATE KIYA GAYA HAI (SignUp.jsx se copy kiya gaya) =====
  // Google se Sign In
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      
      // 1. Google ko Configure karein
      GoogleSignin.configure({
        webClientId: '954681113257-s7oiqqdhlbavbpekl4qf1u4m7esin70s.apps.googleusercontent.com', // Aapki Client ID
      });

      // 2. Purana session clear karein taaki user hamesha account select kar sake
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        if (error.code !== 'SIGN_IN_REQUIRED') {
          console.error("Google SignOut Error:", error);
        }
      }
      
      // 3. Native Google Login popup dikhayein
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn(); 

      // 4. Token request karein
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error('Google se ID Token nahi mila (getTokens failed)');
      }

      // 5. Is ID Token ko Supabase ko dekar login karein
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // 6. Login successful! Ab backend par profile banayein/check karein
      if (data.session) {
        const googleUserName = data.session.user?.user_metadata?.full_name || 'Google User';
        await createProfileOnBackend(data.session.access_token, googleUserName);
      }

      setGoogleLoading(false);
    } catch (error) {
      setGoogleLoading(false);
      if (error.code === 'SIGN_IN_CANCELLED') {
        console.log('User ne Google login cancel kar diya');
      } else {
        Alert.alert('Google Sign-In Error', error.message);
      }
    }
  };
  // ==========================================================================

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.inputbox}>
        <Text style={styles.heading}>Welcome Back!</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading && !googleLoading} // <-- Update
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading && !googleLoading} // <-- Update
        />

        {/* Login Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSignIn} 
          disabled={loading || googleLoading} // <-- Update
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>──────── or ────────</Text>

        {/* Sign Up Link */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('SignUp')} 
          disabled={loading || googleLoading} // <-- Update
        >
          <Text style={{ color: "#bf9ae0ff", marginTop: 7, marginBottom: 20 }}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>

        {/* Google Login Button */}
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleGoogleLogin} 
          disabled={loading || googleLoading} // <-- Update
        >
          {googleLoading ? ( // <-- Update
            <ActivityIndicator color="#8A2BE2" />
          ) : (
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Yeh styles aapke SignUp.jsx se copy kiye gaye hain taaki theme match ho
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  orText: {
    color: "#aaa",
    marginVertical: 15,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48, 
    justifyContent: 'center', 
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#b671f7ff",
    textAlign: "center",
    marginBottom: 20,
  },
  inputbox: {
    width: "90%",
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    minHeight: 48, 
    justifyContent: 'center', 
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: '#333',
  },
});

export default Login;

