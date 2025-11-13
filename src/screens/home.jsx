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

// --- IMPORT YOUR MOOD ICON ---
// Make sure this path is correct relative to home.jsx
// import happyIcon from '../../assets/image/happy.png'; 
// Using an icon for now as the asset path might be wrong
const happyIcon = "emoticon-happy-outline";

// --- EXTERNAL SERVICE IMPORTS ---
import { getAllTasks } from '../services/studyTaskApi';
// FIX 1: Import path 'supabaseServices' se 'chatService' kiya gaya
import { chatService, getCurrentUser } from '../services/chatService'; 
import { GROQ_API_KEY } from '@env';

import axios from 'axios'; // axios ko import karein

// --- GROQ & CHAT CONSTANTS ---
const GROQ_MODEL = "openai/gpt-oss-20b";
const GROQ_API_KEY  = GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ‼️ IMPORTANT: YEH AAPKE OLLAMA BACKEND KA URL HAI
// Yeh aapka local IP + port 3000 hai (jaisa aapki friend ke setup mein tha)
// Agar aapka IP badalta hai, toh ise change karein
const OLLAMA_BACKEND_URL = 'http://10.193.206.36:3000';

const INITIAL_AI_MESSAGE = {
    id: 'initial-ai',
    content: "Hey there! 👋 I'm your StudyBuddy AI companion. I'm here to help... How can I assist you today? (I can see your tasks, mood, and focus sessions!)",
    isUser: false,
    timestamp: Date.now(),
};

// --- GLOBAL UTILITY FUNCTIONS ---
const getTaskProgress = (task) => {
    // FIX: Crash fix (Array.isArray)
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    if (subtasks.length === 0) return { completed: 0, total: 0, text: "Start" };
    const completed = subtasks.filter(sub => sub.completed).length;
    const total = subtasks.length;
    return { completed, total, text: `${completed}/${total}` };
};

const getFocusAndMoodData = async (userId) => {
    // TODO: Is function ko Supabase se connect karein
    const recentFocusSessions = [
        { duration: 1800, completed: true, date: '2025-11-08' },
        { duration: 2700, completed: true, date: '2025-11-07' },
        { duration: 1200, completed: false, date: '2025-11-06' },
    ];

    return {
        recentFocusSessions: recentFocusSessions,
        currentScreenTimeSummary: "You completed 2 focus sessions (30m, 45m) in the last 2 days, totaling 1 hour and 15 minutes of productive time. One 20-minute session failed.",
    };
};

// Groq API call function (Aapki friend ka code)
const sendMessageToGroq = async (history, context) => {
    const messages = history.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content,
    }));

    const systemInstruction = {
        role: "system",
        content: `
            You are a friendly and encouraging StudyBuddy AI designed to assist students with their study tasks, motivation, and mental well-being. Keep responses concise and supportive.

            CURRENT USER CONTEXT:
            - Latest Recorded Mood: ${context.currentMood || 'Not yet recorded today.'}
            - Top 3 Active Tasks: ${context.tasks.length > 0 ? context.tasks.map(t => `${t.title} (${t.priority}) - Subtasks: ${t.progress.text}`).join('; ') : 'No active tasks found.'}
            - Screen Time/Focus Summary (Last 7 days): ${context.screenTimeSummary}
            - Previous Chat Context/Memory: ${context.chatContext ? JSON.stringify(context.chatContext).substring(0, 500) + '...' : 'No long-term memory stored yet.'}

            Use this context to give personalized advice and motivation. Do NOT mention the full data in your response, but use it to inform your answer.
        `
    };

    const payload = {
        model: GROQ_MODEL,
        messages: [systemInstruction, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
    };

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const status = response.status;
            const errorBody = await response.text();
            console.error("Groq API FAILED:", status, errorBody);

            let errorMessage = "An unknown API error occurred.";
            if (status === 401) {
                errorMessage = "Authentication Failed: Check your GROQ_API_KEY.";
            } else if (status === 429) {
                errorMessage = "Rate Limit Exceeded: Too many requests.";
            }

            throw new Error(`Groq API returned status ${status}. Details: ${errorMessage}`);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
        return aiResponse;

    } catch (error) {
        console.error("Fetch/Network/Processing error to Groq:", error.message);
        // FIX: Error message ko user-friendly banaya
        return `I apologize, I'm having trouble connecting to my brain right now. (Error: ${error.message})`;
    }
};

