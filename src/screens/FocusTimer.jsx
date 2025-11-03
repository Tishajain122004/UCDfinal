// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   ScrollView,
//   FlatList,
//   StatusBar,
//   AppState,
//   Platform,
// } from 'react-native';
// import BackgroundTimer from 'react-native-background-timer';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
// import { createFocusSession, getAllFocusSessions } from '../services/focusApi';
// import { useFocusEffect } from '@react-navigation/native';

// const FocusTimer = () => {
//   const [mode, setMode] = useState('timer');
//   const [isRunning, setIsRunning] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [initialTime, setInitialTime] = useState(0);
//   const [isBreak, setIsBreak] = useState(false);
//   const [pausedTime, setPausedTime] = useState(0);
  
//   const [showDurationPicker, setShowDurationPicker] = useState(false);
//   const [showHistory, setShowHistory] = useState(false);
//   const [showBreakOptions, setShowBreakOptions] = useState(false);
  
//   const [selectedHours, setSelectedHours] = useState(0);
//   const [selectedMins, setSelectedMins] = useState(25);
  
//   const [sessions, setSessions] = useState([]);
//   const [focusTime, setFocusTime] = useState('0h 0m');
  
//   const intervalRef = useRef(null);
//   const appState = useRef(AppState.currentState);
//   const backgroundStartTime = useRef(null);
//   const notificationId = useRef(null);

//   // ===== NOTIFICATION SETUP =====
//   useEffect(() => {
//     setupNotifications();
    
//     return () => {
//       if (notificationId.current) {
//         notifee.cancelNotification(notificationId.current);
//       }
//     };
//   }, []);

//   const setupNotifications = async () => {
//     // Request permissions (iOS)
//     if (Platform.OS === 'ios') {
//       await notifee.requestPermission();
//     }

//     // Create notification channel (Android)
//     await notifee.createChannel({
//       id: 'focus-timer',
//       name: 'Focus Timer',
//       importance: AndroidImportance.HIGH,
//       sound: 'default',
//       vibration: true,
//     });

//     // Handle notification actions
//     notifee.onBackgroundEvent(async ({ type, detail }) => {
//       if (type === EventType.DISMISSED) {
//         console.log('Notification dismissed');
//       }
//     });
//   };

//   // ===== APP STATE CHANGE (Background/Foreground) =====
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//         console.log('App came to foreground');
        
//         if (isRunning && backgroundStartTime.current) {
//           const elapsed = Math.floor((Date.now() - backgroundStartTime.current) / 1000);
          
//           if (mode === 'timer') {
//             setTimeLeft(prev => Math.max(0, prev - elapsed));
//           } else {
//             setTimeLeft(prev => prev + elapsed);
//           }
          
//           backgroundStartTime.current = null;
//         }
        
//         // Cancel notification when app opens
//         if (notificationId.current) {
//           notifee.cancelNotification(notificationId.current);
//           notificationId.current = null;
//         }
//       } else if (nextAppState.match(/inactive|background/)) {
//         console.log('App went to background');
//         backgroundStartTime.current = Date.now();
        
//         if (isRunning) {
//           showOngoingNotification();
//         }
//       }

//       appState.current = nextAppState;
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, [isRunning, mode, timeLeft]);

//   // ===== ONGOING NOTIFICATION =====
//   const showOngoingNotification = async () => {
//     const formattedTime = formatTime(timeLeft);
    
//     try {
//       notificationId.current = await notifee.displayNotification({
//         id: 'focus-timer-ongoing',
//         title: isBreak ? '🌙 Break Time' : '🎯 Focus Timer Active',
//         body: `${formattedTime} ${isBreak ? 'break' : mode} in progress`,
//         android: {
//           channelId: 'focus-timer',
//           ongoing: true,
//           autoCancel: false,
//           importance: AndroidImportance.HIGH,
//           pressAction: {
//             id: 'default',
//           },
//         },
//         ios: {
//           sound: 'default',
//         },
//       });
//     } catch (error) {
//       console.error('Error showing notification:', error);
//     }
//   };

//   // ===== COMPLETION NOTIFICATION =====
//   const showCompletionNotification = async (duration) => {
//     const hrs = Math.floor(duration / 3600);
//     const mins = Math.floor((duration % 3600) / 60);
//     const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    
//     try {
//       await notifee.displayNotification({
//         title: '🎉 Congratulations!',
//         body: `You focused for ${timeStr}! Great work!`,
//         android: {
//           channelId: 'focus-timer',
//           importance: AndroidImportance.HIGH,
//           sound: 'default',
//           vibrationPattern: [300, 500],
//           pressAction: {
//             id: 'default',
//           },
//         },
//         ios: {
//           sound: 'default',
//         },
//       });
//     } catch (error) {
//       console.error('Error showing completion notification:', error);
//     }
//   };

//   // ===== BREAK NOTIFICATION =====
//   const showBreakNotification = async (duration, isComplete = false) => {
//     try {
//       await notifee.displayNotification({
//         title: isComplete ? '☕ Break Complete!' : '☕ Break Started',
//         body: isComplete ? 'Time to get back to work!' : `${duration / 60} minute break in progress`,
//         android: {
//           channelId: 'focus-timer',
//           importance: AndroidImportance.HIGH,
//           sound: 'default',
//           ongoing: !isComplete,
//           autoCancel: isComplete,
//           pressAction: {
//             id: 'default',
//           },
//         },
//         ios: {
//           sound: 'default',
//         },
//       });
//     } catch (error) {
//       console.error('Error showing break notification:', error);
//     }
//   };

//   // ===== CALCULATE STATS =====
//   const calculateStats = (sessionList) => {
//     const today = new Date().toDateString();
//     const todaySessions = sessionList.filter(s => 
//       new Date(s.created_at).toDateString() === today
//     );
    
//     const totalFocus = todaySessions.reduce((acc, s) => acc + s.duration, 0);
//     const hrs = Math.floor(totalFocus / 3600);
//     const mins = Math.floor((totalFocus % 3600) / 60);
//     setFocusTime(`${hrs}h ${mins}m`);
//   };

//   // ===== FETCH SESSIONS =====
//   const fetchSessions = async () => {
//     try {
//       const response = await getAllFocusSessions();
//       if (response.success) {
//         setSessions(response.data);
//         calculateStats(response.data);
//       }
//     } catch (e) {
//       console.error('Error loading sessions:', e);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchSessions();
//     }, [])
//   );

//   // ===== SAVE SESSION TO DB =====
//   const saveSessionToDb = async (newSession) => {
//     if (newSession.duration < 120) {
//       console.log(`Session ${newSession.duration}s, less than 2 min. Not saved.`);
//       return;
//     }

//     try {
//       const response = await createFocusSession(newSession);
//       if (response.success && response.data) {
//         const updatedList = [response.data, ...sessions];
//         setSessions(updatedList);
//         calculateStats(updatedList);
//       }
//     } catch (e) {
//       console.error('Error saving session to DB:', e);
//     }
//   };

//   // ===== BACKGROUND TIMER LOGIC =====
//   useEffect(() => {
//     if (isRunning) {
//       BackgroundTimer.runBackgroundTimer(() => {
//         if (mode === 'timer') {
//           setTimeLeft(prev => {
//             if (prev <= 1) {
//               handleTimerComplete();
//               return 0;
//             }
//             return prev - 1;
//           });
//         } else {
//           setTimeLeft(prev => prev + 1);
//         }
//       }, 1000);
//     } else {
//       BackgroundTimer.stopBackgroundTimer();
//     }

//     return () => {
//       BackgroundTimer.stopBackgroundTimer();
//     };
//   }, [isRunning, mode]);

//   // ===== TIMER COMPLETE =====
//   const handleTimerComplete = async () => {
//     setIsRunning(false);
//     BackgroundTimer.stopBackgroundTimer();
    
//     if (notificationId.current) {
//       await notifee.cancelNotification(notificationId.current);
//       notificationId.current = null;
//     }
    
//     if (!isBreak && mode === 'timer') {
//       const elapsed = initialTime;
      
//       await showCompletionNotification(elapsed);
      
//       const newSession = {
//         duration: elapsed,
//         mode: mode,
//         completed: true,
//       };
//       saveSessionToDb(newSession);
//     }
    
//     if (isBreak) {
//       await showBreakNotification(0, true);
      
//       setTimeLeft(pausedTime);
//       setIsBreak(false);
//       setIsRunning(true);
//     } else {
//       setTimeLeft(0);
//       setInitialTime(0);
//     }
//   };

//   // ===== START FOCUS =====
//   const startFocus = () => {
//     if (timeLeft === 0 && mode === 'timer') {
//       setShowDurationPicker(true);
//       return;
//     }
//     if (mode === 'stopwatch' && timeLeft === 0) {
//       setInitialTime(0);
//     }
//     setIsRunning(true);
    
//     if (AppState.currentState !== 'active') {
//       showOngoingNotification();
//     }
//   };

