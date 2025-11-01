import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Platform,
  ActivityIndicator // <-- Naya import
} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // <-- useFocusEffect import karein
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// ===== NAYE IMPORTS =====
import { 
  createGroup, 
  getMyGroups, 
  getAllPublicGroups, 
  joinGroup 
} from '../services/groupApi';
// ==========================

export default function StudyGroups({ navigation }) {
  const [activeTab, setActiveTab] = useState('groups');

  // ----- MOCK DATA HATA DIYA GAYA -----
  const [myGroups, setMyGroups] = useState([]);
  const [discoverableGroups, setDiscoverableGroups] = useState([]); // Yeh ab backend se aayega
  // -------------------------------------
  
  const [discoverFiltered, setDiscoverFiltered] = useState([]); // Search results ke liye
  const [searchQuery, setSearchQuery] = useState('');

  // Loading states
  const [isLoadingMyGroups, setIsLoadingMyGroups] = useState(true);
  const [isLoadingDiscover, setIsLoadingDiscover] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(null); // Join button loading ke liye (group id store karega)

  // Create Group Form States
  const [groupName, setGroupName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // ===== DATA FETCH LOGIC =====
  const fetchMyGroups = async () => {
    setIsLoadingMyGroups(true);
    try {
      const response = await getMyGroups();
      if (response.success) {
        setMyGroups(response.data);
      } else {
        Alert.alert('Error', response.error || 'Could not fetch your groups');
      }
    } catch (error) {
      console.error('fetchMyGroups error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoadingMyGroups(false);
    }
  };

  const fetchDiscoverGroups = async () => {
    setIsLoadingDiscover(true);
    try {
      const response = await getAllPublicGroups();
      if (response.success) {
        setDiscoverableGroups(response.data);
        setDiscoverFiltered([]); // Search ko reset karein
        setSearchQuery(''); // Search text ko reset karein
      } else {
        Alert.alert('Error', response.error || 'Could not fetch discoverable groups');
      }
    } catch (error) {
      console.error('fetchDiscoverGroups error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoadingDiscover(false);
    }
  };

  // Jab bhi screen focus mein aaye, data refresh karein
  useFocusEffect(
    React.useCallback(() => {
      fetchMyGroups();
      fetchDiscoverGroups();
    }, [])
  );
  // ============================

  const handleEnterGroup = (group) => {
    // group object ko seedha pass karein
    navigation.navigate('GroupChat', { group: group });
  };

  // ===== JOIN GROUP (BACKEND SE CONNECTED) =====
  const handleJoinGroup = async (groupToJoin) => {
    if (myGroups.some(g => g.id === groupToJoin.id)) {
      Alert.alert("Already Joined", "You are already a member of this group.");
      return;
    }
    
    setIsJoining(groupToJoin.id); // Loading state set karein
    try {
      // Backend ko sirf ID chahiye
      const response = await joinGroup(groupToJoin.id); 
      if (response.success) {
        Alert.alert("Success!", `You have joined the group "${groupToJoin.name}".`);
        // Dono lists refresh karein
        fetchMyGroups();
        // Discover list se join kiya hua group hat jaana chahiye (optional, depends on logic)
        // Abhi ke liye hum discover list bhi refresh kar rahe hain
        fetchDiscoverGroups(); 
      } else {
        Alert.alert('Error', response.error || 'Could not join group');
      }
    } catch (error) {
      console.error('handleJoinGroup error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsJoining(null); // Loading state reset karein
    }
  };

  // ===== SEARCH (BACKEND DATA SE CONNECTED) =====
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setDiscoverFiltered([]);
    } else {
      // 'discoverableGroups' (backend se) par filter karein, 'ALL_DISCOVERABLE_GROUPS' (mock) par nahi
      const filteredGroups = discoverableGroups.filter(group => {
        const queryLower = query.toLowerCase();
        const nameMatch = group.name.toLowerCase().includes(queryLower);
        // subject check (agar backend se aa raha hai)
        const subjectMatch = group.subject && group.subject.toLowerCase().includes(queryLower);
        return nameMatch || subjectMatch; 
      });
      setDiscoverFiltered(filteredGroups);
    }
  };
  
  // ===== CREATE GROUP (BACKEND SE CONNECTED) =====
  const handleCreateGroup = async () => {
    if (!groupName.trim() || !subject.trim()) {
      Alert.alert('Error', 'Please fill in group name and subject.');
      return;
    }
    
    setIsCreating(true);
    try {
      const newGroupData = {
        name: groupName,
        subject: subject,
        description: description,
        is_private: isPrivate, // Yeh value backend se match honi chahiye
      };
      
      const response = await createGroup(newGroupData);
      
      if (response.success) {
        Alert.alert('Success', 'Group created successfully!');
        // Reset form and switch tab
        setGroupName('');
        setSubject('');
        setDescription('');
        setIsPrivate(false);
        setActiveTab('groups');
        // Naya group add ho gaya hai, 'My Groups' list refresh karein
        fetchMyGroups(); 
      } else {
        Alert.alert('Error', response.error || 'Could not create group');
      }
    } catch (error) {
      console.error('handleCreateGroup error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsCreating(false);
    }
  };

  // ===== RENDER CARD (UI UPDATE) =====
  const renderGroupCard = (group, isMyGroup = false) => (
    <View key={group.id} style={styles.groupCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.groupName}>{group.name}</Text>
        {group.is_private && ( // 'isPrivate' ko 'is_private' kiya (database se match)
          <Icon name="lock" size={16} color="#aaa" style={{ marginLeft: 8 }} />
        )}
      </View>
      <Text style={styles.groupSubject}>{group.subject}</Text>
      <Text style={styles.groupDescription}>{group.description}</Text>
      <View style={styles.groupDetails}>
        {/* Members count abhi backend se nahi aa raha, hum ise baad mein add kar sakte hain */}
        {/* <Text style={styles.detailText}>👥 {group.members} members</Text> */}
      </View>

      {isMyGroup ? (
        <TouchableOpacity style={styles.enterButton} onPress={() => handleEnterGroup(group)}>
          <Text style={styles.buttonText}>Enter Group</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={() => handleJoinGroup(group)}
          disabled={isJoining === group.id} // Disable karein jab join ho raha ho
        >
          {isJoining === group.id ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Join Group</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Study Groups</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'groups' && (
          <>
            {/* ===== MY GROUPS (UI UPDATE) ===== */}
            <Text style={styles.sectionTitle}>My Groups</Text>
            {isLoadingMyGroups ? (
              <ActivityIndicator color="#8B5CF6" style={{ marginVertical: 20 }} />
            ) : myGroups.length === 0 ? (
              <Text style={styles.noResultsText}>You haven't joined any groups yet.</Text>
            ) : (
              myGroups.map(group => renderGroupCard(group, true))
            )}

            {/* ===== DISCOVER GROUPS (UI UPDATE) ===== */}
            <Text style={styles.sectionTitle}>Discover Groups</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or subject..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {isLoadingDiscover ? (
              <ActivityIndicator color="#8B5CF6" style={{ marginVertical: 20 }} />
            ) : (
              (searchQuery ? discoverFiltered : discoverableGroups).length > 0 ? (
                 (searchQuery ? discoverFiltered : discoverableGroups).map(group => renderGroupCard(group, false))
               ) : (
                 <Text style={styles.noResultsText}>
                   {searchQuery ? "No groups found." : "No public groups available right now."}
                 </Text>
               )
            )}
          </>
        )}

        {/* ===== CREATE GROUP (UI UPDATE) ===== */}
        {activeTab === 'create' && (
          <View>
            <Text style={styles.sectionTitle}>Create New Group</Text>
            <Text style={styles.formLabel}>Group Name</Text>
            <TextInput style={styles.formInput} value={groupName} onChangeText={setGroupName} placeholder="e.g., 'Calculus Crew'" placeholderTextColor="#666" />
            
            <Text style={styles.formLabel}>Subject</Text>
            <TextInput style={styles.formInput} value={subject} onChangeText={setSubject} placeholder="e.g., 'Mathematics'" placeholderTextColor="#666" />
            
            <Text style={styles.formLabel}>Description</Text>
            <TextInput style={[styles.formInput, {height: 80, textAlignVertical: 'top'}]} value={description} onChangeText={setDescription} placeholder="What is this group about?" multiline placeholderTextColor="#666" />

            <Text style={styles.formLabel}>Group Visibility</Text>
            <View style={styles.privacyToggleContainer}>
              <TouchableOpacity
                style={[
                  styles.privacyOption,
                  !isPrivate && styles.privacyOptionActive
                ]}
                onPress={() => setIsPrivate(false)}
              >
                <Icon name="earth" size={20} color={!isPrivate ? '#fff' : '#888'} />
                <Text style={[styles.privacyText, !isPrivate && styles.privacyTextActive]}>Public</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.privacyOption,
                  isPrivate && styles.privacyOptionActive
                ]}
                onPress={() => setIsPrivate(true)}
              >
                <Icon name="lock" size={20} color={isPrivate ? '#fff' : '#888'} />
                <Text style={[styles.privacyText, isPrivate && styles.privacyTextActive]}>Private</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.privacyHint}>
              {isPrivate 
                ? "Private groups can only be joined via an invite link." 
                : "Public groups will be visible in the 'Discover' section."
              }
            </Text>

            <TouchableOpacity 
              style={styles.createGroupButton} 
              onPress={handleCreateGroup}
              disabled={isCreating} // Disable karein jab create ho raha ho
            >
              {isCreating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.createGroupButtonText}>Create Group</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Styles (koi change nahi)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050405' },
  header: { height: 60, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0E0E10', borderBottomWidth: 1, borderBottomColor: '#333' },
  backBtn: { padding: 8, width: 50, alignItems: 'flex-start' },
  title: { color: '#fff', fontWeight: '700', fontSize: 18 },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#1a1a1a', marginHorizontal: 16, marginTop: 16, borderRadius: 8, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#8B5CF6' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#999' },
  activeTabText: { color: '#fff' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 20, marginBottom: 16 },
  groupCard: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 16 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  groupSubject: { fontSize: 14, color: '#8B5CF6', marginBottom: 8, marginTop: 2 },
  groupDescription: { fontSize: 14, color: '#ccc', marginBottom: 12, lineHeight: 20 },
  groupDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  detailText: { fontSize: 14, color: '#ccc' },
  enterButton: { backgroundColor: '#8B5CF6', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  joinButton: { backgroundColor: '#333', paddingVertical: 10, borderRadius: 8, alignItems: 'center', minHeight: 38 }, // minHeight add kiya
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  searchInput: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, marginBottom: 16 },
  noResultsText: { color: '#888', textAlign: 'center', marginVertical: 20 },
  
  // Form Styles
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#aaa',
    marginBottom: 8,
    marginTop: 8,
  },
  formInput: { backgroundColor: '#333', borderRadius: 8, padding: 12, fontSize: 16, color: '#fff', marginBottom: 16 },
  createGroupButton: { backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 16, minHeight: 50 }, // minHeight add kiya
  createGroupButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  // Privacy Toggle Styles
  privacyToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
  },
  privacyOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  privacyOptionActive: {
    backgroundColor: '#8B5CF6',
  },
  privacyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  privacyTextActive: {
    color: '#fff',
  },
  privacyHint: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
});

