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
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const FocusTimerApp = () => {
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

//   useEffect(() => {
//     loadSessions();
//   }, []);

//   useEffect(() => {
//     calculateStats();
//   }, [sessions]);

//   const loadSessions = async () => {
//     try {
//       const stored = await AsyncStorage.getItem('focus_sessions');
//       if (stored) {
//         setSessions(JSON.parse(stored));
//       }
//     } catch (e) {
//       console.error('Error loading sessions:', e);
//     }
//   };

//   const saveSessions = async (newSessions) => {
//     try {
//       await AsyncStorage.setItem('focus_sessions', JSON.stringify(newSessions));
//       setSessions(newSessions);
//     } catch (e) {
//       console.error('Error saving sessions:', e);
//     }
//   };

//   const calculateStats = () => {
//     const today = new Date().toDateString();
//     const todaySessions = sessions.filter(s => 
//       new Date(s.date).toDateString() === today
//     );
    
//     const totalFocus = todaySessions.reduce((acc, s) => acc + s.duration, 0);
//     const hrs = Math.floor(totalFocus / 3600);
//     const mins = Math.floor((totalFocus % 3600) / 60);
//     setFocusTime(`${hrs}h ${mins}m`);
//   };

//   useEffect(() => {
//     if (isRunning) {
//       intervalRef.current = setInterval(() => {
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
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     }
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [isRunning, mode]);

//   const handleTimerComplete = () => {
//     setIsRunning(false);
//     if (!isBreak && mode === 'timer') {
//       const elapsed = initialTime;
//       const newSession = {
//         id: Date.now().toString(),
//         date: new Date().toISOString(),
//         duration: elapsed,
//         mode: mode,
//         completed: true,
//       };
//       const updated = [newSession, ...sessions];
//       saveSessions(updated);
//     }
    
//     if (isBreak) {
//       // Resume timer after break
//       setTimeLeft(pausedTime);
//       setIsBreak(false);
//       setIsRunning(true);
//     } else {
//       setTimeLeft(0);
//       setInitialTime(0);
//     }
//   };

//   const startFocus = () => {
//     if (timeLeft === 0 && mode === 'timer') {
//       setShowDurationPicker(true);
//       return;
//     }
//     if (mode === 'stopwatch' && timeLeft === 0) {
//       setInitialTime(0);
//     }
//     setIsRunning(true);
//   };

//   const stopFocus = () => {
//     setIsRunning(false);
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
    
//     if (!isBreak && initialTime > 0) {
//       const elapsed = mode === 'timer' ? initialTime - timeLeft : timeLeft;
//       if (elapsed > 0) {
//         const newSession = {
//           id: Date.now().toString(),
//           date: new Date().toISOString(),
//           duration: elapsed,
//           mode: mode,
//           completed: mode === 'stopwatch' || timeLeft === 0,
//         };
//         const updated = [newSession, ...sessions];
//         saveSessions(updated);
//       }
//     }
    
//     setTimeLeft(0);
//     setInitialTime(0);
//     setIsBreak(false);
//     setPausedTime(0);
//   };

//   const takeBreak = (duration) => {
//     setPausedTime(timeLeft);
//     setTimeLeft(duration);
//     setIsBreak(true);
//     setIsRunning(true);
//     setShowBreakOptions(false);
//   };

//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
    