//   // ===== STOP FOCUS =====
//   const stopFocus = async () => {
//     setIsRunning(false);
//     BackgroundTimer.stopBackgroundTimer();
    
//     if (notificationId.current) {
//       await notifee.cancelNotification(notificationId.current);
//       notificationId.current = null;
//     }
    
//     if (!isBreak && (timeLeft > 0 || initialTime > 0)) {
//       const elapsed = (mode === 'timer') ? (initialTime - timeLeft) : timeLeft;
      
//       if (elapsed > 0) {
//         await showCompletionNotification(elapsed);
        
//         const newSession = {
//           duration: elapsed,
//           mode: mode,
//           completed: mode === 'stopwatch' || timeLeft === 0,
//         };
//         saveSessionToDb(newSession);
//       }
//     }
    
//     setTimeLeft(0);
//     setInitialTime(0);
//     setIsBreak(false);
//     setPausedTime(0);
//     backgroundStartTime.current = null;
//   };

//   // ===== TAKE BREAK =====
//   const takeBreak = (duration) => {
//     setPausedTime(timeLeft);
//     setTimeLeft(duration);
//     setIsBreak(true);
//     setIsRunning(true);
//     setShowBreakOptions(false);
    
//     showBreakNotification(duration, false);
//   };

//   // ===== FORMAT TIME =====
//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
    
//     if (hrs > 0) {
//       return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     }
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   // ===== SET DURATION =====
//   const setDuration = () => {
//     const totalSecs = selectedHours * 3600 + selectedMins * 60;
//     if (totalSecs === 0) return;
    
//     setInitialTime(totalSecs);
//     setTimeLeft(totalSecs);
//     setShowDurationPicker(false);
//     setIsRunning(true);
//   };

//   // ===== RENDER SESSION =====
//   const renderSession = ({ item }) => {
//     const date = new Date(item.created_at);
//     const hrs = Math.floor(item.duration / 3600);
//     const mins = Math.floor((item.duration % 3600) / 60);
    
//     return (
//       <View style={styles.sessionItem}>
//         <View style={styles.sessionLeft}>
//           <Text style={styles.sessionDate}>
//             {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </Text>
//         </View>
//         <View style={styles.sessionRight}>
//           <Text style={styles.sessionDuration}>
//             {hrs > 0 ? `${hrs}h ` : ''}{mins}m
//           </Text>
//           {item.completed && <Text style={styles.completedBadge}>✓</Text>}
//         </View>
//       </View>
//     );
//   };

//   const progress = initialTime > 0 && mode === 'timer' ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Focus</Text>
//         <View style={styles.headerRight}>
//           <View style={styles.focusBadge}>
//             <Text style={styles.focusText}>{focusTime}</Text>
//           </View>
//           <TouchableOpacity 
//             style={styles.historyBtn}
//             onPress={() => setShowHistory(true)}
//           >
//             <Text style={styles.historyIcon}>📊</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Timer Display */}
//       <View style={styles.timerContainer}>
//         <TouchableOpacity 
//           style={styles.timerWrapper}
//           onPress={() => !isRunning && timeLeft === 0 && mode === 'timer' && setShowDurationPicker(true)}
//           activeOpacity={0.8}
//         >
//           <View style={styles.fullCircle} />
          
//           {mode === 'timer' && initialTime > 0 && (
//             <View style={styles.progressRing}>
//               <View style={[styles.progressFill, { 
//                 transform: [{ rotate: `${(progress * 3.6)}deg` }] 
//               }]} />
//             </View>
//           )}
          
//           <View style={styles.timerInner}>
//             <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
//             {isBreak && <Text style={styles.breakLabel}>Break Time</Text>}
//             {!isBreak && timeLeft === 0 && mode === 'timer' && (
//               <Text style={styles.tapToStart}>Tap to set timer</Text>
//             )}
//           </View>
//         </TouchableOpacity>

//         {/* Mode Toggle */}
//         <View style={styles.modeToggle}>
//           <TouchableOpacity
//             style={[styles.modeBtn, mode === 'timer' && styles.modeBtnActive]}
//             onPress={() => {
//               if (!isRunning) {
//                 setMode('timer');
//                 setTimeLeft(0);
//                 setInitialTime(0);
//               }
//             }}
//             disabled={isRunning}
//           >
//             <Text style={[styles.modeBtnText, mode === 'timer' && styles.modeBtnTextActive]}>
//               Timer
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modeBtn, mode === 'stopwatch' && styles.modeBtnActive]}
//             onPress={() => {
//               if (!isRunning) {
//                 setMode('stopwatch');
//                 setTimeLeft(0);
//                 setInitialTime(0);
//               }
//             }}
//             disabled={isRunning}
//           >
//             <Text style={[styles.modeBtnText, mode === 'stopwatch' && styles.modeBtnTextActive]}>
//               Stopwatch
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Controls */}
//       <View style={styles.controls}>
//         {!isRunning ? (
//           <TouchableOpacity 
//             style={styles.startBtn} 
//             onPress={startFocus}
//           >
//             <Text style={styles.startBtnText}>
//               {timeLeft === 0 && mode === 'timer' ? 'Set Timer' : 'Start'}
//             </Text>
//           </TouchableOpacity>
//         ) : (
//           <View style={styles.runningControls}>
//             {!isBreak && (
//               <TouchableOpacity 
//                 style={styles.breakBtn} 
//                 onPress={() => setShowBreakOptions(true)}
//               >
//                 <Text style={styles.breakBtnText}>☕ Break</Text>
//               </TouchableOpacity>
//             )}
//             <TouchableOpacity 
//               style={[styles.stopBtn, isBreak && styles.stopBtnFull]} 
//               onPress={stopFocus}
//             >
//               <Text style={styles.stopBtnText}>■ Stop</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Duration Picker Modal */}
//       <Modal visible={showDurationPicker} animationType="fade" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.pickerModal}>
//             <Text style={styles.pickerTitle}>Set Focus Time</Text>
            
//             <View style={styles.pickerContainer}>
//               <View style={styles.pickerColumn}>
//                 <Text style={styles.pickerLabelTop}>hours</Text>
//                 <ScrollView 
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={styles.pickerScroll}
//                 >
//                   {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
//                     <TouchableOpacity
//                       key={h}
//                       style={[styles.pickerItem, selectedHours === h && styles.pickerItemSelected]}
//                       onPress={() => setSelectedHours(h)}
//                     >
//                       <Text style={[styles.pickerText, selectedHours === h && styles.pickerTextSelected]}>
//                         {h}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>

//               <View style={styles.pickerColumn}>
//                 <Text style={styles.pickerLabelTop}>mins</Text>
//                 <ScrollView 
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={styles.pickerScroll}
//                 >
//                   {[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
//                     <TouchableOpacity
//                       key={m}
//                       style={[styles.pickerItem, selectedMins === m && styles.pickerItemSelected]}
//                       onPress={() => setSelectedMins(m)}
//                     >
//                       <Text style={[styles.pickerText, selectedMins === m && styles.pickerTextSelected]}>
//                         {m}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>
//             </View>

