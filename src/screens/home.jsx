// // import { StyleSheet, Text, View } from 'react-native'
// // import React from 'react'
// // import Block from './src/screens/block.jsx'
// // import More from './src/screens/more.jsx'

// // const Home = ({navigation}) => {
// //   return (
// //     <View style = {{width: '100%', height : "20%", backgroundColor : "skyblue", justifyContent : "center"}}>
// //       <Text>home</Text>
// //       <Button title='Block' onPress={() => navigation.navigate("block")}/>
// //       <Button title='More' onPress={() => navigation.navigate("more")}/>
// //     </View>
// //   )
// // }

// // export default Home
// // const styles = StyleSheet.create({})

// // import { StyleSheet, Text, View, Button } from 'react-native'
// // import React from 'react'

// // const Home = ({ navigation }) => {
// //   return (
// //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "skyblue" }}>
// //       <Text style={{ fontSize: 20, marginBottom: 20 }}>Home</Text>

// //       <Button
// //         title="Go to Block"
// //         onPress={() => navigation.navigate("block")}
// //       />

// //       <Button
// //         title="Go to More"
// //         onPress={() => navigation.navigate("more")}
// //       />
// //     </View>
// //   )
// // }

// // export default Home

// // const styles = StyleSheet.create({})

// // Dashboard.js
// import React from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   TextInput,
//   Platform,
//   StatusBar,
// } from "react-native";

// /**
//  * Dashboard screen (function component) - ready to import in TabNavigator
//  * Usage: <Tab.Screen name="Dashboard" component={Dashboard} />
//  */
// export default function Home({ navigation, route }) {
//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor={styles.safe.backgroundColor} />
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* Header */}
//         <View style={styles.headerWrap}>
//           <Text style={styles.welcome}>Welcome Back!</Text>
//           <Text style={styles.headerSub}>
//             Your AI companion for productivity and{"\n"}wellness.
//           </Text>
//         </View>

//         {/* Today's Goals Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={styles.headerIconWrap}><Text style={styles.headerIcon}>🎯</Text></View>
//             <Text style={styles.cardTitle}>Today's Goals</Text>
//           </View>

//           <View style={styles.goalList}>
//             <GoalItem
//               icon="⏰"
//               title="Study for 3 hours"
//               badgeText="0/3"
//               badgeBg="#2C6EF3"
//             />
//             <GoalItem
//               icon="📚"
//               title="Complete 2 study blocks"
//               badgeText="0/2"
//               badgeBg="#7C4CFF"
//             />
//             <GoalItem
//               icon="💗"
//               title="Journal reflection"
//               badgeText="Pending"
//               badgeBg="#B65C93"
//             />
//           </View>
//         </View>

//         {/* Quick Check-in Card */}
//         <View style={[styles.card, { padding: 16 }]}>
//           <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
//             <View style={styles.checkIconWrap}><Text style={styles.checkIcon}>✨</Text></View>
//             <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Quick Check-in</Text>
//           </View>
//           <Text style={styles.checkSub}>How are you feeling right now?</Text>

//           <Pressable style={styles.moodBtn} onPress={() => console.log("Share Mood pressed")}>
//             <Text style={styles.moodBtnText}>Share My Mood</Text>
//           </Pressable>
//         </View>

//         {/* Chat Widget Card */}
//         <View style={[styles.chatContainer]}>
//           <View style={styles.chatHeader}>
//             <View style={styles.chatHeaderLeft}>
//               <View style={styles.chatAvatar}><Text style={styles.chatAvatarIcon}>💬</Text></View>
//               <View>
//                 <Text style={styles.chatTitle}>StudyBuddy AI</Text>
//                 <Text style={styles.chatSub}>Your supportive learning companion</Text>
//               </View>
//             </View>
//             <View style={styles.onlineDotWrap}>
//               <View style={styles.onlineDot} />
//               <Text style={styles.onlineText}>Online</Text>
//             </View>
//           </View>

