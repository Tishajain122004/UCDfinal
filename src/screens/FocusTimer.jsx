// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// export default function FocusTimer() {
//   const [isActive, setIsActive] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [customMinutes, setCustomMinutes] = useState("");
//   const [currentSubject, setCurrentSubject] = useState("");
//   const [startTime, setStartTime] = useState(null);
//   const [pausedTime, setPausedTime] = useState(0);

//   const originalTime = useRef(0);
//   const intervalRef = useRef(null);

//   const formatTime = (seconds) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   const startTimer = () => {
//     if (!currentSubject) {
//       Alert.alert("Missing Subject", "Please enter what you're focusing on!");
//       return;
//     }
//     const minutes = parseInt(customMinutes);
//     if (isNaN(minutes) || minutes <= 0) {
//       Alert.alert("Invalid Time", "Please enter valid minutes (greater than 0).");
//       return;
//     }

//     const duration = minutes * 60;
//     const now = Date.now();
//     setStartTime(now);
//     originalTime.current = duration;
//     setTimeLeft(duration);
//     setPausedTime(0);
//     setIsActive(true);
//     setIsPaused(false);
//   };

//   const pauseTimer = () => {
//     if (!isPaused) {
//       setPausedTime(Date.now());
//     } else {
//       const pausedDuration = Math.floor((Date.now() - pausedTime) / 1000);
//       setStartTime((prev) => prev + pausedDuration * 1000);
//     }
//     setIsPaused(!isPaused);
//   };

//   const resetTimer = () => {
//     setIsActive(false);
//     setIsPaused(false);
//     setTimeLeft(0);
//     setStartTime(null);
//   };

//   const handleSessionComplete = () => {
//     setIsActive(false);
//     setIsPaused(false);
//     Alert.alert("🎉 Session Complete!", "Time's up! Take a short break.");
//   };

//   useEffect(() => {
//     if (isActive && !isPaused) {
//       intervalRef.current = setInterval(() => {
//         const elapsed = Math.floor((Date.now() - startTime) / 1000);
//         const remaining = originalTime.current - elapsed;

//         if (remaining <= 0) {
//           clearInterval(intervalRef.current);
//           setTimeLeft(0);
//           handleSessionComplete();
//         } else {
//           setTimeLeft(remaining);
//         }
//       }, 1000);
//     } else {
//       clearInterval(intervalRef.current);
//     }

//     return () => clearInterval(intervalRef.current);
//   }, [isActive, isPaused, startTime]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Focus Timer</Text>

//       {/* Subject Input */}
//       <TextInput
//         placeholder="What are you studying?"
//         placeholderTextColor="#aaa"
//         value={currentSubject}
//         onChangeText={setCurrentSubject}
//         style={styles.input}
//         editable={!isActive}
//       />

//       {/* Time Input */}
//       <TextInput
//         placeholder="Enter time (minutes)"
//         placeholderTextColor="#aaa"
//         keyboardType="numeric"
//         value={customMinutes}
//         onChangeText={setCustomMinutes}
//         style={styles.input}
//         editable={!isActive}
//       />

//       {/* Timer */}
//       <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

//       {/* Buttons */}
//       <View style={styles.buttonRow}>
//         {!isActive ? (
//           <TouchableOpacity style={styles.buttonPrimary} onPress={startTimer}>
//             <Icon name="play" size={20} color="white" />
//             <Text style={styles.buttonText}>Start</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity style={styles.buttonSecondary} onPress={pauseTimer}>
//             <Icon name={isPaused ? "play" : "pause"} size={20} color="white" />
//             <Text style={styles.buttonText}>{isPaused ? "Resume" : "Pause"}</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity style={styles.buttonSecondary} onPress={resetTimer}>
//           <Icon name="stop" size={20} color="white" />
//           <Text style={styles.buttonText}>Reset</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Subject Display */}
//       {currentSubject ? (
//         <Text style={styles.subjectText}>🎯 Focus: {currentSubject}</Text>
//       ) : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9F7FF",
//     padding: 24,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#6A0DAD",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     borderColor: "#d1b3e0",
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 12,
//     color: "#333",
//     marginBottom: 12,
//     backgroundColor: "#f8f5fc",
//     textAlign: "center",
//   },
//   timer: {
//     fontSize: 56,
//     fontWeight: "700",
//     color: "#6A0DAD",
//     textAlign: "center",
//     marginVertical: 20,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 10,
//   },
//   buttonPrimary: {
//     flexDirection: "row",
//     backgroundColor: "#6A0DAD",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginHorizontal: 8,
//     alignItems: "center",
//     elevation: 3,
//   },
//   buttonSecondary: {
//     flexDirection: "row",
//     backgroundColor: "#9c6ade",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginHorizontal: 8,
//     alignItems: "center",
//     elevation: 2,
//   },
//   buttonText: {
//     color: "white",
//     marginLeft: 6,
//     fontWeight: "bold",
//   },
//   subjectText: {
//     textAlign: "center",
//     marginTop: 25,
//     fontSize: 16,
//     color: "#6A0DAD",
//     fontWeight: "600",
//   },
// });


import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FocusTimer() {
  const [seconds, setSeconds] = useState(300); // 5 mins default
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const intervalRef = useRef(null);

  // Format time as MM:SS
  const formatTime = (time) => {
    const m = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const s = (time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Timer logic
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            saveSession();
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(300);
  };

  // Save completed session
  const saveSession = async () => {
    const newSession = {
      id: Date.now().toString(),
      duration: formatTime(300 - seconds),
      date: new Date().toLocaleString(),
    };
    const updated = [newSession, ...history];
    setHistory(updated);
    await AsyncStorage.setItem("focusHistory", JSON.stringify(updated));
  };

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem("focusHistory");
    if (stored) setHistory(JSON.parse(stored));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/originals/3d/b9/9b/3db99b7a8e7e8e2d1d081899e9b52d23.jpg",
      }}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Focus Timer</Text>
        <TouchableOpacity onPress={() => setShowHistory(true)}>
          <Icon name="history" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Work</Text>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        {isActive ? (
          <>
            <TouchableOpacity style={styles.stopBtn} onPress={resetTimer}>
              <Text style={styles.btnText}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pauseBtn} onPress={toggleTimer}>
              <Text style={styles.btnText}>Pause</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.startBtn} onPress={toggleTimer}>
            <Text style={styles.btnText}>Start Focus Now</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* History Modal */}
      <Modal visible={showHistory} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Session History</Text>
            <TouchableOpacity onPress={() => setShowHistory(false)}>
              <Icon name="close" size={26} color="black" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>
                  ⏱ {item.duration} — {item.date}
                </Text>
              </View>
            )}
          />
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  timerContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  timerLabel: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 6,
  },
  timerText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  buttons: {
    width: "90%",
    alignItems: "center",
  },
  startBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  stopBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 10,
  },
  pauseBtn: {
    backgroundColor: "#f39c12",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  historyItem: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
  },
});