//             <View style={styles.pickerButtons}>
//               <TouchableOpacity 
//                 style={styles.cancelBtn} 
//                 onPress={() => setShowDurationPicker(false)}
//               >
//                 <Text style={styles.cancelBtnText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={styles.setBtn} 
//                 onPress={setDuration}
//               >
//                 <Text style={styles.setBtnText}>Start Timer</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Break Options Modal */}
//       <Modal visible={showBreakOptions} animationType="fade" transparent={true}>
//         <TouchableOpacity 
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setShowBreakOptions(false)}
//         >
//           <View style={styles.breakModal}>
//             <Text style={styles.breakModalTitle}>Take a Break</Text>
//             <TouchableOpacity 
//               style={styles.breakOptionBtn}
//               onPress={() => takeBreak(300)}
//             >
//               <Text style={styles.breakOptionText}>☕ Short Break</Text>
//               <Text style={styles.breakOptionTime}>5 minutes</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.breakOptionBtn}
//               onPress={() => takeBreak(900)}
//             >
//               <Text style={styles.breakOptionText}>🌙 Long Break</Text>
//               <Text style={styles.breakOptionTime}>15 minutes</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* History Modal */}
//       <Modal visible={showHistory} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.historyModal}>
//             <View style={styles.historyHeader}>
//               <Text style={styles.historyTitle}>History</Text>
//               <TouchableOpacity onPress={() => setShowHistory(false)}>
//                 <Text style={styles.closeBtn}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={sessions}
//               renderItem={renderSession}
//               keyExtractor={item => item.id}
//               style={styles.sessionList}
//               ListEmptyComponent={
//                 <Text style={styles.emptyText}>No sessions yet</Text>
//               }
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
//   headerTitle: { color: '#fff', fontSize: 28, fontWeight: '600' },
//   headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   focusBadge: { backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
//   focusText: { color: '#888', fontSize: 13 },
//   historyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
//   historyIcon: { fontSize: 18 },
//   timerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
//   timerWrapper: { position: 'relative', width: 240, height: 240, marginBottom: 40 },
//   fullCircle: { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 3, borderColor: '#1a1a1a' },
//   progressRing: { position: 'absolute', width: 240, height: 240, borderRadius: 120, overflow: 'hidden' },
//   progressFill: { position: 'absolute', width: '100%', height: '100%', borderRadius: 120, borderWidth: 3, borderColor: '#fff', borderRightColor: 'transparent', borderBottomColor: 'transparent' },
//   timerInner: { position: 'absolute', width: 240, height: 240, borderRadius: 120, justifyContent: 'center', alignItems: 'center' },
//   timerText: { color: '#fff', fontSize: 42, fontWeight: '300', letterSpacing: 2 },
//   breakLabel: { color: '#888', fontSize: 13, marginTop: 8 },
//   tapToStart: { color: '#555', fontSize: 13, marginTop: 8 },
//   modeToggle: { flexDirection: 'row', backgroundColor: '#1a1a1a', borderRadius: 20, padding: 3 },
//   modeBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 17 },
//   modeBtnActive: { backgroundColor: '#fff' },
//   modeBtnText: { color: '#888', fontSize: 14, fontWeight: '500' },
//   modeBtnTextActive: { color: '#000' },
//   controls: { paddingHorizontal: 24, paddingBottom: 40 },
//   startBtn: { backgroundColor: '#fff', padding: 16, borderRadius: 24, alignItems: 'center' },
//   startBtnText: { color: '#000', fontSize: 16, fontWeight: '600' },
//   runningControls: { flexDirection: 'row', gap: 12 },
//   breakBtn: { flex: 1, backgroundColor: '#1a1a1a', padding: 16, borderRadius: 24, alignItems: 'center' },
//   breakBtnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
//   stopBtn: { flex: 1, backgroundColor: '#1a1a1a', padding: 16, borderRadius: 24, alignItems: 'center' },
//   stopBtnFull: { flex: 1 },
//   stopBtnText: { color: '#ff4444', fontSize: 15, fontWeight: '500' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
//   pickerModal: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, width: '80%', maxWidth: 300 },
//   pickerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
//   pickerContainer: { flexDirection: 'row', justifyContent: 'center', gap: 30, height: 180, marginBottom: 20 },
//   pickerColumn: { alignItems: 'center', width: 70 },
//   pickerLabelTop: { color: '#888', fontSize: 12, marginBottom: 10 },
//   pickerScroll: { alignItems: 'center', paddingVertical: 10 },
//   pickerItem: { padding: 8, minWidth: 50, alignItems: 'center', borderRadius: 8, marginVertical: 2 },
//   pickerItemSelected: { backgroundColor: '#fff' },
//   pickerText: { color: '#666', fontSize: 16 },
//   pickerTextSelected: { color: '#000', fontWeight: '600' },
//   pickerButtons: { flexDirection: 'row', gap: 10 },
//   cancelBtn: { flex: 1, padding: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#0a0a0a' },
//   cancelBtnText: { color: '#888', fontSize: 14, fontWeight: '500' },
//   setBtn: { flex: 2, padding: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#fff' },
//   setBtnText: { color: '#000', fontSize: 14, fontWeight: '600' },
//   breakModal: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 24, width: '80%', maxWidth: 300 },
//   breakModalTitle: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
//   breakOptionBtn: { backgroundColor: '#0a0a0a', padding: 16, borderRadius: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   breakOptionText: { color: '#fff', fontSize: 15, fontWeight: '500' },
//   breakOptionTime: { color: '#888', fontSize: 13 },
//   historyModal: { backgroundColor: '#1a1a1a', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 40, maxHeight: '80%', width: '100%', position: 'absolute', bottom: 0 },
//   historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   historyTitle: { color: '#fff', fontSize: 22, fontWeight: '600' },
//   closeBtn: { color: '#888', fontSize: 28, fontWeight: '300' },
//   sessionList: {},
//   sessionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a0a0a', padding: 16, borderRadius: 16, marginBottom: 8 },
//   sessionLeft: { flex: 1 },
//   sessionDate: { color: '#888', fontSize: 14 },
//   sessionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   sessionDuration: { color: '#fff', fontSize: 15, fontWeight: '500' },
//   completedBadge: { color: '#4cd964', fontSize: 16 },
//   emptyText: { color: '#555', textAlign: 'center', marginTop: 40, fontSize: 14 },
// });

// export default FocusTimer;


















// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   ScrollView,
//   FlatList,
//   StatusBar,
//   AppState,
//   Platform,
// } from 'react-native';
// import BackgroundTimer from 'react-native-background-timer';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
// import { createFocusSession, getAllFocusSessions } from '../services/focusApi';
// import { useFocusEffect } from '@react-navigation/native';

// const FocusTimer = ({ navigation, route }) => {
//   const [mode, setMode] = useState('timer');
//   const [isRunning, setIsRunning] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [initialTime, setInitialTime] = useState(0);
//   const [isBreak, setIsBreak] = useState(false);
//   const [pausedTime, setPausedTime] = useState(0);
  
//   const [showDurationPicker, setShowDurationPicker] = useState(false);
//   const [showHistory, setShowHistory] = useState(false);
//   const [showBreakOptions, setShowBreakOptions] = useState(false);
  
//   const [selectedHours, setSelectedHours] = useState(0);
//   const [selectedMins, setSelectedMins] = useState(25);
  
//   const [sessions, setSessions] = useState([]);
//   const [focusTime, setFocusTime] = useState('0h 0m');
  
//   const intervalRef = useRef(null);
//   const notificationUpdateRef = useRef(null);
//   const appState = useRef(AppState.currentState);
//   const backgroundStartTime = useRef(null);
//   const notificationId = useRef(null);
//   const sessionStartTime = useRef(null);

//   // Store current time for notification updates
//   const currentTimeRef = useRef(0);
  
//   // Update ref whenever timeLeft changes
//   useEffect(() => {
//     currentTimeRef.current = timeLeft;
//   }, [timeLeft]);

//   // ===== NOTIFICATION SETUP =====
//   useEffect(() => {
//     setupNotifications();
    
//     return () => {
//       if (notificationId.current) {
//         notifee.cancelNotification(notificationId.current);
//       }
//       if (notificationUpdateRef.current) {
//         clearInterval(notificationUpdateRef.current);
//       }
//     };
//   }, []);

//   const setupNotifications = async () => {
//     // Request permissions (iOS)
//     if (Platform.OS === 'ios') {
//       await notifee.requestPermission();
//     }

//     // Create notification channel (Android)
//     await notifee.createChannel({
//       id: 'focus-timer',
//       name: 'Focus Timer',
//       importance: AndroidImportance.HIGH,
//       sound: 'default',
//       vibration: true,
//     });

//     // Handle notification actions
//     notifee.onBackgroundEvent(async ({ type, detail }) => {
//       if (type === EventType.DISMISSED) {
//         console.log('Notification dismissed');
//       }
//     });
//   };

//   // ===== APP STATE CHANGE (Background/Foreground) =====
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//         console.log('App came to foreground');
        
//         if (isRunning && backgroundStartTime.current) {
//           const elapsed = Math.floor((Date.now() - backgroundStartTime.current) / 1000);
          
//           if (mode === 'timer') {
//             setTimeLeft(prev => Math.max(0, prev - elapsed));
//           } else {
//             setTimeLeft(prev => prev + elapsed);
//           }
          
//           backgroundStartTime.current = null;
//         }
        
//         // Cancel notification when app opens
//         if (notificationId.current) {
//           notifee.cancelNotification(notificationId.current);
//           notificationId.current = null;
//         }
        
//         // Stop notification updates
//         if (notificationUpdateRef.current) {
//           clearInterval(notificationUpdateRef.current);
//           notificationUpdateRef.current = null;
//         }
//       } else if (nextAppState.match(/inactive|background/)) {
//         console.log('App went to background');
//         backgroundStartTime.current = Date.now();
        
//         if (isRunning) {
//           startOngoingNotification();
//         }
//       }

//       appState.current = nextAppState;
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, [isRunning, mode, timeLeft, isBreak]);

//   // ===== START ONGOING NOTIFICATION WITH LIVE UPDATES =====
//   const startOngoingNotification = async () => {
//     // Initial notification with current time
//     await updateOngoingNotification();
    
//     // Clear any existing interval
//     if (notificationUpdateRef.current) {
//       clearInterval(notificationUpdateRef.current);
//     }
    
//     // Update notification every second
//     notificationUpdateRef.current = setInterval(async () => {
//       await updateOngoingNotification();
//     }, 1000);
//   };

//   // ===== UPDATE ONGOING NOTIFICATION =====
//   const updateOngoingNotification = async () => {
//     try {
//       const currentTime = currentTimeRef.current;
//       const formattedTime = formatTime(currentTime);
//       const currentProgress = mode === 'timer' && initialTime > 0 
//         ? Math.round(((initialTime - currentTime) / initialTime) * 100) 
//         : 0;
      
