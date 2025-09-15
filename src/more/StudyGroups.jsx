// src/screens/More/StudyGroups.js
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function StudyGroups({ navigation, route }) {
  return (
    <View style={styles.container}>
      {/* Basic header with back button */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{color:'#fff'}}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title}>Study Groups</Text>
        <View style={{width:50}} />{/* space */}
      </View>

      <View style={styles.content}>
        <Text style={{color:'#fff', fontSize:16}}>This is Study Groups page. Put your UI here.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: '#050405' },
  header: { height:60, paddingHorizontal:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#0E0E10' },
  backBtn: { padding:8 },
  title: { color:'#fff', fontWeight:'700', fontSize:18 },
  content: { padding:16 }
});
