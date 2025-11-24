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

// Mood icon placeholder
const happyIcon = "emoticon-happy-outline";

// External service imports
import { getAllTasks } from "../services/studyTaskApi";
import { chatService, getCurrentUser } from "../services/chatService";

// Load safe API key from .env
import { GROQ_API_KEY } from "@env";

// For future use
import axios from "axios";

// Groq constants
const GROQ_MODEL = "openai/gpt-oss-20b";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
console.log("ENV CHECK:", GROQ_API_KEY);


// Initial default AI message
const INITIAL_AI_MESSAGE = {
    id: "initial-ai",
    content:
        "Hey there! 👋 I'm your StudyBuddy AI companion. I'm here to help... How can I assist you today? (I can see your tasks, mood, and focus sessions!)",
    isUser: false,
    timestamp: Date.now(),
};

// Calculate task progress
const getTaskProgress = (task) => {
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    if (subtasks.length === 0)
        return { completed: 0, total: 0, text: "Start" };
    const completed = subtasks.filter((s) => s.completed).length;
    return { completed, total: subtasks.length, text: `${completed}/${subtasks.length}` };
};

// Fake focus-session + mood context
const getFocusAndMoodData = async () => {
    return {
        recentFocusSessions: [
            { duration: 1800, completed: true, date: "2025-11-08" },
            { duration: 2700, completed: true, date: "2025-11-07" },
            { duration: 1200, completed: false, date: "2025-11-06" },
        ],
        currentScreenTimeSummary:
            "You completed 2 focus sessions (30m, 45m) in the last 2 days, totaling 1 hour and 15 minutes of productive time. One 20-minute session failed.",
    };
};

// Send Chat to Groq API
const sendMessageToGroq = async (history, context) => {
    const messages = history.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content,
    }));

    const system = {
        role: "system",
        content: `
You are a friendly StudyBuddy AI that helps with study tasks, motivation, and wellness.
Use this context:
- Mood: ${context.currentMood}
- Tasks: ${context.tasks
            .map((t) => `${t.title} (${t.priority}) - ${t.progress.text}`)
            .join("; ")}
- Summary: ${context.screenTimeSummary}

Speak naturally, warm, short, supportive. Never dump raw data.
        `,
    };

    const payload = {
        model: GROQ_MODEL,
        messages: [system, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
    };

    try {
        const res = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const status = res.status;
            const text = await res.text();
            console.error("Groq API Error", status, text);
            return `Oops, I'm having trouble thinking right now... (Error ${status})`;
        }

        const data = await res.json();
        return (
            data?.choices?.[0]?.message?.content ||
            "I'm not sure what to say, but I'm here for you!"
        );
    } catch (err) {
        console.error("Fetch error:", err);
        return "I’m having trouble connecting right now.";
    }
};