//       await notifee.displayNotification({
//         id: 'focus-timer-ongoing',
//         title: isBreak 
//           ? `🌙 Break - ${formattedTime} remaining` 
//           : `🎯 Focus - ${formattedTime} ${mode === 'timer' ? 'remaining' : 'elapsed'}`,
//         body: mode === 'timer' 
//           ? `${currentProgress}% complete` 
//           : 'Keep focusing!',
//         android: {
//           channelId: 'focus-timer',
//           ongoing: true,
//           autoCancel: false,
//           importance: AndroidImportance.HIGH,
//           onlyAlertOnce: true,
//           smallIcon: 'ic_launcher',
//           color: '#ffffff',
//           pressAction: {
//             id: 'default',
//           },
//           progress: mode === 'timer' && initialTime > 0 ? {
//             max: initialTime,
//             current: initialTime - currentTime,
//             indeterminate: false,
//           } : undefined,
//         },
//         ios: {
//           sound: 'default',
//         },
//       });
//     } catch (error) {
//       console.error('Error updating notification:', error);
//     }
//   };

//   // ===== COMPLETION NOTIFICATION =====
//   const showCompletionNotification = async (duration) => {
//     const hrs = Math.floor(duration / 3600);
//     const mins = Math.floor((duration % 3600) / 60);
//     const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    
//     try {
//       await notifee.displayNotification({
//         id: 'focus-completion',
//         title: '🎉 Congratulations!',
//         body: `You focused for ${timeStr}! Great work!`,
//         android: {
//           channelId: 'focus-timer',
//           importance: AndroidImportance.HIGH,
//           sound: 'default',
//           vibrationPattern: [300, 500],
//           autoCancel: true,
//           pressAction: {
//             id: 'default',
//           },
//         },
//         ios: {
//           sound: 'default',
//         },
//       });
//     } catch (error) {
//       console.error('Error showing completion notification:', error);
//     }
//   };

//   // ===== BREAK NOTIFICATION =====
//   const showBreakNotification = async (duration, isComplete = false) => {
//     try {
//       await notifee.displayNotification({
//         title: isComplete ? '☕ Break Complete!' : '☕ Break Started',
//         body: isComplete ? 'Time to get back to work!' : `${duration / 60} minute break in progress`,
//         android: {
//           channelId: 'focus-timer',
//           importance: AndroidImportance.HIGH,
//           sound: 'default',
//           autoCancel: isComplete,
//           pressAction: {
//             id: 'default',
//           },
//         },
//         ios: {
//           sound: 'default',
//         },
//       });
//     } catch (error) {
//       console.error('Error showing break notification:', error);
//     }
//   };

//   // ===== CALCULATE STATS =====
//   const calculateStats = (sessionList) => {
//     const today = new Date().toDateString();
//     const todaySessions = sessionList.filter(s => 
//       new Date(s.created_at).toDateString() === today
//     );
    
//     const totalFocus = todaySessions.reduce((acc, s) => acc + s.duration, 0);
//     const hrs = Math.floor(totalFocus / 3600);
//     const mins = Math.floor((totalFocus % 3600) / 60);
//     setFocusTime(`${hrs}h ${mins}m`);
//   };

//   // ===== FETCH SESSIONS =====
//   const fetchSessions = useCallback(async () => {
//     try {
//       const response = await getAllFocusSessions();
//       console.log('Fetched sessions response:', response);
//       if (response.success && response.data) {
//         setSessions(response.data);
//         calculateStats(response.data);
//       }
//     } catch (e) {
//       console.error('Error loading sessions:', e);
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchSessions();
//     }, [fetchSessions])
//   );

//   // ===== SAVE SESSION TO DB =====
//   const saveSessionToDb = async (newSession) => {
//     if (newSession.duration < 120) {
//       console.log(`Session ${newSession.duration}s is less than 2 min. Not saved.`);
//       return;
//     }

//     try {
//       console.log('Saving session to DB:', newSession);
//       const response = await createFocusSession(newSession);
//       console.log('Save session response:', response);
      
//       if (response.success && response.data) {
//         const updatedList = [response.data, ...sessions];
//         setSessions(updatedList);
//         calculateStats(updatedList);
//         console.log('Session saved successfully!');
//       } else {
//         console.error('Session save failed:', response);
//       }
//     } catch (e) {
//       console.error('Error saving session to DB:', e);
//     }
//   };

//   // ===== BACKGROUND TIMER LOGIC =====
//   useEffect(() => {
//     if (isRunning) {
//       BackgroundTimer.runBackgroundTimer(() => {
//         if (mode === 'timer') {
//           setTimeLeft(prev => {
//             const newTime = prev - 1;
            
//             // Update notification in background
//             if (AppState.currentState !== 'active') {
//               updateOngoingNotification();
//             }
            
//             // Check for completion in background
//             if (newTime <= 0) {
//               handleTimerComplete();
//               return 0;
//             }
            
//             return newTime;
//           });
//         } else {
//           setTimeLeft(prev => {
//             const newTime = prev + 1;
            
//             // Update notification in background
//             if (AppState.currentState !== 'active') {
//               updateOngoingNotification();
//             }
            
//             return newTime;
//           });
//         }
//       }, 1000);
//     } else {
//       BackgroundTimer.stopBackgroundTimer();
//     }

//     return () => {
//       BackgroundTimer.stopBackgroundTimer();
//     };
//   }, [isRunning, mode]);

//   // ===== TIMER COMPLETE =====
//   const handleTimerComplete = async () => {
//     console.log('Timer completed!');
//     setIsRunning(false);
//     BackgroundTimer.stopBackgroundTimer();
    
//     // Stop notification updates
//     if (notificationUpdateRef.current) {
//       clearInterval(notificationUpdateRef.current);
//       notificationUpdateRef.current = null;
//     }
    
//     // Cancel ongoing notification
//     if (notificationId.current) {
//       await notifee.cancelNotification(notificationId.current);
//       notificationId.current = null;
//     }
    
//     if (!isBreak && mode === 'timer') {
//       const elapsed = initialTime;
      
//       // Show completion notification (works in background too!)
//       await showCompletionNotification(elapsed);
      
//       const newSession = {
//         duration: elapsed,
//         mode: mode,
//         completed: true,
//       };
//       await saveSessionToDb(newSession);
//     }
    
//     if (isBreak) {
//       await showBreakNotification(0, true);
      
//       setTimeLeft(pausedTime);
//       setIsBreak(false);
//       setIsRunning(true);
//     } else {
//       setTimeLeft(0);
//       setInitialTime(0);
//     }
//   };

//   // ===== START FOCUS =====
//   const startFocus = () => {
//     if (timeLeft === 0 && mode === 'timer') {
//       setShowDurationPicker(true);
//       return;
//     }
//     if (mode === 'stopwatch' && timeLeft === 0) {
//       setInitialTime(0);
//     }
    
//     sessionStartTime.current = Date.now();
//     setIsRunning(true);
    
//     // Start notification if app is in background
//     if (AppState.currentState !== 'active') {
//       startOngoingNotification();
//     }
//   };

//   // ===== STOP FOCUS =====
//   const stopFocus = async () => {
//     console.log('Stopping focus...');
//     setIsRunning(false);
//     BackgroundTimer.stopBackgroundTimer();
    
//     // Stop notification updates
//     if (notificationUpdateRef.current) {
//       clearInterval(notificationUpdateRef.current);
//       notificationUpdateRef.current = null;
//     }
    
//     // Cancel ongoing notification
//     if (notificationId.current) {
//       await notifee.cancelNotification(notificationId.current);
//       notificationId.current = null;
//     }
    
//     if (!isBreak && (timeLeft > 0 || initialTime > 0)) {
//       const elapsed = (mode === 'timer') ? (initialTime - timeLeft) : timeLeft;
      
//       if (elapsed > 0) {
//         await showCompletionNotification(elapsed);
        
//         const newSession = {
//           duration: elapsed,
//           mode: mode,
//           completed: mode === 'stopwatch' || timeLeft === 0,
//         };
//         await saveSessionToDb(newSession);
//       }
//     }
    
//     setTimeLeft(0);
//     setInitialTime(0);
//     setIsBreak(false);
//     setPausedTime(0);
//     backgroundStartTime.current = null;
//     sessionStartTime.current = null;
//   };

//   // ===== TAKE BREAK =====
//   const takeBreak = (duration) => {
//     setPausedTime(timeLeft);
//     setTimeLeft(duration);
//     setIsBreak(true);
//     setIsRunning(true);
//     setShowBreakOptions(false);
    
//     showBreakNotification(duration, false);
//   };

//   // ===== FORMAT TIME =====
//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
    
//     if (hrs > 0) {
//       return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     }
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   // ===== SET DURATION =====
//   const setDuration = () => {
//     const totalSecs = selectedHours * 3600 + selectedMins * 60;
//     if (totalSecs === 0) return;
    
//     setInitialTime(totalSecs);
//     setTimeLeft(totalSecs);
//     setShowDurationPicker(false);
//     sessionStartTime.current = Date.now();
//     setIsRunning(true);
//   };

