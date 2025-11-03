// import React,{useState} from "react";

// import {View,Text,  StyleSheet,ToucjableOpacity,Image, TextInput, TouchableOpacity,ScrollView,} from "react-native";

// import Icon from "react-native-vector-icons/MaterialIcons";


// const SignUp=()=>{


//     const[name,setName] = useState('');
//     const[email,setEmail] = useState('');
//     const[password,setPassword] = useState('');
   

//     const handleSignUp = ()=>{
//         console.log("name :",name);
//         console.log("email : ",email);
//     };
//     return(
//        <ScrollView contentContainerStyle={styles.scrollContainer}>
           
//             <View style={styles.inputbox}>
//  <Text style={styles.heading}>Create Account</Text>




 
//             <TextInput  
            
//             style={styles.input}
//             placeholder = "Full Name"
//             placeholderTextColor={"#888"}
//             value = {name}
//             onChangeText={setName}
//             />
//             <TextInput
//             style={styles.input}
//         placeholder="Email"
//         placeholderTextColor="#aaa"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />
//        <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="#aaa"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TouchableOpacity style = {styles.button}>
//         <Text style = {styles.buttonText} onPress={handleSignUp}>SignUp</Text>
//       </TouchableOpacity>
//  <Text style={styles.orText}>────────  or  ────────</Text>
//       <TouchableOpacity>
//         <Text style={{color:"#bf9ae0ff", marginTop:7,marginBottom:20}}>Already have an account? Log In</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.googleButton} onPress={() => console.log("Google Sign In")}>
//         <Text style={styles.googleButtonText}>Continue with Google</Text>
//       </TouchableOpacity>


    

// </View>

//         </ScrollView>
//     )
// }
// export default SignUp;
// const styles = StyleSheet.create({
//   scrollContainer: {
//     flex: 1,
//     backgroundColor: "#1A1A1A",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//    orText: {
//     color: "#aaa",
//     marginVertical: 15,
//     fontSize: 14,
//   },
//   googleButton: {
//     backgroundColor: "#fff",
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 30,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#b671f7ff",
//     textAlign: "center", // ✅ "Topcenter" replace with valid "center"
//     marginBottom: 20,    // ✅ "auto" not allowed, use number
//   },
//   inputbox: {
//     width: "90%",
//     backgroundColor: "#2A2A2A",
//     borderRadius: 20,
//     marginBottom: 20,
//     padding: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "#333",
//     color: "#fff",
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     borderRadius: 10,
//     marginBottom: 15, // ✅ no "px", just number
//   },
//   button: {
//     backgroundColor: "#8A2BE2",
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   googleButtonText: {
    
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });






// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert, // <-- 1. Alert ko import karein
//   ActivityIndicator, // <-- 2. Loading ke liye
// } from "react-native";

// // 3. Apne config file se Supabase client import karein
// import { supabase } from '../config/supabaseClient'; 

// // 4. Apne backend ka URL define karein (Apna WiFi IP daalein)
// // ‼️ IMPORTANT: 'localhost' nahi, apne computer ka IP Address daalein
// // Terminal mein 'ipconfig' (Windows) ya 'ifconfig' (Mac) se IP pata karein
// const BACKEND_URL = 'http://192.168.1.5:8001'; // <-- Yahaan apna IP daalein

// const SignUp = ({ navigation }) => { // <-- navigation ko props se lein
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false); // <-- 5. Loading state

//   // 6. Backend par profile create karne wala function
//   const createProfileOnBackend = async (token) => {
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/v1/auth/create-profile`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`, // Token bhejna zaroori hai
//         },
//         body: JSON.stringify({ name: name }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || 'Profile create nahi hua');
//       }
//       Alert.alert('Success', 'Profile successfully ban gaya!');
//     } catch (error) {
//       Alert.alert('Profile Error', error.message);
//     }
//   };

//   // 7. handleSignUp function ko update karein
//   const handleSignUp = async () => {
//     if (!name || !email || !password) {
//       Alert.alert('Error', 'Sabhi fields zaroori hain');
//       return;
//     }
//     setLoading(true);

//     // 1. Supabase Auth par user banayein
//     const { data, error } = await supabase.auth.signUp({
//       email: email,
//       password: password,
//     });

//     if (error) {
//       Alert.alert('Sign Up Error', error.message);
//     } else if (data.session) {
//       // 2. Signup successful, ab backend par profile banayein
//       Alert.alert('Success', 'Signup successful! Profile banaya ja raha hai...');
//       await createProfileOnBackend(data.session.access_token);
//       // Login ke baad user automatically home screen par chala jayega (App.jsx se)
//     } else {
//       Alert.alert('Success', 'Signup successful! Please check your email for verification.');
//     }
//     setLoading(false);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.inputbox}>
//         <Text style={styles.heading}>Create Account</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           placeholderTextColor={"#888"}
//           value={name}
//           onChangeText={setName}
//           autoCapitalize="words" // <-- Good practice
//           editable={!loading} // <-- Disable jab loading ho
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#aaa"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none" // <-- Good practice
//           editable={!loading}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#aaa"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//           editable={!loading}
//         />