// --- CHAT MODAL COMPONENT ---
function StudyBuddyChatModal({ isVisible, onClose, todayTasks, selectedMood, userId }) {
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const flatListRef = useRef(null);

    // Load history jab modal khule
    useEffect(() => {
        async function loadChatData() {
            if (!userId) {
                setMessages([INITIAL_AI_MESSAGE]);
                return;
            }

            try {
                const historyData = await chatService.getChatHistory(userId);
                const historyMessages = historyData.map(msg => ({
                    id: msg.id,
                    content: msg.message,
                    isUser: msg.is_user,
                    timestamp: new Date(msg.created_at).getTime(),
                }));

                if (historyMessages.length > 0) {
                    setMessages(historyMessages);
                } else {
                    setMessages([INITIAL_AI_MESSAGE]);
                }
            } catch (e) {
                console.error("Failed to load chat history:", e);
                setMessages([INITIAL_AI_MESSAGE]);
            }
        }

        if (isVisible) {
            loadChatData();
        } else if (!isVisible) {
            setMessages([]);
            setInputMessage("");
        }
    }, [isVisible, userId]);

    // Auto-scroll logic
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    // Clear history logic
    const handleClearHistory = async () => {
        Alert.alert(
            "Clear Chat History",
            "Are you sure you want to delete all messages? This is permanent.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear", onPress: async () => {
                        if (!userId) {
                            Alert.alert("Action Blocked", "Please log in to clear your persistent chat history.");
                            return;
                        }
                        try {
                            // TODO: `clearChatHistory` ko `chatService.js` mein define karna hoga
                            // await chatService.clearChatHistory(userId); 
                            setMessages([INITIAL_AI_MESSAGE]);
                            Alert.alert("Success", "Chat history cleared.");
                        } catch (error) {
                            console.error("Failed to clear history:", error);
                            Alert.alert("Error", "Failed to clear history. Check console for details.");
                        }
                    }, style: "destructive"
                },
            ]
        );
    };

    // Message bubble component
    const MessageBubble = useCallback(({ message }) => (
        <View style={[
            styles.messageBubble,
            message.isUser ? styles.userBubble : styles.botBubble,
        ]}>
            <Text style={styles.messageText}>
                {message.content}
            </Text>
        </View>
    ), []);

    // Send message logic
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isSending) {
            return;
        }

        const userMessage = {
            id: Date.now() + '-user',
            content: inputMessage.trim(),
            isUser: true,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setIsSending(true);

        if (userId) {
            try {
                await chatService.saveMessage(userId, userMessage.content, true);
            } catch (e) {
                console.warn("Failed to save user message to history:", e);
            }
        }

        try {
            // Context functions ko call karein
            const { currentScreenTimeSummary } = await getFocusAndMoodData(userId);
            const longTermContext = null; // TODO: `chatService.getContext(userId)` implement karein

            const taskProgressContext = todayTasks.map(task => ({
                title: task.title,
                priority: task.priority,
                progress: task.progress // `getTaskProgress` pehle hi Home mein call ho chuka hai
            }));

            const aiContext = {
                userId: userId,
                currentMood: selectedMood,
                tasks: taskProgressContext,
                screenTimeSummary: currentScreenTimeSummary,
                chatContext: longTermContext,
            };

            // Conversation history (sirf aakhiri 10 messages)
            const conversationHistory = messages.slice(-10).map(msg => ({
                role: msg.isUser ? "user" : "assistant",
                content: msg.content,
            }));

            const responseText = await sendMessageToGroq(
                [...conversationHistory, { role: "user", content: userMessage.content }],
                aiContext
            );

            const aiResponse = {
                id: Date.now() + '-bot',
                content: responseText,
                isUser: false,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, aiResponse]);

            // Response ko Supabase mein save karein
            if (!responseText.startsWith("I apologize, I'm having trouble") && userId) {
                await chatService.saveMessage(userId, aiResponse.content, false);
            }

        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage = {
                id: Date.now() + '-error',
                content: `I'm sorry, an unexpected error occurred. (Detail: ${error.message || 'Unknown'})`,
                isUser: false,
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.chatModalContainer}>
                <View style={styles.chatHeader}>
                    <Pressable onPress={onClose} style={styles.chatHeaderButton}>
                        <Icon name="chevron-down" size={28} color="#fff" />
                    </Pressable>
                    <Text style={styles.chatHeaderTitle}>StudyBuddy AI</Text>
                    <Pressable onPress={handleClearHistory} style={styles.chatHeaderButton}>
                        <Icon name="delete-empty-outline" size={24} color="#9CA3AF" />
                    </Pressable>
                </View>

                <KeyboardAvoidingView
                    style={styles.chatBody}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <MessageBubble message={item} />}
                        contentContainerStyle={styles.chatMessageList}
                    />

                    {isSending && (
                        <View style={styles.typingIndicatorContainer}>
                            <ActivityIndicator size="small" color="#8b5cf6" />
                            <Text style={styles.typingIndicatorText}>StudyBuddy is thinking...</Text>
                        </View>
                    )}

                    <View style={styles.chatInputContainer}>
                        <TextInput
                            placeholder="Ask StudyBuddy anything..."
                            placeholderTextColor="#6C6C72"
                            style={styles.chatTextInput}
                            value={inputMessage}
                            onChangeText={setInputMessage}
                            editable={!isSending}
                            onSubmitEditing={handleSendMessage}
                        />
                        <Pressable
                            style={({ pressed }) => [
                                styles.chatSendButton,
                                (isSending || !inputMessage.trim()) && styles.chatSendButtonDisabled,
                                pressed && { opacity: 0.8 }
                            ]}
                            onPress={handleSendMessage}
                            disabled={isSending || !inputMessage.trim()}
                        >
                            <Icon name="send" size={22} color="#fff" />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

