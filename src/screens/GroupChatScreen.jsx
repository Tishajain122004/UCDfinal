// src/screens/GroupChatScreen.jsx

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
} from 'react-native';

const { width } = Dimensions.get('window');

export default function GroupChatScreen({ route, navigation }) {
  const { group } = route.params;
  const scrollViewRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'A',
      text: "Hey everyone, ready for tonight's session?",
      timestamp: '2:30 PM',
      avatar: 'A',
    },
    {
      id: 2,
      sender: 'Y',
      text: "Yep, let's tackle chapter 5.",
      timestamp: '2:32 PM',
      avatar: 'Y',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const message = {
      id: Date.now(),
      sender: 'M',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      avatar: 'M',
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const renderMessage = message => {
    const isMyMessage = message.sender === 'M';
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isMyMessage
            ? styles.myMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        {!isMyMessage && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{message.avatar}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text style={styles.messageText}>{message.text}</Text>
          <Text
            style={[
              styles.timestamp,
              isMyMessage ? styles.myTimestamp : styles.otherTimestamp,
            ]}
          >
            {message.timestamp}
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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupSubject}>{group.members} members</Text>
        </View>
        {/* ## YEH BUTTON INVITE SCREEN PAR NAVIGATE KAREGA ## */}
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() =>
            navigation.navigate('PrivateGroupInvite', { group: group })
          }
        >
          <Text style={styles.inviteIcon}>➕ Invite</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={{ padding: 16 }}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
  headerContent: { flex: 1, alignItems: 'center' },
  groupName: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  groupSubject: { fontSize: 14, color: '#8B5CF6' },
  inviteButton: { padding: 10 },
  inviteIcon: { color: '#fff', fontSize: 16 },
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
  sendButton: { backgroundColor: '#8B5CF6', padding: 12, borderRadius: 24 },
  sendButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
