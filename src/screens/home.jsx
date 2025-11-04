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

















import React, { useState, useEffect, useRef } from "react";
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
  FlatList, // <-- Naya import
  ActivityIndicator,
  Alert,
  // Animated (ab use nahi ho raha, hata sakte hain)
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
import { getAllTasks } from '../services/studyTaskApi';
// ===== NAYE IMPORTS =====
import axios from 'axios';
import { chatService, getCurrentUser } from '../services/chatService';
// ==========================

// ‼️ IMPORTANT: YEH AAPKE OLLAMA BACKEND KA URL HAI
// Yahaan apna wohi IP address daalein jo aapne baaki services mein daala hai
// Port 3000 (jaisa aapki friend ke setup mein tha)
const OLLAMA_BACKEND_URL = 'http://10.193.206.36:3000';

export default function Home({ navigation }) {
  // Purane states
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  // ===== CHAT KE LIYE NAYE STATES =====
  const [chatText, setChatText] = useState(""); // Yeh pehle se tha
  const [messages, setMessages] = useState([]); // Chat history ke liye
  const [isAiLoading, setIsAiLoading] = useState(false); // AI ke response ke liye
  const [isLoadingHistory, setIsLoadingHistory] = useState(true); // History load karne ke liye
  const [currentUser, setCurrentUser] = useState(null);
  const chatListRef = useRef(null); // FlatList ko scroll karne ke liye
  // ==================================

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

  // ===== Task Functions (Koi Change Nahi) =====
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
    console.log("Home.js: Fetching tasks...");
    setIsLoadingTasks(true);    
    try {
      const response = await getAllTasks();
      if (response.success && response.data) {
        const topTasks = getTopPriorityTasks(response.data);
        setTodayTasks(topTasks);
      } else {
        console.warn("Home.js: Failed to fetch tasks:", response.error);
        // Alert.alert("Error", "Could not load today's goals"); // Isse comment kar diya taaki chat test kar sakein
      }
    } catch (error) {
      console.error("Home.js: Error fetching tasks:", error);
      // Alert.alert("Error", "Something went wrong while loading tasks"); // Isse comment kar diya
    } finally {
      setIsLoadingTasks(false);
    }
  };
  
  // ===== NAYA FUNCTION: User aur Chat History Load Karein =====
  const loadUserAndHistory = async () => {
    console.log("Home.js: Loading user and chat history...");
    setIsLoadingHistory(true);
    try {
      // 1. Current user ko get karein
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'Please log in to use chat');
        return;
      }
      setCurrentUser(user);

      // 2. Chat history Supabase se load karein
      const history = await chatService.getChatHistory(user.id);
      
      if (history && history.length > 0) {
        const formattedMessages = history.map(msg => ({
          id: msg.id,
          text: msg.message,
          isUser: msg.is_user,
          createdAt: msg.created_at
        }));
        setMessages(formattedMessages);
      } else {
        // First time - welcome message dikhayein
        const welcomeMsg = {
          id: '1',
          text: "Hey there! 👋 I'm your StudyBuddy AI companion. How are you feeling today?",
          isUser: false
        };
        setMessages([welcomeMsg]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load chat history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Jab bhi screen focus mein aaye, Tasks aur Chat History dono load karein
  useFocusEffect(
    React.useCallback(() => {
      fetchTodayTasks();
      loadUserAndHistory();
    }, [])
  );
  
  // ===== NAYA FUNCTION: Message Bhejein =====
  const handleSendMessage = async () => {
    if (!chatText.trim() || isAiLoading || !currentUser) return;

    const userMessageText = chatText;
    setInputText('');
    setIsAiLoading(true);

    // 1. User ka message UI par dikhayein
    const userMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      isUser: true
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // 2. User ka message Supabase mein save karein
      await chatService.saveMessage(currentUser.id, userMessageText, true);

      // 3. Ollama backend ko call karein
      const response = await axios.post(`${OLLAMA_BACKEND_URL}/api/chat`, {
        message: userMessageText
      }, {
        timeout: 60000 // 1 minute timeout
      });

      const botMessageText = response.data.response;

      // 4. Bot ka message UI par dikhayein
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botMessageText,
        isUser: false
      };
      setMessages(prev => [...prev, botMessage]);

      // 5. Bot ka message Supabase mein save karein
      await chatService.saveMessage(currentUser.id, botMessageText, false);

    } catch (error) {
      console.error('Chat Error:', error);
      const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
      Alert.alert(
        'AI Error',
        'Failed to get response. Make sure Ollama backend server is running.\n\n' + errorMsg
      );
      
      // Error message UI par dikhayein
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };
  
  // ===== NAYA FUNCTION: Chat Message Render Karein =====
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble,
        item.isError && styles.errorBubble
      ]}
    >
      <Text style={[
        styles.messageText,
        item.isUser ? styles.userText : styles.botText
      ]}>
        {item.text}
      </Text>
    </View>
  );

  // ===== Task helper functions (Koi Change Nahi) =====
  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'High': return 'fire';
      case 'Medium': return 'star';
      case 'Low': return 'clock-outline';
      default: return 'checkbox-marked-circle-outline';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return { main: '#f87171', gradient: ['#ef4444', '#f87171'] };
      case 'Medium': return { main: '#a78bfa', gradient: ['#8b5cf6', '#a78bfa'] };
      case 'Low': return { main: '#6b7280', gradient: ['#4b5563', '#6b7280'] };
      default: return { main: '#666', gradient: ['#555', '#666'] };
    }
  };

  const getTaskProgress = (task) => {
    // FIX: Subtasks null/undefined hone se crash fix
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    if (subtasks.length === 0) return { completed: 0, total: 0, text: "Start" };
    const completed = subtasks.filter(sub => sub.completed).length;
    const total = subtasks.length;
    return { completed, total, text: `${completed}/${total}` };
  };

  function onSelectMood(mood) {
    setSelectedMood(mood.id);
    setMoodModalVisible(false);
    console.log("Mood selected:", mood.id);
  }

  // ===== RETURN (JSX) - UPDATE KIYA GAYA =====
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#050405" />
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header (No change) */}
        <View style={styles.headerWrap}>
          <View style={styles.gradientOverlay}>
            <Text style={styles.welcome}>Welcome Back! ✨</Text>
            <Text style={styles.headerSub}>
              Your AI companion for productivity and wellness
            </Text>
          </View>
        </View>

        {/* ===== Modern Today's Goals Card (No change) ===== */}
        <Pressable 
          style={({ pressed }) => [
            styles.modernCard,
            styles.goalsCard,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
          ]}
          onPress={() => navigation.navigate('StudyTasks')}
        >
          {/* Gradient Background */}
          <View style={styles.cardGradient} />
          
          {/* Header with Click Hint */}
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

          {/* Tasks List */}
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
                const progress = getTaskProgress(task);
                const colors = getPriorityColor(task.priority);
                return (
                  <ModernTaskItem
                    key={task.id}
                    icon={getPriorityIcon(task.priority)}
                    title={task.title}
                    priority={task.priority}
                    badgeText={progress.text}
                    color={colors.main}
                    index={index}
                  />
                );
              })
            )}
          </View>
        </Pressable>

        {/* Modern Quick Check-in Card (No change) */}
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
              <Icon 
                name={moodOptions.find(m => m.id === selectedMood)?.icon} 
                size={32} 
                color={moodOptions.find(m => m.id === selectedMood)?.bg} 
              />
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

        {/* ===== Modern Chat Widget (UPDATED) ===== */}
        <View style={styles.modernChatContainer}>
          {/* Header (No change) */}
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

          {/* Message List (DYNAMIC) */}
          {isLoadingHistory ? (
            <View style={styles.chatLoadingContainer}>
              <ActivityIndicator size="small" color="#a78bfa" />
              <Text style={styles.loadingText}>Loading chat...</Text>
            </View>
          ) : (
            <FlatList
              ref={chatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id.toString()} // Key ko string banaya
              contentContainerStyle={styles.chatMessageList}
              ListFooterComponent={isAiLoading ? (
                <View style={styles.aiLoadingContainer}>
                  <ActivityIndicator size="small" color="#a78bfa" />
                  <Text style={styles.aiLoadingText}>StudyBuddy is thinking...</Text>
                </View>
              ) : null}
              onContentSizeChange={() => chatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => chatListRef.current?.scrollToEnd({ animated: true })}
            />
          )}

          {/* Modern Input (DYNAMIC) */}
          <View style={styles.modernChatInput}>
            <View style={styles.inputWrapper}>
              <Icon name="pencil-outline" size={18} color="#6C6C72" style={styles.inputIcon} />
              <TextInput
                placeholder="Type your message..."
                placeholderTextColor="#6C6C72"
                style={styles.modernTextInput}
                value={chatText}
                onChangeText={setChatText}
                editable={!isAiLoading} // Disable jab AI soch raha hai
              />
            </View>
            <View style={styles.actionButtons}>
              <Pressable style={styles.modernIconBtn}>
                <Icon name="microphone" size={20} color="#9CA3AF" />
              </Pressable>
              <Pressable style={styles.modernIconBtn}>
                <Icon name="camera" size={20} color="#9CA3AF" />
              </Pressable>
              <Pressable 
                style={[
                  styles.modernSendBtn, 
                  (isAiLoading || !chatText.trim()) && styles.sendButtonDisabled // Disable style
                ]}
                onPress={handleSendMessage} // Naya function
                disabled={isAiLoading || !chatText.trim()} // Disable button
              >
                {isAiLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Icon name="send" size={18} color="#fff" />
                )}
              </Pressable>
            </View>
          </View>
        </View>
        {/* ======================================= */}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modern Mood Modal (No change) */}
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
                  <Icon name={item.icon} size={36} color="#fff" />
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
    </SafeAreaView>
  );
}