//           {/* messages area */}
//           <View style={styles.messages}>
//             <View style={styles.aiIconSmall}><Text style={{ color: "#fff" }}>🤖</Text></View>
//             <View style={styles.aiBubbleWrap}>
//               <Text style={styles.aiBubbleText}>
//                 Hey there! 👋 I'm your StudyBuddy AI companion.{"\n\n"}
//                 I'm here to help you stay motivated, focused, and balanced in your learning journey.{"\n\n"}
//                 How are you feeling today? Ready to crush some goals or need a gentle nudge to get started?
//               </Text>
//               <Text style={styles.msgTime}>10:44 AM</Text>
//             </View>
//           </View>

//           {/* input area */}
//           <View style={styles.chatInputRow}>
//             <TextInput
//               placeholder="Ask me anything..."
//               placeholderTextColor="#6C6C72"
//               style={styles.chatInput}
//             />
//             <Pressable style={styles.iconBtn} onPress={() => console.log("mic")}>
//               <Text style={styles.iconBtnText}>🎙️</Text>
//             </Pressable>
//             <Pressable style={styles.iconBtn} onPress={() => console.log("camera")}>
//               <Text style={styles.iconBtnText}>📷</Text>
//             </Pressable>
//             <Pressable style={[styles.sendBtn]} onPress={() => console.log("send")}>
//               <Text style={styles.sendIcon}>➡️</Text>
//             </Pressable>
//           </View>
//         </View>

//         {/* spacing */}
//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* Goal item sub-component */
// function GoalItem({ icon, title, badgeText, badgeBg }) {
//   return (
//     <View style={styles.goalRow}>
//       <View style={styles.goalIconWrap}>
//         <Text style={styles.goalIcon}>{icon}</Text>
//       </View>

//       <View style={{ flex: 1 }}>
//         <Text style={styles.goalTitle}>{title}</Text>
//       </View>

//       <View style={[styles.badge, { backgroundColor: badgeBg || "#666" }]}>
//         <Text style={styles.badgeText}>{badgeText}</Text>
//       </View>
//     </View>
//   );
// }

// /* small helper to convert hex to rgba - returns rgba string */
// function rgba(hex = "#000000", alpha = 1) {
//   const h = hex.replace("#", "");
//   const r = parseInt(h.substring(0, 2), 16);
//   const g = parseInt(h.substring(2, 4), 16);
//   const b = parseInt(h.substring(4, 6), 16);
//   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// }

// /* styles */
// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#050405",
//   },
//   container: {
//     paddingHorizontal: 20,
//     paddingTop: 18,
//     paddingBottom: 36,
//   },
//   headerWrap: {
//     alignItems: "center",
//     marginBottom: 14,
//   },
//   welcome: {
//     color: "#7F5CFF",
//     fontSize: 36,
//     fontWeight: "800",
//     textAlign: "center",
//   },
//   headerSub: {
//     color: "#9A9AA0",
//     textAlign: "center",
//     marginTop: 8,
//     fontSize: 15,
//   },

//   /* card: Today's Goals */
//   card: {
//     backgroundColor: "#0E0E10",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 18,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   headerIconWrap: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: rgba("#3DDC84", 0.08),
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },
//   headerIcon: {
//     fontSize: 22,
//   },
//   cardTitle: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "800",
//   },

