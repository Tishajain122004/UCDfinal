import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMyRewards } from '../services/rewardApi';

export default function Achievements() {
  const navigation = useNavigation();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const response = await getMyRewards();
      if (response.success) {
        setRewards(response.data);
      } else {
        Alert.alert("Error", response.error);
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRewards();
    }, [])
  );

  const renderItem = ({ item }) => {
    // API se 'achievements' object nested aata hai
    const ach = item.achievements; 
    
    return (
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Icon name={ach.icon || 'trophy'} size={32} color="#fbbf24" />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.cardTitle}>{ach.title}</Text>
          <Text style={styles.cardDescription}>{ach.description}</Text>
          <Text style={styles.cardDate}>
            Unlocked on: {new Date(item.unlocked_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Achievements</Text>
        <View style={{ width: 50 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color="#a78bfa" size="large" />
      ) : (
        <FlatList
          data={rewards}
          renderItem={renderItem}
          keyExtractor={(item) => item.achievements.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No achievements unlocked yet. Keep focusing!</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050405' },
  header: { 
    height: 60, 
    paddingHorizontal: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#0E0E10', 
    borderBottomWidth: 1, 
    borderBottomColor: '#333' 
  },
  backBtn: { padding: 8, width: 50, alignItems: 'flex-start' },
  title: { color: '#fff', fontWeight: '700', fontSize: 18 },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textWrapper: {
    flex: 1,
  },
  cardTitle: {
    color: '#fbbf24', // Yellow
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
  },
  cardDate: {
    color: '#888',
    fontSize: 12,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});