/* Modern Task Item Component (No change) */
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

/* Modern Styles (Updated) */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#050405" },
  container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36 },

  // Header
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

  // Modern Card Base
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

  // Card Header
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

  // Goals List
  modernGoalList: {
    gap: 10,
  },

  // Modern Task Row
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

  // Loading & Empty States
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

  // Check-in Card
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

  // Modern Chat Container
  modernChatContainer: {
    backgroundColor: "#0a0a0b",
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

  // Modern Input
  modernChatInput: {
    padding: 12,
    backgroundColor: "#050505",
    gap: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151517",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputIcon: {
    marginRight: 8,
  },
  modernTextInput: {
    flex: 1,
    height: 48,
    color: "#fff",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modernIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#151517",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  modernSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: { // Naya style
    backgroundColor: '#374151'
  },

  // Modern Modal
  modernModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modernModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modernModalCard: {
    backgroundColor: "#0E0E10",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modernModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modernModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modernModalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  modernModalSubtitle: {
    color: "#6B7280",
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

  // ===== NAYE CHAT STYLES (ChatScreen se copy kiye gaye) =====
  chatLoadingContainer: { // Naya style (loading state)
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  chatMessageList: { // Naya style (FlatList ke liye)
    padding: 16,
    backgroundColor: "#050505",
    minHeight: 150, // Thodi height de dein
  },
  messageBubble: {
    maxWidth: '85%', // Thoda chhota
    padding: 12,
    borderRadius: 16,
    marginVertical: 4
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#8b5cf6' // Aapka theme color
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#151517', // Aapka dark UI color
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  errorBubble: {
    backgroundColor: '#f87171', // Subtle red
    borderColor: '#ef4444'
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22
  },
  userText: {
    color: 'white'
  },
  botText: {
    color: '#E5E7EB'
  },
  aiLoadingContainer: { // "Thinking..." indicator
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#050505',
  },
  aiLoadingText: {
    marginLeft: 10,
    color: '#6B7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

