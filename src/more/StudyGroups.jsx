// // src/screens/More/StudyGroups.js
// import React from 'react';
// import { View, Text, StyleSheet, Pressable } from 'react-native';

// export default function StudyGroups({ navigation, route }) {
//   return (
//     <View style={styles.container}>
//       {/* Basic header with back button */}
//       <View style={styles.header}>
//         <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={{color:'#fff'}}>‹ Back</Text>
//         </Pressable>
//         <Text style={styles.title}>Study Groups</Text>
//         <View style={{width:50}} />{/* space */}
//       </View>

//       <View style={styles.content}>
//         <Text style={{color:'#fff', fontSize:16}}>This is Study Groups page. Put your UI here.</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex:1, backgroundColor: '#050405' },
//   header: { height:60, paddingHorizontal:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#0E0E10' },
//   backBtn: { padding:8 },
//   title: { color:'#fff', fontWeight:'700', fontSize:18 },
//   content: { padding:16 }
// });


// src/screens/More/StudyGroups.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';

// Searching ke liye ek sample data list
const ALL_DISCOVERABLE_GROUPS = [
  { id: 3, name: 'Physics Masters', subject: 'Physics', description: 'Advanced physics concepts and problem solving.', members: 6},
  { id: 4, name: 'History Buffs', subject: 'History', description: 'Exploring world history collaboratively.', members: 2},
  { id: 5, name: 'React Native Devs', subject: 'Programming', description: 'Let\'s build awesome apps together!', members: 15},
  { id: 6, name: 'Quantum Mechanics', subject: 'Physics', description: 'Diving deep into the quantum realm.', members: 5 },
  { id: 7, name: 'Ancient Civilizations', subject: 'History', description: 'From Mesopotamia to Rome.', members: 11},
];

export default function StudyGroups({ navigation }) {
  const [activeTab, setActiveTab] = useState('groups');

  const [myGroups, setMyGroups] = useState([
    { id: 1, name: 'Calculus Crew', subject: 'Mathematics', description: 'Tackling calculus together.', members: 4},
  ]);
  
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Create Group Form States
  const [groupName, setGroupName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleEnterGroup = (group) => {
    navigation.navigate('GroupChat', { group: group });
  };

  const handleJoinGroup = (groupToJoin) => {
    if (myGroups.some(g => g.id === groupToJoin.id)) {
      Alert.alert("Already Joined", "You are already a member of this group.");
      return;
    }
    setMyGroups(prev => [...prev, { ...groupToJoin, members: groupToJoin.members + 1 }]);
    setSearchQuery('');
    setDiscoverGroups([]);
    Alert.alert("Success!", `You have joined the group "${groupToJoin.name}".`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setDiscoverGroups([]);
    } else {
      const filteredGroups = ALL_DISCOVERABLE_GROUPS.filter(group => {
        const queryLower = query.toLowerCase();
        const nameMatch = group.name.toLowerCase().includes(queryLower);
        const subjectMatch = group.subject.toLowerCase().includes(queryLower);
        return nameMatch || subjectMatch;
      });
      setDiscoverGroups(filteredGroups);
    }
  };
  
  const handleCreateGroup = () => {
    if (!groupName.trim() || !subject.trim()) {
      Alert.alert('Error', 'Please fill in group name and subject.');
      return;
    }
    const newGroup = {
      id: Date.now(),
      name: groupName,
      subject: subject,
      description: description,
      members: 1, // Start with 1 member (the creator)
    };
    setMyGroups(prev => [newGroup, ...prev]);
    // Reset form and switch tab
    setGroupName('');
    setSubject('');
    setDescription('');
    setActiveTab('groups');
    Alert.alert('Success', 'Group created successfully!');
  };

  const renderGroupCard = (group, isMyGroup = false) => (
    <View key={group.id} style={styles.groupCard}>
      <View>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupSubject}>{group.subject}</Text>
      </View>
      <Text style={styles.groupDescription}>{group.description}</Text>
      <View style={styles.groupDetails}>
        <Text style={styles.detailText}>👥 {group.members} members</Text>
        {/* <Text style={styles.detailText}>🗓️ {group.schedule}</Text> */}
      </View>

      {isMyGroup ? (
        <TouchableOpacity style={styles.enterButton} onPress={() => handleEnterGroup(group)}>
          <Text style={styles.buttonText}>Enter Group</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinGroup(group)}>
          <Text style={styles.buttonText}>Join Group</Text>
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
            <Text style={styles.sectionTitle}>My Groups</Text>
            {myGroups.map(group => renderGroupCard(group, true))}

            <Text style={styles.sectionTitle}>Discover Groups</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or subject..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {discoverGroups.length > 0 ? (
              discoverGroups.map(group => renderGroupCard(group, false))
            ) : (
              <Text style={styles.noResultsText}>
                {searchQuery ? "No groups found." : "Type to search for groups."}
              </Text>
            )}
          </>
        )}

        {activeTab === 'create' && (
          <View>
            <Text style={styles.sectionTitle}>Create New Group</Text>
            <TextInput style={styles.formInput} value={groupName} onChangeText={setGroupName} placeholder="Group Name" placeholderTextColor="#666" />
            <TextInput style={styles.formInput} value={subject} onChangeText={setSubject} placeholder="Subject/Category" placeholderTextColor="#666" />
            <TextInput style={[styles.formInput, {height: 80, textAlignVertical: 'top'}]} value={description} onChangeText={setDescription} placeholder="Description" multiline placeholderTextColor="#666" />
            <TouchableOpacity style={styles.createGroupButton} onPress={handleCreateGroup}>
              <Text style={styles.createGroupButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

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
  groupName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  groupSubject: { fontSize: 14, color: '#8B5CF6', marginBottom: 8 },
  groupDescription: { fontSize: 14, color: '#ccc', marginBottom: 12, lineHeight: 20 },
  groupDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  detailText: { fontSize: 14, color: '#ccc' },
  enterButton: { backgroundColor: '#8B5CF6', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  joinButton: { backgroundColor: '#333', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  searchInput: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, marginBottom: 16 },
  noResultsText: { color: '#888', textAlign: 'center', marginVertical: 20 },
  formInput: { backgroundColor: '#333', borderRadius: 8, padding: 12, fontSize: 16, color: '#fff', marginBottom: 16 },
  createGroupButton: { backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  createGroupButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});