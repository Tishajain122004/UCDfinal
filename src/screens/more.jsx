// // More.js
// import React from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   StatusBar,
//   Platform,
// } from "react-native";

// const features = [
//   { key: "study-groups", title: "Study Groups", subtitle: "Collaborate, chat, and focus together", icon: "👥" },
//   { key: "analytics", title: "Analytics", subtitle: "Track your progress and habits", icon: "📊" },
//   { key: "journal", title: "Journal", subtitle: "Daily reflections and insights", icon: "📓" },
//   { key: "study-tasks", title: "Study Tasks", subtitle: "Organize your tasks and goals", icon: "✅" },
//   { key: "whiteboard", title: "Whiteboard", subtitle: "Draw, brainstorm, and collaborate", icon: "🖊️" },
//   { key: "leaderboard", title: "Leaderboard", subtitle: "See who's crushing their goals", icon: "🏆" },
//   { key: "parental", title: "Parental Report", subtitle: "Share progress with parents", icon: "📄" },
//   { key: "settings", title: "Settings", subtitle: "Manage your account and preferences", icon: "⚙️" },
// ];

// /**
//  * More screen component
//  * Accepts navigation and route props from React Navigation
//  */
// export default function More({ navigation, route }) {
//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor={styles.safe.backgroundColor} />
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.heading}>More Features</Text>
//         <Text style={styles.subheading}>Explore everything StudyBuddy has to offer.</Text>

//         <View style={styles.card}>
//           {features.map((item, idx) => (
//             <Pressable
//               key={item.key}
//               style={({ pressed }) => [styles.row, idx === features.length - 1 ? styles.lastRow : null, pressed ? styles.rowPressed : null]}
//               onPress={() => {
//                 // Example navigation: navigation.navigate('FeatureDetail', { featureKey: item.key })
//                 console.log("Pressed:", item.key);
//               }}
//             >
//               <View style={[styles.iconWrap, { backgroundColor: rgba("#7F5CFF", 0.14) }]}>
//                 <Text style={styles.iconText}>{item.icon}</Text>
//               </View>

//               <View style={styles.textWrap}>
//                 <Text style={styles.title}>{item.title}</Text>
//                 <Text style={styles.subtitle}>{item.subtitle}</Text>
//               </View>

//               <Text style={styles.chev}>›</Text>
//             </Pressable>
//           ))}
//         </View>

//         <View style={styles.logoutCard}>
//           <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]} onPress={() => {
//             console.log("Logout pressed");
//             // Example: navigation.replace('Login')
//           }}>
//             <View style={[styles.iconWrap, { backgroundColor: rgba("#E05555", 0.12) }]}>
//               <Text style={[styles.iconText, { fontSize: 20 }]}>⤺</Text>
//             </View>

//             <View style={styles.textWrap}>
//               <Text style={[styles.title, { color: "#E05555" }]}>Logout</Text>
//               <Text style={styles.subtitle}>Sign out of your account</Text>
//             </View>

//             <Text style={[styles.chev, { color: "#E05555" }]}>›</Text>
//           </Pressable>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* helper to convert hex to rgba with alpha */
// function rgba(hex, a = 1) {
//   const hx = hex.replace("#", "");
//   const r = parseInt(hx.substring(0, 2), 16);
//   const g = parseInt(hx.substring(2, 4), 16);
//   const b = parseInt(hx.substring(4, 6), 16);
//   return `rgba(${r}, ${g}, ${b}, ${a})`;
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#050405",
//   },
//   container: {
//     paddingHorizontal: 20,
//     paddingTop: 18,
//     paddingBottom: 40,
//   },
//   heading: {
//     fontSize: 34,
//     fontWeight: "700",
//     color: "#7F5CFF",
//     textAlign: "center",
//     marginTop: Platform.OS === "android" ? 6 : 0,
//   },
//   subheading: {
//     color: "#9A9AA0",
//     textAlign: "center",
//     marginTop: 8,
//     marginBottom: 18,
//     fontSize: 14,
//   },
//   card: {
//     backgroundColor: "#0E0E10",
//     borderRadius: 14,
//     paddingVertical: 4,
//     overflow: "hidden",
//     marginBottom: 18,
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 18,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#151516",
//   },
//   lastRow: { borderBottomWidth: 0 },
//   rowPressed: { opacity: 0.86 },
//   iconWrap: {
//     width: 48,
//     height: 48,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 14,
//   },
//   iconText: { fontSize: 20 },
//   textWrap: { flex: 1, flexDirection: "column" },
//   title: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginBottom: 4 },
//   subtitle: { color: "#A7A7AD", fontSize: 13 },
//   chev: { color: "#6F6F76", fontSize: 20, marginLeft: 10 },
//   logoutCard: { backgroundColor: "#0E0E10", borderRadius: 14, paddingVertical: 6, paddingHorizontal: 6 },
// });


