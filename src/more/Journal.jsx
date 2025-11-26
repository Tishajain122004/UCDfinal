// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Modal,
//   TextInput,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// export default function Journal() {
//   const navigation = useNavigation();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [newEntry, setNewEntry] = useState("");
//   const [gratefulText, setGratefulText] = useState("");
//   const [accomplishedText, setAccomplishedText] = useState("");

//   const [journals, setJournals] = useState([
//     {
//       id: 1,
//       title: "Amazing Study Session Today",
//       date: "Sunday, August 24, 2025",
//       content:
//         "Had such a productive day! Finally understood the calculus concepts that were giving me trouble. The Pomodoro technique...",
//       grateful: "My study group for helping me understand derivatives",
//       accomplished: "Completed 3 chapters of calculus and all practice problems",
//       mood: "😊",
//       tag: "amazing",
//     },
//   ]);

//   const handleSaveEntry = () => {
//     if (newEntry.trim() === "") return;
//     const newJournal = {
//       id: journals.length + 1,
//       title: "New Journal Entry",
//       date: new Date().toDateString(),
//       content: newEntry,
//       grateful: gratefulText.trim() || "—",
//       accomplished: accomplishedText.trim() || "—",
//       mood: "📝",
//       tag: "new",
//     };
//     setJournals([newJournal, ...journals]);
//     setNewEntry("");
//     setGratefulText("");
//     setAccomplishedText("");
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>My Journal</Text>
//         <View style={{ width: 50 }} />
//       </View>

//       <Text style={styles.subHeader}>Reflect, grow, and track your journey</Text>

//       {/* Buttons */}

//       <TouchableOpacity
//         style={styles.newEntryButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.newEntryText}>＋ New Entry</Text>
//       </TouchableOpacity>

//       {/* Recent Journals */}
//       <ScrollView style={styles.journalList}>
//         {journals.slice(0, 3).map((journal) => (
//           <View key={journal.id} style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.cardTitle}>{journal.title}</Text>
//               <Text style={styles.mood}>{journal.mood}</Text>
//               <View style={styles.tag}>
//                 <Text style={styles.tagText}>{journal.tag}</Text>
//               </View>
//             </View>
//             <Text style={styles.cardDate}>{journal.date}</Text>
//             <Text style={styles.cardContent}>{journal.content}</Text>
//             <Text style={styles.cardFooter}>
//               <Text style={{ fontWeight: "bold" }}>Grateful for: </Text>
//               {journal.grateful}
//             </Text>
//             <Text style={styles.cardFooter}>
//               <Text style={{ fontWeight: "bold" }}>Accomplished: </Text>
//               {journal.accomplished}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>

//       {/* See All Journals */}
//       <TouchableOpacity style={styles.seeAllButton}>
//         <Text style={styles.seeAllText}>See All Journals</Text>
//       </TouchableOpacity>

