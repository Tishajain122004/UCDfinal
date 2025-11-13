// home.js - Modern Aesthetic Version
// import React, { useState, useEffect } from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   TextInput,
//   Modal,
//   StatusBar,
//   FlatList,
//   ActivityIndicator,
//   Alert,
//   Animated,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { useFocusEffect } from "@react-navigation/native";
// import { getAllTasks } from '../services/studyTaskApi';

// export default function Home({ navigation }) {
//   const [chatText, setChatText] = useState("");
//   const [moodModalVisible, setMoodModalVisible] = useState(false);
//   const [selectedMood, setSelectedMood] = useState(null);
//   const [todayTasks, setTodayTasks] = useState([]);
//   const [isLoadingTasks, setIsLoadingTasks] = useState(true);

//   const moodOptions = [
//     { id: "happy", label: "Happy", icon: "emoticon-happy-outline", bg: "#FFB347" },
//     { id: "calm", label: "Calm", icon: "emoticon-cool-outline", bg: "#4FC3F7" },
//     { id: "thoughtful", label: "Thoughtful", icon: "emoticon-thinking-outline", bg: "#D68BFF" },
//     { id: "down", label: "Down", icon: "emoticon-sad-outline", bg: "#9CA3AF" },
//     { id: "stressed", label: "Stressed", icon: "emoticon-dead-outline", bg: "#FF6B6B" },
//     { id: "tired", label: "Tired", icon: "emoticon-sleep-outline", bg: "#B66CFF" },
//     { id: "motivated", label: "Motivated", icon: "fire", bg: "#2DD36F" },
//     { id: "neutral", label: "Neutral", icon: "emoticon-neutral-outline", bg: "#9CA3AF" },
//   ];

//   const getTopPriorityTasks = (tasks) => {
//     const activeTasks = tasks.filter(task => task.status === 'Active');
//     if (activeTasks.length === 0) return [];

//     const priorityOrder = { High: 1, Medium: 2, Low: 3 };
//     const sortedTasks = [...activeTasks].sort((a, b) => {
//       const priorityA = priorityOrder[a.priority] || 999;
//       const priorityB = priorityOrder[b.priority] || 999;
//       return priorityA - priorityB;
//     });

//     return sortedTasks.slice(0, 3);
//   };

//   const fetchTodayTasks = async () => {
//     console.log("Home.js: Fetching tasks for Today's Goals...");
//     setIsLoadingTasks(true);
    
//     try {
//       const response = await getAllTasks();
      
//       if (response.success && response.data) {
//         console.log("Home.js: Tasks fetched successfully:", response.data.length, "tasks");
//         const topTasks = getTopPriorityTasks(response.data);
//         setTodayTasks(topTasks);
//         console.log("Home.js: Top priority tasks:", topTasks.length);
//       } else {
//         console.warn("Home.js: Failed to fetch tasks:", response.error);
//         Alert.alert("Error", "Could not load today's goals");
//       }
//     } catch (error) {
//       console.error("Home.js: Error fetching tasks:", error);
//       Alert.alert("Error", "Something went wrong while loading tasks");
//     } finally {
//       setIsLoadingTasks(false);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchTodayTasks();
//     }, [])
//   );

//   const getPriorityIcon = (priority) => {
//     switch(priority) {
//       case 'High': return 'fire';
//       case 'Medium': return 'star';
//       case 'Low': return 'clock-outline';
//       default: return 'checkbox-marked-circle-outline';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch(priority) {
//       case 'High': return { main: '#f87171', gradient: ['#ef4444', '#f87171'] };
//       case 'Medium': return { main: '#a78bfa', gradient: ['#8b5cf6', '#a78bfa'] };
//       case 'Low': return { main: '#6b7280', gradient: ['#4b5563', '#6b7280'] };
//       default: return { main: '#666', gradient: ['#555', '#666'] };
//     }
//   };

//   const getTaskProgress = (task) => {
//     const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
//     if (subtasks.length === 0) return { completed: 0, total: 0, text: "Start" };
//     const completed = subtasks.filter(sub => sub.completed).length;
//     const total = subtasks.length;
//     return { completed, total, text: `${completed}/${total}` };
//   };

//   function onSelectMood(mood) {
//     setSelectedMood(mood.id);
//     setMoodModalVisible(false);
//     console.log("Mood selected:", mood.id);
//   }

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor="#050405" />
//       <ScrollView 
//         contentContainerStyle={styles.container}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Modern Header with Gradient */}
//         <View style={styles.headerWrap}>
//           <View style={styles.gradientOverlay}>
//             <Text style={styles.welcome}>Welcome Back! ✨</Text>
//             <Text style={styles.headerSub}>
//               Your AI companion for productivity and wellness
//             </Text>
//           </View>
//         </View>

//         {/* ===== Modern Today's Goals Card ===== */}
//         <Pressable 
//           style={({ pressed }) => [
//             styles.modernCard,
//             styles.goalsCard,
//             pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
//           ]}
//           onPress={() => navigation.navigate('Study Tasks')}
//         >
//           {/* Gradient Background */}
//           <View style={styles.cardGradient} />
          
//           {/* Header with Click Hint */}
//           <View style={styles.modernCardHeader}>
//             <View style={styles.headerLeft}>
//               <View style={styles.modernIconWrap}>
//                 <Icon name="target" size={22} color="#fff" />
//               </View>
//               <View>
//                 <Text style={styles.modernCardTitle}>Today's Goals</Text>
//                 <Text style={styles.cardSubtitle}>Tap to view all tasks →</Text>
//               </View>
//             </View>
//             <Pressable 
//               onPress={(e) => {
//                 e.stopPropagation();
//                 fetchTodayTasks();
//               }}
//               style={styles.refreshBtn}
//             >
//               <Icon name="refresh" size={18} color="#fff" />
//             </Pressable>
//           </View>

//           {/* Tasks List */}
//           <View style={styles.modernGoalList}>
//             {isLoadingTasks ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="small" color="#a78bfa" />
//                 <Text style={styles.loadingText}>Loading your goals...</Text>
//               </View>
//             ) : todayTasks.length === 0 ? (
//               <View style={styles.emptyContainer}>
//                 <View style={styles.emptyIconWrap}>
//                   <Icon name="trophy-outline" size={40} color="#fbbf24" />
//                 </View>
//                 <Text style={styles.emptyTitle}>All Clear! 🎉</Text>
//                 <Text style={styles.emptySubtitle}>
//                   No active tasks. Time to create some goals!
//                 </Text>
//                 <Pressable 
//                   style={styles.modernAddBtn}
//                   onPress={() => navigation.navigate('Study Tasks')}
//                 >
//                   <Icon name="plus-circle" size={18} color="#fff" />
//                   <Text style={styles.modernAddBtnText}>Add New Task</Text>
//                 </Pressable>
//               </View>
//             ) : (
//               todayTasks.map((task, index) => {
//                 const progress = getTaskProgress(task);
//                 const colors = getPriorityColor(task.priority);
//                 return (
//                   <ModernTaskItem
//                     key={task.id}
//                     icon={getPriorityIcon(task.priority)}
//                     title={task.title}
//                     priority={task.priority}
//                     badgeText={progress.text}
//                     color={colors.main}
//                     index={index}
//                   />
//                 );
//               })
//             )}
//           </View>
//         </Pressable>

//         {/* Modern Quick Check-in Card */}
//         <View style={[styles.modernCard, styles.checkInCard]}>
//           <View style={styles.checkInGradient} />
//           <View style={styles.modernCardHeader}>
//             <View style={styles.headerLeft}>
//               <View style={[styles.modernIconWrap, { backgroundColor: 'rgba(255, 211, 107, 0.2)' }]}>
//                 <Icon name="emoticon-happy-outline" size={22} color="#ffd36b" />
//               </View>
//               <View>
//                 <Text style={styles.modernCardTitle}>Quick Check-in</Text>
//                 <Text style={styles.cardSubtitle}>How are you feeling?</Text>
//               </View>
//             </View>
//           </View>

//           {selectedMood ? (
//             <View style={styles.selectedMoodContainer}>
//               <Icon 
//                 name={moodOptions.find(m => m.id === selectedMood)?.icon} 
//                 size={32} 
//                 color={moodOptions.find(m => m.id === selectedMood)?.bg} 
//               />
//               <Text style={styles.selectedMoodText}>
//                 Feeling {moodOptions.find(m => m.id === selectedMood)?.label}
//               </Text>
//             </View>
//           ) : null}

//           <Pressable 
//             style={({ pressed }) => [
//               styles.modernMoodBtn,
//               pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
//             ]}
//             onPress={() => setMoodModalVisible(true)}
//           >
//             <Icon name="heart-pulse" size={18} color="#fff" />
//             <Text style={styles.modernMoodBtnText}>
//               {selectedMood ? 'Update Mood' : 'Share My Mood'}
//             </Text>
//           </Pressable>
//         </View>

//         {/* Modern Chat Widget */}
//         <View style={styles.modernChatContainer}>
//           {/* Header */}
//           <View style={styles.modernChatHeader}>
//             <View style={styles.chatHeaderLeft}>
//               <View style={styles.modernChatAvatar}>
//                 <Icon name="robot-outline" size={24} color="#fff" />
//                 <View style={styles.chatAvatarGlow} />
//               </View>
//               <View>
//                 <Text style={styles.modernChatTitle}>StudyBuddy AI</Text>
//                 <View style={styles.onlineIndicator}>
//                   <View style={styles.onlinePulse} />
//                   <Text style={styles.onlineText}>Online Now</Text>
//                 </View>
//               </View>
//             </View>
//           </View>

//           {/* Message Bubble */}
//           <View style={styles.modernMessages}>
//             <View style={styles.modernAiBubble}>
//               <Text style={styles.modernAiText}>
//                 Hey there! 👋 I'm your StudyBuddy AI companion.{"\n\n"}
//                 I'm here to help you stay motivated, focused, and balanced in your learning journey.{"\n\n"}
//                 How are you feeling today?
//               </Text>
//               <Text style={styles.modernMsgTime}>Just now</Text>
//             </View>
//           </View>

//           {/* Modern Input */}
//           <View style={styles.modernChatInput}>
//             <View style={styles.inputWrapper}>
//               <Icon name="pencil-outline" size={18} color="#6C6C72" style={styles.inputIcon} />
//               <TextInput
//                 placeholder="Type your message..."
//                 placeholderTextColor="#6C6C72"
//                 style={styles.modernTextInput}
//                 value={chatText}
//                 onChangeText={setChatText}
//               />
//             </View>
//             <View style={styles.actionButtons}>
//               <Pressable style={styles.modernIconBtn}>
//                 <Icon name="microphone" size={20} color="#9CA3AF" />
//               </Pressable>
//               <Pressable style={styles.modernIconBtn}>
//                 <Icon name="camera" size={20} color="#9CA3AF" />
//               </Pressable>
//               <Pressable 
//                 style={styles.modernSendBtn}
//                 onPress={() => { 
//                   console.log("send:", chatText); 
//                   setChatText(""); 
//                 }}
//               >
//                 <Icon name="send" size={18} color="#fff" />
//               </Pressable>
//             </View>
//           </View>
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>

//       {/* Modern Mood Modal */}
//       <Modal
//         visible={moodModalVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setMoodModalVisible(false)}
//       >
//         <View style={styles.modernModalOverlay}>
//           <Pressable 
//             style={styles.modernModalBackdrop} 
//             onPress={() => setMoodModalVisible(false)}
//           />
//           <View style={styles.modernModalCard}>
//             <View style={styles.modernModalHandle} />
//             <View style={styles.modernModalHeader}>
//               <View>
//                 <Text style={styles.modernModalTitle}>How are you feeling?</Text>
//                 <Text style={styles.modernModalSubtitle}>Select your current mood</Text>
//               </View>
//               <Pressable 
//                 onPress={() => setMoodModalVisible(false)} 
//                 style={styles.modernModalClose}
//               >
//                 <Icon name="close" size={22} color="#fff" />
//               </Pressable>
//             </View>

//             <FlatList
//               data={moodOptions}
//               keyExtractor={(item) => item.id}
//               numColumns={2}
//               contentContainerStyle={styles.moodGrid}
//               columnWrapperStyle={styles.moodRow}
//               renderItem={({ item }) => (
//                 <Pressable
//                   onPress={() => onSelectMood(item)}
//                   style={({ pressed }) => [
//                     styles.modernMoodItem,
//                     { backgroundColor: item.bg },
//                     pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }
//                   ]}
//                 >
//                   <Icon name={item.icon} size={36} color="#fff" />
//                   <Text style={styles.modernMoodLabel}>{item.label}</Text>
//                 </Pressable>
//               )}
//             />