//   goalList: {
//     marginTop: 6,
//   },
//   goalRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#151516",
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   goalIconWrap: {
//     width: 38,
//     height: 38,
//     borderRadius: 10,
//     backgroundColor: "#0F0F10",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   goalIcon: { fontSize: 18 },
//   goalTitle: {
//     color: "#EDEEF0",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 12,
//     minWidth: 58,
//   },
//   badgeText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   /* Quick check-in */
//   checkIconWrap: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: "rgba(255,200,90,0.08)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkIcon: { fontSize: 20 },
//   checkSub: {
//     color: "#CFCFD2",
//     marginBottom: 12,
//     marginTop: 6,
//   },
//   moodBtn: {
//     marginTop: 6,
//     backgroundColor: "#F59B17",
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     // subtle gradient effect imitation
//     shadowColor: "#F59B17",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.12,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   moodBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//   },

//   /* Chat widget */
//   chatContainer: {
//     backgroundColor: "#0B0B0C",
//     borderRadius: 14,
//     padding: 0,
//     overflow: "hidden",
//   },
//   chatHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#2D1A45",
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//   },
//   chatHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   chatAvatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 12,
//     backgroundColor: "#6C4CFF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },
//   chatAvatarIcon: { fontSize: 20, color: "#fff" },
//   chatTitle: { color: "#FFFFFF", fontWeight: "800" },
//   chatSub: { color: "#CFCFD2", fontSize: 12 },
//   onlineDotWrap: { alignItems: "center", flexDirection: "row" },
//   onlineDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 6,
//     backgroundColor: "#2BC66E",
//     marginRight: 6,
//   },
//   onlineText: { color: "#9ECFA1", fontSize: 12 },

//   messages: {
//     flexDirection: "row",
//     padding: 14,
//     paddingTop: 18,
//     backgroundColor: "#050505",
//     alignItems: "flex-start",
//   },
//   aiIconSmall: {
//     width: 36,
//     alignItems: "center",
//     marginRight: 8,
//     marginTop: 6,
//   },
//   aiBubbleWrap: {
//     backgroundColor: "#0E1113",
//     borderRadius: 10,
//     padding: 14,
//     maxWidth: "85%",
//   },
//   aiBubbleText: { color: "#E6F1F4", lineHeight: 20 },
//   msgTime: { color: "#6C6C72", fontSize: 11, marginTop: 8 },

//   /* input row */
//   chatInputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     gap: 8,
//     backgroundColor: "#050505",
//   },
//   chatInput: {
//     flex: 1,
//     height: 44,
//     backgroundColor: "#0E0E10",
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     color: "#fff",
//   },
//   iconBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 10,
//     backgroundColor: "#0D0D0E",
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 8,
//   },
//   iconBtnText: { fontSize: 18 },
//   sendBtn: {
//     width: 48,
//     height: 44,
//     borderRadius: 10,
//     backgroundColor: "#6F4BFF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 8,
//   },
//   sendIcon: { color: "#fff", fontSize: 18 },
// });

// home.js
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Home({ navigation }) {
  const [chatText, setChatText] = useState("");
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  const moodOptions = [
    { id: "happy", label: "Happy", icon: "emoticon-happy-outline", bg: "#FFB347" },
    { id: "calm", label: "Calm", icon: "emoticon-cool-outline", bg: "#4FC3F7" },
    { id: "thoughtful", label: "Thoughtful", icon: "emoticon-thinking-outline", bg: "#D68BFF" },
    { id: "down", label: "Down", icon: "emoticon-sad-outline", bg: "#9CA3AF" },
    { id: "stressed", label: "Stressed", icon: "emoticon-dead-outline", bg: "#FF6B6B" },
    { id: "tired", label: "Tired", icon: "emoticon-sleep-outline", bg: "#B66CFF" },
    { id: "motivated", label: "Motivated", icon: "fire", bg: "#2DD36F" },
    { id: "neutral", label: "Neutral", icon: "emoticon-neutral-outline", bg: "#9CA3AF" },
  ];

  function onSelectMood(mood) {
    setSelectedMood(mood.id);
    setMoodModalVisible(false);
    // handle mood selection (send to backend / state as needed)
    console.log("Mood selected:", mood.id);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={styles.safe.backgroundColor} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerWrap}>
          <Text style={styles.welcome}>Welcome Back!</Text>
          <Text style={styles.headerSub}>Your AI companion for productivity and{"\n"}wellness.</Text>
        </View>

        {/* Today's Goals Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerIconWrap}><Icon name="bullseye" size={20} color="#2BD36E" /></View>
            <Text style={styles.cardTitle}>Today's Goals</Text>
          </View>

          <View style={styles.goalList}>
            <GoalItem icon="clock-outline" title="Study for 3 hours" badgeText="0/3" badgeBg="#2C6EF3" />
            <GoalItem icon="book-open-page-variant" title="Complete 2 study blocks" badgeText="0/2" badgeBg="#7C4CFF" />
            <GoalItem icon="heart-outline" title="Journal reflection" badgeText="Pending" badgeBg="#B65C93" />
          </View>
        </View>

        {/* Quick Check-in */}
        <View style={[styles.card, { padding: 16 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <View style={styles.checkIconWrap}><Icon name="sparkles" size={20} color="#FFD36B" /></View>
            <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Quick Check-in</Text>
          </View>
          <Text style={styles.checkSub}>How are you feeling right now?</Text>

          <Pressable style={styles.moodBtn} onPress={() => setMoodModalVisible(true)}>
            <Text style={styles.moodBtnText}>Share My Mood</Text>
          </Pressable>
        </View>

        {/* Chat Widget */}
        <View style={[styles.chatContainer]}>
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderLeft}>
              <View style={styles.chatAvatar}><Icon name="chat" size={20} color="#fff" /></View>
              <View>
                <Text style={styles.chatTitle}>StudyBuddy AI</Text>
                <Text style={styles.chatSub}>Your supportive learning companion</Text>
              </View>
            </View>
            <View style={styles.onlineDotWrap}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>

          {/* messages area */}
          <View style={styles.messages}>
            <View style={styles.aiIconSmall}><Icon name="robot" size={20} color="#fff" /></View>
            <View style={styles.aiBubbleWrap}>
              <Text style={styles.aiBubbleText}>
                Hey there! 👋 I'm your StudyBuddy AI companion.{"\n\n"}
                I'm here to help you stay motivated, focused, and balanced in your learning journey.{"\n\n"}
                How are you feeling today? Ready to crush some goals or need a gentle nudge to get started?
              </Text>
              <Text style={styles.msgTime}>10:44 AM</Text>
            </View>
          </View>

          {/* input area (icons replaced with vector icons) */}
          <View style={styles.chatInputRow}>
            <TextInput
              placeholder="Ask me anything..."
              placeholderTextColor="#6C6C72"
              style={styles.chatInput}
              value={chatText}
              onChangeText={setChatText}
            />
            <Pressable style={styles.iconBtn} onPress={() => console.log("mic")}>
              <Icon name="microphone" size={18} color="#CFCFD2" />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => console.log("camera")}>
              <Icon name="camera" size={18} color="#CFCFD2" />
            </Pressable>
            <Pressable style={[styles.sendBtn]} onPress={() => { console.log("send:", chatText); setChatText(""); }}>
              <Icon name="send" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Mood Modal */}
      <Modal
        visible={moodModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setMoodModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How are you feeling?</Text>
              <Pressable onPress={() => setMoodModalVisible(false)} style={styles.modalClose}>
                <Icon name="close" size={20} color="#fff" />
              </Pressable>
            </View>

            <FlatList
              data={moodOptions}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{ paddingVertical: 8 }}
              columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelectMood(item)}
                  style={({ pressed }) => [
                    styles.moodItem,
                    { backgroundColor: item.bg },
                    pressed && { opacity: 0.85 }
                  ]}
                >
                  <Icon name={item.icon} size={30} color="#fff" />
                  <Text style={styles.moodLabel}>{item.label}</Text>
                </Pressable>
              )}
            />

            <Text style={styles.modalHint}>Your mood helps me provide better support and suggestions</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* small subcomponent and helpers */
