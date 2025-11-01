import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../config/supabaseClient'; // Realtime ke liye
import { getMessages, sendMessage } from '../services/chatApi'; // Naya API
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Icon ke liye

const { width } = Dimensions.get('window');

export default function GroupChatScreen({ route, navigation }) {
  const { group } = route.params;
  const scrollViewRef = useRef(null);

  // Mock data hata diya
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [myProfile, setMyProfile] = useState(null); // Apna profile store karne ke liye
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Function: Apna user profile get karein
  const fetchMyProfile = async () => {
    // Pehle Supabase Auth se Auth ID lein
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "Could not find user profile");
      return;
    }
    
    // Ab 'users' table se internal ID aur naam lein
    const { data, error } = await supabase
      .from('users')
      .select('id, name')
      .eq('auth_id', user.id)
      .single();

    if (error || !data) {
      console.error("Error fetching my profile:", error);
      Alert.alert("Error", "Could not verify user profile");
    } else {
      setMyProfile(data); // { id: '...', name: 'Tisha Jain' }
    }
  };

  // Function: Messages fetch karein
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await getMessages(group.id);
      if (response.success) {
        setMessages(response.data);
      } else {
        Alert.alert("Error", response.error || "Could not load messages");
      }
    } catch (error) {
      console.error("fetchMessages error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Screen load hote hi messages aur profile fetch karein
  useFocusEffect(
    React.useCallback(() => {
      fetchMyProfile();
      fetchMessages();
    }, [group.id])
  );
  
  // ===== REALTIME CHAT SETUP =====
  useEffect(() => {
    // 1. Channel ko subscribe karein
    const channel = supabase
      .channel(`group-chat-${group.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'group_messages',
          filter: `group_id=eq.${group.id}` // Sirf is group ke messages
        },
        async (payload) => {
          console.log('Realtime message received!', payload.new);
          
          // Check karein ki message pehle se state mein nahi hai (local send se)
          const messageExists = messages.some(msg => msg.id === payload.new.id);
          if (messageExists) return;

          // Naya message (payload.new) ka format backend jaisa nahi hai
          // Humein sender ki info alag se fetch karni hogi
          
          const { data: senderData, error } = await supabase
            .from('users')
            .select('id, name')
            .eq('id', payload.new.user_id)
            .single();

          if (error) {
            console.error("Error fetching sender info for realtime:", error);
          } else {
            // Naye message ko format karein
            const formattedMessage = {
              id: payload.new.id,
              created_at: payload.new.created_at,
              text: payload.new.text,
              sender: {
                id: senderData.id,
                name: senderData.name || 'Unknown User'
              }
            };
            // Message ko state mein add karein
            setMessages(prev => [...prev, formattedMessage]);
          }
        }
      )
      .subscribe();

    // 2. Cleanup: Component unmount hone par unsubscribe karein
    return () => {
      supabase.removeChannel(channel);
    };
  }, [group.id, messages]); // `messages` ko dependency mein add karein taaki `messageExists` check reliable ho
  // ==============================

  // Scroll to bottom jab naya message aaye
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Message bhej/save karein
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || sending || !myProfile) return;
    
    setSending(true);
    const text = newMessage.trim();
    setNewMessage(''); // Input ko turant clear karein

    // Optimistic UI: Message ko turant UI mein dikhayein
    const tempId = Date.now().toString(); // Temporary ID
    const optimisticMessage = {
      id: tempId,
      created_at: new Date().toISOString(),
      text: text,
      sender: {
        id: myProfile.id,
        name: myProfile.name
      }
    };
    setMessages(prev => [...prev, optimisticMessage]);
    
    try {
      // API ko call karein
      const response = await sendMessage({
        group_id: group.id,
        text: text
      });
      
      if (!response.success) {
        Alert.alert("Error", response.error || "Message could not be sent");
        setNewMessage(text); // Message waapas input mein daal dein
        // Optimistic update ko reverse karein
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
      }
      // Naya message Realtime se aayega, lekin humne pehle hi add kar diya hai
      // Realtime logic ab duplicates ko check karega
      
    } catch (error) {
      console.error("handleSendMessage error:", error);
      Alert.alert("Error", error.message);
      setNewMessage(text); // Message waapas input mein daal dein
      // Optimistic update ko reverse karein
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  // Message UI render karein
  const renderMessage = (message) => {
    // Check karein ki 'myProfile' load ho gaya hai aur message ka sender 'myProfile' hai
    const isMyMessage = myProfile && message.sender && message.sender.id === myProfile.id;
    
    // Message timestamp format karein
    const timestamp = new Date(message.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    // Sender ka naam (ya avatar initial)
    const senderName = message.sender ? message.sender.name : 'U';
    const avatarInitial = (senderName || 'U').charAt(0).toUpperCase();

    return (
      <View
        key={message.id.toString()} // key ko string banayein
        style={[
          styles.messageContainer,
          isMyMessage
            ? styles.myMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        {!isMyMessage && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          {/* Doosre user ka naam dikhayein */}
          {!isMyMessage && (
            <Text style={styles.senderName}>{senderName}</Text>
          )}
          
          <Text style={styles.messageText}>{message.text}</Text>
          <Text
            style={[
              styles.timestamp,
              isMyMessage ? styles.myTimestamp : styles.otherTimestamp,
            ]}
          >
            {timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>{/* Icon badal diya */}
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>

        </View>
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() =>
            navigation.navigate('PrivateGroupInvite', { group: group })
          }
        >
          <Icon name="account-plus-outline" size={24} color="#fff" /> {/* Icon badal diya */}
        </TouchableOpacity>
      </View>

      {/* Messages */}
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color="#8B5CF6" size="large" />
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ padding: 16 }}
        >
          {messages.map(renderMessage)}
        </ScrollView>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          editable={!sending}
        />
        <TouchableOpacity 
          style={[styles.sendButton, sending && styles.sendButtonDisabled]} 
          onPress={handleSendMessage}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Icon name="send" size={20} color="#fff" /> // Icon badal diya
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles (Thode updates)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: '#0E0E10',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: { padding: 10 },
  backIcon: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerContent: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  groupName: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  groupSubject: { fontSize: 14, color: '#8B5CF6' },
  inviteButton: { padding: 10 },
  // inviteIcon: { color: '#fff', fontSize: 16 }, // Hata diya
  messagesContainer: { flex: 1, backgroundColor: '#111' },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageContainer: { justifyContent: 'flex-end' },
  otherMessageContainer: { justifyContent: 'flex-start' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  messageBubble: {
    maxWidth: width * 0.7,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: { backgroundColor: '#8B5CF6', borderBottomRightRadius: 4 },
  otherMessageBubble: { backgroundColor: '#333', borderBottomLeftRadius: 4 },
  senderName: { // Naya style
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: { fontSize: 16, color: '#fff', lineHeight: 20 },
  timestamp: { fontSize: 12, alignSelf: 'flex-end', marginTop: 4 },
  myTimestamp: { color: 'rgba(255, 255, 255, 0.7)' },
  otherTimestamp: { color: '#999' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  textInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  sendButton: { 
    backgroundColor: '#8B5CF6', 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  sendButtonDisabled: {
    backgroundColor: '#555'
  },
  sendButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