//   // ===== RENDER SESSION =====
//   const renderSession = ({ item }) => {
//     const date = new Date(item.created_at);
//     const hrs = Math.floor(item.duration / 3600);
//     const mins = Math.floor((item.duration % 3600) / 60);
    
//     return (
//       <View style={styles.sessionItem}>
//         <View style={styles.sessionLeft}>
//           <Text style={styles.sessionDate}>
//             {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </Text>
//         </View>
//         <View style={styles.sessionRight}>
//           <Text style={styles.sessionDuration}>
//             {hrs > 0 ? `${hrs}h ` : ''}{mins}m
//           </Text>
//           {item.completed && <Text style={styles.completedBadge}>✓</Text>}
//         </View>
//       </View>
//     );
//   };

//   const progress = initialTime > 0 && mode === 'timer' ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Focus</Text>
//         <View style={styles.headerRight}>
//           <View style={styles.focusBadge}>
//             <Text style={styles.focusText}>{focusTime}</Text>
//           </View>
//           <TouchableOpacity 
//             style={styles.historyBtn}
//             onPress={() => setShowHistory(true)}
//           >
//             <Text style={styles.historyIcon}>📊</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Timer Display */}
//       <View style={styles.timerContainer}>
//         <TouchableOpacity 
//           style={styles.timerWrapper}
//           onPress={() => !isRunning && timeLeft === 0 && mode === 'timer' && setShowDurationPicker(true)}
//           activeOpacity={0.8}
//         >
//           <View style={styles.fullCircle} />
          
//           {mode === 'timer' && initialTime > 0 && (
//             <View style={styles.progressRing}>
//               <View style={[styles.progressFill, { 
//                 transform: [{ rotate: `${(progress * 3.6)}deg` }] 
//               }]} />
//             </View>
//           )}
          
//           <View style={styles.timerInner}>
//             <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
//             {isBreak && <Text style={styles.breakLabel}>Break Time</Text>}
//             {!isBreak && timeLeft === 0 && mode === 'timer' && (
//               <Text style={styles.tapToStart}>Tap to set timer</Text>
//             )}
//           </View>
//         </TouchableOpacity>

//         {/* Mode Toggle */}
//         <View style={styles.modeToggle}>
//           <TouchableOpacity
//             style={[styles.modeBtn, mode === 'timer' && styles.modeBtnActive]}
//             onPress={() => {
//               if (!isRunning) {
//                 setMode('timer');
//                 setTimeLeft(0);
//                 setInitialTime(0);
//               }
//             }}
//             disabled={isRunning}
//           >
//             <Text style={[styles.modeBtnText, mode === 'timer' && styles.modeBtnTextActive]}>
//               Timer
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modeBtn, mode === 'stopwatch' && styles.modeBtnActive]}
//             onPress={() => {
//               if (!isRunning) {
//                 setMode('stopwatch');
//                 setTimeLeft(0);
//                 setInitialTime(0);
//               }
//             }}
//             disabled={isRunning}
//           >
//             <Text style={[styles.modeBtnText, mode === 'stopwatch' && styles.modeBtnTextActive]}>
//               Stopwatch
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Controls */}
//       <View style={styles.controls}>
//         {!isRunning ? (
//           <TouchableOpacity 
//             style={styles.startBtn} 
//             onPress={startFocus}
//           >
//             <Text style={styles.startBtnText}>
//               {timeLeft === 0 && mode === 'timer' ? 'Set Timer' : 'Start'}
//             </Text>
//           </TouchableOpacity>
//         ) : (
//           <View style={styles.runningControls}>
//             {!isBreak && (
//               <TouchableOpacity 
//                 style={styles.breakBtn} 
//                 onPress={() => setShowBreakOptions(true)}
//               >
//                 <Text style={styles.breakBtnText}>☕ Break</Text>
//               </TouchableOpacity>
//             )}
//             <TouchableOpacity 
//               style={[styles.stopBtn, isBreak && styles.stopBtnFull]} 
//               onPress={stopFocus}
//             >
//               <Text style={styles.stopBtnText}>■ Stop</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Duration Picker Modal */}
//       <Modal visible={showDurationPicker} animationType="fade" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.pickerModal}>
//             <Text style={styles.pickerTitle}>Set Focus Time</Text>
            
//             <View style={styles.pickerContainer}>
//               <View style={styles.pickerColumn}>
//                 <Text style={styles.pickerLabelTop}>hours</Text>
//                 <ScrollView 
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={styles.pickerScroll}
//                 >
//                   {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
//                     <TouchableOpacity
//                       key={h}
//                       style={[styles.pickerItem, selectedHours === h && styles.pickerItemSelected]}
//                       onPress={() => setSelectedHours(h)}
//                     >
//                       <Text style={[styles.pickerText, selectedHours === h && styles.pickerTextSelected]}>
//                         {h}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>

//               <View style={styles.pickerColumn}>
//                 <Text style={styles.pickerLabelTop}>mins</Text>
//                 <ScrollView 
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={styles.pickerScroll}
//                 >
//                   {[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
//                     <TouchableOpacity
//                       key={m}
//                       style={[styles.pickerItem, selectedMins === m && styles.pickerItemSelected]}
//                       onPress={() => setSelectedMins(m)}
//                     >
//                       <Text style={[styles.pickerText, selectedMins === m && styles.pickerTextSelected]}>
//                         {m}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>
//             </View>

//             <View style={styles.pickerButtons}>
//               <TouchableOpacity 
//                 style={styles.cancelBtn} 
//                 onPress={() => setShowDurationPicker(false)}
//               >
//                 <Text style={styles.cancelBtnText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={styles.setBtn} 
//                 onPress={setDuration}
//               >
//                 <Text style={styles.setBtnText}>Start Timer</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Break Options Modal */}
//       <Modal visible={showBreakOptions} animationType="fade" transparent={true}>
//         <TouchableOpacity 
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setShowBreakOptions(false)}
//         >
//           <View style={styles.breakModal}>
//             <Text style={styles.breakModalTitle}>Take a Break</Text>
//             <TouchableOpacity 
//               style={styles.breakOptionBtn}
//               onPress={() => takeBreak(300)}
//             >
//               <Text style={styles.breakOptionText}>☕ Short Break</Text>
//               <Text style={styles.breakOptionTime}>5 minutes</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.breakOptionBtn}
//               onPress={() => takeBreak(900)}
//             >
//               <Text style={styles.breakOptionText}>🌙 Long Break</Text>
//               <Text style={styles.breakOptionTime}>15 minutes</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* History Modal */}
//       <Modal visible={showHistory} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.historyModal}>
//             <View style={styles.historyHeader}>
//               <Text style={styles.historyTitle}>History</Text>
//               <TouchableOpacity onPress={() => setShowHistory(false)}>
//                 <Text style={styles.closeBtn}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={sessions}
//               renderItem={renderSession}
//               keyExtractor={item => item.id?.toString()}
//               style={styles.sessionList}
//               ListEmptyComponent={
//                 <Text style={styles.emptyText}>No sessions yet</Text>
//               }
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
//   headerTitle: { color: '#fff', fontSize: 28, fontWeight: '600' },
//   headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   focusBadge: { backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
//   focusText: { color: '#888', fontSize: 13 },
//   historyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
//   historyIcon: { fontSize: 18 },
//   timerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
//   timerWrapper: { position: 'relative', width: 240, height: 240, marginBottom: 40 },
//   fullCircle: { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 3, borderColor: '#1a1a1a' },
//   progressRing: { position: 'absolute', width: 240, height: 240, borderRadius: 120, overflow: 'hidden' },
//   progressFill: { position: 'absolute', width: '100%', height: '100%', borderRadius: 120, borderWidth: 3, borderColor: '#fff', borderRightColor: 'transparent', borderBottomColor: 'transparent' },
//   timerInner: { position: 'absolute', width: 240, height: 240, borderRadius: 120, justifyContent: 'center', alignItems: 'center' },
//   timerText: { color: '#fff', fontSize: 42, fontWeight: '300', letterSpacing: 2 },
//   breakLabel: { color: '#888', fontSize: 13, marginTop: 8 },
//   tapToStart: { color: '#555', fontSize: 13, marginTop: 8 },
//   modeToggle: { flexDirection: 'row', backgroundColor: '#1a1a1a', borderRadius: 20, padding: 3 },
//   modeBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 17 },
//   modeBtnActive: { backgroundColor: '#fff' },
//   modeBtnText: { color: '#888', fontSize: 14, fontWeight: '500' },
//   modeBtnTextActive: { color: '#000' },
//   controls: { paddingHorizontal: 24, paddingBottom: 40 },
//   startBtn: { backgroundColor: '#fff', padding: 16, borderRadius: 24, alignItems: 'center' },
//   startBtnText: { color: '#000', fontSize: 16, fontWeight: '600' },
//   runningControls: { flexDirection: 'row', gap: 12 },
//   breakBtn: { flex: 1, backgroundColor: '#1a1a1a', padding: 16, borderRadius: 24, alignItems: 'center' },
//   breakBtnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
//   stopBtn: { flex: 1, backgroundColor: '#1a1a1a', padding: 16, borderRadius: 24, alignItems: 'center' },
//   stopBtnFull: { flex: 1 },
//   stopBtnText: { color: '#ff4444', fontSize: 15, fontWeight: '500' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
//   pickerModal: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, width: '80%', maxWidth: 300 },
//   pickerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
//   pickerContainer: { flexDirection: 'row', justifyContent: 'center', gap: 30, height: 180, marginBottom: 20 },
//   pickerColumn: { alignItems: 'center', width: 70 },
//   pickerLabelTop: { color: '#888', fontSize: 12, marginBottom: 10 },
//   pickerScroll: { alignItems: 'center', paddingVertical: 10 },
//   pickerItem: { padding: 8, minWidth: 50, alignItems: 'center', borderRadius: 8, marginVertical: 2 },
//   pickerItemSelected: { backgroundColor: '#fff' },
//   pickerText: { color: '#666', fontSize: 16 },
//   pickerTextSelected: { color: '#000', fontWeight: '600' },
//   pickerButtons: { flexDirection: 'row', gap: 10 },
//   cancelBtn: { flex: 1, padding: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#0a0a0a' },
//   cancelBtnText: { color: '#888', fontSize: 14, fontWeight: '500' },
//   setBtn: { flex: 2, padding: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#fff' },
//   setBtnText: { color: '#000', fontSize: 14, fontWeight: '600' },
//   breakModal: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 24, width: '80%', maxWidth: 300 },
//   breakModalTitle: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
//   breakOptionBtn: { backgroundColor: '#0a0a0a', padding: 16, borderRadius: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   breakOptionText: { color: '#fff', fontSize: 15, fontWeight: '500' },
//   breakOptionTime: { color: '#888', fontSize: 13 },
//   historyModal: { backgroundColor: '#1a1a1a', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 40, maxHeight: '80%', width: '100%', position: 'absolute', bottom: 0 },
//   historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   historyTitle: { color: '#fff', fontSize: 22, fontWeight: '600' },
//   closeBtn: { color: '#888', fontSize: 28, fontWeight: '300' },
//   sessionList: {},
//   sessionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a0a0a', padding: 16, borderRadius: 16, marginBottom: 8 },
//   sessionLeft: { flex: 1 },
//   sessionDate: { color: '#888', fontSize: 14 },
//   sessionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   sessionDuration: { color: '#fff', fontSize: 15, fontWeight: '500' },
//   completedBadge: { color: '#4cd964', fontSize: 16 },
//   emptyText: { color: '#555', textAlign: 'center', marginTop: 40, fontSize: 14 },
// });

