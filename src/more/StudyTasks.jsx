import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// API service ko import karein
import { 
  createTask, 
  getAllTasks, 
  updateTask, 
  deleteTask 
} from '../services/studyTaskApi';

const TABS = ["All", "Active", "Completed", "New Block"];

// Priority ke rang (subtle waale)
const PRIORITY_COLORS = {
  High: "#f87171",
  Medium: "#a78bfa",
  Low: "#6b7280",
};

export default function StudyTasks() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Modal states
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalBusy, setIsModalBusy] = useState(false);

  // ===== HELPER FUNCTION: Ensure subtasks is always an array =====
  const ensureSubtasks = (task) => {
    return {
      ...task,
      subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
    };
  };

  // ===== DATA FETCHING =====
  const fetchTasks = async () => {
    console.log("StudyTasks.jsx: Fetching all tasks...");
    setIsLoading(true);
    try {
      const response = await getAllTasks();
      if (response.success) {
        console.log("StudyTasks.jsx: Tasks fetched successfully:", response.data.length, "tasks");
        // Normalize all tasks to ensure subtasks is an array
        const normalizedTasks = response.data.map(ensureSubtasks);
        setTasks(normalizedTasks);
      } else {
        Alert.alert("Error", response.error || "Could not fetch tasks.");
      }
    } catch (error) {
      console.error("--- CATCH BLOCK (StudyTasks.jsx): fetchTasks API call FAILED:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [])
  );

  // ===== TASK ACTIONS (API CALLS) =====

  const addTask = async () => {
    console.log("--- CHECK 1 (StudyTasks.jsx): 'Add Task' button pressed.");
    if (!newTask.trim()) return;
    setIsSaving(true);

    const taskData = {
      title: newTask,
      priority: "Medium",
    };
    
    try {
      console.log("StudyTasks.jsx: Calling taskApi.createTask with data:", taskData);
      const response = await createTask(taskData);
      
      if (response.success) {
        console.log("StudyTasks.jsx: API call successful. Refreshing tasks...");
        setNewTask("");
        setActiveTab("All");
        await fetchTasks();
      } else {
        Alert.alert("Save Error", response.error || "Could not save task.");
      }
    } catch (error) {
      console.error("--- CATCH BLOCK (StudyTasks.jsx): createTask API call FAILED:", error);
      Alert.alert("Save Error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTask = async (taskToToggle) => {
    const newStatus = taskToToggle.status === 'Active' ? 'Completed' : 'Active';
    let updatedSubtasks = Array.isArray(taskToToggle.subtasks) ? taskToToggle.subtasks : [];

    if (newStatus === 'Completed') {
      updatedSubtasks = updatedSubtasks.map(sub => ({ ...sub, completed: true }));
    }

    const oldTasks = tasks;
    setTasks(tasks.map(t => 
      t.id === taskToToggle.id ? { ...t, status: newStatus, subtasks: updatedSubtasks } : t
    ));
    
    try {
      await updateTask(taskToToggle.id, { 
        status: newStatus, 
        subtasks: updatedSubtasks 
      });
    } catch (error) {
      console.error("StudyTasks.jsx: toggleTask update failed:", error);
      Alert.alert("Update Error", "Could not sync task status.");
      setTasks(oldTasks);
    }
  };

  const setPriority = async (priority) => {
    if (!selectedTask) return;
    setIsModalBusy(true);

    const oldTasks = tasks;
    setTasks(tasks.map(t => 
      t.id === selectedTask.id ? { ...t, priority: priority } : t
    ));
    setSelectedTask(prev => ({ ...prev, priority: priority }));
    
    try {
      await updateTask(selectedTask.id, { priority });
    } catch (error) {
      console.error("StudyTasks.jsx: setPriority update failed:", error);
      Alert.alert("Update Error", "Could not update priority.");
      setTasks(oldTasks);
    } finally {
      setIsModalBusy(false);
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    const oldTasks = tasks;
    let updatedSubtasks = [];

    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const currentSubtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
        updatedSubtasks = currentSubtasks.map(sub =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    }));
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
    }

    try {
      await updateTask(taskId, { subtasks: updatedSubtasks });
    } catch (error) {
      console.error("StudyTasks.jsx: toggleSubtask update failed:", error);
      Alert.alert("Update Error", "Could not sync subtask status.");
      setTasks(oldTasks);
    }
  };

  const addSubtask = async () => {
    if (!newSubtaskText.trim() || !selectedTask) return;
    setIsModalBusy(true);

    const newSub = {
      id: Date.now().toString(),
      title: newSubtaskText,
      completed: false
    };

    const currentSubtasks = Array.isArray(selectedTask.subtasks) ? selectedTask.subtasks : [];
    const updatedSubtasks = [...currentSubtasks, newSub];

    const oldTasks = tasks;
    setTasks(tasks.map(t => 
      t.id === selectedTask.id ? { ...t, subtasks: updatedSubtasks } : t
    ));
    setSelectedTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
    
    try {
      await updateTask(selectedTask.id, { subtasks: updatedSubtasks });
      setNewSubtaskText("");
    } catch (error) {
      console.error("StudyTasks.jsx: addSubtask update failed:", error);
      Alert.alert("Update Error", "Could not add subtask.");
      setTasks(oldTasks);
    } finally {
      setIsModalBusy(false);
    }
  };

  const deleteTaskApiCall = async () => {
    if (!selectedTask) return;
    setIsModalBusy(true);

    const oldTasks = tasks;
    setTasks(tasks.filter(t => t.id !== selectedTask.id));
    closeMenu();
    
    try {
      await deleteTask(selectedTask.id);
    } catch (error) {
      console.error("StudyTasks.jsx: deleteTask failed:", error);
      Alert.alert("Delete Error", "Could not delete task.");
      setTasks(oldTasks);
    }
  };

  // ===== RENDER FUNCTIONS =====

  const openMenu = (task) => {
    // Normalize task before opening modal
    setSelectedTask(ensureSubtasks(task));
    setIsMenuVisible(true);
  };

  const closeMenu = () => {
    setSelectedTask(null);
    setIsMenuVisible(false);
    setNewSubtaskText("");
  };

  const renderTask = ({ item }) => {
    const isCompleted = item.status === 'Completed'; 
    
    if (activeTab === "Active" && isCompleted) return null;
    if (activeTab === "Completed" && !isCompleted) return null;

    // ===== ROBUST FIX: Always ensure subtasks is an array =====
    const subtasks = Array.isArray(item.subtasks) ? item.subtasks : [];
    const completedSubtasks = subtasks.filter(sub => sub.completed).length;
    const totalSubtasks = subtasks.length;
    const priority = item.priority || "Medium";

    return (
      <View style={styles.taskContainer}>
        {/* Main Task */}
        <View style={[styles.task, isCompleted && styles.taskDone]}>
          <TouchableOpacity onPress={() => toggleTask(item)}>
            <Text style={[styles.checkbox, { color: isCompleted ? '#555' : PRIORITY_COLORS[priority]}]}>
              {isCompleted ? "✔" : "☐"}
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.taskText, isCompleted && styles.textDone]}>
              {item.title}
            </Text>
            <View style={styles.taskMeta}>
              <Text style={[styles.priority, { color: PRIORITY_COLORS[priority] }]}>
                {priority} Priority
              </Text>
              {totalSubtasks > 0 && (
                <Text style={styles.subtaskCount}>
                  ({completedSubtasks}/{totalSubtasks} subtasks)
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={() => openMenu(item)} style={styles.dotsButton}>
            <Text style={styles.dots}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Subtasks List */}
        {subtasks.length > 0 && (
          <View style={styles.subtaskContainer}>
            {subtasks.map(subtask => (
              <TouchableOpacity
                key={subtask.id}
                style={styles.subtask}
                onPress={() => toggleSubtask(item.id, subtask.id)}
              >
                <Text style={styles.checkboxSmall}>
                  {subtask.completed ? "✔" : "☐"}
                </Text>
                <Text style={[styles.subtaskText, subtask.completed && styles.textDone]}>
                  {subtask.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderTaskMenuModal = () => {
    if (!selectedTask) return null;
    
    const modalSubtasks = Array.isArray(selectedTask.subtasks) ? selectedTask.subtasks : [];
    
    return (
      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeMenu}
      >
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeMenu}>
          <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>{selectedTask?.title}</Text>
                <TouchableOpacity onPress={closeMenu}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Priority Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Set Priority</Text>
                <View style={styles.priorityButtons}>
                  {["High", "Medium", "Low"].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityButton,
                        { backgroundColor: PRIORITY_COLORS[p] + '30' },
                        { borderColor: PRIORITY_COLORS[p] },
                        selectedTask?.priority === p && { backgroundColor: PRIORITY_COLORS[p] }
                      ]}
                      onPress={() => setPriority(p)}
                      disabled={isModalBusy}
                    >
                      <Text style={[styles.priorityButtonText, { color: selectedTask?.priority === p ? '#fff' : PRIORITY_COLORS[p] }]}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Subtasks Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Subtasks</Text>
                {modalSubtasks.map(sub => (
                  <TouchableOpacity
                    key={sub.id}
                    style={styles.subtask}
                    onPress={() => toggleSubtask(selectedTask.id, sub.id)}
                    disabled={isModalBusy}
                  >
                    <Text style={styles.checkboxSmall}>
                      {sub.completed ? "✔" : "☐"}
                    </Text>
                    <Text style={[styles.subtaskText, sub.completed && styles.textDone]}>
                      {sub.title}
                    </Text>
                  </TouchableOpacity>
                ))}
                {modalSubtasks.length === 0 && (
                  <Text style={styles.emptySubtask}>No subtasks yet.</Text>
                )}
                {/* Add Subtask Input */}
                <View style={styles.subtaskInputContainer}>
                  <TextInput
                    placeholder="Add new subtask..."
                    placeholderTextColor="#666"
                    value={newSubtaskText}
                    onChangeText={setNewSubtaskText}
                    style={styles.subtaskInput}
                    editable={!isModalBusy}
                  />
                  <TouchableOpacity onPress={addSubtask} style={styles.subtaskAddButton} disabled={isModalBusy}>
                    {isModalBusy && !isSaving ? <ActivityIndicator size="small" color="#fff"/> : <Text style={styles.addBtnText}>Add</Text>}
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Delete Button Section */}
              <View style={styles.modalSection}>
                <TouchableOpacity onPress={deleteTaskApiCall} style={styles.deleteButton} disabled={isModalBusy}>
                  <Text style={styles.deleteButtonText}>Delete Task</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Study Tasks</Text>
        <View style={{ width: 50 }} />
      </View>

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

      {/* New Block Input ya Task List */}
      {activeTab === "New Block" ? (
        <View>
          <TextInput
            placeholder="Enter new task..."
            placeholderTextColor="#666"
            value={newTask}
            onChangeText={setNewTask}
            style={styles.input}
            editable={!isSaving}
          />
          <TouchableOpacity onPress={addTask} style={styles.addBtn} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.addBtnText}>Add Task</Text>}
          </TouchableOpacity>
        </View>
      ) : (
        isLoading ? (
          <ActivityIndicator size="large" color="#a78bfa" style={{ marginTop: 40 }}/>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTask}
            ListEmptyComponent={
              <Text style={styles.empty}>No tasks here yet!</Text>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={isLoading}
            onRefresh={fetchTasks}
          />
        )
      )}

      {/* Modal ko render karein */}
      {renderTaskMenuModal()}
    </View>
  );
}
// Styles (Subtle UI ke saath)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f", paddingTop: 0 },
  header: {
    height: 60,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0E0E10',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backBtn: {
    padding: 8,
    width: 50,
    alignItems: 'flex-start',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 16,
  },
  tabText: { color: "#aaa", fontSize: 16 },
  activeTabText: { color: "#a78bfa", fontWeight: "700" },

  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  addBtn: {
    backgroundColor: "#a78bfa",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  addBtnText: { color: "#fff", fontWeight: "600" },

  // --- Task Item Styles ---
  taskContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#2c2c2c",
    borderRadius: 12,
  },
  task: {
    backgroundColor: "#3a3a3a",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  taskDone: { backgroundColor: "#2c2c2c" },
  checkbox: { fontSize: 20 },
  taskText: { color: "#fff", fontSize: 16, flexShrink: 1 },
  textDone: { color: "#777", textDecorationLine: "line-through" },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priority: { fontSize: 12, fontWeight: '600' },
  subtaskCount: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 10,
  },
  dotsButton: {
    padding: 8,
    marginLeft: 8,
  },
  dots: { color: "#fff", fontSize: 18 },
  empty: { color: "#555", textAlign: "center", marginTop: 40 },

  // --- Subtask Item Styles ---
  subtaskContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#4a4a4a'
  },
  subtask: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 10, // Indent
  },
  checkboxSmall: {
    fontSize: 16,
    color: '#a78bfa',
    marginRight: 10,
  },
  subtaskText: {
    color: '#ddd',
    fontSize: 14,
  },

  // --- Modal Styles ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    color: '#fff',
    fontSize: 20,
    padding: 8,
  },
  modalSection: {
    marginTop: 20,
  },
  modalSectionTitle: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: { // Subtle style
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  priorityButtonText: {
    fontWeight: '700',
  },
  emptySubtask: {
    color: '#666',
    fontStyle: 'italic',
  },
  subtaskInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  subtaskInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  subtaskAddButton: {
    backgroundColor: '#a78bfa',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: 'center',
  },
  deleteButton: { // Subtle delete
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#444',
    borderWidth: 1,
    borderColor: '#f87171'
  },
  deleteButtonText: {
    color: '#f87171',
    fontWeight: '600'
  },
});

