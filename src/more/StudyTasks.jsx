// StudyTasks.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const TABS = ["All", "Active", "Completed", "New Block"];

export default function StudyTasks() {
  const [activeTab, setActiveTab] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        priority: "Medium",
      },
    ]);
    setNewTask("");
    setActiveTab("All");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const renderTask = ({ item }) => {
    if (activeTab === "Active" && item.completed) return null;
    if (activeTab === "Completed" && !item.completed) return null;

    return (
      <TouchableOpacity style={[styles.task, item.completed && styles.taskDone]}>
        {/* Checkbox */}
        <TouchableOpacity onPress={() => toggleTask(item.id)}>
          <Text style={styles.checkbox}>
            {item.completed ? "✔" : "☐"}
          </Text>
        </TouchableOpacity>

        {/* Task details */}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.taskText, item.completed && styles.textDone]}>
            {item.title}
          </Text>
          <Text style={styles.priority}>Priority: {item.priority}</Text>
        </View>

        {/* 3 dots menu */}
        <Text style={styles.dots}>⋮</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* New Block Input */}
      {activeTab === "New Block" ? (
        <View>
          <TextInput
            placeholder="Enter new task..."
            placeholderTextColor="#666"
            value={newTask}
            onChangeText={setNewTask}
            style={styles.input}
          />
          <TouchableOpacity onPress={addTask} style={styles.addBtn}>
            <Text style={styles.addBtnText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          ListEmptyComponent={
            <Text style={styles.empty}>No tasks here yet!</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f", padding: 16 },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabText: { color: "#aaa", fontSize: 16 },
  activeTabText: { color: "#a78bfa", fontWeight: "700" },

  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: "#a78bfa",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "600" },

  task: {
    backgroundColor: "#3a3a3a",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  taskDone: { backgroundColor: "#2c2c2c" },
  checkbox: { fontSize: 20, color: "#a78bfa" },
  taskText: { color: "#fff", fontSize: 16 },
  textDone: { color: "#aaa", textDecorationLine: "line-through" },
  priority: { color: "#a78bfa", fontSize: 12 },
  dots: { color: "#fff", fontSize: 18, marginLeft: 8 },

  empty: { color: "#555", textAlign: "center", marginTop: 20 },
});