// More.js
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
  Alert // <-- 1. Import Alert
} from "react-native";
import { supabase } from '../config/supabaseClient'; // <-- 2. Import Supabase

/**
 * Map keys → stack screen names
 */
const screenMap = {
  "study-groups": "StudyGroups",
  analytics: "Analytics",
  Journal: "Journal", // Note: Key is 'Journal' (capital J) in features array
  "study-tasks": "StudyTasks",
  whiteboard: "Whiteboard",
  // leaderboard: "Leaderboard",
  Achievements: "Achievements",
  parental: "ParentalReport",
  settings: "Settings",
};

const features = [
  { key: "study-tasks", title: "Study Tasks", subtitle: "Organize your tasks and goals", icon: "✅" },
  { key: "study-groups", title: "Study Groups", subtitle: "Collaborate, chat, and focus together", icon: "👥" },
  { key: "analytics", title: "Analytics Screen Stats", subtitle: "Track your progress and habits", icon: "📊" },
  { key: "Journal", title: "Journal", subtitle: "Daily reflections and insights", icon: "📓" },
  { key: "whiteboard", title: "Whiteboard", subtitle: "Draw, brainstorm, and collaborate", icon: "🖊️" },
  // { key: "leaderboard", title: "Leaderboard", subtitle: "See who's crushing their goals", icon: "🏆" },
    { key: "Achievements", title: "Achievements", subtitle: "See who's crushing their goals", icon: "🏆" },

  // { key: "parental", title: "Parental Report", subtitle: "Share progress with parents", icon: "📄" },
  // { key: "settings", title: "Settings", subtitle: "Manage your account and preferences", icon: "⚙️" },
];

export default function More({ navigation }) {

  // <-- 3. Create a handleLogout function -->
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            console.log("Logout pressed, signing out...");
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.error("Error logging out:", error.message);
              Alert.alert("Error", "Could not log out. Please try again.");
            }
            // No need to navigate here, the onAuthStateChanged
            // listener in App.jsx will automatically switch screens.
          }
        }
      ]
    );
  };
  // <------------------------------------------->

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={styles.safe.backgroundColor} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>More Features</Text>
        <Text style={styles.subheading}>Explore everything StudyBuddy has to offer.</Text>

        {/* Feature List */}
        <View style={styles.card}>
          {features.map((item, idx) => (
            <Pressable
              key={item.key}
              style={({ pressed }) => [
                styles.row,
                idx === features.length - 1 ? styles.lastRow : null,
                pressed ? styles.rowPressed : null,
              ]}
              onPress={() => {
                const screenName = screenMap[item.key];
                if (screenName) {
                  navigation.navigate(screenName); // 👈 Navigate to correct screen
                } else {
                  console.warn("No screen found for:", item.key);
                }
              }}
            >
              <View style={[styles.iconWrap, { backgroundColor: rgba("#7F5CFF", 0.14) }]}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>

              <View style={styles.textWrap}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              <Text style={styles.chev}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutCard}>
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={handleLogout} // <-- 4. Call handleLogout
          >
            <View style={[styles.iconWrap, { backgroundColor: rgba("#E05555", 0.12) }]}>
              <Text style={[styles.iconText, { fontSize: 20 }]}>⤺</Text>
            </View>

            <View style={styles.textWrap}>
              <Text style={[styles.title, { color: "#E05555" }]}>Logout</Text>
              <Text style={styles.subtitle}>Sign out of your account</Text>
            </View>

            <Text style={[styles.chev, { color: "#E05555" }]}>›</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* helper to convert hex to rgba with alpha */
function rgba(hex, a = 1) {
  const hx = hex.replace("#", "");
  const r = parseInt(hx.substring(0, 2), 16);
  const g = parseInt(hx.substring(2, 4), 16);
  const b = parseInt(hx.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#050405",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 34,
    fontWeight: "700",
    color: "#7F5CFF",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? 6 : 0,
  },
  subheading: {
    color: "#9A9AA0",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 18,
    fontSize: 14,
  },
  card: {
    backgroundColor: "#0E0E10",
    borderRadius: 14,
    paddingVertical: 4,
    overflow: "hidden",
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#151516",
  },
  lastRow: { borderBottomWidth: 0 },
  rowPressed: { opacity: 0.86 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconText: { fontSize: 20 },
  textWrap: { flex: 1, flexDirection: "column" },
  title: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginBottom: 4 },
  subtitle: { color: "#A7A7AD", fontSize: 13 },
  chev: { color: "#6F6F76", fontSize: 20, marginLeft: 10 },
  logoutCard: { backgroundColor: "#0E0E10", borderRadius: 14, paddingVertical: 6, paddingHorizontal: 6 },
});

