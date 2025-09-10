// TabNavigator.jsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Apni screens sahi path se import kar (directly src me hain)
import GetStarted from "../screens/GetStarted";       // Home
import FocusTimer from "../screens/FocusTimer";                   // Focus Timer
import BlockerPageRN from "../screens/BlockerPageRN"; // Blocks
import SignUp from "../screens/SignUp";               // More

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
        <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Focus Timer") {
              iconName = focused ? "hourglass" : "hourglass-outline";
            } else if (route.name === "Blocks") {
              iconName = focused ? "shield" : "shield-outline";
            } else if (route.name === "More") {
              iconName = focused
                ? "ellipsis-horizontal-circle"
                : "ellipsis-horizontal-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#673AB7", // green for active
          tabBarInactiveTintColor: "gray",  // grey for inactive
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 0,
            elevation: 5,
            height: 60,
            paddingBottom: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        })}
      >
        <Tab.Screen name="Home" component={GetStarted} />
        <Tab.Screen name="Focus Timer" component={FocusTimer} />
        <Tab.Screen name="Blocks" component={BlockerPageRN} />
        <Tab.Screen name="More" component={SignUp} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

