// src/screens/PrivateGroupScreen.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
  Clipboard,
  ScrollView, // <-- Bas isko yahan add karna hai
} from 'react-native';

export default function PrivateGroupInviteScreen({ route, navigation }) {
  // Yeh 'group' object pichli screen (GroupChatScreen) se aa raha hai
  const { group } = route.params;
  const [inviteLink, setInviteLink] = useState(`https://yourapp.com/join/${group.id}`);
  const [copied, setCopied] = useState(false);

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Join my study group "${group.name}" for ${group.subject}!\n\nLink: ${inviteLink}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share link');
    }
  };

  const handleCopyLink = async () => {
    await Clipboard.setString(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    Alert.alert('Success', 'Link copied to clipboard!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite to Group</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Group Info Card */}
        <View style={styles.groupInfoCard}>
          <Text style={styles.groupIcon}>🔒</Text>
          <View>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupSubject}>{group.subject}</Text>
          </View>
        </View>

        {/* Invite Link Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invite Link</Text>
          <Text style={styles.sectionDescription}>
            Share this link with others to invite them to your private group.
          </Text>
          <View style={styles.linkContainer}>
            <TextInput style={styles.linkInput} value={inviteLink} editable={false} />
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
              <Text style={styles.copyButtonText}>{copied ? '✓ Copied' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareLink}>
            <Text style={styles.shareButtonText}>Share Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingTop: Platform.OS === 'ios' ? 50 : 20, paddingBottom: 16, backgroundColor: '#0E0E10', borderBottomWidth: 1, borderBottomColor: '#333' },
  backButton: { padding: 10, width: 50 },
  backIcon: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  content: { padding: 20 },
  groupInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 24 },
  groupIcon: { fontSize: 32, marginRight: 16 },
  groupName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  groupSubject: { fontSize: 14, color: '#8B5CF6' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  sectionDescription: { fontSize: 14, color: '#999', marginBottom: 16, lineHeight: 20 },
  linkContainer: { flexDirection: 'row', backgroundColor: '#1a1a1a', borderRadius: 8, borderWidth: 1, borderColor: '#333', marginBottom: 16 },
  linkInput: { flex: 1, padding: 12, color: '#fff', fontSize: 14 },
  copyButton: { backgroundColor: '#8B5CF6', justifyContent: 'center', paddingHorizontal: 16, borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  copyButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  shareButton: { backgroundColor: '#8B5CF6', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  shareButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});