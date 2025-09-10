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
import React from "react";
import TabNavigator from "./src/navigation/TabNavigator";

export default function App() {
  return <TabNavigator />;
}
