import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home.jsx'
import Block from './src/screens/block.jsx'
import More from './src/screens/more.jsx'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();


// import { NavigationContainer } from '@react-navigation/native';
// const Stack = createNativeStackNavigator();


const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={Home} />
      <Tab.Screen name="block" component={Block} />
      <Tab.Screen name="more" component={More} />

    </Tab.Navigator>
  );
}

// const StackNavigator = () => {
//   return(
//   <Stack.Navigator>
//     <Stack.Screen name = "home" component={Home}/>
//     <Stack.Screen name = "block" component={Block}/>
//     <Stack.Screen name = "more" component={More}/>

//   </Stack.Navigator>
//   )

// }
const App = () => {
  return (
    <NavigationContainer>
      <TabNavigator/>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})