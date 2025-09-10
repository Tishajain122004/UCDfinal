import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function FocusTimer() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessionType, setSessionType] = useState("focus");
  const [currentSubject, setCurrentSubject] = useState("");
  const [sessionCount, setSessionCount] = useState(0);

  const intervalRef = useRef(null);
  const originalTime = useRef(25 * 60);

  const timerPresets = {
    focus: { duration: 25 * 60, label: "Focus Session" },
    shortBreak: { duration: 5 * 60, label: "Short Break" },
    longBreak: { duration: 15 * 60, label: "Long Break" }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused]);

  const handleSessionComplete = () => {
    setIsActive(false);
    setIsPaused(false);
    setSessionCount((prev) => prev + 1);

    if (sessionType === "focus") {
      if ((sessionCount + 1) % 4 === 0) {
        setSessionType("longBreak");
        setTimeLeft(timerPresets.longBreak.duration);
        originalTime.current = timerPresets.longBreak.duration;
      } else {
        setSessionType("shortBreak");
        setTimeLeft(timerPresets.shortBreak.duration);
        originalTime.current = timerPresets.shortBreak.duration;
      }
    } else {
      setSessionType("focus");
      setTimeLeft(timerPresets.focus.duration);
      originalTime.current = timerPresets.focus.duration;
    }

    Alert.alert("Session Complete!", `${timerPresets[sessionType].label} finished.`);
  };

  const startTimer = () => {
    if (!currentSubject && sessionType === "focus") {
      Alert.alert("Missing Subject", "Please enter a subject before starting!");
      return;
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => setIsPaused(!isPaused);

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(originalTime.current);
  };

  const changeSessionType = (type) => {
    if (!isActive) {
      setSessionType(type);
      setTimeLeft(timerPresets[type].duration);
      originalTime.current = timerPresets[type].duration;
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus Timer</Text>
      <Text style={styles.subtitle}>{timerPresets[sessionType].label}</Text>

      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

      {sessionType === "focus" && (
        <TextInput
          placeholder="What are you studying?"
          placeholderTextColor="#aaa"
          value={currentSubject}
          onChangeText={setCurrentSubject}
          style={styles.input}
          editable={!isActive}
        />
      )}

      <View style={styles.buttonRow}>
        {!isActive ? (
          <TouchableOpacity style={styles.buttonPrimary} onPress={startTimer}>
            <Icon name="play" size={20} color="white" />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttonSecondary} onPress={pauseTimer}>
            <Icon name={isPaused ? "play" : "pause"} size={20} color="white" />
            <Text style={styles.buttonText}>{isPaused ? "Resume" : "Pause"}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.buttonSecondary} onPress={resetTimer}>
          <Icon name="stop" size={20} color="white" />
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sessionRow}>
        {Object.keys(timerPresets).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.sessionButton,
              sessionType === type && styles.activeSession,
            ]}
            onPress={() => changeSessionType(type)}
            disabled={isActive}
          >
            <Text
              style={[
                styles.sessionText,
                sessionType === type && { color: "white" },
              ]}
            >
              {timerPresets[type].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.stats}>Sessions: {sessionCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // white background
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6A0DAD", // purple
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9c6ade", // soft purple
    textAlign: "center",
    marginBottom: 16,
  },
  timer: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#6A0DAD",
    textAlign: "center",
    marginVertical: 20,
  },
  input: {
    borderColor: "#d1b3e0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: "#333",
    marginBottom: 16,
    backgroundColor: "#f8f5fc", // light purple bg
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonPrimary: {
    flexDirection: "row",
    backgroundColor: "#6A0DAD",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 8,
    alignItems: "center",
    elevation: 3,
  },
  buttonSecondary: {
    flexDirection: "row",
    backgroundColor: "#9c6ade",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 8,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "bold",
  },
  sessionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  sessionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d1b3e0",
    borderRadius: 20,
    margin: 5,
    backgroundColor: "#fff",
  },
  activeSession: {
    backgroundColor: "#6A0DAD",
    borderColor: "#6A0DAD",
  },
  sessionText: {
    color: "#6A0DAD",
    fontWeight: "600",
  },
  stats: {
    color: "#6A0DAD",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
});

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import { AnimatedCircularProgress } from "react-native-circular-progress";
// import CircularProgress from 'react-native-circular-progress-indicator';

// export default function FocusTimer() {
//   const [isActive, setIsActive] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(25 * 60);
//   const [customMinutes, setCustomMinutes] = useState('25');
//   const [currentSubject, setCurrentSubject] = useState('');