// Chat Modal component
function StudyBuddyChatModal({
    isVisible,
    onClose,
    todayTasks,
    selectedMood,
    userId,
}) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const flatRef = useRef(null);

    useEffect(() => {
        async function load() {
            if (!userId) {
                setMessages([INITIAL_AI_MESSAGE]);
                return;
            }

            try {
                const history = await chatService.getChatHistory(userId);

                if (history.length === 0) {
                    setMessages([INITIAL_AI_MESSAGE]);
                    return;
                }

                setMessages(
                    history.map((m) => ({
                        id: m.id,
                        content: m.message,
                        isUser: m.is_user,
                        timestamp: new Date(m.created_at).getTime(),
                    }))
                );
            } catch (e) {
                console.error(e);
                setMessages([INITIAL_AI_MESSAGE]);
            }
        }

        if (isVisible) load();
        else {
            setMessages([]);
            setMessage("");
        }
    }, [isVisible]);

    useEffect(() => {
        if (flatRef.current) {
            flatRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const send = async () => {
        if (!message.trim() || isSending) return;

        const userMsg = {
            id: Date.now() + "-user",
            content: message.trim(),
            isUser: true,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setMessage("");
        setIsSending(true);

        if (userId) {
            try {
                await chatService.saveMessage(userId, userMsg.content, true);
            } catch {}
        }

        try {
            const { currentScreenTimeSummary } = await getFocusAndMoodData();

            const ctx = {
                userId,
                currentMood: selectedMood,
                screenTimeSummary: currentScreenTimeSummary,
                tasks: todayTasks,
            };

            const history = messages.slice(-10);

            const aiText = await sendMessageToGroq(history, ctx);

            const aiMsg = {
                id: Date.now() + "-bot",
                content: aiText,
                isUser: false,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, aiMsg]);

            if (userId && !aiText.includes("trouble")) {
                await chatService.saveMessage(userId, aiMsg.content, false);
            }
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={styles.chatModalContainer}>
                <View style={styles.chatHeader}>
                    <Pressable
                        onPress={onClose}
                        style={styles.chatHeaderButton}
                    >
                        <Icon name="chevron-down" size={28} color="#fff" />
                    </Pressable>
                    <Text style={styles.chatHeaderTitle}>StudyBuddy AI</Text>
                    <View style={{ width: 40 }} />
                </View>

                <KeyboardAvoidingView
                    style={styles.chatBody}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <FlatList
                        ref={flatRef}
                        data={messages}
                        keyExtractor={(i) => i.id.toString()}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.messageBubble,
                                    item.isUser
                                        ? styles.userBubble
                                        : styles.botBubble,
                                ]}
                            >
                                <Text style={styles.messageText}>{item.content}</Text>
                            </View>
                        )}
                        contentContainerStyle={styles.chatMessageList}
                    />

                    {isSending && (
                        <View style={styles.typingIndicatorContainer}>
                            <ActivityIndicator size="small" color="#8b5cf6" />
                            <Text style={styles.typingIndicatorText}>
                                StudyBuddy is thinking...
                            </Text>
                        </View>
                    )}

                    <View style={styles.chatInputContainer}>
                        <TextInput
                            placeholder="Ask StudyBuddy anything..."
                            placeholderTextColor="#6C6C72"
                            style={styles.chatTextInput}
                            value={message}
                            onChangeText={setMessage}
                            editable={!isSending}
                            onSubmitEditing={send}
                        />
                        <Pressable
                            onPress={send}
                            disabled={isSending || !message.trim()}
                            style={({ pressed }) => [
                                styles.chatSendButton,
                                (isSending || !message.trim()) &&
                                    styles.chatSendButtonDisabled,
                                pressed && { opacity: 0.8 },
                            ]}
                        >
                            <Icon name="send" size={22} color="#fff" />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

// ------------------------
// HOME SCREEN COMPONENT
// ------------------------

export default function Home({ navigation }) {
    const [moodModalVisible, setMoodModalVisible] = useState(false);
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [selectedMood, setSelectedMood] = useState(null);
    const [todayTasks, setTodayTasks] = useState([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const moodOptions = [
        { id: "happy", label: "Happy", icon: happyIcon, bg: "#FFB347" },
        { id: "calm", label: "Calm", icon: "emoticon-cool-outline", bg: "#4FC3F7" },
        { id: "thoughtful", label: "Thoughtful", icon: "emoticon-thinking-outline", bg: "#D68BFF" },
        { id: "down", label: "Down", icon: "emoticon-sad-outline", bg: "#9CA3AF" },
        { id: "stressed", label: "Stressed", icon: "emoticon-dead-outline", bg: "#FF6B6B" },
        { id: "tired", label: "Tired", icon: "emoticon-sleep-outline", bg: "#B66CFF" },
        { id: "motivated", label: "Motivated", icon: "fire", bg: "#2DD36F" },
        { id: "neutral", label: "Neutral", icon: "emoticon-neutral-outline", bg: "#9CA3AF" },
    ];

    const getTopPriorityTasks = (tasks) => {
        const active = tasks.filter((t) => t.status === "Active");
        if (active.length === 0) return [];

        const priority = { High: 1, Medium: 2, Low: 3 };
        return [...active]
            .sort((a, b) => priority[a.priority] - priority[b.priority])
            .slice(0, 3);
    };

    async function fetchTasks() {
        setIsLoadingTasks(true);
        try {
            const res = await getAllTasks();

            if (res.success && res.data) {
                const withProgress = res.data.map((t) => ({
                    ...t,
                    progress: getTaskProgress(t),
                }));
                setTodayTasks(getTopPriorityTasks(withProgress));
            }
        } catch (e) {
            console.error("Task Fetch Error:", e);
        } finally {
            setIsLoadingTasks(false);
        }
    }

    async function fetchUser() {
        try {
            const user = await getCurrentUser();
            if (user) setCurrentUser(user);
        } catch (e) {
            console.error("Fetch user error:", e);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
            fetchUser();
        }, [])
    );

    function onSelectMood(m) {
        setSelectedMood(m.id);
        setMoodModalVisible(false);
    }

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

                {/* Tasks */}
                <Pressable
                    style={({ pressed }) => [
                        styles.modernCard,
                        styles.goalsCard,
                        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                    ]}
                    onPress={() => navigation.navigate("StudyTasks")}
                >
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
                        <Pressable onPress={fetchTasks} style={styles.refreshBtn}>
                            <Icon name="refresh" size={18} color="#fff" />
                        </Pressable>
                    </View>

                    <View style={styles.modernGoalList}>
                        {isLoadingTasks ? (
                            <ActivityIndicator size="small" color="#a78bfa" />
                        ) : todayTasks.length === 0 ? (
                            <Text style={{ color: "#fff", textAlign: "center" }}>
                                No active tasks today.
                            </Text>
                        ) : (
                            todayTasks.map((t, i) => (
                                <ModernTaskItem
                                    key={t.id}
                                    icon={"checkbox-marked-circle-outline"}
                                    title={t.title}
                                    priority={t.priority}
                                    badgeText={t.progress.text}
                                    color={"#8b5cf6"}
                                    index={i}
                                />
                            ))
                        )}
                    </View>
                </Pressable>

                {/* Mood */}
                <View style={[styles.modernCard, styles.checkInCard]}>
                    <View style={styles.modernCardHeader}>
                        <View style={styles.headerLeft}>
                            <View
                                style={[
                                    styles.modernIconWrap,
                                    { backgroundColor: "rgba(255, 211, 107, 0.2)" },
                                ]}
                            >
                                <Icon
                                    name="emoticon-happy-outline"
                                    size={22}
                                    color="#ffd36b"
                                />
                            </View>
                            <View>
                                <Text style={styles.modernCardTitle}>Quick Check-in</Text>
                                <Text style={styles.cardSubtitle}>
                                    How are you feeling?
                                </Text>
                            </View>
                        </View>
                    </View>

                    {selectedMood && (
                        <View style={styles.selectedMoodContainer}>
                            <Icon
                                name={
                                    moodOptions.find((m) => m.id === selectedMood)?.icon
                                }
                                size={32}
                                color={
                                    moodOptions.find((m) => m.id === selectedMood)?.bg
                                }
                            />
                            <Text style={styles.selectedMoodText}>
                                Feeling{" "}
                                {
                                    moodOptions.find((m) => m.id === selectedMood)
                                        ?.label
                                }
                            </Text>
                        </View>
                    )}

                    <Pressable
                        style={styles.modernMoodBtn}
                        onPress={() => setMoodModalVisible(true)}
                    >
                        <Icon name="heart-pulse" size={18} color="#fff" />
                        <Text style={styles.modernMoodBtnText}>
                            {selectedMood ? "Update Mood" : "Share My Mood"}
                        </Text>
                    </Pressable>
                </View>

                {/* Chat Card */}
                <Pressable
                    onPress={() => setChatModalVisible(true)}
                    style={[styles.modernCard, styles.modernChatContainer]}
                >
                    <View style={styles.modernChatHeader}>
                        <View style={styles.chatHeaderLeft}>
                            <View style={styles.modernChatAvatar}>
                                <Icon name="robot-outline" size={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.modernChatTitle}>
                                    StudyBuddy AI
                                </Text>
                                <Text style={styles.onlineText}>Online now</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.modernMessages}>
                        <Text style={styles.modernAiText}>
                            {INITIAL_AI_MESSAGE.content}
                        </Text>
                    </View>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Mood Modal */}
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
                        <View style={styles.modernModalHeader}>
                            <Text style={styles.modernModalTitle}>
                                How are you feeling?
                            </Text>
                            <Pressable
                                onPress={() => setMoodModalVisible(false)}
                                style={styles.modernModalClose}
                            >
                                <Icon name="close" size={22} color="#fff" />
                            </Pressable>
                        </View>

                        <FlatList
                            data={moodOptions}
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent: "space-between",
                            }}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.moodGrid}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.modernMoodItem,
                                        { backgroundColor: item.bg },
                                    ]}
                                    onPress={() => onSelectMood(item)}
                                >
                                    <Icon name={item.icon} size={36} color="#fff" />
                                    <Text style={styles.modernMoodLabel}>
                                        {item.label}
                                    </Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Chat Modal */}
            <StudyBuddyChatModal
                isVisible={chatModalVisible}
                onClose={() => setChatModalVisible(false)}
                todayTasks={todayTasks}
                selectedMood={
                    moodOptions.find((m) => m.id === selectedMood)?.label ||
                    "Not Recorded"
                }
                userId={currentUser?.id}
            />
        </SafeAreaView>
    );
}