//             <Text style={styles.modernModalHint}>
//               💡 Your mood helps me provide better support and suggestions
//             </Text>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* Modern Task Item Component */
// function ModernTaskItem({ icon, title, priority, badgeText, color, index }) {
//   return (
//     <View style={[styles.modernTaskRow, { animationDelay: `${index * 100}ms` }]}>
//       <View style={styles.taskContent}>
//         <View style={[styles.modernTaskIcon, { backgroundColor: color + '20' }]}>
//           <Icon name={icon} size={18} color={color} />
//         </View>
//         <View style={styles.taskInfo}>
//           <Text style={styles.modernTaskTitle} numberOfLines={1}>
//             {title}
//           </Text>
//           <View style={styles.taskMeta}>
//             <View style={[styles.priorityDot, { backgroundColor: color }]} />
//             <Text style={[styles.priorityLabel, { color: color }]}>
//               {priority} Priority
//             </Text>
//           </View>
//         </View>
//       </View>
//       <View style={[styles.modernBadge, { backgroundColor: color }]}>
//         <Text style={styles.modernBadgeText}>{badgeText}</Text>
//       </View>
//     </View>
//   );
// }

// /* Modern Styles */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#050405" },
//   container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36 },

//   // Header
//   headerWrap: { 
//     marginBottom: 24,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   gradientOverlay: {
//     padding: 16,
//   },
//   welcome: { 
//     color: "#fff", 
//     fontSize: 32, 
//     fontWeight: "900", 
//     textAlign: "center",
//     letterSpacing: -0.5,
//   },
//   headerSub: { 
//     color: "#9CA3AF", 
//     textAlign: "center", 
//     marginTop: 8, 
//     fontSize: 14,
//     lineHeight: 20,
//   },

//   // Modern Card Base
//   modernCard: {
//     backgroundColor: "#0E0E10",
//     borderRadius: 20,
//     padding: 18,
//     marginBottom: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },

//   goalsCard: {
//     backgroundColor: '#0a0a0b',
//   },

//   cardGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 100,
//     opacity: 0.1,
//   },

//   // Card Header
//   modernCardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   modernIconWrap: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: 'rgba(139, 92, 246, 0.2)',
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   modernCardTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "800",
//     letterSpacing: -0.3,
//   },
//   cardSubtitle: {
//     color: "#6B7280",
//     fontSize: 12,
//     marginTop: 2,
//   },
//   refreshBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   // Goals List
//   modernGoalList: {
//     gap: 10,
//   },

//   // Modern Task Row
//   modernTaskRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#151517",
//     paddingVertical: 14,
//     paddingHorizontal: 14,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.03)',
//   },
//   taskContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   modernTaskIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   taskInfo: {
//     flex: 1,
//   },
//   modernTaskTitle: {
//     color: "#E5E7EB",
//     fontSize: 15,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   taskMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   priorityDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     marginRight: 6,
//   },
//   priorityLabel: {
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   modernBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     minWidth: 50,
//     alignItems: "center",
//   },
//   modernBadgeText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   // Loading & Empty States
//   loadingContainer: {
//     paddingVertical: 32,
//     alignItems: "center",
//   },
//   loadingText: {
//     color: "#6B7280",
//     marginTop: 12,
//     fontSize: 14,
//   },
//   emptyContainer: {
//     paddingVertical: 24,
//     alignItems: "center",
//   },
//   emptyIconWrap: {
//     width: 64,
//     height: 64,
//     borderRadius: 16,
//     backgroundColor: 'rgba(251, 191, 36, 0.1)',
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   emptyTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 6,
//   },
//   emptySubtitle: {
//     color: "#6B7280",
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   modernAddBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#8b5cf6",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     gap: 6,
//   },
//   modernAddBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 14,
//   },

//   // Check-in Card
//   checkInCard: {
//     backgroundColor: '#0a0a0b',
//   },
//   checkInGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 80,
//     opacity: 0.08,
//   },
//   selectedMoodContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: 'rgba(255, 255, 255, 0.03)',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//     gap: 10,
//   },
//   selectedMoodText: {
//     color: "#E5E7EB",
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   modernMoodBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f59e0b",
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     gap: 8,
//   },
//   modernMoodBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 15,
//   },