//       {/* Modal for New Entry */}
//       <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>New Journal Entry</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Write your thoughts..."
//               multiline
//               value={newEntry}
//               onChangeText={setNewEntry}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Grateful for..."
//               value={gratefulText}
//               onChangeText={setGratefulText}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Accomplished today..."
//               value={accomplishedText}
//               onChangeText={setAccomplishedText}
//             />
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
//                 <Text style={styles.saveText}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     paddingTop: 0,
//   },
//   header: {
//     height: 60,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#0E0E10',
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   backBtn: {
//     padding: 8,
//     width: 50,
//     alignItems: 'flex-start',
//   },
//   title: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 18,
//   },
//   subHeader: {
//     fontSize: 14,
//     color: "#aaa",
//     marginBottom: 20,
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   newEntryButton: {
//     backgroundColor: "#7c3aed",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 20,
//     marginHorizontal: 20,
//   },
//   newEntryText: {
//     color: "#fff",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   journalList: {
//     paddingHorizontal: 20,
//   },
//   card: {
//     backgroundColor: "#1a1a1a",
//     padding: 15,
//     borderRadius: 15,
//     marginBottom: 15,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//     flex: 1,
//   },
//   mood: {
//     fontSize: 20,
//     marginRight: 5,
//   },
//   tag: {
//     backgroundColor: "#064e3b",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//   },
//   tagText: {
//     color: "#34d399",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   cardDate: {
//     color: "#aaa",
//     fontSize: 13,
//     marginVertical: 5,
//   },
//   cardContent: {
//     color: "#ddd",
//     marginBottom: 8,
//   },
//   cardFooter: {
//     color: "#bbb",
//     fontSize: 13,
//     marginTop: 2,
//   },
//   seeAllButton: {
//     padding: 12,
//     alignItems: "center",
//   },
//   seeAllText: {
//     color: "#7c3aed",
//     fontWeight: "bold",
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: "#1a1a1a",
//     borderRadius: 15,
//     padding: 20,
//   },
//   modalTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//     input: {
//     backgroundColor: "#333",
//     color: "#fff",
//     borderRadius: 10,
//     padding: 10,
//     height: 100,
//     marginBottom: 15,
//     textAlignVertical: "top",
//   },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   cancelButton: {
//     marginRight: 10,
//   },
//   cancelText: {
//     color: "#f87171",
//     fontSize: 16,
//   },
//   saveButton: {
//     backgroundColor: "#7c3aed",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   saveText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Modal,
//   TextInput,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// // Mock data (sirf 1 recent item yahaan rakha hai)
// const recentJournals = [
//   {
//     id: 1,
//     title: "Amazing Study Session Today",
//     date: "Sunday, October 26, 2025",
//     content:
//       "Had such a productive day! Finally understood the calculus concepts...",
//     grateful: "My study group for helping me understand derivatives",
//     accomplished: "Completed 3 chapters of calculus",
//     mood: "😊",
//     tag: "amazing",
//   },
// ];

// export default function Journal() {
//   const navigation = useNavigation();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [newEntry, setNewEntry] = useState("");
//   const [gratefulText, setGratefulText] = useState("");
//   const [accomplishedText, setAccomplishedText] = useState("");

//   // 'journals' state ab 'recentJournals' se initialize hoga
//   const [journals, setJournals] = useState(recentJournals);

//   const handleSaveEntry = () => {
//     if (newEntry.trim() === "") return;
//     const newJournal = {
//       id: journals.length + 1,
//       title: "New Journal Entry",
//       date: new Date().toDateString(), // Example: "Tue Oct 28 2025"
//       content: newEntry,
//       grateful: gratefulText.trim() || "—",
//       accomplished: accomplishedText.trim() || "—",
//       mood: "📝",
//       tag: "new",
//     };
//     setJournals([newJournal, ...journals]);
//     setNewEntry("");
//     setGratefulText("");
//     setAccomplishedText("");
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>My Journal</Text>
//         <View style={{ width: 50 }} />
//       </View>

//       <Text style={styles.subHeader}>Reflect, grow, and track your journey</Text>

//       {/* Buttons */}
//       <TouchableOpacity
//         style={styles.newEntryButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.newEntryText}>＋ New Entry</Text>
//       </TouchableOpacity>

//       <Text style={styles.recentTitle}>Recent Entries</Text>

//       {/* Recent Journals */}
//       <ScrollView style={styles.journalList}>
//         {journals.slice(0, 3).map((journal) => ( // Sirf 3 recent dikhayein
//           <View key={journal.id} style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.cardTitle}>{journal.title}</Text>
//               <Text style={styles.mood}>{journal.mood}</Text>
//               <View style={styles.tag}>
//                 <Text style={styles.tagText}>{journal.tag}</Text>
//               </View>
//             </View>
//             <Text style={styles.cardDate}>{journal.date}</Text>
//             <Text style={styles.cardContent} numberOfLines={2}>{journal.content}</Text> 
//           </View>
//         ))}
//       </ScrollView>

//       {/* See All Journals (UPDATED) */}
//       <TouchableOpacity 
//         style={styles.seeAllButton}
//         onPress={() => navigation.navigate('AllJournals')} // <-- NAYI SCREEN PAR JAYEGA
//       >
//         <Text style={styles.seeAllText}>See All Journals</Text>
//       </TouchableOpacity>

//       {/* Modal for New Entry (No changes) */}
//       <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>New Journal Entry</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Write your thoughts..."
//               placeholderTextColor="#888"
//               multiline
//               value={newEntry}
//               onChangeText={setNewEntry}
//             />
//             <TextInput
//               style={styles.inputShort} // <-- Alag style
//               placeholder="Grateful for..."
//               placeholderTextColor="#888"
//               value={gratefulText}
//               onChangeText={setGratefulText}
//             />
//             <TextInput
//               style={styles.inputShort} // <-- Alag style
//               placeholder="Accomplished today..."
//               placeholderTextColor="#888"
//               value={accomplishedText}
//               onChangeText={setAccomplishedText}
//             />
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
//                 <Text style={styles.saveText}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// // Styles (Thode changes kiye gaye hain)
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     paddingTop: 0,
//   },
//   header: {
//     height: 60,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#0E0E10',
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   backBtn: {
//     padding: 8,
//     width: 50,
//     alignItems: 'flex-start',
//   },
//   title: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 18,
//   },
//   subHeader: {
//     fontSize: 14,
//     color: "#aaa",
//     marginBottom: 20,
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   newEntryButton: {
//     backgroundColor: "#7c3aed",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 20,
//     marginHorizontal: 20,
//   },
//   newEntryText: {
//     color: "#fff",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   recentTitle: { // <-- Naya style
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     paddingHorizontal: 20,
//     marginBottom: 10,
//   },
//   journalList: {
//     paddingHorizontal: 20,
//   },
//   card: {
//     backgroundColor: "#1a1a1a",
//     padding: 15,
//     borderRadius: 15,
//     marginBottom: 15,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//     flex: 1,
//   },
//   mood: {
//     fontSize: 20,
//     marginRight: 5,
//   },
//   tag: {
//     backgroundColor: "#064e3b",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//   },
//   tagText: {
//     color: "#34d399",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   cardDate: {
//     color: "#aaa",
//     fontSize: 13,
//     marginVertical: 5,
//   },
//   cardContent: {
//     color: "#ddd",
//     marginBottom: 8,
//   },
//   seeAllButton: {
//     padding: 12,
//     alignItems: "center",
//   },
//   seeAllText: {
//     color: "#7c3aed",
//     fontWeight: "bold",
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: "#1a1a1a",
//     borderRadius: 15,
//     padding: 20,
//   },
//   modalTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   input: {
//     backgroundColor: "#333",
//     color: "#fff",
//     borderRadius: 10,
//     padding: 10,
//     height: 100,
//     marginBottom: 15,
//     textAlignVertical: "top",
//   },
//   inputShort: { // <-- Naya style modal ke liye
//     backgroundColor: "#333",
//     color: "#fff",
//     borderRadius: 10,
//     padding: 10,
//     height: 45,
//     marginBottom: 15,
//   },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   cancelButton: {
//     marginRight: 10,
//   },
//   cancelText: {
//     color: "#f87171",
//     fontSize: 16,
//   },
//   saveButton: {
//     backgroundColor: "#7c3aed",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   saveText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });





// src/more/Journal.jsx

import React, { useState, useEffect } from "react"; // useEffect add karein
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, ActivityIndicator, // ActivityIndicator add karein
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// API service ko import karein
import { createEntry, getRecentEntries } from '../services/journalApi'; // <-- Import functions

export default function Journal() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [gratefulText, setGratefulText] = useState("");
  const [accomplishedText, setAccomplishedText] = useState("");

  const [journals, setJournals] = useState([]); // Initial state khaali rakhein
  const [loading, setLoading] = useState(true); // Loading state add karein
  const [saving, setSaving] = useState(false); // Saving state add karein

  // Function: Recent entries fetch karne ke liye
  const fetchRecentJournals = async () => {
    setLoading(true);
    try {
      console.log("Journal.jsx: Fetching recent entries..."); // Added log
      const response = await getRecentEntries();
      if (response.success) {
        console.log("Journal.jsx: Recent entries fetched:", response.data); // Added log
        setJournals(response.data);
      } else {
         console.error("Journal.jsx: Error fetching recent entries:", response.error); // Added log
      }
    } catch (error) {
      console.error("Journal.jsx: API call error fetching recent:", error); // Added log
      // Alert.alert("Error", "Could not fetch recent journals."); // Optional Alert
    } finally {
      setLoading(false);
    }
  };

  // Component load hone par recent entries fetch karein
  useEffect(() => {
    fetchRecentJournals();
  }, []); // Khaali dependency array = sirf ek baar run hoga

  // Function: Nayi entry save karne ke liye
  const handleSaveEntry = async () => { // async add karein
    if (newEntry.trim() === "") {
        Alert.alert("Input Required", "Please write your thoughts.");
        return;
    }
    setSaving(true); // Saving shuru

    // Data object banayein
    const newJournalData = {
      // title: "New Journal Entry", // Backend default de dega
      content: newEntry,
      grateful: gratefulText.trim() || null, // null bhejein agar khaali hai
      accomplished: accomplishedText.trim() || null, // null bhejein agar khaali hai
      // date backend par default ho jayegi
    };

    try {
      console.log("Journal.jsx: Calling createEntry with data:", newJournalData); // Added log
      const response = await createEntry(newJournalData); // API call
      if (response.success) {
        console.log("Journal.jsx: Entry saved via API:", response.data); // Added log
        // Optional: Nayi entry ko state mein add karein ya list refresh karein
        // setJournals([response.data, ...journals]); // Turant UI update ke liye
        fetchRecentJournals(); // Ya list ko refresh karein
        setNewEntry("");
        setGratefulText("");
        setAccomplishedText("");
        setModalVisible(false);
      } else {
        console.error("Journal.jsx: Error saving entry via API:", response.error); // Added log
        Alert.alert("Save Error", response.error || "Could not save journal entry.");
      }
    } catch (error) {
      console.error("Journal.jsx: API call error saving entry:", error); // Added log
      Alert.alert("Save Error", error.message || "Could not save journal entry.");
    } finally {
        setSaving(false); // Saving khatam
    }
  };

  return (
    <View style={styles.container}>
      {/* ... Header ... */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Journal</Text>
        <View style={{ width: 50 }} />
      </View>

      <Text style={styles.subHeader}>Reflect, grow, and track your journey</Text>

      {/* ... New Entry Button ... */}
      <TouchableOpacity
        style={styles.newEntryButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.newEntryText}>＋ New Entry</Text>
      </TouchableOpacity>

      <Text style={styles.recentTitle}>Recent Entries</Text>

      {/* Recent Journals */}
      {loading ? (
        <ActivityIndicator size="large" color="#7c3aed" style={{marginTop: 50}} />
      ) : (
        <ScrollView style={styles.journalList}>
          {journals.length === 0 ? (
            <Text style={styles.noEntriesText}>No recent journal entries found.</Text>
          ) : (
            journals.slice(0, 3).map((journal) => (
              <View key={journal.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{journal.title || 'Journal Entry'}</Text>
                  {/* Mood/Tag hata diye gaye */}
                </View>
                {/* Date ko format karna behtar hai */}
                <Text style={styles.cardDate}>{new Date(journal.date || journal.created_at).toLocaleDateString()}</Text>
                <Text style={styles.cardContent} numberOfLines={2}>{journal.content}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}


      {/* See All Journals */}
      <TouchableOpacity
        style={styles.seeAllButton}
        onPress={() => navigation.navigate('AllJournals')}
      >
        <Text style={styles.seeAllText}>See All Journals</Text>
      </TouchableOpacity>

      {/* Modal for New Entry */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Journal Entry</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your thoughts..."
              placeholderTextColor="#888"
              multiline
              value={newEntry}
              onChangeText={setNewEntry}
              editable={!saving} // Disable jab saving ho
            />
            <TextInput
              style={styles.inputShort}
              placeholder="Grateful for..."
              placeholderTextColor="#888"
              value={gratefulText}
              onChangeText={setGratefulText}
              editable={!saving}
            />
            <TextInput
              style={styles.inputShort}
              placeholder="Accomplished today..."
              placeholderTextColor="#888"
              value={accomplishedText}
              onChangeText={setAccomplishedText}
              editable={!saving}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={saving} // Disable jab saving ho
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEntry}
                disabled={saving} // Disable jab saving ho
              >
                {saving ? (
                    <ActivityIndicator color="#fff" size="small"/>
                ) : (
                    <Text style={styles.saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles (Naya style add kiya hai)
const styles = StyleSheet.create({
  // ... Purane styles ...
  container: { flex: 1, backgroundColor: "#000", paddingTop: 0 },
  header: { height: 60, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0E0E10', borderBottomWidth: 1, borderBottomColor: '#333' },
  backBtn: { padding: 8, width: 50, alignItems: 'flex-start' },
  title: { color: '#fff', fontWeight: '700', fontSize: 18 },
  subHeader: { fontSize: 14, color: "#aaa", marginBottom: 20, paddingHorizontal: 20, marginTop: 10 },
  newEntryButton: { backgroundColor: "#7c3aed", padding: 14, borderRadius: 10, marginBottom: 20, marginHorizontal: 20 },
  newEntryText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  recentTitle: { color: '#fff', fontSize: 16, fontWeight: '600', paddingHorizontal: 20, marginBottom: 10 },
  journalList: { paddingHorizontal: 20 },
  card: { backgroundColor: "#1a1a1a", padding: 15, borderRadius: 15, marginBottom: 15 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", flex: 1 },
  cardDate: { color: "#aaa", fontSize: 13, marginVertical: 5 },
  cardContent: { color: "#ddd", marginBottom: 0 }, // Hata diya margin
  seeAllButton: { padding: 12, alignItems: "center" },
  seeAllText: { color: "#7c3aed", fontWeight: "bold" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 },
  modalContent: { backgroundColor: "#1a1a1a", borderRadius: 15, padding: 20 },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { backgroundColor: "#333", color: "#fff", borderRadius: 10, padding: 10, height: 100, marginBottom: 15, textAlignVertical: "top" },
  inputShort: { backgroundColor: "#333", color: "#fff", borderRadius: 10, padding: 10, height: 45, marginBottom: 15 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  cancelButton: { marginRight: 10, paddingVertical: 10 }, // Thoda padding
  cancelText: { color: "#f87171", fontSize: 16 },
  saveButton: { backgroundColor: "#7c3aed", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, minWidth: 80, alignItems: 'center' }, // Min width
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  noEntriesText: { // <-- Naya style
      color: '#aaa',
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
  },
});