// Modern task item
function ModernTaskItem({ icon, title, priority, badgeText, color }) {
    return (
        <View style={styles.modernTaskRow}>
            <View style={styles.taskContent}>
                <View style={[styles.modernTaskIcon, { backgroundColor: color + "20" }]}>
                    <Icon name={icon} size={18} color={color} />
                </View>
                <View>
                    <Text style={styles.modernTaskTitle}>{title}</Text>
                    <Text style={[styles.priorityLabel, { color }]}>
                        {priority} Priority
                    </Text>
                </View>
            </View>
            <View style={[styles.modernBadge, { backgroundColor: color }]}>
                <Text style={styles.modernBadgeText}>{badgeText}</Text>
            </View>
        </View>
    );
}

/* ---- STYLES (unchanged from your original code, polished) ---- */
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#050405" },
    container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36 },
    headerWrap: {
        marginBottom: 24,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 20,
        overflow: "hidden",
    },
    gradientOverlay: { padding: 16 },
    welcome: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "900",
        textAlign: "center",
    },
    headerSub: {
        color: "#9CA3AF",
        textAlign: "center",
        marginTop: 8,
        fontSize: 14,
    },
    modernCard: {
        backgroundColor: "#0E0E10",
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    goalsCard: { backgroundColor: "#0a0a0b" },
    modernCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    modernIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    modernCardTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
    cardSubtitle: { color: "#6B7280", fontSize: 12 },
    refreshBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        alignItems: "center",
        justifyContent: "center",
    },
    modernGoalList: { gap: 10 },

    modernTaskRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#151517",
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.03)",
    },
    taskContent: { flexDirection: "row", alignItems: "center" },
    modernTaskIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    modernTaskTitle: { color: "#E5E7EB", fontSize: 15, fontWeight: "600" },
    priorityLabel: { fontSize: 11, fontWeight: "600" },
    modernBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 50,
        alignItems: "center",
    },
    modernBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },

    checkInCard: { backgroundColor: "#0a0a0b" },
    selectedMoodContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.03)",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        gap: 10,
    },
    selectedMoodText: { color: "#E5E7EB", fontSize: 15, fontWeight: "600" },
    modernMoodBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f59e0b",
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    modernMoodBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },

    modernChatContainer: { padding: 0, borderRadius: 20 },
    modernChatHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        backgroundColor: "#1a1a2e",
    },
    chatHeaderLeft: { flexDirection: "row", alignItems: "center" },
    modernChatAvatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#8b5cf6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    modernChatTitle: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 16,
    },
    onlineText: { color: "#6ee7b7", fontSize: 12 },
    modernMessages: { padding: 16 },
    modernAiText: { color: "#E5E7EB", fontSize: 14 },

    /* Chat modal styles */
    chatModalContainer: { flex: 1, backgroundColor: "#050405" },
    chatHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#151517",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
    },
    chatHeaderButton: { width: 40 },
    chatHeaderTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
    chatBody: { flex: 1 },
    chatMessageList: { paddingHorizontal: 10, paddingVertical: 10 },
    messageBubble: {
        maxWidth: "80%",
        padding: 12,
        marginVertical: 4,
        borderRadius: 16,
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: "#8b5cf6",
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: "flex-start",
        backgroundColor: "#151517",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        borderTopLeftRadius: 4,
    },
    messageText: { color: "#fff", fontSize: 15 },
    chatInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#151517",
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
    },
    chatTextInput: {
        flex: 1,
        backgroundColor: "#0E0E10",
        borderRadius: 25,
        padding: 12,
        color: "#fff",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    chatSendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#8b5cf6",
        alignItems: "center",
        justifyContent: "center",
    },
    chatSendButtonDisabled: {
        backgroundColor: "#374151",
        opacity: 0.7,
    },
    typingIndicatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        padding: 8,
        marginLeft: 14,
        backgroundColor: "rgba(139,92,246,0.1)",
        borderRadius: 16,
        marginBottom: 4,
    },
    typingIndicatorText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#8b5cf6",
    },

    modernModalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.7)",
    },
    modernModalBackdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modernModalCard: {
        backgroundColor: "#0E0E10",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    modernModalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },
    modernModalTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
    modernModalClose: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.05)",
        alignItems: "center",
        justifyContent: "center",
    },
    moodGrid: { paddingHorizontal: 16, paddingBottom: 20 },
    modernMoodItem: {
        width: "48%",
        height: 120,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    modernMoodLabel: {
        marginTop: 10,
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
});

export { };