// --- HOME SCREEN COMPONENT ---
export default function Home({ navigation }) {
    const [moodModalVisible, setMoodModalVisible] = useState(false);
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [selectedMood, setSelectedMood] = useState(null);
    const [todayTasks, setTodayTasks] = useState([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    
    // FIX: Naya state current user ke liye
    const [currentUser, setCurrentUser] = useState(null); 

    const moodOptions = [
        { id: "happy", label: "Happy", icon: happyIcon, bg: "#FFB347", isImage: false }, // Using icon name
        { id: "calm", label: "Calm", icon: "emoticon-cool-outline", bg: "#4FC3F7", isImage: false },
        { id: "thoughtful", label: "Thoughtful", icon: "emoticon-thinking-outline", bg: "#D68BFF", isImage: false },
        { id: "down", label: "Down", icon: "emoticon-sad-outline", bg: "#9CA3AF", isImage: false },
        { id: "stressed", label: "Stressed", icon: "emoticon-dead-outline", bg: "#FF6B6B", isImage: false },
        { id: "tired", label: "Tired", icon: "emoticon-sleep-outline", bg: "#B66CFF", isImage: false },
        { id: "motivated", label: "Motivated", icon: "fire", bg: "#2DD36F", isImage: false },
        { id: "neutral", label: "Neutral", icon: "emoticon-neutral-outline", bg: "#9CA3AF", isImage: false },
    ];

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
        setIsLoadingTasks(true);
        try {
            const response = await getAllTasks();
            if (response.success && response.data) {
                // Task data ke saath progress bhi calculate karein
                const tasksWithProgress = response.data.map(task => ({
                    ...task,
                    progress: getTaskProgress(task)
                }));
                const topTasks = getTopPriorityTasks(tasksWithProgress);
                setTodayTasks(topTasks);
            } else {
                console.warn("Home.js: Failed to fetch tasks:", response.error);
            }
        } catch (error) {
            console.error("Home.js: Error fetching tasks:", error);
        } finally {
            setIsLoadingTasks(false);
        }
    };

    // FIX: User ko fetch karne ke liye naya function
    const fetchUser = async () => {
        try {
            const user = await getCurrentUser();
            if (user) {
                setCurrentUser(user);
            }
        } catch (e) {
            console.error("Error fetching user on home:", e);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchTodayTasks();
            fetchUser(); // User ko bhi fetch karein
        }, [])
    );

    function onSelectMood(mood) {
        setSelectedMood(mood.id);
        setMoodModalVisible(false);
    }

    const openChat = () => {
        setChatModalVisible(true);
    };
    
    // (Helper functions `getPriorityIcon` aur `getPriorityColor` ko yahaan copy karein)
    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'High': return 'fire';
            case 'Medium': return 'star';
            case 'Low': return 'clock-outline';
            default: return 'checkbox-marked-circle-outline';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return { main: '#f87171', gradient: ['#ef4444', '#f87171'] };
            case 'Medium': return { main: '#a78bfa', gradient: ['#8b5cf6', '#a78bfa'] };
            case 'Low': return { main: '#6b7280', gradient: ['#4b5563', '#6b7280'] };
            default: return { main: '#666', gradient: ['#555', '#666'] };
        }
    };


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

                {/* Today's Goals Card */}
                <Pressable
                    style={({ pressed }) => [
                        styles.modernCard,
                        styles.goalsCard,
                        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
                    ]}
                    onPress={() => navigation.navigate('StudyTasks')}
                >
                    <View style={styles.cardGradient} />
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

                    {/* Today's Goals List */}
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
                                // const progress = getTaskProgress(task); // Progress pehle hi fetchTodayTasks mein calculate ho gaya hai
                                const colors = getPriorityColor(task.priority);
                                return (
                                    <ModernTaskItem
                                        key={task.id}
                                        icon={getPriorityIcon(task.priority)}
                                        title={task.title}
                                        priority={task.priority}
                                        badgeText={task.progress.text} // Use pre-calculated progress
                                        color={colors.main}
                                        index={index}
                                    />
                                );
                            })
                        )}
                    </View>
                </Pressable>

                {/* Quick Check-in Card */}
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
                             {/* FIX: Mood icon logic ko update kiya */}
                            {moodOptions.find(m => m.id === selectedMood)?.isImage ? (
                                <Image 
                                    source={happyIcon} // Directly use the imported variable
                                    style={{ width: 32, height: 32 }}
                                />
                            ) : (
                                <Icon
                                    name={moodOptions.find(m => m.id === selectedMood)?.icon || 'help-circle'}
                                    size={32}
                                    color={moodOptions.find(m => m.id === selectedMood)?.bg || '#fff'}
                                />
                            )}
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

                {/* Chat Widget (Static, opens modal) */}
                <Pressable
                    onPress={openChat} // <-- YEH AB CHAT MODAL KHOLEGA
                    style={({ pressed }) => [
                        styles.modernCard,
                        styles.modernChatContainer,
                        pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] }
                    ]}
                >
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
                    <View style={styles.modernMessages}>
                        <View style={styles.modernAiBubble}>
                            <Text style={styles.modernAiText}>
                                {INITIAL_AI_MESSAGE.content.split('\n')[0]}
                                {'\n\n'}
                                Tap here to open full chat and start talking!
                            </Text>
                            <Text style={styles.modernMsgTime}>Tap to chat</Text>
                        </View>
                    </View>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Mood Modal (No change) */}
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
                                     {/* FIX: Mood icon logic ko update kiya */}
                                    {item.isImage ? (
                                        <Image source={happyIcon} style={{ width: 36, height: 36 }} />
                                    ) : (
                                        <Icon name={item.icon} size={36} color="#fff" />
                                    )}
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

            {/* Naya Chat Modal */}
            <StudyBuddyChatModal
                isVisible={chatModalVisible}
                onClose={() => setChatModalVisible(false)}
                todayTasks={todayTasks} // Current tasks pass karein
                selectedMood={moodOptions.find(m => m.id === selectedMood)?.label || 'Not Recorded'} // Current mood pass karein
                userId={currentUser?.id} // Current user ID pass karein
            />
        </SafeAreaView>
    );
}

