// JournalScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";

export default function Journal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [journals, setJournals] = useState([
    {
      id: 1,
      title: "Amazing Study Session Today",
      date: "Sunday, August 24, 2025",
      content:
        "Had such a productive day! Finally understood the calculus concepts that were giving me trouble. The Pomodoro technique...",
      grateful: "My study group for helping me understand derivatives",
      accomplished: "Completed 3 chapters of calculus and all practice problems",
      mood: "😊",
      tag: "amazing",
    },
  ]);

  const handleSaveEntry = () => {
    if (newEntry.trim() === "") return;
    const newJournal = {
      id: journals.length + 1,
      title: "New Journal Entry",
      date: new Date().toDateString(),
      content: newEntry,
      grateful: "—",
      accomplished: "—",
      mood: "📝",
      tag: "new",
    };
    setJournals([newJournal, ...journals]);
    setNewEntry("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>My Journal</Text>
      <Text style={styles.subHeader}>Reflect, grow, and track your journey</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.aiButton}>
        <Text style={styles.aiText}>✨ AI Writing Prompts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.newEntryButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.newEntryText}>＋ New Entry</Text>
      </TouchableOpacity>

      {/* Recent Journals */}
      <ScrollView style={styles.journalList}>
        {journals.slice(0, 3).map((journal) => (
          <View key={journal.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{journal.title}</Text>
              <Text style={styles.mood}>{journal.mood}</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{journal.tag}</Text>
              </View>
            </View>
            <Text style={styles.cardDate}>{journal.date}</Text>
            <Text style={styles.cardContent}>{journal.content}</Text>
            <Text style={styles.cardFooter}>
              <Text style={{ fontWeight: "bold" }}>Grateful for: </Text>
              {journal.grateful}
            </Text>
            <Text style={styles.cardFooter}>
              <Text style={{ fontWeight: "bold" }}>Accomplished: </Text>
              {journal.accomplished}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* See All Journals */}
      <TouchableOpacity style={styles.seeAllButton}>
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
              multiline
              value={newEntry}
              onChangeText={setNewEntry}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#a78bfa", // purple
  },
  subHeader: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 20,
  },
  aiButton: {
    backgroundColor: "#1f1f1f",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  aiText: {
    color: "#fff",
    textAlign: "center",
  },
  newEntryButton: {
    backgroundColor: "#7c3aed", // purple
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  newEntryText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  journalList: {
    flex: 1,
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  mood: {
    fontSize: 20,
    marginRight: 5,
  },
  tag: {
    backgroundColor: "#064e3b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tagText: {
    color: "#34d399",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardDate: {
    color: "#aaa",
    fontSize: 13,
    marginVertical: 5,
  },
  cardContent: {
    color: "#ddd",
    marginBottom: 8,
  },
  cardFooter: {
    color: "#bbb",
    fontSize: 13,
    marginTop: 2,
  },
  seeAllButton: {
    padding: 12,
    alignItems: "center",
  },
  seeAllText: {
    color: "#7c3aed",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
    height: 120,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 10,
  },
  cancelText: {
    color: "#f87171",
  },
  saveButton: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
