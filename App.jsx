// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// import Temp from './src/Temp';
// import GetStarted from './src/GetStarted';
// import SignUp from './src/SignUp';
// import BlockerPageRN from './src/BlockerPageRN';

// const Stack = createNativeStackNavigator();

// const App = () => {
//   return (
//     // <NavigationContainer>
//     //   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     //     <Stack.Screen name="Temp" component={Temp} />
//     //     <Stack.Screen name="GetStarted" component={GetStarted} />
//     //       <Stack.Screen name="SignUp" component={SignUp} />
//     //       <Stack.Screen name="Bloked apps" component={BlockerPageRN} />
//     //   </Stack.Navigator>
//     // </NavigationContainer>
//     <TabNavigator />;
//   );
// };

// export default App;
// // App.js
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import TabNavigator from './src/navigation/TabNavigator';

// export default function App() {
//   return (
//     <NavigationContainer>
//       <TabNavigator />
//     </NavigationContainer>
//   );
// }

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import TabNavigator from "./src/navigation/TabNavigator";

// export default function App() {
//   return (
//     <NavigationContainer>
//       <TabNavigator />
//     </NavigationContainer>
//   );
// }

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { supabase } from './src/config/supabaseClient'; // <-- Hamara Supabase client

// --- Screens ---
import TabNavigator from "./src/navigation/TabNavigator"; // <-- Aapka main app
import SignUpScreen from './src/screens/SignUp';
import LoginScreen from './src/screens/login'; // <-- Aapki login file
import GetStartedScreen from './src/screens/GetStarted';
import StudyTasks from './src/more/StudyTasks';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 1. Pehli baar session check karein
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Session changes ko sunein (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // 3. Listener ko cleanup karein
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Jab tak session check ho raha hai, loading dikhayein
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b671f7ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && session.user ? (
          <>
            <Stack.Screen name="MainApp" component={TabNavigator} />
            <Stack.Screen name="StudyTasks" component={StudyTasks} />
          </>
        ) : (
          <>
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A', // Aapke app ka background color
  },
});