//   // Modern Chat Container
//   modernChatContainer: {
//     backgroundColor: "#0a0a0b",
//     borderRadius: 20,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   modernChatHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#1a1a2e",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//   },
//   chatHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   modernChatAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#8b5cf6",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//     position: 'relative',
//   },
//   chatAvatarGlow: {
//     position: 'absolute',
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#8b5cf6",
//     opacity: 0.3,
//   },
//   modernChatTitle: {
//     color: "#fff",
//     fontWeight: "800",
//     fontSize: 16,
//   },
//   onlineIndicator: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 2,
//   },
//   onlinePulse: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#10b981",
//     marginRight: 6,
//   },
//   onlineText: {
//     color: "#6ee7b7",
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   // Messages
//   modernMessages: {
//     padding: 16,
//     backgroundColor: "#050505",
//   },
//   modernAiBubble: {
//     backgroundColor: "#151517",
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   modernAiText: {
//     color: "#E5E7EB",
//     lineHeight: 22,
//     fontSize: 14,
//   },
//   modernMsgTime: {
//     color: "#6B7280",
//     fontSize: 11,
//     marginTop: 10,
//   },

//   // Modern Input
//   modernChatInput: {
//     padding: 12,
//     backgroundColor: "#050505",
//     gap: 10,
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#151517",
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   inputIcon: {
//     marginRight: 8,
//   },
//   modernTextInput: {
//     flex: 1,
//     height: 48,
//     color: "#fff",
//     fontSize: 14,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   modernIconBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#151517",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   modernSendBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#8b5cf6",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   // Modern Modal
//   modernModalOverlay: {
//     flex: 1,
//     justifyContent: "flex-end",
//   },
//   modernModalBackdrop: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.7)",
//   },
//   modernModalCard: {
//     backgroundColor: "#0E0E10",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingTop: 8,
//     paddingBottom: 32,
//     borderTopWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   modernModalHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#374151',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
//   modernModalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   modernModalTitle: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "800",
//     letterSpacing: -0.5,
//   },
//   modernModalSubtitle: {
//     color: "#6B7280",
//     fontSize: 13,
//     marginTop: 2,
//   },
//   modernModalClose: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   moodGrid: {
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//   },
//   moodRow: {
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   modernMoodItem: {
//     width: "48%",
//     height: 120,
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   modernMoodLabel: {
//     marginTop: 10,
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 15,
//   },
//   modernModalHint: {
//     color: "#6B7280",
//     textAlign: "center",
//     marginTop: 16,
//     paddingHorizontal: 24,
//     fontSize: 13,
//     lineHeight: 20,
//   },
// });

















// import React, { useState, useEffect, useRef } from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   TextInput,
//   Modal,
//   StatusBar,
//   FlatList, // <-- Naya import
//   ActivityIndicator,
//   Alert,
//   // Animated (ab use nahi ho raha, hata sakte hain)
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { useFocusEffect } from "@react-navigation/native";
// import { getAllTasks } from '../services/studyTaskApi';
// // ===== NAYE IMPORTS =====
// import axios from 'axios';
// import { chatService, getCurrentUser } from '../services/chatService';
// // ==========================

// // ‼️ IMPORTANT: YEH AAPKE OLLAMA BACKEND KA URL HAI
// // Yahaan apna wohi IP address daalein jo aapne baaki services mein daala hai
// // Port 3000 (jaisa aapki friend ke setup mein tha)
// const OLLAMA_BACKEND_URL = 'http://10.21.2.243:3000';
// import StudyTasks from '../more/StudyTasks';


// export default function Home({ navigation }) {
//   // Purane states
//   const [moodModalVisible, setMoodModalVisible] = useState(false);
//   const [selectedMood, setSelectedMood] = useState(null);
//   const [todayTasks, setTodayTasks] = useState([]);
//   const [isLoadingTasks, setIsLoadingTasks] = useState(true);

//   // ===== CHAT KE LIYE NAYE STATES =====
//   const [chatText, setChatText] = useState(""); // Yeh pehle se tha
//   const [messages, setMessages] = useState([]); // Chat history ke liye
//   const [isAiLoading, setIsAiLoading] = useState(false); // AI ke response ke liye
//   const [isLoadingHistory, setIsLoadingHistory] = useState(true); // History load karne ke liye
//   const [currentUser, setCurrentUser] = useState(null);
//   const chatListRef = useRef(null); // FlatList ko scroll karne ke liye
//   // ==================================

//   const moodOptions = [
//     { id: "happy", label: "Happy", icon: "emoticon-happy-outline", bg: "#FFB347" },
//     { id: "calm", label: "Calm", icon: "emoticon-cool-outline", bg: "#4FC3F7" },
//     { id: "thoughtful", label: "Thoughtful", icon: "emoticon-thinking-outline", bg: "#D68BFF" },
//     { id: "down", label: "Down", icon: "emoticon-sad-outline", bg: "#9CA3AF" },
//     { id: "stressed", label: "Stressed", icon: "emoticon-dead-outline", bg: "#FF6B6B" },
//     { id: "tired", label: "Tired", icon: "emoticon-sleep-outline", bg: "#B66CFF" },
//     { id: "motivated", label: "Motivated", icon: "fire", bg: "#2DD36F" },
//     { id: "neutral", label: "Neutral", icon: "emoticon-neutral-outline", bg: "#9CA3AF" },
//   ];

//   // ===== Task Functions (Koi Change Nahi) =====
//   const getTopPriorityTasks = (tasks) => {
//     const activeTasks = tasks.filter(task => task.status === 'Active');
//     if (activeTasks.length === 0) return [];

//     const priorityOrder = { High: 1, Medium: 2, Low: 3 };
//     const sortedTasks = [...activeTasks].sort((a, b) => {
//       const priorityA = priorityOrder[a.priority] || 999;
//       const priorityB = priorityOrder[b.priority] || 999;
//       return priorityA - priorityB;
//     });

//     return sortedTasks.slice(0, 3);
//   };

//   const fetchTodayTasks = async () => {
//     console.log("Home.js: Fetching tasks...");
//     setIsLoadingTasks(true);    
//     try {
//       const response = await getAllTasks();
//       if (response.success && response.data) {
//         const topTasks = getTopPriorityTasks(response.data);
//         setTodayTasks(topTasks);
//       } else {
//         console.warn("Home.js: Failed to fetch tasks:", response.error);
//         // Alert.alert("Error", "Could not load today's goals"); // Isse comment kar diya taaki chat test kar sakein
//       }
//     } catch (error) {
//       console.error("Home.js: Error fetching tasks:", error);
//       // Alert.alert("Error", "Something went wrong while loading tasks"); // Isse comment kar diya
//     } finally {
//       setIsLoadingTasks(false);
//     }
//   };
  
//   // ===== NAYA FUNCTION: User aur Chat History Load Karein =====
//   const loadUserAndHistory = async () => {
//     console.log("Home.js: Loading user and chat history...");
//     setIsLoadingHistory(true);
//     try {
//       // 1. Current user ko get karein
//       const user = await getCurrentUser();
//       if (!user) {
//         Alert.alert('Error', 'Please log in to use chat');
//         return;
//       }
//       setCurrentUser(user);

//       // 2. Chat history Supabase se load karein
//       const history = await chatService.getChatHistory(user.id);
      
//       if (history && history.length > 0) {
//         const formattedMessages = history.map(msg => ({
//           id: msg.id,
//           text: msg.message,
//           isUser: msg.is_user,
//           createdAt: msg.created_at
//         }));
//         setMessages(formattedMessages);
//       } else {
//         // First time - welcome message dikhayein
//         const welcomeMsg = {
//           id: '1',
//           text: "Hey there! 👋 I'm your StudyBuddy AI companion. How are you feeling today?",
//           isUser: false
//         };
//         setMessages([welcomeMsg]);
//       }
//     } catch (error) {
//       console.error('Error loading history:', error);
//       Alert.alert('Error', 'Failed to load chat history');
//     } finally {
//       setIsLoadingHistory(false);
//     }
//   };

//   // Jab bhi screen focus mein aaye, Tasks aur Chat History dono load karein
//   useFocusEffect(
//     React.useCallback(() => {
//       fetchTodayTasks();
//       loadUserAndHistory();
//     }, [])
//   );
  
//   // ===== NAYA FUNCTION: Message Bhejein =====
//   const handleSendMessage = async () => {
//     if (!chatText.trim() || isAiLoading || !currentUser) return;

//     const userMessageText = chatText;
//     setInputText('');
//     setIsAiLoading(true);

//     // 1. User ka message UI par dikhayein
//     const userMessage = {
//       id: Date.now().toString(),
//       text: userMessageText,
//       isUser: true
//     };
//     setMessages(prev => [...prev, userMessage]);

//     try {
//       // 2. User ka message Supabase mein save karein
//       await chatService.saveMessage(currentUser.id, userMessageText, true);

//       // 3. Ollama backend ko call karein
//       const response = await axios.post(`${OLLAMA_BACKEND_URL}/api/chat`, {
//         message: userMessageText
//       }, {
//         timeout: 60000 // 1 minute timeout
//       });

//       const botMessageText = response.data.response;

//       // 4. Bot ka message UI par dikhayein
//       const botMessage = {
//         id: (Date.now() + 1).toString(),
//         text: botMessageText,
//         isUser: false
//       };
//       setMessages(prev => [...prev, botMessage]);

//       // 5. Bot ka message Supabase mein save karein
//       await chatService.saveMessage(currentUser.id, botMessageText, false);

//     } catch (error) {
//       console.error('Chat Error:', error);
//       const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
//       Alert.alert(
//         'AI Error',
//         'Failed to get response. Make sure Ollama backend server is running.\n\n' + errorMsg
//       );
      
//       // Error message UI par dikhayein
//       const errorMessage = {
//         id: (Date.now() + 1).toString(),
//         text: 'Sorry, I encountered an error. Please try again.',
//         isUser: false,
//         isError: true
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsAiLoading(false);
//     }
//   };
  
//   // ===== NAYA FUNCTION: Chat Message Render Karein =====
//   const renderMessage = ({ item }) => (
//     <View
//       style={[
//         styles.messageBubble,
//         item.isUser ? styles.userBubble : styles.botBubble,
//         item.isError && styles.errorBubble
//       ]}
//     >
//       <Text style={[
//         styles.messageText,
//         item.isUser ? styles.userText : styles.botText
//       ]}>
//         {item.text}
//       </Text>
//     </View>
//   );

//   // ===== Task helper functions (Koi Change Nahi) =====
//   const getPriorityIcon = (priority) => {
//     switch(priority) {
//       case 'High': return 'fire';
//       case 'Medium': return 'star';
//       case 'Low': return 'clock-outline';
//       default: return 'checkbox-marked-circle-outline';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch(priority) {
//       case 'High': return { main: '#f87171', gradient: ['#ef4444', '#f87171'] };
//       case 'Medium': return { main: '#a78bfa', gradient: ['#8b5cf6', '#a78bfa'] };
//       case 'Low': return { main: '#6b7280', gradient: ['#4b5563', '#6b7280'] };
//       default: return { main: '#666', gradient: ['#555', '#666'] };
//     }
//   };

//   const getTaskProgress = (task) => {
//     // FIX: Subtasks null/undefined hone se crash fix
//     const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
//     if (subtasks.length === 0) return { completed: 0, total: 0, text: "Start" };
//     const completed = subtasks.filter(sub => sub.completed).length;
//     const total = subtasks.length;
//     return { completed, total, text: `${completed}/${total}` };
//   };

//   function onSelectMood(mood) {
//     setSelectedMood(mood.id);
//     setMoodModalVisible(false);
//     console.log("Mood selected:", mood.id);
//   }

//   // ===== RETURN (JSX) - UPDATE KIYA GAYA =====
//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor="#050405" />
//       <ScrollView 
//         contentContainerStyle={styles.container}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Modern Header (No change) */}
//         <View style={styles.headerWrap}>
//           <View style={styles.gradientOverlay}>
//             <Text style={styles.welcome}>Welcome Back! ✨</Text>
//             <Text style={styles.headerSub}>
//               Your AI companion for productivity and wellness
//             </Text>
//           </View>
//         </View>

//         {/* ===== Modern Today's Goals Card (No change) ===== */}
//         <Pressable 
//           style={({ pressed }) => [
//             styles.modernCard,
//             styles.goalsCard,
//             pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
//           ]}
//           onPress={() => navigation.navigate('StudyTasks')}
//         >
//           {/* Gradient Background */}
//           <View style={styles.cardGradient} />
          
//           {/* Header with Click Hint */}
//           <View style={styles.modernCardHeader}>
//             <View style={styles.headerLeft}>
//               <View style={styles.modernIconWrap}>
//                 <Icon name="target" size={22} color="#fff" />
//               </View>
//               <View>
//                 <Text style={styles.modernCardTitle}>Today's Goals</Text>
//                 <Text style={styles.cardSubtitle}>Tap to view all tasks →</Text>
//               </View>
//             </View>
//             <Pressable 
//               onPress={(e) => {
//                 e.stopPropagation();
//                 fetchTodayTasks();
//               }}
//               style={styles.refreshBtn}
//             >
//               <Icon name="refresh" size={18} color="#fff" />
//             </Pressable>
//           </View>

//           {/* Tasks List */}
//           <View style={styles.modernGoalList}>
//             {isLoadingTasks ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="small" color="#a78bfa" />
//                 <Text style={styles.loadingText}>Loading your goals...</Text>
//               </View>
//             ) : todayTasks.length === 0 ? (
//               <View style={styles.emptyContainer}>
//                 <View style={styles.emptyIconWrap}>
//                   <Icon name="trophy-outline" size={40} color="#fbbf24" />
//                 </View>
//                 <Text style={styles.emptyTitle}>All Clear! 🎉</Text>
//                 <Text style={styles.emptySubtitle}>
//                   No active tasks. Time to create some goals!
//                 </Text>
//                 <Pressable 
//                   style={styles.modernAddBtn}
//                   onPress={() => navigation.navigate('StudyTasks')}
//                 >
//                   <Icon name="plus-circle" size={18} color="#fff" />
//                   <Text style={styles.modernAddBtnText}>Add New Task</Text>
//                 </Pressable>
//               </View>
//             ) : (
//               todayTasks.map((task, index) => {
//                 const progress = getTaskProgress(task);
//                 const colors = getPriorityColor(task.priority);
//                 return (
//                   <ModernTaskItem
//                     key={task.id}
//                     icon={getPriorityIcon(task.priority)}
//                     title={task.title}
//                     priority={task.priority}
//                     badgeText={progress.text}
//                     color={colors.main}
//                     index={index}
//                   />
//                 );
//               })
//             )}
//           </View>
//         </Pressable>

//         {/* Modern Quick Check-in Card (No change) */}
//         <View style={[styles.modernCard, styles.checkInCard]}>
//           <View style={styles.checkInGradient} />
//           <View style={styles.modernCardHeader}>
//             <View style={styles.headerLeft}>
//               <View style={[styles.modernIconWrap, { backgroundColor: 'rgba(255, 211, 107, 0.2)' }]}>
//                 <Icon name="emoticon-happy-outline" size={22} color="#ffd36b" />
//               </View>
//               <View>
//                 <Text style={styles.modernCardTitle}>Quick Check-in</Text>
//                 <Text style={styles.cardSubtitle}>How are you feeling?</Text>
//               </View>
//             </View>
//           </View>

//           {selectedMood ? (
//             <View style={styles.selectedMoodContainer}>
//               <Icon 
//                 name={moodOptions.find(m => m.id === selectedMood)?.icon} 
//                 size={32} 
//                 color={moodOptions.find(m => m.id === selectedMood)?.bg} 
//               />
//               <Text style={styles.selectedMoodText}>
//                 Feeling {moodOptions.find(m => m.id === selectedMood)?.label}
//               </Text>
//             </View>
//           ) : null}

//           <Pressable 
//             style={({ pressed }) => [
//               styles.modernMoodBtn,
//               pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
//             ]}
//             onPress={() => setMoodModalVisible(true)}
//           >
//             <Icon name="heart-pulse" size={18} color="#fff" />
//             <Text style={styles.modernMoodBtnText}>
//               {selectedMood ? 'Update Mood' : 'Share My Mood'}
//             </Text>
//           </Pressable>
//         </View>

//         {/* ===== Modern Chat Widget (UPDATED) ===== */}
//         <View style={styles.modernChatContainer}>
//           {/* Header (No change) */}
//           <View style={styles.modernChatHeader}>
//             <View style={styles.chatHeaderLeft}>
//               <View style={styles.modernChatAvatar}>
//                 <Icon name="robot-outline" size={24} color="#fff" />
//                 <View style={styles.chatAvatarGlow} />
//               </View>
//               <View>
//                 <Text style={styles.modernChatTitle}>StudyBuddy AI</Text>
//                 <View style={styles.onlineIndicator}>
//                   <View style={styles.onlinePulse} />
//                   <Text style={styles.onlineText}>Online Now</Text>
//                 </View>
//               </View>
//             </View>
//           </View>

//           {/* Message List (DYNAMIC) */}
//           {isLoadingHistory ? (
//             <View style={styles.chatLoadingContainer}>
//               <ActivityIndicator size="small" color="#a78bfa" />
//               <Text style={styles.loadingText}>Loading chat...</Text>
//             </View>
//           ) : (
//             <FlatList
//               ref={chatListRef}
//               data={messages}
//               renderItem={renderMessage}
//               keyExtractor={item => item.id.toString()} // Key ko string banaya
//               contentContainerStyle={styles.chatMessageList}
//               ListFooterComponent={isAiLoading ? (
//                 <View style={styles.aiLoadingContainer}>
//                   <ActivityIndicator size="small" color="#a78bfa" />
//                   <Text style={styles.aiLoadingText}>StudyBuddy is thinking...</Text>
//                 </View>
//               ) : null}
//               onContentSizeChange={() => chatListRef.current?.scrollToEnd({ animated: true })}
//               onLayout={() => chatListRef.current?.scrollToEnd({ animated: true })}
//             />
//           )}

//           {/* Modern Input (DYNAMIC) */}
//           <View style={styles.modernChatInput}>
//             <View style={styles.inputWrapper}>
//               <Icon name="pencil-outline" size={18} color="#6C6C72" style={styles.inputIcon} />
//               <TextInput
//                 placeholder="Type your message..."
//                 placeholderTextColor="#6C6C72"
//                 style={styles.modernTextInput}
//                 value={chatText}
//                 onChangeText={setChatText}
//                 editable={!isAiLoading} // Disable jab AI soch raha hai
//               />
//             </View>
//             <View style={styles.actionButtons}>
//               <Pressable style={styles.modernIconBtn}>
//                 <Icon name="microphone" size={20} color="#9CA3AF" />
//               </Pressable>
//               <Pressable style={styles.modernIconBtn}>
//                 <Icon name="camera" size={20} color="#9CA3AF" />
//               </Pressable>
//               <Pressable 
//                 style={[
//                   styles.modernSendBtn, 
//                   (isAiLoading || !chatText.trim()) && styles.sendButtonDisabled // Disable style
//                 ]}
//                 onPress={handleSendMessage} // Naya function
//                 disabled={isAiLoading || !chatText.trim()} // Disable button
//               >
//                 {isAiLoading ? (
//                   <ActivityIndicator size="small" color="#fff" />
//                 ) : (
//                   <Icon name="send" size={18} color="#fff" />
//                 )}
//               </Pressable>
//             </View>
//           </View>
//         </View>
//         {/* ======================================= */}

//         <View style={{ height: 40 }} />
//       </ScrollView>

//       {/* Modern Mood Modal (No change) */}
//       <Modal
//         visible={moodModalVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setMoodModalVisible(false)}
//       >
//         <View style={styles.modernModalOverlay}>
//           <Pressable 
//             style={styles.modernModalBackdrop} 
//             onPress={() => setMoodModalVisible(false)}
//           />
//           <View style={styles.modernModalCard}>
//             <View style={styles.modernModalHandle} />
//             <View style={styles.modernModalHeader}>
//               <View>
//                 <Text style={styles.modernModalTitle}>How are you feeling?</Text>
//                 <Text style={styles.modernModalSubtitle}>Select your current mood</Text>
//               </View>
//               <Pressable 
//                 onPress={() => setMoodModalVisible(false)} 
//                 style={styles.modernModalClose}
//               >
//                 <Icon name="close" size={22} color="#fff" />
//               </Pressable>
//             </View>

//             <FlatList
//               data={moodOptions}
//               keyExtractor={(item) => item.id}
//               numColumns={2}
//               contentContainerStyle={styles.moodGrid}
//               columnWrapperStyle={styles.moodRow}
//               renderItem={({ item }) => (
//                 <Pressable
//                   onPress={() => onSelectMood(item)}
//                   style={({ pressed }) => [
//                     styles.modernMoodItem,
//                     { backgroundColor: item.bg },
//                     pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }
//                   ]}
//                 >
//                   <Icon name={item.icon} size={36} color="#fff" />
//                   <Text style={styles.modernMoodLabel}>{item.label}</Text>
//                 </Pressable>
//               )}
//             />

//             <Text style={styles.modernModalHint}>
//               💡 Your mood helps me provide better support and suggestions
//             </Text>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* Modern Task Item Component (No change) */
// function ModernTaskItem({ icon, title, priority, badgeText, color, index }) {
//   return (
//     <View style={[styles.modernTaskRow, { animationDelay: `${index * 100}ms` }]}>
//       <View style={styles.taskContent}>
//         <View style={[styles.modernTaskIcon, { backgroundColor: color + '20' }]}>
//           <Icon name={icon} size={18} color={color} />
//         </View>
//         <View style={styles.taskInfo}>
//           <Text style={styles.modernTaskTitle} numberOfLines={1}>
//             {title}
//           </Text>
//           <View style={styles.taskMeta}>
//             <View style={[styles.priorityDot, { backgroundColor: color }]} />
//             <Text style={[styles.priorityLabel, { color: color }]}>
//               {priority} Priority
//             </Text>
//           </View>
//         </View>
//       </View>
//       <View style={[styles.modernBadge, { backgroundColor: color }]}>
//         <Text style={styles.modernBadgeText}>{badgeText}</Text>
//       </View>
//     </View>
//   );
// }

// /* Modern Styles (Updated) */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#050405" },
//   container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36 },

//   // Header
//   headerWrap: { 
//     marginBottom: 24,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   gradientOverlay: {
//     padding: 16,
//   },
//   welcome: { 
//     color: "#fff", 
//     fontSize: 32, 
//     fontWeight: "900", 
//     textAlign: "center",
//     letterSpacing: -0.5,
//   },
//   headerSub: { 
//     color: "#9CA3AF", 
//     textAlign: "center", 
//     marginTop: 8, 
//     fontSize: 14,
//     lineHeight: 20,
//   },

//   // Modern Card Base
//   modernCard: {
//     backgroundColor: "#0E0E10",
//     borderRadius: 20,
//     padding: 18,
//     marginBottom: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },

//   goalsCard: {
//     backgroundColor: '#0a0a0b',
//   },

//   cardGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 100,
//     opacity: 0.1,
//   },

//   // Card Header
//   modernCardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   modernIconWrap: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: 'rgba(139, 92, 246, 0.2)',
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   modernCardTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "800",
//     letterSpacing: -0.3,
//   },
//   cardSubtitle: {
//     color: "#6B7280",
//     fontSize: 12,
//     marginTop: 2,
//   },
//   refreshBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   // Goals List
//   modernGoalList: {
//     gap: 10,
//   },

//   // Modern Task Row
//   modernTaskRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#151517",
//     paddingVertical: 14,
//     paddingHorizontal: 14,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.03)',
//   },
//   taskContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   modernTaskIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   taskInfo: {
//     flex: 1,
//   },
//   modernTaskTitle: {
//     color: "#E5E7EB",
//     fontSize: 15,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   taskMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   priorityDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     marginRight: 6,
//   },
//   priorityLabel: {
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   modernBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     minWidth: 50,
//     alignItems: "center",
//   },
//   modernBadgeText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   // Loading & Empty States
//   loadingContainer: {
//     paddingVertical: 32,
//     alignItems: "center",
//   },
//   loadingText: {
//     color: "#6B7280",
//     marginTop: 12,
//     fontSize: 14,
//   },
//   emptyContainer: {
//     paddingVertical: 24,
//     alignItems: "center",
//   },
//   emptyIconWrap: {
//     width: 64,
//     height: 64,
//     borderRadius: 16,
//     backgroundColor: 'rgba(251, 191, 36, 0.1)',
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   emptyTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 6,
//   },
//   emptySubtitle: {
//     color: "#6B7280",
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   modernAddBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#8b5cf6",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     gap: 6,
//   },
//   modernAddBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 14,
//   },

//   // Check-in Card
//   checkInCard: {
//     backgroundColor: '#0a0a0b',
//   },
//   checkInGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 80,
//     opacity: 0.08,
//   },
//   selectedMoodContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: 'rgba(255, 255, 255, 0.03)',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//     gap: 10,
//   },
//   selectedMoodText: {
//     color: "#E5E7EB",
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   modernMoodBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f59e0b",
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     gap: 8,
//   },
//   modernMoodBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 15,
//   },

//   // Modern Chat Container
//   modernChatContainer: {
//     backgroundColor: "#0a0a0b",
//     borderRadius: 20,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   modernChatHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#1a1a2e",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//   },
//   chatHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   modernChatAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#8b5cf6",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//     position: 'relative',
//   },
//   chatAvatarGlow: {
//     position: 'absolute',
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#8b5cf6",
//     opacity: 0.3,
//   },
//   modernChatTitle: {
//     color: "#fff",
//     fontWeight: "800",
//     fontSize: 16,
//   },
//   onlineIndicator: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 2,
//   },
//   onlinePulse: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#10b981",
//     marginRight: 6,
//   },
//   onlineText: {
//     color: "#6ee7b7",
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   // Modern Input
//   modernChatInput: {
//     padding: 12,
//     backgroundColor: "#050505",
//     gap: 10,
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#151517",
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   inputIcon: {
//     marginRight: 8,
//   },
//   modernTextInput: {
//     flex: 1,
//     height: 48,
//     color: "#fff",
//     fontSize: 14,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   modernIconBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#151517",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   modernSendBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#8b5cf6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sendButtonDisabled: { // Naya style
//     backgroundColor: '#374151'
//   },

//   // Modern Modal
//   modernModalOverlay: {
//     flex: 1,
//     justifyContent: "flex-end",
//   },
//   modernModalBackdrop: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.7)",
//   },
//   modernModalCard: {
//     backgroundColor: "#0E0E10",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingTop: 8,
//     paddingBottom: 32,
//     borderTopWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   modernModalHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#374151',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
//   modernModalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   modernModalTitle: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "800",
//     letterSpacing: -0.5,
//   },
//   modernModalSubtitle: {
//     color: "#6B7280",
//     fontSize: 13,
//     marginTop: 2,
//   },
//   modernModalClose: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   moodGrid: {
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//   },
//   moodRow: {
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   modernMoodItem: {
//     width: "48%",
//     height: 120,
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   modernMoodLabel: {
//     marginTop: 10,
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 15,
//   },
//   modernModalHint: {
//     color: "#6B7280",
//     textAlign: "center",
//     marginTop: 16,
//     paddingHorizontal: 24,
//     fontSize: 13,
//     lineHeight: 20,
//   },

//   // ===== NAYE CHAT STYLES (ChatScreen se copy kiye gaye) =====
//   chatLoadingContainer: { // Naya style (loading state)
//     padding: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 150,
//   },
//   chatMessageList: { // Naya style (FlatList ke liye)
//     padding: 16,
//     backgroundColor: "#050505",
//     minHeight: 150, // Thodi height de dein
//   },
//   messageBubble: {
//     maxWidth: '85%', // Thoda chhota
//     padding: 12,
//     borderRadius: 16,
//     marginVertical: 4
//   },
//   userBubble: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#8b5cf6' // Aapka theme color
//   },
//   botBubble: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#151517', // Aapka dark UI color
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)'
//   },
//   errorBubble: {
//     backgroundColor: '#f87171', // Subtle red
//     borderColor: '#ef4444'
//   },
//   messageText: {
//     fontSize: 15,
//     lineHeight: 22
//   },
//   userText: {
//     color: 'white'
//   },
//   botText: {
//     color: '#E5E7EB'
//   },
//   aiLoadingContainer: { // "Thinking..." indicator
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//     backgroundColor: '#050505',
//   },
//   aiLoadingText: {
//     marginLeft: 10,
//     color: '#6B7280',
//     fontSize: 14,
//     fontStyle: 'italic',
//   },
// });









// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//     SafeAreaView,
//     ScrollView,
//     View,
//     Text,
//     StyleSheet,
//     Pressable,
//     TextInput,
//     Modal,
//     StatusBar,
//     FlatList,
//     ActivityIndicator,
//     Alert,
//     KeyboardAvoidingView,
//     Platform,
//     Image,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { useFocusEffect } from "@react-navigation/native";

// // --- IMPORT YOUR MOOD ICON ---
// // import happyIcon from '../../assets/image/happy.png'; // Assuming this path is correct

// // --- EXTERNAL SERVICE IMPORTS ---
// import { getAllTasks } from '../services/studyTaskApi';
// import { chatService, getCurrentUser } from '../services/supabaseServices'; // Import getCurrentUser

// // --- GROQ & CHAT CONSTANTS ---
// const GROQ_MODEL = "openai/gpt-oss-20b";
// // WARNING: Hide this key in a secure backend proxy in production.
// const GROQ_API_KEY = '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';
// const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// // MOCK_USER_ID has been REMOVED. Only the authenticated user ID will be used.

// const INITIAL_AI_MESSAGE = {
//     id: 'initial-ai',
//     content: "Hey there! 👋 I'm your StudyBuddy AI companion. I'm here to help you stay motivated, focused, and balanced in your learning journey. How can I assist you today? (I can see your tasks, mood, and focus sessions!)",
//     isUser: false,
//     timestamp: Date.now(),
// };

// // --- GLOBAL UTILITY FUNCTIONS ---
// const getTaskProgress = (task) => {
//     const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
//     if (subtasks.length === 0) return { completed: 0, total: 0, text: "Start" };
//     const completed = subtasks.filter(sub => sub.completed).length;
//     const total = subtasks.length;
//     return { completed, total, text: `${completed}/${total}` };
// };

// const getFocusAndMoodData = async (userId) => {
//     // This function can still run, but the data will be generic or null if userId is null
//     const recentFocusSessions = [
//         { duration: 1800, completed: true, date: '2025-11-08' },
//         { duration: 2700, completed: true, date: '2025-11-07' },
//         { duration: 1200, completed: false, date: '2025-11-06' },
//     ];

//     return {
//         recentFocusSessions: recentFocusSessions,
//         currentScreenTimeSummary: "You completed 2 focus sessions (30m, 45m) in the last 2 days, totaling 1 hour and 15 minutes of productive time. One 20-minute session failed.",
//     };
// };

// const sendMessageToGroq = async (history, context) => {
//     const messages = history.map(msg => ({
//         role: msg.isUser ? "user" : "assistant",
//         content: msg.content,
//     }));

//     const systemInstruction = {
//         role: "system",
//         content: `
//             You are a friendly and encouraging StudyBuddy AI designed to assist students with their study tasks, motivation, and mental well-being. Keep responses concise and supportive.

//             CURRENT USER CONTEXT:
//             - Latest Recorded Mood: ${context.currentMood || 'Not yet recorded today.'}
//             - Top 3 Active Tasks: ${context.tasks.length > 0 ? context.tasks.map(t => `${t.title} (${t.priority}) - Subtasks: ${t.progress.text}`).join('; ') : 'No active tasks found.'}
//             - Screen Time/Focus Summary (Last 7 days): ${context.screenTimeSummary}
//             - Previous Chat Context/Memory: ${context.chatContext ? JSON.stringify(context.chatContext).substring(0, 500) + '...' : 'No long-term memory stored yet.'}

//             Use this context to give personalized advice and motivation. Do NOT mention the full data in your response, but use it to inform your answer.
//         `
//     };

//     const payload = {
//         model: GROQ_MODEL,
//         messages: [systemInstruction, ...messages],
//         temperature: 0.7,
//         max_tokens: 1024,
//     };

//     try {
//         const response = await fetch(GROQ_API_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${GROQ_API_KEY}`,
//             },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//             const status = response.status;
//             const errorBody = await response.text();
//             console.error("Groq API FAILED:", status, errorBody);

//             let errorMessage = "An unknown API error occurred.";
//             if (status === 401) {
//                 errorMessage = "Authentication Failed: Check your GROQ_API_KEY.";
//             } else if (status === 429) {
//                 errorMessage = "Rate Limit Exceeded: Too many requests.";
//             }

//             throw new Error(`Groq API returned status ${status}. Details: ${errorMessage}`);
//         }

//         const data = await response.json();
//         const aiResponse = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
//         return aiResponse;

//     } catch (error) {
//         console.error("Fetch/Network/Processing error to Groq:", error.message);
//         return `I apologize, I'm having trouble connecting to my brain right now. (Error: ${error.message})`;
//     }
// };

// // --- CHAT MODAL COMPONENT ---
// function StudyBuddyChatModal({ isVisible, onClose, todayTasks, selectedMood, currentUserId }) {
//     const [inputMessage, setInputMessage] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [isSending, setIsSending] = useState(false);
//     const flatListRef = useRef(null);

//     useEffect(() => {
//         async function loadChatData() {
//             // FIX: Use ONLY the actual user ID. If null, history is skipped.
//             const idToUse = currentUserId; 

//             if (!idToUse) {
//                 // If not logged in, just show the initial AI message and skip history load.
//                 setMessages([INITIAL_AI_MESSAGE]);
//                 return;
//             }

//             try {
//                 const historyData = await chatService.getChatHistory(idToUse);
//                 const historyMessages = historyData.map(msg => ({
//                     id: msg.id,
//                     content: msg.message,
//                     isUser: msg.is_user,
//                     timestamp: new Date(msg.created_at).getTime(),
//                 }));

//                 if (historyMessages.length > 0) {
//                     setMessages(historyMessages);
//                 } else {
//                     setMessages([INITIAL_AI_MESSAGE]);
//                 }
//             } catch (e) {
//                 console.error("Failed to load chat history:", e);
//                 setMessages([INITIAL_AI_MESSAGE]);
//             }
//         }

//         if (isVisible) {
//             loadChatData();
//         } else if (!isVisible) {
//             setMessages([]);
//             setInputMessage("");
//         }
//     }, [isVisible, currentUserId]);

//     useEffect(() => {
//         if (flatListRef.current) {
//             flatListRef.current.scrollToEnd({ animated: true });
//         }
//     }, [messages]);

//     const handleClearHistory = async () => {
//         Alert.alert(
//             "Clear Chat History",
//             "Are you sure you want to delete all messages? This is permanent.",
//             [
//                 { text: "Cancel", style: "cancel" },
//                 {
//                     text: "Clear", onPress: async () => {
//                         const idToUse = currentUserId; // Use only the actual user ID
                        
//                         if (!idToUse) {
//                             Alert.alert("Action Blocked", "Please log in to clear your persistent chat history.");
//                             return;
//                         }
                        
//                         try {
//                             await chatService.clearChatHistory(idToUse);
//                             setMessages([INITIAL_AI_MESSAGE]);
//                             Alert.alert("Success", "Chat history cleared.");
//                         } catch (error) {
//                             console.error("Failed to clear history:", error);
//                             Alert.alert("Error", "Failed to clear history. Check console for details.");
//                         }
//                     }, style: "destructive"
//                 },
//             ]
//         );
//     };

//     const MessageBubble = useCallback(({ message }) => (
//         <View style={[
//             styles.messageBubble,
//             message.isUser ? styles.userBubble : styles.botBubble,
//         ]}>
//             <Text style={styles.messageText}>
//                 {message.content}
//             </Text>
//         </View>
//     ), []);

//     const handleSendMessage = async () => {
//         if (!inputMessage.trim() || isSending) {
//             return;
//         }

//         const idToUse = currentUserId; // Use only the actual user ID
//         const isUserAuthenticated = !!idToUse; // Flag to check if we can save/fetch context

//         const userMessage = {
//             id: Date.now() + '-user',
//             content: inputMessage.trim(),
//             isUser: true,
//             timestamp: Date.now()
//         };

//         setMessages(prev => [...prev, userMessage]);
//         setInputMessage("");
//         setIsSending(true);

//         // Conditional save: Only attempt to save the user message if the user is authenticated
//         if (isUserAuthenticated) {
//             try {
//                 await chatService.saveMessage(idToUse, userMessage.content, true);
//             } catch (e) {
//                 // If save fails, we log it but continue with the Groq call
//                 console.warn("Failed to save user message to history:", e);
//             }
//         } else {
//              console.log("Chat history save skipped: User not logged in.");
//         }

//         try {
//             // If not authenticated, we pass null to getFocusAndMoodData, which defaults to generic data.
//             const { currentScreenTimeSummary } = await getFocusAndMoodData(idToUse); 
            
//             // Only fetch long-term context if authenticated
//             const longTermContext = isUserAuthenticated ? await chatService.getContext(idToUse) : null;

//             const taskProgressContext = todayTasks.map(task => ({
//                 title: task.title,
//                 priority: task.priority,
//                 progress: getTaskProgress(task),
//             }));

//             const aiContext = {
//                 userId: idToUse,
//                 currentMood: selectedMood,
//                 tasks: taskProgressContext,
//                 screenTimeSummary: currentScreenTimeSummary,
//                 chatContext: longTermContext,
//             };

//             const conversationHistory = messages.slice(-10).map(msg => ({
//                 role: msg.isUser ? "user" : "assistant",
//                 content: msg.content,
//             }));

//             const responseText = await sendMessageToGroq(
//                 [...conversationHistory, { role: "user", content: userMessage.content }],
//                 aiContext
//             );

//             const aiResponse = {
//                 id: Date.now() + '-bot',
//                 content: responseText,
//                 isUser: false,
//                 timestamp: Date.now()
//             };

//             setMessages(prev => [...prev, aiResponse]);

//             // Conditional save: Only save the AI response if the user is authenticated
//             if (!responseText.startsWith("I apologize, I'm having trouble") && isUserAuthenticated) {
//                 await chatService.saveMessage(idToUse, aiResponse.content, false);
//             }

//         } catch (error) {
//             console.error("Chat error:", error);
//             const errorMessage = {
//                 id: Date.now() + '-error',
//                 content: `I'm sorry, an unexpected error occurred during our conversation. (Detail: ${error.message || 'Unknown'})`,
//                 isUser: false,
//                 timestamp: Date.now(),
//             };
//             setMessages(prev => [...prev, errorMessage]);
//         } finally {
//             setIsSending(false);
//         }
//     };

//     return (
//         <Modal
//             visible={isVisible}
//             animationType="slide"
//             onRequestClose={onClose}
//         >
//             <SafeAreaView style={styles.chatModalContainer}>
//                 <View style={styles.chatHeader}>
//                     <Pressable onPress={onClose} style={styles.chatHeaderButton}>
//                         <Icon name="chevron-down" size={28} color="#fff" />
//                     </Pressable>
//                     <Text style={styles.chatHeaderTitle}>StudyBuddy AI</Text>
//                     <Pressable onPress={handleClearHistory} style={styles.chatHeaderButton}>
//                         <Icon name="delete-empty-outline" size={24} color="#9CA3AF" />
//                     </Pressable>
//                 </View>

//                 <KeyboardAvoidingView
//                     style={styles.chatBody}
//                     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                     keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
//                 >
//                     <FlatList
//                         ref={flatListRef}
//                         data={messages}
//                         keyExtractor={(item) => item.id.toString()}
//                         renderItem={({ item }) => <MessageBubble message={item} />}
//                         contentContainerStyle={styles.chatMessageList}
//                     />

//                     {isSending && (
//                         <View style={styles.typingIndicatorContainer}>
//                             <ActivityIndicator size="small" color="#8b5cf6" />
//                             <Text style={styles.typingIndicatorText}>StudyBuddy is thinking...</Text>
//                         </View>
//                     )}

//                     <View style={styles.chatInputContainer}>
//                         <TextInput
//                             placeholder="Ask StudyBuddy anything..."
//                             placeholderTextColor="#6C6C72"
//                             style={styles.chatTextInput}
//                             value={inputMessage}
//                             onChangeText={setInputMessage}
//                             editable={!isSending}
//                             onSubmitEditing={handleSendMessage}
//                         />
//                         <Pressable
//                             style={({ pressed }) => [
//                                 styles.chatSendButton,
//                                 (isSending || !inputMessage.trim()) && styles.chatSendButtonDisabled,
//                                 pressed && { opacity: 0.8 }
//                             ]}
//                             onPress={handleSendMessage}
//                             disabled={isSending || !inputMessage.trim()}
//                         >
//                             <Icon name="send" size={22} color="#fff" />
//                         </Pressable>
//                     </View>
//                 </KeyboardAvoidingView>
//             </SafeAreaView>
//         </Modal>
//     );
// }

// // --- HOME SCREEN COMPONENT ---
// export default function Home({ navigation }) {
//     const [moodModalVisible, setMoodModalVisible] = useState(false);
//     const [chatModalVisible, setChatModalVisible] = useState(false);
//     const [selectedMood, setSelectedMood] = useState(null);
//     const [todayTasks, setTodayTasks] = useState([]);
//     const [isLoadingTasks, setIsLoadingTasks] = useState(true);
//     const [currentUserId, setCurrentUserId] = useState(null); // State to hold the user ID

//     // Fetch the actual user ID when the component loads
//     useEffect(() => {
//         async function fetchUserId() {
//             const user = await getCurrentUser();
//             setCurrentUserId(user ? user.id : null);
//         }
//         fetchUserId();
//     }, []);

//     const moodOptions = [
//         { id: "happy", label: "Happy", icon: "emoticon-cool-outline", bg: "#FFB347", isImage: true },
//         { id: "calm", label: "Calm", icon: "emoticon-cool-outline", bg: "#4FC3F7", isImage: false },
//         { id: "thoughtful", label: "Thoughtful", icon: "emoticon-thinking-outline", bg: "#D68BFF", isImage: false },
//         { id: "down", label: "Down", icon: "emoticon-sad-outline", bg: "#9CA3AF", isImage: false },
//         { id: "stressed", label: "Stressed", icon: "emoticon-dead-outline", bg: "#FF6B6B", isImage: false },
//         { id: "tired", label: "Tired", icon: "emoticon-sleep-outline", bg: "#B66CFF", isImage: false },
//         { id: "motivated", label: "Motivated", icon: "fire", bg: "#2DD36F", isImage: false },
//         { id: "neutral", label: "Neutral", icon: "emoticon-neutral-outline", bg: "#9CA3AF", isImage: false },
//     ];

//     const getTopPriorityTasks = (tasks) => {
//         const activeTasks = tasks.filter(task => task.status === 'Active');
//         if (activeTasks.length === 0) return [];

//         const priorityOrder = { High: 1, Medium: 2, Low: 3 };
//         const sortedTasks = [...activeTasks].sort((a, b) => {
//             const priorityA = priorityOrder[a.priority] || 999;
//             const priorityB = priorityOrder[b.priority] || 999;
//             return priorityA - priorityB;
//         });

//         return sortedTasks.slice(0, 3);
//     };

//     const fetchTodayTasks = async () => {
//         setIsLoadingTasks(true);

//         try {
//             // NOTE: getAllTasks implementation is in ../services/studyTaskApi and not provided here.
//             const response = await getAllTasks();

//             if (response.success && response.data) {
//                 const topTasks = getTopPriorityTasks(response.data);
//                 const tasksWithProgress = topTasks.map(task => ({
//                     ...task,
//                     progress: getTaskProgress(task)
//                 }));
//                 setTodayTasks(tasksWithProgress);
//             } else {
//                 console.warn("Home.js: Failed to fetch tasks:", response.error);
//             }
//         } catch (error) {
//             console.error("Home.js: Error fetching tasks:", error);
//         } finally {
//             setIsLoadingTasks(false);
//         }
//     };

//     useFocusEffect(
//         React.useCallback(() => {
//             fetchTodayTasks();
//         }, [])
//     );

//     function onSelectMood(mood) {
//         setSelectedMood(mood.id);
//         setMoodModalVisible(false);
//     }

//     const openChat = () => {
//         setChatModalVisible(true);
//     };

//     const getPriorityIcon = (priority) => {
//         // Placeholder implementation based on common practice
//         switch (priority) {
//             case 'High':
//                 return { name: 'alert-circle', color: '#FF6B6B' };
//             case 'Medium':
//                 return { name: 'minus-circle', color: '#FFB347' };
//             case 'Low':
//                 return { name: 'check-circle', color: '#2DD36F' };
//             default:
//                 return { name: 'circle-outline', color: '#9CA3AF' };
//         }
//     };


//     // --- RENDERING ---
//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" backgroundColor="#0E0E10" />
//             <ScrollView style={styles.scrollView}>
//                 {/* Header Section */}
//                 <View style={styles.header}>
//                     <Text style={styles.greetingText}>Hello, Scholar!</Text>
//                     <Pressable style={styles.profileButton} onPress={() => navigation.navigate('Settings')}>
//                         <Icon name="account-circle" size={30} color="#fff" />
//                     </Pressable>
//                 </View>

//                 {/* AI Chat Button */}
//                 <Pressable style={styles.aiChatCard} onPress={openChat}>
//                     <Icon name="robot-outline" size={30} color="#8b5cf6" />
//                     <View style={{ flex: 1, marginLeft: 15 }}>
//                         <Text style={styles.aiChatTitle}>Talk to StudyBuddy AI</Text>
//                         <Text style={styles.aiChatSubtitle}>Get personalized motivation and task help.</Text>
//                     </View>
//                     <Icon name="chevron-right" size={24} color="#8b5cf6" />
//                 </Pressable>

//                 {/* Mood Tracker Card */}
//                 <View style={styles.card}>
//                     <Text style={styles.cardTitle}>How are you feeling?</Text>
//                     <Pressable 
//                         style={[styles.moodButton, { backgroundColor: selectedMood ? moodOptions.find(m => m.id === selectedMood)?.bg : '#3A3A3C' }]} 
//                         onPress={() => setMoodModalVisible(true)}
//                     >
//                         {selectedMood ? (
//                             <>
//                                 {/* Assuming happyIcon is imported and available */}
//                                 {/* {moodOptions.find(m => m.id === selectedMood)?.isImage ? (
//                                     <Image source={happyIcon} style={styles.moodIconImage} />
//                                 ) : ( */}
//                                     <Icon 
//                                         name={moodOptions.find(m => m.id === selectedMood)?.icon || 'emoticon-happy-outline'} 
//                                         size={24} 
//                                         color="#fff" 
//                                     />
//                                 {/* )} */}
//                                 <Text style={styles.moodText}>{moodOptions.find(m => m.id === selectedMood)?.label}</Text>
//                             </>
//                         ) : (
//                             <Text style={styles.moodText}>Tap to log your mood</Text>
//                         )}
//                     </Pressable>
//                 </View>

//                 {/* Today's Focus Tasks Card */}
//                 <View style={styles.card}>
//                     <Text style={styles.cardTitle}>Top Priority Tasks</Text>
//                     {isLoadingTasks ? (
//                         <ActivityIndicator size="small" color="#8b5cf6" style={{ marginTop: 10 }} />
//                     ) : (
//                         todayTasks.length > 0 ? (
//                             todayTasks.map((task) => (
//                                 <View key={task.id} style={styles.taskItem}>
//                                     <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
//                                         <Icon 
//                                             name={getPriorityIcon(task.priority).name} 
//                                             size={18} 
//                                             color={getPriorityIcon(task.priority).color} 
//                                             style={{ marginRight: 10 }}
//                                         />
//                                         <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
//                                     </View>
//                                     <View style={styles.taskProgressBox}>
//                                         <Text style={styles.taskProgressText}>{task.progress.text}</Text>
//                                     </View>
//                                 </View>
//                             ))
//                         ) : (
//                             <Text style={styles.noDataText}>No high-priority tasks for today! Go set some!</Text>
//                         )
//                     )}
//                     <Pressable style={styles.viewTasksButton} onPress={() => navigation.navigate('Tasks')}>
//                         <Text style={styles.viewTasksText}>View All Tasks</Text>
//                     </Pressable>
//                 </View>
//             </ScrollView>

//             {/* Mood Selection Modal */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={moodModalVisible}
//                 onRequestClose={() => setMoodModalVisible(false)}
//             >
//                 <View style={styles.centeredView}>
//                     <View style={styles.modalView}>
//                         <Text style={styles.modalTitle}>Select Your Current Mood</Text>
//                         <View style={styles.moodGrid}>
//                             {moodOptions.map((mood) => (
//                                 <Pressable
//                                     key={mood.id}
//                                     style={({ pressed }) => [
//                                         styles.moodGridItem,
//                                         { backgroundColor: mood.bg },
//                                         selectedMood === mood.id && styles.selectedMoodItem,
//                                         pressed && { opacity: 0.8 }
//                                     ]}
//                                     onPress={() => onSelectMood(mood)}
//                                 >
//                                     {/* {mood.isImage ? (
//                                         <Image source={happyIcon} style={styles.moodGridIconImage} />
//                                     ) : ( */}
//                                         <Icon name={mood.icon} size={30} color="#fff" />
//                                     {/* )} */}
//                                     <Text style={styles.moodGridText}>{mood.label}</Text>
//                                 </Pressable>
//                             ))}
//                         </View>
//                         <Pressable style={styles.closeButton} onPress={() => setMoodModalVisible(false)}>
//                             <Text style={styles.closeButtonText}>Close</Text>
//                         </Pressable>
//                     </View>
//                 </View>
//             </Modal>

//             {/* StudyBuddy Chat Modal */}
//             <StudyBuddyChatModal
//                 isVisible={chatModalVisible}
//                 onClose={() => setChatModalVisible(false)}
//                 todayTasks={todayTasks}
//                 selectedMood={selectedMood}
//                 currentUserId={currentUserId} // Pass the fetched user ID
//             />
//         </SafeAreaView>
//     );
// }

// // --- STYLES ---
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#0E0E10',
//     },
//     scrollView: {
//         paddingHorizontal: 15,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 15,
//         paddingHorizontal: 5,
//     },
//     greetingText: {
//         fontSize: 26,
//         fontWeight: '700',
//         color: '#fff',
//     },
//     profileButton: {
//         padding: 5,
//     },
//     // AI Chat Card Styles
//     aiChatCard: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#1E1E20',
//         padding: 20,
//         borderRadius: 15,
//         marginVertical: 10,
//         borderLeftWidth: 5,
//         borderLeftColor: '#8b5cf6',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         elevation: 6,
//     },
//     aiChatTitle: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#fff',
//     },
//     aiChatSubtitle: {
//         fontSize: 13,
//         color: '#9CA3AF',
//         marginTop: 3,
//     },
//     // General Card Styles
//     card: {
//         backgroundColor: '#1E1E20',
//         padding: 20,
//         borderRadius: 15,
//         marginVertical: 10,
//     },
//     cardTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#fff',
//         marginBottom: 10,
//     },
//     noDataText: {
//         color: '#9CA3AF',
//         fontSize: 16,
//         textAlign: 'center',
//         paddingVertical: 15,
//     },
//     // Mood Tracker Styles
//     moodButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 15,
//         borderRadius: 10,
//         minHeight: 60,
//         marginTop: 5,
//     },
//     moodText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//         marginLeft: 10,
//     },
//     // Task Item Styles
//     taskItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: 'rgba(255, 255, 255, 0.1)',
//     },
//     taskTitle: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '500',
//         flex: 1,
//     },
//     taskProgressBox: {
//         backgroundColor: '#374151',
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         marginLeft: 15,
//     },
//     taskProgressText: {
//         color: '#fff',
//         fontSize: 14,
//         fontWeight: 'bold',
//     },
//     viewTasksButton: {
//         padding: 10,
//         marginTop: 10,
//         borderRadius: 8,
//         alignItems: 'center',
//         backgroundColor: '#2D3748',
//     },
//     viewTasksText: {
//         color: '#8b5cf6',
//         fontWeight: '600',
//         fontSize: 15,
//     },
//     // Mood Modal Styles
//     centeredView: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     },
//     modalView: {
//         width: '100%',
//         backgroundColor: '#1E1E20',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         padding: 30,
//         alignItems: 'center',
//     },
//     modalTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: '#fff',
//         marginBottom: 20,
//     },
//     moodGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//         width: '100%',
//     },
//     moodGridItem: {
//         width: '30%',
//         aspectRatio: 1,
//         borderRadius: 15,
//         margin: '1.5%',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 10,
//         opacity: 0.8,
//     },
//     selectedMoodItem: {
//         borderWidth: 3,
//         borderColor: '#fff',
//         opacity: 1,
//     },
//     moodGridText: {
//         color: '#fff',
//         fontSize: 14,
//         fontWeight: '600',
//         marginTop: 5,
//     },
//     closeButton: {
//         backgroundColor: '#8b5cf6',
//         borderRadius: 10,
//         padding: 15,
//         elevation: 2,
//         width: '100%',
//         marginTop: 10,
//     },
//     closeButtonText: {
//         color: 'white',
//         fontWeight: 'bold',
//         textAlign: 'center',
//         fontSize: 16,
//     },
//     // Chat Modal Styles
//     chatModalContainer: {
//         flex: 1,
//         backgroundColor: '#0E0E10',
//     },
//     chatHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 10,
//         paddingVertical: 15,
//         backgroundColor: '#1E1E20',
//         borderBottomWidth: 1,
//         borderBottomColor: 'rgba(255, 255, 255, 0.1)',
//     },
//     chatHeaderTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: '#fff',
//     },
//     chatHeaderButton: {
//         padding: 5,
//     },
//     chatBody: {
//         flex: 1,
//     },
//     chatMessageList: {
//         paddingHorizontal: 10,
//         paddingTop: 10,
//     },
//     messageBubble: {
//         maxWidth: '80%',
//         padding: 12,
//         borderRadius: 15,
//         marginVertical: 4,
//     },
//     userBubble: {
//         alignSelf: 'flex-end',
//         backgroundColor: '#8b5cf6',
//         borderBottomRightRadius: 4,
//     },
//     botBubble: {
//         alignSelf: 'flex-start',
//         backgroundColor: '#1E1E20',
//         borderWidth: 1,
//         borderColor: 'rgba(255, 255, 255, 0.1)',
//         borderTopLeftRadius: 4,
//     },
//     messageText: {
//         color: "#fff",
//         fontSize: 15,
//         lineHeight: 22,
//     },
//     typingIndicatorContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         alignSelf: 'flex-start',
//         padding: 10,
//         marginHorizontal: 10,
//         backgroundColor: '#1E1E20',
//         borderRadius: 15,
//         marginBottom: 5,
//         borderTopLeftRadius: 4,
//     },
//     typingIndicatorText: {
//         color: '#9CA3AF',
//         marginLeft: 10,
//         fontSize: 14,
//     },
//     chatInputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         backgroundColor: '#151517',
//         borderTopWidth: 1,
//         borderTopColor: 'rgba(255, 255, 255, 0.1)',
//     },
//     chatTextInput: {
//         flex: 1,
//         backgroundColor: '#0E0E10',
//         borderRadius: 25,
//         paddingHorizontal: 18,
//         paddingVertical: 12,
//         color: '#fff',
//         fontSize: 16,
//         marginRight: 10,
//         borderWidth: 1,
//         borderColor: 'rgba(255, 255, 255, 0.05)',
//         maxHeight: 120,
//     },
//     chatSendButton: {
//         width: 44,
//         height: 44,
//         borderRadius: 22,
//         backgroundColor: '#8b5cf6',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     chatSendButtonDisabled: {
//         backgroundColor: '#374151',
//         opacity: 0.7,
//     },
// });




import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    Modal,
    StatusBar,
    FlatList,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";

// --- IMPORT YOUR MOOD ICON ---
// Make sure this path is correct relative to home.jsx
// import happyIcon from '../../assets/image/happy.png'; 
// Using an icon for now as the asset path might be wrong
const happyIcon = "emoticon-happy-outline";

// --- EXTERNAL SERVICE IMPORTS ---
import { getAllTasks } from '../services/studyTaskApi';
// FIX 1: Import path 'supabaseServices' se 'chatService' kiya gaya
import { chatService, getCurrentUser } from '../services/chatService'; 
import axios from 'axios'; // axios ko import karein

// --- GROQ & CHAT CONSTANTS ---
const GROQ_MODEL = "openai/gpt-oss-20b";
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ‼️ IMPORTANT: YEH AAPKE OLLAMA BACKEND KA URL HAI
// Yeh aapka local IP + port 3000 hai (jaisa aapki friend ke setup mein tha)
// Agar aapka IP badalta hai, toh ise change karein
const OLLAMA_BACKEND_URL = 'http://10.193.206.36:3000';

const INITIAL_AI_MESSAGE = {
    id: 'initial-ai',
    content: "Hey there! 👋 I'm your StudyBuddy AI companion. I'm here to help... How can I assist you today? (I can see your tasks, mood, and focus sessions!)",
    isUser: false,
    timestamp: Date.now(),
};

// --- GLOBAL UTILITY FUNCTIONS ---
const getTaskProgress = (task) => {
    // FIX: Crash fix (Array.isArray)
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    if (subtasks.length === 0) return { completed: 0, total: 0, text: "Start" };
    const completed = subtasks.filter(sub => sub.completed).length;
    const total = subtasks.length;
    return { completed, total, text: `${completed}/${total}` };
};

const getFocusAndMoodData = async (userId) => {
    // TODO: Is function ko Supabase se connect karein
    const recentFocusSessions = [
        { duration: 1800, completed: true, date: '2025-11-08' },
        { duration: 2700, completed: true, date: '2025-11-07' },
        { duration: 1200, completed: false, date: '2025-11-06' },
    ];

    return {
        recentFocusSessions: recentFocusSessions,
        currentScreenTimeSummary: "You completed 2 focus sessions (30m, 45m) in the last 2 days, totaling 1 hour and 15 minutes of productive time. One 20-minute session failed.",
    };
};

// Groq API call function (Aapki friend ka code)
const sendMessageToGroq = async (history, context) => {
    const messages = history.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content,
    }));

    const systemInstruction = {
        role: "system",
        content: `
            You are a friendly and encouraging StudyBuddy AI designed to assist students with their study tasks, motivation, and mental well-being. Keep responses concise and supportive.

            CURRENT USER CONTEXT:
            - Latest Recorded Mood: ${context.currentMood || 'Not yet recorded today.'}
            - Top 3 Active Tasks: ${context.tasks.length > 0 ? context.tasks.map(t => `${t.title} (${t.priority}) - Subtasks: ${t.progress.text}`).join('; ') : 'No active tasks found.'}
            - Screen Time/Focus Summary (Last 7 days): ${context.screenTimeSummary}
            - Previous Chat Context/Memory: ${context.chatContext ? JSON.stringify(context.chatContext).substring(0, 500) + '...' : 'No long-term memory stored yet.'}

            Use this context to give personalized advice and motivation. Do NOT mention the full data in your response, but use it to inform your answer.
        `
    };

    const payload = {
        model: GROQ_MODEL,
        messages: [systemInstruction, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
    };

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const status = response.status;
            const errorBody = await response.text();
            console.error("Groq API FAILED:", status, errorBody);

            let errorMessage = "An unknown API error occurred.";
            if (status === 401) {
                errorMessage = "Authentication Failed: Check your GROQ_API_KEY.";
            } else if (status === 429) {
                errorMessage = "Rate Limit Exceeded: Too many requests.";
            }

            throw new Error(`Groq API returned status ${status}. Details: ${errorMessage}`);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
        return aiResponse;

    } catch (error) {
        console.error("Fetch/Network/Processing error to Groq:", error.message);
        // FIX: Error message ko user-friendly banaya
        return `I apologize, I'm having trouble connecting to my brain right now. (Error: ${error.message})`;
    }
};

// --- CHAT MODAL COMPONENT ---
function StudyBuddyChatModal({ isVisible, onClose, todayTasks, selectedMood, userId }) {
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const flatListRef = useRef(null);

    // Load history jab modal khule
    useEffect(() => {
        async function loadChatData() {
            if (!userId) {
                setMessages([INITIAL_AI_MESSAGE]);
                return;
            }

            try {
                const historyData = await chatService.getChatHistory(userId);
                const historyMessages = historyData.map(msg => ({
                    id: msg.id,
                    content: msg.message,
                    isUser: msg.is_user,
                    timestamp: new Date(msg.created_at).getTime(),
                }));

                if (historyMessages.length > 0) {
                    setMessages(historyMessages);
                } else {
                    setMessages([INITIAL_AI_MESSAGE]);
                }
            } catch (e) {
                console.error("Failed to load chat history:", e);
                setMessages([INITIAL_AI_MESSAGE]);
            }
        }

        if (isVisible) {
            loadChatData();
        } else if (!isVisible) {
            setMessages([]);
            setInputMessage("");
        }
    }, [isVisible, userId]);

    // Auto-scroll logic
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    // Clear history logic
    const handleClearHistory = async () => {
        Alert.alert(
            "Clear Chat History",
            "Are you sure you want to delete all messages? This is permanent.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear", onPress: async () => {
                        if (!userId) {
                            Alert.alert("Action Blocked", "Please log in to clear your persistent chat history.");
                            return;
                        }
                        try {
                            // TODO: `clearChatHistory` ko `chatService.js` mein define karna hoga
                            // await chatService.clearChatHistory(userId); 
                            setMessages([INITIAL_AI_MESSAGE]);
                            Alert.alert("Success", "Chat history cleared.");
                        } catch (error) {
                            console.error("Failed to clear history:", error);
                            Alert.alert("Error", "Failed to clear history. Check console for details.");
                        }
                    }, style: "destructive"
                },
            ]
        );
    };

    // Message bubble component
    const MessageBubble = useCallback(({ message }) => (
        <View style={[
            styles.messageBubble,
            message.isUser ? styles.userBubble : styles.botBubble,
        ]}>
            <Text style={styles.messageText}>
                {message.content}
            </Text>
        </View>
    ), []);

    // Send message logic
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isSending) {
            return;
        }

        const userMessage = {
            id: Date.now() + '-user',
            content: inputMessage.trim(),
            isUser: true,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setIsSending(true);

        if (userId) {
            try {
                await chatService.saveMessage(userId, userMessage.content, true);
            } catch (e) {
                console.warn("Failed to save user message to history:", e);
            }
        }

        try {
            // Context functions ko call karein
            const { currentScreenTimeSummary } = await getFocusAndMoodData(userId);
            const longTermContext = null; // TODO: `chatService.getContext(userId)` implement karein

            const taskProgressContext = todayTasks.map(task => ({
                title: task.title,
                priority: task.priority,
                progress: task.progress // `getTaskProgress` pehle hi Home mein call ho chuka hai
            }));

            const aiContext = {
                userId: userId,
                currentMood: selectedMood,
                tasks: taskProgressContext,
                screenTimeSummary: currentScreenTimeSummary,
                chatContext: longTermContext,
            };

            // Conversation history (sirf aakhiri 10 messages)
            const conversationHistory = messages.slice(-10).map(msg => ({
                role: msg.isUser ? "user" : "assistant",
                content: msg.content,
            }));

            const responseText = await sendMessageToGroq(
                [...conversationHistory, { role: "user", content: userMessage.content }],
                aiContext
            );

            const aiResponse = {
                id: Date.now() + '-bot',
                content: responseText,
                isUser: false,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, aiResponse]);

            // Response ko Supabase mein save karein
            if (!responseText.startsWith("I apologize, I'm having trouble") && userId) {
                await chatService.saveMessage(userId, aiResponse.content, false);
            }

        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage = {
                id: Date.now() + '-error',
                content: `I'm sorry, an unexpected error occurred. (Detail: ${error.message || 'Unknown'})`,
                isUser: false,
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.chatModalContainer}>
                <View style={styles.chatHeader}>
                    <Pressable onPress={onClose} style={styles.chatHeaderButton}>
                        <Icon name="chevron-down" size={28} color="#fff" />
                    </Pressable>
                    <Text style={styles.chatHeaderTitle}>StudyBuddy AI</Text>
                    <Pressable onPress={handleClearHistory} style={styles.chatHeaderButton}>
                        <Icon name="delete-empty-outline" size={24} color="#9CA3AF" />
                    </Pressable>
                </View>

                <KeyboardAvoidingView
                    style={styles.chatBody}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <MessageBubble message={item} />}
                        contentContainerStyle={styles.chatMessageList}
                    />

                    {isSending && (
                        <View style={styles.typingIndicatorContainer}>
                            <ActivityIndicator size="small" color="#8b5cf6" />
                            <Text style={styles.typingIndicatorText}>StudyBuddy is thinking...</Text>
                        </View>
                    )}

                    <View style={styles.chatInputContainer}>
                        <TextInput
                            placeholder="Ask StudyBuddy anything..."
                            placeholderTextColor="#6C6C72"
                            style={styles.chatTextInput}
                            value={inputMessage}
                            onChangeText={setInputMessage}
                            editable={!isSending}
                            onSubmitEditing={handleSendMessage}
                        />
                        <Pressable
                            style={({ pressed }) => [
                                styles.chatSendButton,
                                (isSending || !inputMessage.trim()) && styles.chatSendButtonDisabled,
                                pressed && { opacity: 0.8 }
                            ]}
                            onPress={handleSendMessage}
                            disabled={isSending || !inputMessage.trim()}
                        >
                            <Icon name="send" size={22} color="#fff" />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

// --- HOME SCREEN COMPONENT ---
export default function Home({ navigation }) {
    const [moodModalVisible, setMoodModalVisible] = useState(false);
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [selectedMood, setSelectedMood] = useState(null);
    const [todayTasks, setTodayTasks] = useState([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    
    // FIX: Naya state current user ke liye
    const [currentUser, setCurrentUser] = useState(null); 

    const moodOptions = [
        { id: "happy", label: "Happy", icon: happyIcon, bg: "#FFB347", isImage: false }, // Using icon name
        { id: "calm", label: "Calm", icon: "emoticon-cool-outline", bg: "#4FC3F7", isImage: false },
        { id: "thoughtful", label: "Thoughtful", icon: "emoticon-thinking-outline", bg: "#D68BFF", isImage: false },
        { id: "down", label: "Down", icon: "emoticon-sad-outline", bg: "#9CA3AF", isImage: false },
        { id: "stressed", label: "Stressed", icon: "emoticon-dead-outline", bg: "#FF6B6B", isImage: false },
        { id: "tired", label: "Tired", icon: "emoticon-sleep-outline", bg: "#B66CFF", isImage: false },
        { id: "motivated", label: "Motivated", icon: "fire", bg: "#2DD36F", isImage: false },
        { id: "neutral", label: "Neutral", icon: "emoticon-neutral-outline", bg: "#9CA3AF", isImage: false },
    ];

    const getTopPriorityTasks = (tasks) => {
        const activeTasks = tasks.filter(task => task.status === 'Active');
        if (activeTasks.length === 0) return [];

        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        const sortedTasks = [...activeTasks].sort((a, b) => {
            const priorityA = priorityOrder[a.priority] || 999;
            const priorityB = priorityOrder[b.priority] || 999;
            return priorityA - priorityB;
        });

        return sortedTasks.slice(0, 3);
    };

    const fetchTodayTasks = async () => {
        setIsLoadingTasks(true);
        try {
            const response = await getAllTasks();
            if (response.success && response.data) {
                // Task data ke saath progress bhi calculate karein
                const tasksWithProgress = response.data.map(task => ({
                    ...task,
                    progress: getTaskProgress(task)
                }));
                const topTasks = getTopPriorityTasks(tasksWithProgress);
                setTodayTasks(topTasks);
            } else {
                console.warn("Home.js: Failed to fetch tasks:", response.error);
            }
        } catch (error) {
            console.error("Home.js: Error fetching tasks:", error);
        } finally {
            setIsLoadingTasks(false);
        }
    };

    // FIX: User ko fetch karne ke liye naya function
    const fetchUser = async () => {
        try {
            const user = await getCurrentUser();
            if (user) {
                setCurrentUser(user);
            }
        } catch (e) {
            console.error("Error fetching user on home:", e);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchTodayTasks();
            fetchUser(); // User ko bhi fetch karein
        }, [])
    );

    function onSelectMood(mood) {
        setSelectedMood(mood.id);
        setMoodModalVisible(false);
    }

    const openChat = () => {
        setChatModalVisible(true);
    };
    
    // (Helper functions `getPriorityIcon` aur `getPriorityColor` ko yahaan copy karein)
    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'High': return 'fire';
            case 'Medium': return 'star';
            case 'Low': return 'clock-outline';
            default: return 'checkbox-marked-circle-outline';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return { main: '#f87171', gradient: ['#ef4444', '#f87171'] };
            case 'Medium': return { main: '#a78bfa', gradient: ['#8b5cf6', '#a78bfa'] };
            case 'Low': return { main: '#6b7280', gradient: ['#4b5563', '#6b7280'] };
            default: return { main: '#666', gradient: ['#555', '#666'] };
        }
    };


    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#050405" />
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.headerWrap}>
                    <View style={styles.gradientOverlay}>
                        <Text style={styles.welcome}>Welcome Back! ✨</Text>
                        <Text style={styles.headerSub}>
                            Your AI companion for productivity and wellness
                        </Text>
                    </View>
                </View>

                {/* Today's Goals Card */}
                <Pressable
                    style={({ pressed }) => [
                        styles.modernCard,
                        styles.goalsCard,
                        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
                    ]}
                    onPress={() => navigation.navigate('StudyTasks')}
                >
                    <View style={styles.cardGradient} />
                    <View style={styles.modernCardHeader}>
                        <View style={styles.headerLeft}>
                            <View style={styles.modernIconWrap}>
                                <Icon name="target" size={22} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.modernCardTitle}>Today's Goals</Text>
                                <Text style={styles.cardSubtitle}>Tap to view all tasks →</Text>
                            </View>
                        </View>
                        <Pressable
                            onPress={(e) => {
                                e.stopPropagation();
                                fetchTodayTasks();
                            }}
                            style={styles.refreshBtn}
                        >
                            <Icon name="refresh" size={18} color="#fff" />
                        </Pressable>
                    </View>

                    {/* Today's Goals List */}
                    <View style={styles.modernGoalList}>
                        {isLoadingTasks ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#a78bfa" />
                                <Text style={styles.loadingText}>Loading your goals...</Text>
                            </View>
                        ) : todayTasks.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconWrap}>
                                    <Icon name="trophy-outline" size={40} color="#fbbf24" />
                                </View>
                                <Text style={styles.emptyTitle}>All Clear! 🎉</Text>
                                <Text style={styles.emptySubtitle}>
                                    No active tasks. Time to create some goals!
                                </Text>
                                <Pressable
                                    style={styles.modernAddBtn}
                                    onPress={() => navigation.navigate('StudyTasks')}
                                >
                                    <Icon name="plus-circle" size={18} color="#fff" />
                                    <Text style={styles.modernAddBtnText}>Add New Task</Text>
                                </Pressable>
                            </View>
                        ) : (
                            todayTasks.map((task, index) => {
                                // const progress = getTaskProgress(task); // Progress pehle hi fetchTodayTasks mein calculate ho gaya hai
                                const colors = getPriorityColor(task.priority);
                                return (
                                    <ModernTaskItem
                                        key={task.id}
                                        icon={getPriorityIcon(task.priority)}
                                        title={task.title}
                                        priority={task.priority}
                                        badgeText={task.progress.text} // Use pre-calculated progress
                                        color={colors.main}
                                        index={index}
                                    />
                                );
                            })
                        )}
                    </View>
                </Pressable>

                {/* Quick Check-in Card */}
                <View style={[styles.modernCard, styles.checkInCard]}>
                    <View style={styles.checkInGradient} />
                    <View style={styles.modernCardHeader}>
                        <View style={styles.headerLeft}>
                            <View style={[styles.modernIconWrap, { backgroundColor: 'rgba(255, 211, 107, 0.2)' }]}>
                                <Icon name="emoticon-happy-outline" size={22} color="#ffd36b" />
                            </View>
                            <View>
                                <Text style={styles.modernCardTitle}>Quick Check-in</Text>
                                <Text style={styles.cardSubtitle}>How are you feeling?</Text>
                            </View>
                        </View>
                    </View>

                    {selectedMood ? (
                        <View style={styles.selectedMoodContainer}>
                             {/* FIX: Mood icon logic ko update kiya */}
                            {moodOptions.find(m => m.id === selectedMood)?.isImage ? (
                                <Image 
                                    source={happyIcon} // Directly use the imported variable
                                    style={{ width: 32, height: 32 }}
                                />
                            ) : (
                                <Icon
                                    name={moodOptions.find(m => m.id === selectedMood)?.icon || 'help-circle'}
                                    size={32}
                                    color={moodOptions.find(m => m.id === selectedMood)?.bg || '#fff'}
                                />
                            )}
                            <Text style={styles.selectedMoodText}>
                                Feeling {moodOptions.find(m => m.id === selectedMood)?.label}
                            </Text>
                        </View>
                    ) : null}

                    <Pressable
                        style={({ pressed }) => [
                            styles.modernMoodBtn,
                            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
                        ]}
                        onPress={() => setMoodModalVisible(true)}
                    >
                        <Icon name="heart-pulse" size={18} color="#fff" />
                        <Text style={styles.modernMoodBtnText}>
                            {selectedMood ? 'Update Mood' : 'Share My Mood'}
                        </Text>
                    </Pressable>
                </View>

                {/* Chat Widget (Static, opens modal) */}
                <Pressable
                    onPress={openChat} // <-- YEH AB CHAT MODAL KHOLEGA
                    style={({ pressed }) => [
                        styles.modernCard,
                        styles.modernChatContainer,
                        pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] }
                    ]}
                >
                    <View style={styles.modernChatHeader}>
                        <View style={styles.chatHeaderLeft}>
                            <View style={styles.modernChatAvatar}>
                                <Icon name="robot-outline" size={24} color="#fff" />
                                <View style={styles.chatAvatarGlow} />
                            </View>
                            <View>
                                <Text style={styles.modernChatTitle}>StudyBuddy AI</Text>
                                <View style={styles.onlineIndicator}>
                                    <View style={styles.onlinePulse} />
                                    <Text style={styles.onlineText}>Online Now</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.modernMessages}>
                        <View style={styles.modernAiBubble}>
                            <Text style={styles.modernAiText}>
                                {INITIAL_AI_MESSAGE.content.split('\n')[0]}
                                {'\n\n'}
                                Tap here to open full chat and start talking!
                            </Text>
                            <Text style={styles.modernMsgTime}>Tap to chat</Text>
                        </View>
                    </View>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Mood Modal (No change) */}
            <Modal
                visible={moodModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setMoodModalVisible(false)}
            >
                <View style={styles.modernModalOverlay}>
                    <Pressable
                        style={styles.modernModalBackdrop}
                        onPress={() => setMoodModalVisible(false)}
                    />
                    <View style={styles.modernModalCard}>
                        <View style={styles.modernModalHandle} />
                        <View style={styles.modernModalHeader}>
                            <View>
                                <Text style={styles.modernModalTitle}>How are you feeling?</Text>
                                <Text style={styles.modernModalSubtitle}>Select your current mood</Text>
                            </View>
                            <Pressable
                                onPress={() => setMoodModalVisible(false)}
                                style={styles.modernModalClose}
                            >
                                <Icon name="close" size={22} color="#fff" />
                            </Pressable>
                        </View>

                        <FlatList
                            data={moodOptions}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            contentContainerStyle={styles.moodGrid}
                            columnWrapperStyle={styles.moodRow}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => onSelectMood(item)}
                                    style={({ pressed }) => [
                                        styles.modernMoodItem,
                                        { backgroundColor: item.bg },
                                        pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }
                                    ]}
                                >
                                     {/* FIX: Mood icon logic ko update kiya */}
                                    {item.isImage ? (
                                        <Image source={happyIcon} style={{ width: 36, height: 36 }} />
                                    ) : (
                                        <Icon name={item.icon} size={36} color="#fff" />
                                    )}
                                    <Text style={styles.modernMoodLabel}>{item.label}</Text>
                                </Pressable>
                            )}
                        />
                        <Text style={styles.modernModalHint}>
                            💡 Your mood helps me provide better support and suggestions
                        </Text>
                    </View>
                </View>
            </Modal>

            {/* Naya Chat Modal */}
            <StudyBuddyChatModal
                isVisible={chatModalVisible}
                onClose={() => setChatModalVisible(false)}
                todayTasks={todayTasks} // Current tasks pass karein
                selectedMood={moodOptions.find(m => m.id === selectedMood)?.label || 'Not Recorded'} // Current mood pass karein
                userId={currentUser?.id} // Current user ID pass karein
            />
        </SafeAreaView>
    );
}