//   const intervalRef = useRef(null);
//   const originalTime = useRef(25 * 60);

//   useEffect(() => {
//     if (isActive && !isPaused) {
//       intervalRef.current = setInterval(() => {
//         setTimeLeft(time => {
//           if (time <= 1) {
//             handleSessionComplete();
//             return 0;
//           }
//           return time - 1;
//         });
//       }, 1000);
//     } else {
//       clearInterval(intervalRef.current);
//     }

//     return () => clearInterval(intervalRef.current);
//   }, [isActive, isPaused]);

//   const handleSessionComplete = () => {
//     setIsActive(false);
//     setIsPaused(false);
//     Alert.alert('Session Complete!', 'Good job! 🎉');
//   };

//   const startTimer = () => {
//     if (!currentSubject) {
//       Alert.alert('Missing Subject', 'Please enter a subject before starting!');
//       return;
//     }
//     const minutes = parseInt(customMinutes);
//     if (isNaN(minutes) || minutes <= 0) {
//       Alert.alert('Invalid Time', 'Please enter a valid number of minutes.');
//       return;
//     }
//     setTimeLeft(minutes * 60);
//     originalTime.current = minutes * 60;
//     setIsActive(true);
//     setIsPaused(false);
//   };

//   const pauseTimer = () => setIsPaused(!isPaused);

//   const resetTimer = () => {
//     setIsActive(false);
//     setIsPaused(false);
//     setTimeLeft(originalTime.current);
//   };

//   const formatTime = seconds => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Focus Timer</Text>

//       {/* Circular Timer */}
//       <View style={styles.circleContainer}>
//         <CircularProgress
//           value={(timeLeft / originalTime.current) * 100}
//           radius={120}
//           duration={1000}
//           progressValueColor={'#6A0DAD'}
//           title={formatTime(timeLeft)}
//           titleColor={'#6A0DAD'}
//           titleStyle={{ fontSize: 32, fontWeight: 'bold' }}
//           activeStrokeColor="#6A0DAD"
//           inActiveStrokeColor="#d1b3e0"
//           inActiveStrokeOpacity={0.5}
//         />
//       </View>

//       {/* Subject Input */}
//       <TextInput
//         placeholder="What are you studying?"
//         placeholderTextColor="#aaa"
//         value={currentSubject}
//         onChangeText={setCurrentSubject}
//         style={styles.input}
//         editable={!isActive}
//       />

//       {/* Custom Time Input */}
//       <TextInput
//         placeholder="Enter minutes (e.g. 30)"
//         placeholderTextColor="#aaa"
//         keyboardType="numeric"
//         value={customMinutes}
//         onChangeText={setCustomMinutes}
//         style={styles.input}
//         editable={!isActive}
//       />

//       {/* Buttons */}
//       <View style={styles.buttonRow}>
//         {!isActive ? (
//           <TouchableOpacity style={styles.buttonPrimary} onPress={startTimer}>
//             <Icon name="play" size={20} color="white" />
//             <Text style={styles.buttonText}>Start</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity style={styles.buttonSecondary} onPress={pauseTimer}>
//             <Icon name={isPaused ? 'play' : 'pause'} size={20} color="white" />
//             <Text style={styles.buttonText}>
//               {isPaused ? 'Resume' : 'Pause'}
//             </Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity style={styles.buttonSecondary} onPress={resetTimer}>
//           <Icon name="stop" size={20} color="white" />
//           <Text style={styles.buttonText}>Reset</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#6A0DAD',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   circleContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   timer: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#6A0DAD',
//     textAlign: 'center',
//   },
//   input: {
//     borderColor: '#d1b3e0',
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 12,
//     color: '#333',
//     marginBottom: 12,
//     backgroundColor: '#f8f5fc',
//     textAlign: 'center',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 15,
//   },
//   buttonPrimary: {
//     flexDirection: 'row',
//     backgroundColor: '#6A0DAD',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginHorizontal: 8,
//     alignItems: 'center',
//     elevation: 3,
//   },
//   buttonSecondary: {
//     flexDirection: 'row',
//     backgroundColor: '#9c6ade',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginHorizontal: 8,
//     alignItems: 'center',
//     elevation: 2,
//   },
//   buttonText: {
//     color: 'white',
//     marginLeft: 6,
//     fontWeight: 'bold',
//   },
// });