//     if (hrs > 0) {
//       return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     }
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const setDuration = () => {
//     const totalSecs = selectedHours * 3600 + selectedMins * 60;
//     if (totalSecs === 0) {
//       return;
//     }
//     setInitialTime(totalSecs);
//     setTimeLeft(totalSecs);
//     setShowDurationPicker(false);
//     setIsRunning(true);
//   };

//   const renderSession = ({ item }) => {
//     const date = new Date(item.date);
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
//           {/* Full Circle Border */}
//           <View style={styles.fullCircle} />
          
//           {/* Progress Ring */}
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
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingTop: 60,
//     paddingBottom: 20,
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 28,
//     fontWeight: '600',
//   },
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   focusBadge: {
//     backgroundColor: '#1a1a1a',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   focusText: {
//     color: '#888',
//     fontSize: 13,
//   },
//   historyBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#1a1a1a',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   historyIcon: {
//     fontSize: 18,
//   },
//   timerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   timerWrapper: {
//     position: 'relative',
//     width: 240,
//     height: 240,
//     marginBottom: 40,
//   },
//   fullCircle: {
//     position: 'absolute',
//     width: 240,
//     height: 240,
//     borderRadius: 120,
//     borderWidth: 3,
//     borderColor: '#1a1a1a',
//   },
//   progressRing: {
//     position: 'absolute',
//     width: 240,
//     height: 240,
//     borderRadius: 120,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     borderRadius: 120,
//     borderWidth: 3,
//     borderColor: '#fff',
//     borderRightColor: 'transparent',
//     borderBottomColor: 'transparent',
//   },
//   timerInner: {
//     position: 'absolute',
//     width: 240,
//     height: 240,
//     borderRadius: 120,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   timerText: {
//     color: '#fff',
//     fontSize: 42,
//     fontWeight: '300',
//     letterSpacing: 2,
//   },
//   breakLabel: {
//     color: '#888',
//     fontSize: 13,
//     marginTop: 8,
//   },
//   tapToStart: {
//     color: '#555',
//     fontSize: 13,
//     marginTop: 8,
//   },
//   modeToggle: {
//     flexDirection: 'row',
//     backgroundColor: '#1a1a1a',
//     borderRadius: 20,
//     padding: 3,
//   },
//   modeBtn: {
//     paddingHorizontal: 24,
//     paddingVertical: 8,
//     borderRadius: 17,
//   },
//   modeBtnActive: {
//     backgroundColor: '#fff',
//   },
//   modeBtnText: {
//     color: '#888',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   modeBtnTextActive: {
//     color: '#000',
//   },
//   controls: {
//     paddingHorizontal: 24,
//     paddingBottom: 40,
//   },
//   startBtn: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 24,
//     alignItems: 'center',
//   },
//   startBtnText: {
//     color: '#000',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   runningControls: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   breakBtn: {
//     flex: 1,
//     backgroundColor: '#1a1a1a',
//     padding: 16,
//     borderRadius: 24,
//     alignItems: 'center',
//   },
//   breakBtnText: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   stopBtn: {
//     flex: 1,
//     backgroundColor: '#1a1a1a',
//     padding: 16,
//     borderRadius: 24,
//     alignItems: 'center',
//   },
//   stopBtnFull: {
//     flex: 1,
//   },
//   stopBtnText: {
//     color: '#ff4444',
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pickerModal: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 20,
//     padding: 20,
//     width: '80%',
//     maxWidth: 300,
//   },
//   pickerTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   pickerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 30,
//     height: 180,
//     marginBottom: 20,
//   },
//   pickerColumn: {
//     alignItems: 'center',
//     width: 70,
//   },
//   pickerLabelTop: {
//     color: '#888',
//     fontSize: 12,
//     marginBottom: 10,
//   },
//   pickerScroll: {
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   pickerItem: {
//     padding: 8,
//     minWidth: 50,
//     alignItems: 'center',
//     borderRadius: 8,
//     marginVertical: 2,
//   },
//   pickerItemSelected: {
//     backgroundColor: '#fff',
//   },
//   pickerText: {
//     color: '#666',
//     fontSize: 16,
//   },
//   pickerTextSelected: {
//     color: '#000',
//     fontWeight: '600',
//   },
//   pickerButtons: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   cancelBtn: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 14,
//     alignItems: 'center',
//     backgroundColor: '#0a0a0a',
//   },
//   cancelBtnText: {
//     color: '#888',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   setBtn: {
//     flex: 2,
//     padding: 12,
//     borderRadius: 14,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   setBtnText: {
//     color: '#000',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   breakModal: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 20,
//     padding: 24,
//     width: '80%',
//     maxWidth: 300,
//   },
//   breakModalTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   breakOptionBtn: {
//     backgroundColor: '#0a0a0a',
//     padding: 16,
//     borderRadius: 14,
//     marginBottom: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   breakOptionText: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   breakOptionTime: {
//     color: '#888',
//     fontSize: 13,
//   },
//   historyModal: {
//     backgroundColor: '#1a1a1a',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingTop: 20,
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//     maxHeight: '80%',
//     width: '100%',
//     position: 'absolute',
//     bottom: 0,
//   },
//   historyHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   historyTitle: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: '600',
//   },
//   closeBtn: {
//     color: '#888',
//     fontSize: 28,
//     fontWeight: '300',
//   },
//   sessionList: {
//     flex: 1,
//   },
//   sessionItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#0a0a0a',
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 8,
//   },
//   sessionLeft: {
//     flex: 1,
//   },
//   sessionDate: {
//     color: '#888',
//     fontSize: 14,
//   },
//   sessionRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   sessionDuration: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   completedBadge: {
//     color: '#4cd964',
//     fontSize: 16,
//   },
//   emptyText: {
//     color: '#555',
//     textAlign: 'center',
//     marginTop: 40,
//     fontSize: 14,
//   },
// });

// export default FocusTimerApp;











import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  FlatList,
  StatusBar,
  // AsyncStorage ko hata diya gaya hai
} from 'react-native';
// API service ko import karein
import { createFocusSession, getAllFocusSessions } from '../services/focusApi'; 
import { useFocusEffect } from '@react-navigation/native'; // useFocusEffect zaroori hai

const FocusTimer = () => {
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
  
  const [sessions, setSessions] = useState([]); // Database se aayega
  const [focusTime, setFocusTime] = useState('0h 0m');
  
  const intervalRef = useRef(null);

  // AsyncStorage logic (loadSessions, saveSessions) hata diya gaya hai

  // (No change) Stats calculate karein
  const calculateStats = (sessionList) => {
    const today = new Date().toDateString();
    const todaySessions = sessionList.filter(s => 
      new Date(s.created_at).toDateString() === today // 'date' ko 'created_at' se replace kiya
    );
    
    const totalFocus = todaySessions.reduce((acc, s) => acc + s.duration, 0);
    const hrs = Math.floor(totalFocus / 3600);
    const mins = Math.floor((totalFocus % 3600) / 60);
    setFocusTime(`${hrs}h ${mins}m`);
  };

  // Naya Function: Database se sessions fetch karein
  const fetchSessions = async () => {
    try {
      const response = await getAllFocusSessions();
      if (response.success) {
        setSessions(response.data);
        calculateStats(response.data); // Stats ko naye data se calculate karein
      } else {
        console.error('Error fetching sessions:', response.error);
      }
    } catch (e) {
      console.error('Error loading sessions:', e);
    }
  };

  // Jab bhi screen focus mein aaye, sessions refresh karein
  useFocusEffect(
    React.useCallback(() => {
      fetchSessions();
    }, [])
  );

  // Naya Function: Session ko Database mein save karein
  const saveSessionToDb = async (newSession) => {
    // ===== YEH RAHI AAPKI 5 MINUTE WAALI CONDITION (Frontend par bhi) =====
    // 5 minutes = 300 seconds
    if (newSession.duration < 120) {
      console.log(`Session ${newSession.duration}s ka tha, 5 min se kam. Save nahi kiya.`);
      return; // 5 min se kam hai, save mat karo
    }
    // =============================================================

    try {
      const response = await createFocusSession(newSession);
      if (response.success && response.data) {
        // Session save ho gaya, ab local list ko update karein
        const updatedList = [response.data, ...sessions];
        setSessions(updatedList);
        calculateStats(updatedList); // Stats refresh karein
      } else {
        console.log(response.message); // "Session 5 minute se kam tha..."
      }
    } catch (e) {
      console.error('Error saving session to DB:', e);
    }
  };

  // (Timer logic... No changes)
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'timer') {
          setTimeLeft(prev => {
            if (prev <= 1) {
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        } else {
          setTimeLeft(prev => prev + 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  // handleTimerComplete (UPDATED)
  const handleTimerComplete = () => {
    setIsRunning(false);
    if (!isBreak && mode === 'timer') {
      const elapsed = initialTime;
      const newSession = {
        // id, date ab backend par banega
        duration: elapsed,
        mode: mode,
        completed: true,
      };
      // saveSessions(updated) ko naye function se replace karein
      saveSessionToDb(newSession); 
    }
    
    if (isBreak) {
      // Resume timer after break
      setTimeLeft(pausedTime);
      setIsBreak(false);
      setIsRunning(true);
    } else {
      setTimeLeft(0);
      setInitialTime(0);
    }
  };

  // startFocus (No change)
  const startFocus = () => {
    if (timeLeft === 0 && mode === 'timer') {
      setShowDurationPicker(true);
      return;
    }
    if (mode === 'stopwatch' && timeLeft === 0) {
      setInitialTime(0);
    }
    setIsRunning(true);
  };

  // stopFocus (UPDATED)
  const stopFocus = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (!isBreak && (timeLeft > 0 || initialTime > 0)) { // Thoda logic clean kiya
      const elapsed = (mode === 'timer') ? (initialTime - timeLeft) : timeLeft;
      
      if (elapsed > 0) { // Sirf tab save karein jab time chala ho
        const newSession = {
          duration: elapsed,
          mode: mode,
          completed: mode === 'stopwatch' || timeLeft === 0,
        };
        // saveSessions(updated) ko naye function se replace karein
        saveSessionToDb(newSession);
      }
    }
    
    setTimeLeft(0);
    setInitialTime(0);
    setIsBreak(false);
    setPausedTime(0);
  };

  // takeBreak (No change)
  const takeBreak = (duration) => {
    setPausedTime(timeLeft);
    setTimeLeft(duration);
    setIsBreak(true);
    setIsRunning(true);
    setShowBreakOptions(false);
  };

  // formatTime (No change)
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // setDuration (No change)
  const setDuration = () => {
    const totalSecs = selectedHours * 3600 + selectedMins * 60;
    if (totalSecs === 0) {
      return;
    }
    setInitialTime(totalSecs);
    setTimeLeft(totalSecs);
    setShowDurationPicker(false);
    setIsRunning(true);
  };

  // renderSession (UPDATED)
  const renderSession = ({ item }) => {
    const date = new Date(item.created_at); // 'date' ko 'created_at' se replace kiya
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

  // progress (No change)
  const progress = initialTime > 0 && mode === 'timer' ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  // ===== RETURN (JSX) - KOI CHANGE NAHI =====
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
          activeOpacity={0.8}
        >
          {/* Full Circle Border */}
          <View style={styles.fullCircle} />
          
          {/* Progress Ring */}
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
            {!isBreak && timeLeft === 0 && mode === 'timer' && (
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
              onPress={() => takeBreak(120)} // 5 min
            >
              <Text style={styles.breakOptionText}>☕ Short Break</Text>
              <Text style={styles.breakOptionTime}>5 minutes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.breakOptionBtn}
              onPress={() => takeBreak(900)} // 15 min
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
              keyExtractor={item => item.id}
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

// ===== STYLES (KOI CHANGE NAHI) =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  focusBadge: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  focusText: {
    color: '#888',
    fontSize: 13,
  },
  historyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyIcon: {
    fontSize: 18,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  timerWrapper: {
    position: 'relative',
    width: 240,
    height: 240,
    marginBottom: 40,
  },
  fullCircle: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 3,
    borderColor: '#1a1a1a',
  },
  progressRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 120,
    borderWidth: 3,
    borderColor: '#fff',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timerInner: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '300',
    letterSpacing: 2,
  },
  breakLabel: {
    color: '#888',
    fontSize: 13,
    marginTop: 8,
  },
  tapToStart: {
    color: '#555',
    fontSize: 13,
    marginTop: 8,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 3,
  },
  modeBtn: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 17,
  },
  modeBtnActive: {
    backgroundColor: '#fff',
  },
  modeBtnText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  modeBtnTextActive: {
    color: '#000',
  },
  controls: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  startBtn: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  runningControls: {
    flexDirection: 'row',
    gap: 12,
  },
  breakBtn: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  breakBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  stopBtn: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  stopBtnFull: {
    flex: 1,
  },
  stopBtnText: {
    color: '#ff4444',
    fontSize: 15,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  pickerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    height: 180,
    marginBottom: 20,
  },
  pickerColumn: {
    alignItems: 'center',
    width: 70,
  },
  pickerLabelTop: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
  },
  pickerScroll: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  pickerItem: {
    padding: 8,
    minWidth: 50,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: '#fff',
  },
  pickerText: {
    color: '#666',
    fontSize: 16,
  },
  pickerTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  pickerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  cancelBtnText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  setBtn: {
    flex: 2,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  setBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  breakModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  breakModalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  breakOptionBtn: {
    backgroundColor: '#0a0a0a',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakOptionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  breakOptionTime: {
    color: '#888',
    fontSize: 13,
  },
  historyModal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  closeBtn: {
    color: '#888',
    fontSize: 28,
    fontWeight: '300',
  },
  sessionList: {
    // History modal ki list ke liye thodi height set karein (optional)
    // height: 300 
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  sessionLeft: {
    flex: 1,
  },
  sessionDate: {
    color: '#888',
    fontSize: 14,
  },
  sessionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionDuration: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  completedBadge: {
    color: '#4cd964',
    fontSize: 16,
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});


export default FocusTimer;