// ===== FIX: MODERN TASK ITEM KO SAHI STYLES SE REPLACE KIYA =====
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

// ===== STYLES (Fixed) =====
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#050405" },
    container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36 },
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
    modernGoalList: {
        gap: 10,
    },

    // --- Modern Task Item Styles (FIXED) ---
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
    // --- End of Task Item Styles ---

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
    modernChatContainer: {
        padding: 0, // Reset padding
        backgroundColor: '#050505', // Darker background
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
    modernMessages: {
        padding: 16,
        backgroundColor: "#050505",
    },
    modernAiBubble: {
        backgroundColor: "#151517",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    modernAiText: {
        color: "#E5E7EB",
        lineHeight: 22,
        fontSize: 14,
    },
    modernMsgTime: {
        color: "#6B7280",
        fontSize: 11,
        marginTop: 10,
        textAlign: 'right',
    },
    modernModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modernModalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modernModalCard: {
        backgroundColor: '#0E0E10',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    },
    modernModalHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#374151',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    modernModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    modernModalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
    },
    modernModalSubtitle: {
        color: '#6B7280',
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

    // ===== NAYE CHAT MODAL STYLES =====
    chatModalContainer: {
        flex: 1,
        backgroundColor: '#050405',
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#151517',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    },
    chatHeaderButton: {
        padding: 5,
        width: 40, // Consistent tap area
    },
    chatHeaderTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    chatBody: {
        flex: 1,
        justifyContent: 'space-between',
    },
    chatMessageList: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        marginVertical: 4,
        borderRadius: 16,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#8b5cf6',
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#151517',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderTopLeftRadius: 4,
    },
    messageText: {
        color: "#fff",
        fontSize: 15,
        lineHeight: 22,
    },
    chatInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#151517',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    chatTextInput: {
        flex: 1,
        backgroundColor: '#0E0E10',
        borderRadius: 25,
        paddingHorizontal: 18,
        paddingVertical: 12,
        color: '#fff',
        fontSize: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        maxHeight: 120,
    },
    chatSendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#8b5cf6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatSendButtonDisabled: {
        backgroundColor: '#374151',
        opacity: 0.7,
    },
    typingIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 10,
        marginBottom: 5,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderRadius: 16,
    },
    typingIndicatorText: {
        color: '#8b5cf6',
        marginLeft: 8,
        fontSize: 14,
    },
});