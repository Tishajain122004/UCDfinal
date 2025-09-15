// // src/navigation/MoreStack.js
// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import More from '../screens/more'; // your list screen
// import StudyGroups from '../more/StudyGroups';
// import Analytics from '../more/Analytics';
// import Journal from '../more/Journal';
// import StudyTasks from '../more/StudyTasks';
// import Whiteboard from '../more/Whiteboard';
// import Leaderboard from '../more/Leaderboard';
// import ParentalReport from '../more/ParentalReport';
// import Settings from '../more/Settings';

// const Stack = createNativeStackNavigator();

// export default function MoreStack() {
//   return (
//     <Stack.Navigator
//       initialRouteName="More"
//       screenOptions={{ headerShown: false }} // headerHidden because your UI has custom headers
//     >
//       <Stack.Screen name="More" component={More} />
//       <Stack.Screen name="StudyGroups" component={StudyGroups} />
//       <Stack.Screen name="Analytics" component={Analytics} />
//       <Stack.Screen name="Journal" component={Journal} />
//       <Stack.Screen name="StudyTasks" component={StudyTasks} />
//       <Stack.Screen name="StudyGroups" component={StudyGroups} />
//       <Stack.Screen name="Whiteboard" component={Whiteboard} />
//       <Stack.Screen name="Leaderboard" component={Leaderboard} />
//       <Stack.Screen name="ParentalReport" component={ParentalReport} />
//       <Stack.Screen name="Settings" component={Settings} />
//     </Stack.Navigator>
//   );
// }

// src/navigation/MoreStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import More from '../screens/more'; // your main "More" list screen
import StudyGroups from '../more/StudyGroups';
import Analytics from '../more/Analytics';
import Journal from '../more/Journal';
import StudyTasks from '../more/StudyTasks';
import Whiteboard from '../more/Whiteboard';
import Leaderboard from '../more/Leaderboard';
import ParentalReport from '../more/ParentalReport';
import Settings from '../more/Settings';

const Stack = createNativeStackNavigator();

export default function MoreStack() {
  return (
    <Stack.Navigator
      initialRouteName="More"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="More" component={More} />
      <Stack.Screen name="StudyGroups" component={StudyGroups} />
      <Stack.Screen name="Analytics" component={Analytics} />
      <Stack.Screen name="Journal" component={Journal} />
      <Stack.Screen name="StudyTasks" component={StudyTasks} />
      <Stack.Screen name="Whiteboard" component={Whiteboard} />
      <Stack.Screen name="Leaderboard" component={Leaderboard} />
      <Stack.Screen name="ParentalReport" component={ParentalReport} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