// // Add display name for better debugging
// FocusTimer.displayName = 'FocusTimer';

// export default FocusTimer;



import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  FlatList,
  StatusBar,
  AppState,
  Platform,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { createFocusSession, getAllFocusSessions } from '../services/focusApi';
import { useFocusEffect } from '@react-navigation/native';

const FocusTimer = ({ navigation, route }) => {
  const [mode, setMode] = useState('timer');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showBreakOptions, setShowBreakOptions] = useState(false);
  
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMins, setSelectedMins] = useState(25);
  
  const [sessions, setSessions] = useState([]);
  const [focusTime, setFocusTime] = useState('0h 0m');
  
  const intervalRef = useRef(null);
  const notificationUpdateRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const backgroundStartTime = useRef(null);
  const notificationId = useRef(null);
  const sessionStartTime = useRef(null);
  const lastKnownTime = useRef(null);
  const isInBackground = useRef(false);
  const timerCompletionHandled = useRef(false);

  // Store current time for notification updates
  const currentTimeRef = useRef(0);
  
  // Update ref whenever timeLeft changes
  useEffect(() => {
    currentTimeRef.current = timeLeft;
  }, [timeLeft]);

  // ===== NOTIFICATION SETUP =====
  useEffect(() => {
    setupNotifications();
    
    return () => {
      if (notificationId.current) {
        notifee.cancelNotification(notificationId.current);
      }
      if (notificationUpdateRef.current) {
        clearInterval(notificationUpdateRef.current);
      }
    };
  }, []);

  const setupNotifications = async () => {
    try {
      // Request permissions (iOS)
      if (Platform.OS === 'ios') {
        await notifee.requestPermission();
      }

      // Create notification channel (Android)
      await notifee.createChannel({
        id: 'focus-timer',
        name: 'Focus Timer',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });

      // Handle notification actions
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.DISMISSED) {
          console.log('Notification dismissed');
        }
      });
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  // ===== APP STATE CHANGE (Background/Foreground) =====
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('AppState changed:', appState.current, '->', nextAppState);
      console.log('Current state - isRunning:', isRunning, 'isBreak:', isBreak, 'timeLeft:', timeLeft);
      
      // Coming to foreground
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App came to foreground');
        isInBackground.current = false;
        
        if (isRunning && backgroundStartTime.current) {
          const elapsed = Math.floor((Date.now() - backgroundStartTime.current) / 1000);
          console.log('Time elapsed in background:', elapsed, 'seconds');
          
          if (mode === 'timer' || isBreak) {
            // Countdown mode
            setTimeLeft(prev => {
              const newTime = Math.max(0, prev - elapsed);
              console.log('Timer updated from', prev, 'to', newTime);
              
              // If time completed during background
              if (newTime <= 0 && prev > 0 && !timerCompletionHandled.current) {
                console.log('Timer completed while in background!');
                timerCompletionHandled.current = true;
                setTimeout(() => {
                  handleTimerComplete();
                  timerCompletionHandled.current = false;
                }, 100);
              }
              
              return newTime;
            });
          } else {
            // Stopwatch mode
            setTimeLeft(prev => {
              const newTime = prev + elapsed;
              console.log('Stopwatch updated from', prev, 'to', newTime);
              return newTime;
            });
          }
          
          backgroundStartTime.current = null;
        }
        
        // Cancel notification when app opens
        if (notificationId.current) {
          notifee.cancelNotification(notificationId.current).catch(err => 
            console.error('Error canceling notification:', err)
          );
          notificationId.current = null;
        }
        
        // Stop notification updates
        if (notificationUpdateRef.current) {
          clearInterval(notificationUpdateRef.current);
          notificationUpdateRef.current = null;
        }
      } 
      // Going to background
      else if (nextAppState.match(/inactive|background/)) {
        console.log('App went to background');
        isInBackground.current = true;
        
        if (isRunning) {
          backgroundStartTime.current = Date.now();
          lastKnownTime.current = timeLeft;
          startOngoingNotification();
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isRunning, mode, timeLeft, isBreak]);

  // ===== START ONGOING NOTIFICATION WITH LIVE UPDATES =====
  const startOngoingNotification = async () => {
    console.log('Starting ongoing notification');
    
    try {
      // Initial notification with current time
      await updateOngoingNotification();
      
      // Clear any existing interval
      if (notificationUpdateRef.current) {
        clearInterval(notificationUpdateRef.current);
      }
    } catch (error) {
      console.error('Error starting notification:', error);
    }
  };

  // ===== UPDATE ONGOING NOTIFICATION =====
  const updateOngoingNotification = async () => {
    try {
      const currentTime = lastKnownTime.current || currentTimeRef.current;
      const formattedTime = formatTime(currentTime);
      const currentProgress = mode === 'timer' && initialTime > 0 
        ? Math.round(((initialTime - currentTime) / initialTime) * 100) 
        : 0;
      
      const notificationTitle = isBreak 
        ? `🌙 Break - ${formattedTime} remaining` 
        : `🎯 Focus - ${formattedTime} ${mode === 'timer' ? 'remaining' : 'elapsed'}`;
      
      const notificationBody = isBreak
        ? 'Take a rest, you deserve it!'
        : mode === 'timer' 
          ? `${currentProgress}% complete • Stay focused!` 
          : 'Keep going strong!';
      
      await notifee.displayNotification({
        id: 'focus-timer-ongoing',
        title: notificationTitle,
        body: notificationBody,
        android: {
          channelId: 'focus-timer',
          ongoing: true,
          autoCancel: false,
          importance: AndroidImportance.HIGH,
          onlyAlertOnce: true,
          smallIcon: 'ic_launcher',
          color: isBreak ? '#FFA500' : '#4CAF50',
          pressAction: {
            id: 'default',
          },
          progress: (mode === 'timer' || isBreak) && initialTime > 0 ? {
            max: isBreak ? (pausedTime > 0 ? 900 : 300) : initialTime,
            current: isBreak ? ((pausedTime > 0 ? 900 : 300) - currentTime) : (initialTime - currentTime),
            indeterminate: false,
          } : undefined,
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  // ===== COMPLETION NOTIFICATION =====
  const showCompletionNotification = async (duration) => {
    const hrs = Math.floor(duration / 3600);
    const mins = Math.floor((duration % 3600) / 60);
    const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    
    try {
      await notifee.displayNotification({
        id: 'focus-completion',
        title: '🎉 Congratulations!',
        body: `You focused for ${timeStr}! Great work!`,
        android: {
          channelId: 'focus-timer',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          vibrationPattern: [300, 500],
          autoCancel: true,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('Error showing completion notification:', error);
    }
  };

  // ===== BREAK NOTIFICATION =====
  const showBreakNotification = async (duration, isComplete = false) => {
    try {
      await notifee.displayNotification({
        title: isComplete ? '☕ Break Complete!' : '☕ Break Started',
        body: isComplete ? 'Time to get back to work!' : `${duration / 60} minute break in progress`,
        android: {
          channelId: 'focus-timer',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          autoCancel: isComplete,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('Error showing break notification:', error);
    }
  };

  // ===== CALCULATE STATS =====
  const calculateStats = (sessionList) => {
    const today = new Date().toDateString();
    const todaySessions = sessionList.filter(s => 
      new Date(s.created_at).toDateString() === today
    );
    
    const totalFocus = todaySessions.reduce((acc, s) => acc + s.duration, 0);
    const hrs = Math.floor(totalFocus / 3600);
    const mins = Math.floor((totalFocus % 3600) / 60);
    setFocusTime(`${hrs}h ${mins}m`);
  };

  // ===== FETCH SESSIONS =====
  const fetchSessions = useCallback(async () => {
    try {
      const response = await getAllFocusSessions();
      console.log('Fetched sessions response:', response);
      if (response.success && response.data) {
        setSessions(response.data);
        calculateStats(response.data);
      }
    } catch (e) {
      console.error('Error loading sessions:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [fetchSessions])
  );

  // ===== SAVE SESSION TO DB =====
  const saveSessionToDb = async (newSession) => {
    if (newSession.duration < 120) {
      console.log(`Session ${newSession.duration}s is less than 2 min. Not saved.`);
      return;
    }

    try {
      console.log('Saving session to DB:', newSession);
      const response = await createFocusSession(newSession);
      console.log('Save session response:', response);
      
      if (response.success && response.data) {
        const updatedList = [response.data, ...sessions];
        setSessions(updatedList);
        calculateStats(updatedList);
        console.log('Session saved successfully!');
      } else {
        console.error('Session save failed:', response);
      }
    } catch (e) {
      console.error('Error saving session to DB:', e);
    }
  };

  // ===== BACKGROUND TIMER LOGIC =====
  useEffect(() => {
    if (isRunning) {
      // Set background start time if in background
      if (isInBackground.current && !backgroundStartTime.current) {
        backgroundStartTime.current = Date.now();
      }
      
      BackgroundTimer.runBackgroundTimer(() => {
        if (mode === 'timer' || isBreak) {
          // Timer and break countdown
          setTimeLeft(prev => {
            const newTime = Math.max(0, prev - 1);
            lastKnownTime.current = newTime;
            
            // Update notification in background every 2 seconds (reduce overhead)
            if (isInBackground.current && newTime % 2 === 0) {
              updateOngoingNotification();
            }
            
            // Check for completion
            if (newTime <= 0 && prev > 0 && !timerCompletionHandled.current) {
              timerCompletionHandled.current = true;
              handleTimerComplete();
            }
            
            return newTime;
          });
        } else {
          // Stopwatch count up
          setTimeLeft(prev => {
            const newTime = prev + 1;
            lastKnownTime.current = newTime;
            
            // Update notification in background every 2 seconds
            if (isInBackground.current && newTime % 2 === 0) {
              updateOngoingNotification();
            }
            
            return newTime;
          });
        }
      }, 1000);
    } else {
      BackgroundTimer.stopBackgroundTimer();
      backgroundStartTime.current = null;
      lastKnownTime.current = null;
    }

    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [isRunning, mode, isBreak]);

  // ===== TIMER COMPLETE =====
  const handleTimerComplete = async () => {
    console.log('Timer completed! isBreak:', isBreak);
    
    // Prevent multiple calls
    if (timerCompletionHandled.current && !isBreak) {
      return;
    }
    
    // Stop notification updates
    if (notificationUpdateRef.current) {
      clearInterval(notificationUpdateRef.current);
      notificationUpdateRef.current = null;
    }
    
    // Cancel ongoing notification
    if (notificationId.current) {
      await notifee.cancelNotification(notificationId.current).catch(err => 
        console.error('Error canceling notification:', err)
      );
      notificationId.current = null;
    }
    
    if (isBreak) {
      // Break complete - resume main timer
      console.log('Break completed! Resuming timer with:', pausedTime, 'seconds');
      await showBreakNotification(0, true);
      
      setIsBreak(false);
      setTimeLeft(pausedTime);
      setIsRunning(true);
      timerCompletionHandled.current = false;
      
      // Restart notification if in background
      if (isInBackground.current) {
        setTimeout(() => {
          startOngoingNotification();
        }, 500);
      }
    } else if (mode === 'timer') {
      // Main timer complete
      const elapsed = initialTime;
      
      // Stop the timer first
      setIsRunning(false);
      BackgroundTimer.stopBackgroundTimer();
      
      // Show completion notification (works in background too!)
      await showCompletionNotification(elapsed);
      
      const newSession = {
        duration: elapsed,
        mode: mode,
        completed: true,
      };
      await saveSessionToDb(newSession);
      
      setTimeLeft(0);
      setInitialTime(0);
      timerCompletionHandled.current = false;
    } else {
      setTimeLeft(0);
      setInitialTime(0);
      timerCompletionHandled.current = false;
    }
  };

  // ===== START FOCUS =====
  const startFocus = () => {
    if (timeLeft === 0 && mode === 'timer') {
      setShowDurationPicker(true);
      return;
    }
    if (mode === 'stopwatch' && timeLeft === 0) {
      setInitialTime(0);
    }
    
    sessionStartTime.current = Date.now();
    timerCompletionHandled.current = false;
    setIsRunning(true);
    
    // Start notification if app is in background
    if (AppState.currentState !== 'active') {
      startOngoingNotification();
    }
  };

  // ===== STOP FOCUS =====
  const stopFocus = async () => {
    console.log('Stopping focus...');
    setIsRunning(false);
    BackgroundTimer.stopBackgroundTimer();
    
    // Stop notification updates
    if (notificationUpdateRef.current) {
      clearInterval(notificationUpdateRef.current);
      notificationUpdateRef.current = null;
    }
    
    // Cancel ongoing notification
    if (notificationId.current) {
      await notifee.cancelNotification(notificationId.current).catch(err => 
        console.error('Error canceling notification:', err)
      );
      notificationId.current = null;
    }
    
    if (!isBreak && (timeLeft > 0 || initialTime > 0)) {
      const elapsed = (mode === 'timer') ? (initialTime - timeLeft) : timeLeft;
      
      if (elapsed > 0) {
        await showCompletionNotification(elapsed);
        
        const newSession = {
          duration: elapsed,
          mode: mode,
          completed: mode === 'stopwatch' || timeLeft === 0,
        };
        await saveSessionToDb(newSession);
      }
    }
    
    setTimeLeft(0);
    setInitialTime(0);
    setIsBreak(false);
    setPausedTime(0);
    backgroundStartTime.current = null;
    sessionStartTime.current = null;
    lastKnownTime.current = null;
    isInBackground.current = false;
    timerCompletionHandled.current = false;
  };

  // ===== TAKE BREAK =====
  const takeBreak = async (duration) => {
    console.log('Taking break for', duration, 'seconds. Current time:', timeLeft);
    
    // Save current timer state
    setPausedTime(timeLeft);
    
    // Cancel current notification
    if (notificationId.current) {
      await notifee.cancelNotification(notificationId.current).catch(err => 
        console.error('Error canceling notification:', err)
      );
      notificationId.current = null;
    }
    
    // Set break timer
    setTimeLeft(duration);
    setIsBreak(true);
    setIsRunning(true);
    setShowBreakOptions(false);
    timerCompletionHandled.current = false;
    
    // Reset background tracking
    backgroundStartTime.current = Date.now();
    lastKnownTime.current = duration;
    
    // Show break notification
    await showBreakNotification(duration, false);
    
    // If in background, start notification updates
    if (isInBackground.current) {
      startOngoingNotification();
    }
  };

  // ===== FORMAT TIME =====
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ===== SET DURATION =====
  const setDuration = () => {
    const totalSecs = selectedHours * 3600 + selectedMins * 60;
    if (totalSecs === 0) return;
    
    setInitialTime(totalSecs);
    setTimeLeft(totalSecs);
    setShowDurationPicker(false);
    sessionStartTime.current = Date.now();
    timerCompletionHandled.current = false;
    setIsRunning(true);
  };

  // ===== RENDER SESSION =====
  const renderSession = ({ item }) => {
    const date = new Date(item.created_at);
    const hrs = Math.floor(item.duration / 3600);
    const mins = Math.floor((item.duration % 3600) / 60);
    
    return (
      <View style={styles.sessionItem}>
        <View style={styles.sessionLeft}>
          <Text style={styles.sessionDate}>
            {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.sessionRight}>
          <Text style={styles.sessionDuration}>
            {hrs > 0 ? `${hrs}h ` : ''}{mins}m
          </Text>
          {item.completed && <Text style={styles.completedBadge}>✓</Text>}
        </View>
      </View>
    );
  };

  const progress = initialTime > 0 && mode === 'timer' ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Focus</Text>
        <View style={styles.headerRight}>
          <View style={styles.focusBadge}>
            <Text style={styles.focusText}>{focusTime}</Text>
          </View>
          <TouchableOpacity 
            style={styles.historyBtn}
            onPress={() => setShowHistory(true)}
          >
            <Text style={styles.historyIcon}>📊</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <TouchableOpacity 
          style={styles.timerWrapper}
          onPress={() => !isRunning && timeLeft === 0 && mode === 'timer' && setShowDurationPicker(true)}
          activeOpacity={isRunning ? 1 : 0.8}
          disabled={isRunning}
        >
          <View style={styles.fullCircle} />
          
          {mode === 'timer' && initialTime > 0 && (
            <View style={styles.progressRing}>
              <View style={[styles.progressFill, { 
                transform: [{ rotate: `${(progress * 3.6)}deg` }] 
              }]} />
            </View>
          )}
          
          <View style={styles.timerInner}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            {isBreak && <Text style={styles.breakLabel}>Break Time</Text>}
            {!isBreak && timeLeft === 0 && mode === 'timer' && !isRunning && (
              <Text style={styles.tapToStart}>Tap to set timer</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'timer' && styles.modeBtnActive]}
            onPress={() => {
              if (!isRunning) {
                setMode('timer');
                setTimeLeft(0);
                setInitialTime(0);
              }
            }}
            disabled={isRunning}
          >
            <Text style={[styles.modeBtnText, mode === 'timer' && styles.modeBtnTextActive]}>
              Timer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'stopwatch' && styles.modeBtnActive]}
            onPress={() => {
              if (!isRunning) {
                setMode('stopwatch');
                setTimeLeft(0);
                setInitialTime(0);
              }
            }}
            disabled={isRunning}
          >
            <Text style={[styles.modeBtnText, mode === 'stopwatch' && styles.modeBtnTextActive]}>
              Stopwatch
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity 
            style={styles.startBtn} 
            onPress={startFocus}
          >
            <Text style={styles.startBtnText}>
              {timeLeft === 0 && mode === 'timer' ? 'Set Timer' : 'Start'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.runningControls}>
            {!isBreak && (
              <TouchableOpacity 
                style={styles.breakBtn} 
                onPress={() => setShowBreakOptions(true)}
              >
                <Text style={styles.breakBtnText}>☕ Break</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.stopBtn, isBreak && styles.stopBtnFull]} 
              onPress={stopFocus}
            >
              <Text style={styles.stopBtnText}>■ Stop</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Duration Picker Modal */}
      <Modal visible={showDurationPicker} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Set Focus Time</Text>
            
            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabelTop}>hours</Text>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pickerScroll}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                    <TouchableOpacity
                      key={h}
                      style={[styles.pickerItem, selectedHours === h && styles.pickerItemSelected]}
                      onPress={() => setSelectedHours(h)}
                    >
                      <Text style={[styles.pickerText, selectedHours === h && styles.pickerTextSelected]}>
                        {h}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabelTop}>mins</Text>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pickerScroll}
                >
                  {[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.pickerItem, selectedMins === m && styles.pickerItemSelected]}
                      onPress={() => setSelectedMins(m)}
                    >
                      <Text style={[styles.pickerText, selectedMins === m && styles.pickerTextSelected]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.pickerButtons}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setShowDurationPicker(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.setBtn} 
                onPress={setDuration}
              >
                <Text style={styles.setBtnText}>Start Timer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Break Options Modal */}
      <Modal visible={showBreakOptions} animationType="fade" transparent={true}>
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBreakOptions(false)}
        >
          <View style={styles.breakModal}>
            <Text style={styles.breakModalTitle}>Take a Break</Text>
            <TouchableOpacity 
              style={styles.breakOptionBtn}
              onPress={() => takeBreak(300)}
            >
              <Text style={styles.breakOptionText}>☕ Short Break</Text>
              <Text style={styles.breakOptionTime}>5 minutes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.breakOptionBtn}
              onPress={() => takeBreak(900)}
            >
              <Text style={styles.breakOptionText}>🌙 Long Break</Text>
              <Text style={styles.breakOptionTime}>15 minutes</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* History Modal */}
      <Modal visible={showHistory} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.historyModal}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>History</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={sessions}
              renderItem={renderSession}
              keyExtractor={item => item.id?.toString()}
              style={styles.sessionList}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No sessions yet</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  focusBadge: { backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  focusText: { color: '#888', fontSize: 13 },
  historyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
  historyIcon: { fontSize: 18 },
  timerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  timerWrapper: { position: 'relative', width: 240, height: 240, marginBottom: 40 },
  fullCircle: { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 3, borderColor: '#1a1a1a' },
  progressRing: { position: 'absolute', width: 240, height: 240, borderRadius: 120, overflow: 'hidden' },
  progressFill: { position: 'absolute', width: '100%', height: '100%', borderRadius: 120, borderWidth: 3, borderColor: '#fff', borderRightColor: 'transparent', borderBottomColor: 'transparent' },
  timerInner: { position: 'absolute', width: 240, height: 240, borderRadius: 120, justifyContent: 'center', alignItems: 'center' },
  timerText: { color: '#fff', fontSize: 42, fontWeight: '300', letterSpacing: 2 },
  breakLabel: { color: '#888', fontSize: 13, marginTop: 8 },
  tapToStart: { color: '#555', fontSize: 13, marginTop: 8 },
  modeToggle: { flexDirection: 'row', backgroundColor: '#1a1a1a', borderRadius: 20, padding: 3 },
  modeBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 17 },
  modeBtnActive: { backgroundColor: '#fff' },
  modeBtnText: { color: '#888', fontSize: 14, fontWeight: '500' },
  modeBtnTextActive: { color: '#000' },
  controls: { paddingHorizontal: 24, paddingBottom: 40 },
  startBtn: { backgroundColor: '#fff', padding: 16, borderRadius: 24, alignItems: 'center' },
  startBtnText: { color: '#000', fontSize: 16, fontWeight: '600' },
  runningControls: { flexDirection: 'row', gap: 12 },
  breakBtn: { flex: 1, backgroundColor: '#1a1a1a', padding: 16, borderRadius: 24, alignItems: 'center' },
  breakBtnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  stopBtn: { flex: 1, backgroundColor: '#1a1a1a', padding: 16, borderRadius: 24, alignItems: 'center' },
  stopBtnFull: { flex: 1 },
  stopBtnText: { color: '#ff4444', fontSize: 15, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  pickerModal: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, width: '80%', maxWidth: 300 },
  pickerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  pickerContainer: { flexDirection: 'row', justifyContent: 'center', gap: 30, height: 180, marginBottom: 20 },
  pickerColumn: { alignItems: 'center', width: 70 },
  pickerLabelTop: { color: '#888', fontSize: 12, marginBottom: 10 },
  pickerScroll: { alignItems: 'center', paddingVertical: 10 },
  pickerItem: { padding: 8, minWidth: 50, alignItems: 'center', borderRadius: 8, marginVertical: 2 },
  pickerItemSelected: { backgroundColor: '#fff' },
  pickerText: { color: '#666', fontSize: 16 },
  pickerTextSelected: { color: '#000', fontWeight: '600' },
  pickerButtons: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, padding: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#0a0a0a' },
  cancelBtnText: { color: '#888', fontSize: 14, fontWeight: '500' },
  setBtn: { flex: 2, padding: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#fff' },
  setBtnText: { color: '#000', fontSize: 14, fontWeight: '600' },
  breakModal: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 24, width: '80%', maxWidth: 300 },
  breakModalTitle: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  breakOptionBtn: { backgroundColor: '#0a0a0a', padding: 16, borderRadius: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakOptionText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  breakOptionTime: { color: '#888', fontSize: 13 },
  historyModal: { backgroundColor: '#1a1a1a', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 40, maxHeight: '80%', width: '100%', position: 'absolute', bottom: 0 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  historyTitle: { color: '#fff', fontSize: 22, fontWeight: '600' },
  closeBtn: { color: '#888', fontSize: 28, fontWeight: '300' },
  sessionList: {},
  sessionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a0a0a', padding: 16, borderRadius: 16, marginBottom: 8 },
  sessionLeft: { flex: 1 },
  sessionDate: { color: '#888', fontSize: 14 },
  sessionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sessionDuration: { color: '#fff', fontSize: 15, fontWeight: '500' },
  completedBadge: { color: '#4cd964', fontSize: 16 },
  emptyText: { color: '#555', textAlign: 'center', marginTop: 40, fontSize: 14 },
});

// Add display name for better debugging
FocusTimer.displayName = 'FocusTimer';

export default FocusTimer;