function GoalItem({ icon, title, badgeText, badgeBg }) {
  return (
    <View style={styles.goalRow}>
      <View style={styles.goalIconWrap}>
        <Icon name={icon} size={18} color="#CFCFD2" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.goalTitle}>{title}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: badgeBg || "#666" }]}>
        <Text style={styles.badgeText}>{badgeText}</Text>
      </View>
    </View>
  );
}

function onSelectMood(mood) {
  // placeholder if needed from outside - left intentionally
  console.log("mood selected (global):", mood.id);
}

/* styles */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#050405" },
  container: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 36 },

  headerWrap: { alignItems: "center", marginBottom: 14 },
  welcome: { color: "#7F5CFF", fontSize: 36, fontWeight: "800", textAlign: "center" },
  headerSub: { color: "#9A9AA0", textAlign: "center", marginTop: 8, fontSize: 15 },

  card: { backgroundColor: "#0E0E10", borderRadius: 14, padding: 14, marginBottom: 18 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  headerIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(61,220,132,0.08)", alignItems: "center", justifyContent: "center", marginRight: 10 },
  cardTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },

  goalList: { marginTop: 6 },
  goalRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#151516", paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, marginBottom: 10 },
  goalIconWrap: { width: 38, height: 38, borderRadius: 10, backgroundColor: "#0F0F10", alignItems: "center", justifyContent: "center", marginRight: 12 },
  goalIcon: { fontSize: 18 },
  goalTitle: { color: "#EDEEF0", fontSize: 14, fontWeight: "600" },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, alignItems: "center", justifyContent: "center", marginLeft: 12, minWidth: 58 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  checkIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,200,90,0.08)", alignItems: "center", justifyContent: "center" },
  checkIcon: { fontSize: 20 },
  checkSub: { color: "#CFCFD2", marginBottom: 12, marginTop: 6 },
  moodBtn: { marginTop: 6, backgroundColor: "#F59B17", paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  moodBtnText: { color: "#fff", fontWeight: "700" },

  chatContainer: { backgroundColor: "#0B0B0C", borderRadius: 14, padding: 0, overflow: "hidden" },
  chatHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#2D1A45", paddingHorizontal: 14, paddingVertical: 12 },
  chatHeaderLeft: { flexDirection: "row", alignItems: "center" },
  chatAvatar: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#6C4CFF", alignItems: "center", justifyContent: "center", marginRight: 10 },
  chatAvatarIcon: { fontSize: 20, color: "#fff" },
  chatTitle: { color: "#FFFFFF", fontWeight: "800" },
  chatSub: { color: "#CFCFD2", fontSize: 12 },
  onlineDotWrap: { alignItems: "center", flexDirection: "row" },
  onlineDot: { width: 10, height: 10, borderRadius: 6, backgroundColor: "#2BC66E", marginRight: 6 },
  onlineText: { color: "#9ECFA1", fontSize: 12 },

  messages: { flexDirection: "row", padding: 14, paddingTop: 18, backgroundColor: "#050505", alignItems: "flex-start" },
  aiIconSmall: { width: 36, alignItems: "center", marginRight: 8, marginTop: 6 },
  aiBubbleWrap: { backgroundColor: "#0E1113", borderRadius: 10, padding: 14, maxWidth: "85%" },
  aiBubbleText: { color: "#E6F1F4", lineHeight: 20 },
  msgTime: { color: "#6C6C72", fontSize: 11, marginTop: 8 },

  chatInputRow: { flexDirection: "row", alignItems: "center", padding: 12, gap: 8, backgroundColor: "#050505" },
  chatInput: { flex: 1, height: 44, backgroundColor: "#0E0E10", borderRadius: 10, paddingHorizontal: 12, color: "#fff" },
  iconBtn: { width: 44, height: 44, borderRadius: 10, backgroundColor: "#0D0D0E", alignItems: "center", justifyContent: "center", marginLeft: 8 },
  iconBtnText: { fontSize: 18 },
  sendBtn: { width: 48, height: 44, borderRadius: 10, backgroundColor: "#6F4BFF", alignItems: "center", justifyContent: "center", marginLeft: 8 },

  /* Modal styles */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#050505", borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 14, paddingBottom: 28 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, marginBottom: 8 },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  modalClose: { padding: 8 },
  moodItem: {
    width: "47%",
    height: 110,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  moodLabel: { marginTop: 8, color: "#fff", fontWeight: "700" },
  modalHint: { color: "#9A9AA0", textAlign: "center", marginTop: 8, paddingHorizontal: 20, fontSize: 13 },
});