// ===== FIX: MODERN TASK ITEM KO SAHI STYLES SE REPLACE KIYA =====
function ModernTaskItem({ icon, title, priority, badgeText, color, index }) {
    return (
        <View style={[styles.modernTaskRow, { animationDelay: `${index * 100}ms` }]}>
            <View style={styles.taskContent}>
                <View style={[styles.modernTaskIcon, { backgroundColor: color + '20' }]}>
                    <Icon name={icon} size={18} color={color} />
                </View>
                <View style={styles.taskInfo}>
                    <Text style={styles.modernTaskTitle} numberOfLines={1}>
                        {title}
                    </Text>
                    <View style={styles.taskMeta}>
                        <View style={[styles.priorityDot, { backgroundColor: color }]} />
                        <Text style={[styles.priorityLabel, { color: color }]}>
                            {priority} Priority
                        </Text>
                    </View>
                </View>
            </View>
            <View style={[styles.modernBadge, { backgroundColor: color }]}>
                <Text style={styles.modernBadgeText}>{badgeText}</Text>
            </View>
        </View>
    );
}

// ===== STYLES (Fixed) =====
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#050405" },
    container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36 },
    headerWrap: {
        marginBottom: 24,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    gradientOverlay: {
        padding: 16,
    },
    welcome: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "900",
        textAlign: "center",
        letterSpacing: -0.5,
    },
    headerSub: {
        color: "#9CA3AF",
        textAlign: "center",
        marginTop: 8,
        fontSize: 14,
        lineHeight: 20,
    },
    modernCard: {
        backgroundColor: "#0E0E10",
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    goalsCard: {
        backgroundColor: '#0a0a0b',
    },
    cardGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        opacity: 0.1,
    },
    modernCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    modernIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    modernCardTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: -0.3,
    },
    cardSubtitle: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 2,
    },
    refreshBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: "center",
        justifyContent: "center",
    },
    modernGoalList: {
        gap: 10,
    },

    // --- Modern Task Item Styles (FIXED) ---
    modernTaskRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#151517",
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.03)',
    },
    taskContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    modernTaskIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    taskInfo: {
        flex: 1,
    },
    modernTaskTitle: {
        color: "#E5E7EB",
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 4,
    },
    taskMeta: {
        flexDirection: "row",
        alignItems: "center",
    },
    priorityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    priorityLabel: {
        fontSize: 11,
        fontWeight: "600",
    },
    modernBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 50,
        alignItems: "center",
    },
    modernBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
    // --- End of Task Item Styles ---

    loadingContainer: {
        paddingVertical: 32,
        alignItems: "center",
    },
    loadingText: {
        color: "#6B7280",
        marginTop: 12,
        fontSize: 14,
    },
    emptyContainer: {
        paddingVertical: 24,
        alignItems: "center",
    },
    emptyIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    emptyTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
    },
    emptySubtitle: {
        color: "#6B7280",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 16,
    },
    modernAddBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#8b5cf6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 6,
    },
    modernAddBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    checkInCard: {
        backgroundColor: '#0a0a0b',
    },
    checkInGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        opacity: 0.08,
    },
    selectedMoodContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        gap: 10,
    },
    selectedMoodText: {
        color: "#E5E7EB",
        fontSize: 15,
        fontWeight: "600",
    },
    modernMoodBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f59e0b",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
    },
    modernMoodBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
    modernChatContainer: {
        padding: 0, // Reset padding
        backgroundColor: '#050505', // Darker background
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    modernChatHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1a1a2e",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    chatHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    modernChatAvatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#8b5cf6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        position: 'relative',
    },
    chatAvatarGlow: {
        position: 'absolute',
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#8b5cf6",
        opacity: 0.3,
    },
    modernChatTitle: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 16,
    },
    onlineIndicator: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    onlinePulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#10b981",
        marginRight: 6,
    },
    onlineText: {
        color: "#6ee7b7",
        fontSize: 12,
        fontWeight: "600",
    },
    modernMessages: {
        padding: 16,
        backgroundColor: "#050505",
    },
    modernAiBubble: {
        backgroundColor: "#151517",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    modernAiText: {
        color: "#E5E7EB",
        lineHeight: 22,
        fontSize: 14,
    },
    modernMsgTime: {
        color: "#6B7280",
        fontSize: 11,
        marginTop: 10,
        textAlign: 'right',
    },
    modernModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modernModalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modernModalCard: {
        backgroundColor: '#0E0E10',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    },
    modernModalHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#374151',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    modernModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    modernModalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
    },
    modernModalSubtitle: {
        color: '#6B7280',
        fontSize: 13,
        marginTop: 2,
    },
    modernModalClose: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: "center",
        justifyContent: "center",
    },
    moodGrid: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    moodRow: {
        justifyContent: "space-between",
        marginBottom: 12,
    },
    modernMoodItem: {
        width: "48%",
        height: 120,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    modernMoodLabel: {
        marginTop: 10,
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
    modernModalHint: {
        color: "#6B7280",
        textAlign: "center",
        marginTop: 16,
        paddingHorizontal: 24,
        fontSize: 13,
        lineHeight: 20,
    },

    // ===== NAYE CHAT MODAL STYLES =====
    chatModalContainer: {
        flex: 1,
        backgroundColor: '#050405',
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#151517',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    },
    chatHeaderButton: {
        padding: 5,
        width: 40, // Consistent tap area
    },
    chatHeaderTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    chatBody: {
        flex: 1,
        justifyContent: 'space-between',
    },
    chatMessageList: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        marginVertical: 4,
        borderRadius: 16,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#8b5cf6',
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#151517',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderTopLeftRadius: 4,
    },
    messageText: {
        color: "#fff",
        fontSize: 15,
        lineHeight: 22,
    },
    chatInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#151517',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    chatTextInput: {
        flex: 1,
        backgroundColor: '#0E0E10',
        borderRadius: 25,
        paddingHorizontal: 18,
        paddingVertical: 12,
        color: '#fff',
        fontSize: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        maxHeight: 120,
    },
    chatSendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#8b5cf6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatSendButtonDisabled: {
        backgroundColor: '#374151',
        opacity: 0.7,
    },
    typingIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 10,
        marginBottom: 5,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderRadius: 16,
    },
    typingIndicatorText: {
        color: '#8b5cf6',
        marginLeft: 8,
        fontSize: 14,
    },
});