//         {/* 8. Button ko update karein */}
//         <TouchableOpacity 
//           style={styles.button} 
//           onPress={handleSignUp} 
//           disabled={loading} // <-- Disable jab loading ho
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" /> // <-- Loading spinner
//           ) : (
//             <Text style={styles.buttonText}>Sign Up</Text>
//           )}
//         </TouchableOpacity>

//         <Text style={styles.orText}>──────── or ────────</Text>

//         {/* 9. Login button ko navigation add karein */}
//         <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//           <Text style={{ color: "#bf9ae0ff", marginTop: 7, marginBottom: 20 }}>
//             Already have an account? Log In
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.googleButton} onPress={() => console.log("Google Sign In")}>
//           <Text style={styles.googleButtonText}>Continue with Google</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// export default SignUp;

// // Aapke styles bilkul perfect hain, unhein change karne ki zaroorat nahi hai
// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1, // <-- flex: 1 ki jagah flexGrow: 1 behtar hai ScrollView ke liye
//     backgroundColor: "#1A1A1A",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   orText: {
//     color: "#aaa",
//     marginVertical: 15,
//     fontSize: 14,
//   },
//   googleButton: {
//     backgroundColor: "#fff",
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 30,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#b671f7ff",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   inputbox: {
//     width: "90%",
//     backgroundColor: "#2A2A2A",
//     borderRadius: 20,
//     padding: 20,
//     alignItems: "center",
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "#333",
//     color: "#fff",
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#8A2BE2",
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//     marginTop: 10,
//     width: '100%', // <-- Button ko full width de dein
//     alignItems: 'center', // <-- Text ko center karein
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   googleButtonText: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });


import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from '../config/supabaseClient'; 

// ===== NAYA IMPORT =====
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// =======================

const BACKEND_URL = 'http://10.21.1.179:8001'; // <-- Yahaan apna IP daalein

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // Google ke liye alag loading

  // Backend par profile create karne wala function
  const createProfileOnBackend = async (token, userName) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/create-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: userName }), // Form se mila 'name' ya Google se mila 'userName'
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
  // ======================================

  // Email/Password se Sign Up
  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Sabhi fields zaroori hain');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else if (data.session) {
      Alert.alert('Success', 'Signup successful! Profile banaya ja raha hai...');
      // Form waala 'name' backend ko bhejein
      await createProfileOnBackend(data.session.access_token, name);
    } else {
      Alert.alert('Success', 'Signup successful! Please check your email for verification.');
    }
    setLoading(false);
  };

  // ===== YEH FUNCTION UPDATE KIYA GAYA HAI =====
  // Google se Sign In
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      
      // 1. Google ko Configure karein
      GoogleSignin.configure({
        webClientId: '954681113257-s7oiqqdhlbavbpekl4qf1u4m7esin70s.apps.googleusercontent.com', 
      });

      // ===== YEH LINE FIX HAI =====
      // Force user ko hamesha account select karne ko kahein
      // Purane cached session ko clear karein
      try {
        await GoogleSignin.signOut();
        console.log("Purana Google session clear kar diya gaya hai.");
      } catch (error) {
        if (error.code !== 'SIGN_IN_REQUIRED') {
          console.error("Google SignOut Error:", error);
        }
      }
      // ===========================

      // 2. Native Google Login popup dikhayein
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn(); // Pehle sirf sign in karein

      // 3. Ab token alag se request karein (Yeh zyada reliable hai)
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error('Google se ID Token nahi mila (getTokens failed)');
      }

      // 4. Is ID Token ko Supabase ko dekar login karein
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // 5. Login successful! Ab backend par profile banayein/check karein
      if (data.session) {
        const googleUserName = data.session.user?.user_metadata?.full_name || 'Google User';
        await createProfileOnBackend(data.session.access_token, googleUserName);
      }

      setGoogleLoading(false);
    } catch (error) {
      setGoogleLoading(false);
      // Agar user ne popup cancel kar diya toh 'SIGN_IN_CANCELLED' error aata hai
      if (error.code === 'SIGN_IN_CANCELLED') {
        console.log('User ne Google login cancel kar diya');
      } else {
        Alert.alert('Google Sign-In Error', error.message);
      }
    }
  };
  // ===================================

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.inputbox}>
        <Text style={styles.heading}>Create Account</Text>

        {/* ... baaki ke TextInputs ... */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={"#888"}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!loading && !googleLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading && !googleLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading && !googleLoading}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSignUp} 
          disabled={loading || googleLoading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>──────── or ────────</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading || googleLoading}>
          <Text style={{ color: "#bf9ae0ff", marginTop: 7, marginBottom: 20 }}>
            Already have an account? Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleGoogleLogin} 
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color="#8A2BE2" />
          ) : (
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUp;

// Styles
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

