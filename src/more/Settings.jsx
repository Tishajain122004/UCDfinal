

// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   Image, 
//   StyleSheet, 
//   ActivityIndicator,
//   RefreshControl,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import { BarChart } from 'react-native-chart-kit';
// import { NativeModules } from 'react-native';
// const { AppUsageModule } = NativeModules;

// export default function Settings() {
//   const [apps, setApps] = useState([]);
//   const [totalTime, setTotalTime] = useState('0m');
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const loadData = async () => {
//     setRefreshing(true);
//     try {
//       console.log('📱 Fetching usage data...');
      
//       const result = await AppUsageModule.getUsageStats();
      
//       console.log('✅ Data received');
//       console.log('Apps:', result?.apps?.length);
//       console.log('Total:', result?.totalTime);
      
//       if (result && result.apps) {
//         const sortedApps = result.apps
//           .filter(app => app.timeMs > 0)
//           .sort((a, b) => b.timeMs - a.timeMs);
        
//         setApps(sortedApps);
//         setTotalTime(result.totalTime || '0m');
        
//         if (result.weeklyData && result.weeklyData.length === 7) {
//           console.log('📊 Weekly data received');
//           setWeeklyData(result.weeklyData);
//         }
//       }
      
//     } catch (err) {
//       console.error('❌ Error:', err.message);
//       Alert.alert('Error', err.message);
//     } finally {
//       setRefreshing(false);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const screenWidth = Dimensions.get('window').width;

//   const chartData = {
//     labels: weeklyData.map(d => d.label),
//     datasets: [{
//       data: weeklyData.length > 0 
//         ? weeklyData.map(d => Math.max(d.timeMs / (1000 * 60 * 60), 0.1))
//         : [0.1]
//     }]
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#4285F4" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={apps}
//         keyExtractor={(item, idx) => `${item.packageName}-${idx}`}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={loadData} />
//         }
//         ListHeaderComponent={
//           <>
//             <View style={styles.timeHeader}>
//               <Text style={styles.label}>Screen time</Text>
//               <Text style={styles.bigTime}>{totalTime}</Text>
//               <Text style={styles.subLabel}>Today</Text>
//             </View>

//             {weeklyData.length > 0 && (
//               <View style={styles.chartSection}>
//                 <BarChart
//                   data={chartData}
//                   width={screenWidth - 40}
//                   height={200}
//                   fromZero
//                   showValuesOnTopOfBars={false}
//                   withInnerLines={false}
//                   chartConfig={{
//                     backgroundColor: '#fff',
//                     backgroundGradientFrom: '#fff',
//                     backgroundGradientTo: '#fff',
//                     color: (opacity = 1, index) => {
//                       return weeklyData[index]?.isToday 
//                         ? '#1a73e8' 
//                         : `rgba(66, 133, 244, ${opacity * 0.4})`;
//                     },
//                     labelColor: () => '#666',
//                     barPercentage: 0.5,
//                     decimalPlaces: 0,
//                   }}
//                   style={styles.chart}
//                 />
                
//                 <View style={styles.daysRow}>
//                   {weeklyData.map((day, i) => (
//                     <View key={i} style={styles.dayColumn}>
//                       <Text style={[
//                         styles.dayText,
//                         day.isToday && styles.todayText
//                       ]}>
//                         {day.label}
//                       </Text>
//                       <Text style={styles.timeText}>
//                         {day.timeFormatted}
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             )}

//             <View style={styles.dateLine}>
//               <Text style={styles.dateText}>
//                 {new Date().toLocaleDateString('en-US', {
//                   weekday: 'short',
//                   month: 'short',
//                   day: 'numeric'
//                 })}
//               </Text>
//             </View>
//           </>
//         }
//         renderItem={({ item }) => (
//           <View style={styles.appRow}>
//             {item.iconUri ? (
//               <Image source={{ uri: item.iconUri }} style={styles.appIcon} />
//             ) : (
//               <View style={[styles.appIcon, styles.iconPlaceholder]}>
//                 <Text style={styles.iconLetter}>
//                   {item.appName[0]?.toUpperCase() || '?'}
//                 </Text>
//               </View>
//             )}
            
//             <View style={styles.appInfo}>
//               <Text style={styles.appName} numberOfLines={1}>
//                 {item.appName}
//               </Text>
//               <Text style={styles.appTime}>{item.timeFormatted}</Text>
//             </View>

//             <Text style={styles.chevron}>›</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   timeHeader: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#fafafa' },
//   label: { fontSize: 14, color: '#666', marginBottom: 8 },
//   bigTime: { fontSize: 52, fontWeight: '300', color: '#000' },
//   subLabel: { fontSize: 14, color: '#999', marginTop: 4 },
//   chartSection: { paddingTop: 20, paddingHorizontal: 20, backgroundColor: '#fff' },
//   chart: { marginVertical: 8 },
//   daysRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, marginBottom: 20 },
//   dayColumn: { alignItems: 'center', width: 45 },
//   dayText: { fontSize: 12, color: '#999', marginBottom: 4 },
//   todayText: { color: '#1a73e8', fontWeight: '600' },
//   timeText: { fontSize: 11, color: '#666' },
//   dateLine: { paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fafafa' },
//   dateText: { fontSize: 15, fontWeight: '500', color: '#000' },
//   appRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
//   appIcon: { width: 40, height: 40, borderRadius: 10, marginRight: 16 },
//   iconPlaceholder: { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
//   iconLetter: { fontSize: 18, fontWeight: '600', color: '#666' },
//   appInfo: { flex: 1 },
//   appName: { fontSize: 16, color: '#000', marginBottom: 3 },
//   appTime: { fontSize: 14, color: '#666' },
//   chevron: { fontSize: 24, color: '#ccc' },
// });

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { NativeModules } from 'react-native';
import { saveTodayAnalytics, checkTodayDataSaved, markTodayAsSaved } from '../services/analyticsService';

const { AppUsageModule } = NativeModules;

export default function Settings() {
  const [apps, setApps] = useState([]);
  const [totalTime, setTotalTime] = useState('0m');
  const [weeklyData, setWeeklyData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState(''); // For user feedback

  // ✅ Sync data to backend
  const syncToBackend = async (usageData) => {
    try {
      // Check token EXACTLY like your study tasks do
      const token = await AsyncStorage.getItem('authToken');
      
      console.log('=== SYNC DEBUG START ===');
      console.log('Token exists?', token ? 'YES ✅' : 'NO ❌');
      if (token) {
        console.log('Token preview:', token.substring(0, 30) + '...');
      }
      console.log('========================');

      if (!token) {
        console.log('⚠️ No token - skipping sync');
        setSyncStatus('Not synced');
        return;
      }

      // Check if already synced
      const alreadySaved = await checkTodayDataSaved();
      if (alreadySaved) {
        console.log('ℹ️ Already synced today');
        setSyncStatus('✓ Synced');
        return;
      }

      // Prepare data
      const appsData = usageData.apps.map(app => ({
        packageName: app.packageName,
        appName: app.appName,
        timeMs: app.timeMs,
        timeFormatted: app.timeFormatted
      }));

      const totalMs = usageData.apps.reduce((sum, app) => sum + app.timeMs, 0);

      console.log('🔄 Starting sync...');
      console.log('Total screen time (ms):', totalMs);
      console.log('Number of apps:', appsData.length);
      
      setSyncStatus('Syncing...');

      await saveTodayAnalytics({
        totalScreenTime: totalMs,
        apps: appsData
      });
      
      await markTodayAsSaved();
      setSyncStatus('✓ Synced');
      console.log('✅ Sync completed!');

    } catch (error) {
      console.error('❌ SYNC FAILED:', error.message);
      console.error('Error details:', error.response?.data || error);
      
      setSyncStatus('✗ Failed');
      
      // Show what went wrong
      Alert.alert(
        'Sync Failed', 
        `Error: ${error.response?.data?.message || error.message}\n\nCheck console for details.`
      );
    }
  };

  const loadData = async () => {
    setRefreshing(true);
    try {
      console.log('📱 Fetching usage data...');
      
      const result = await AppUsageModule.getUsageStats();
      
      console.log('✅ Data received');
      console.log('Apps:', result?.apps?.length);
      console.log('Total:', result?.totalTime);
      
      if (result && result.apps) {
        const sortedApps = result.apps
          .filter(app => app.timeMs > 0)
          .sort((a, b) => b.timeMs - a.timeMs);
        
        setApps(sortedApps);
        setTotalTime(result.totalTime || '0m');
        
        if (result.weeklyData && result.weeklyData.length === 7) {
          console.log('📊 Weekly data received');
          setWeeklyData(result.weeklyData);
        }

        // ✅ Auto-sync to backend
        if (sortedApps.length > 0) {
          await syncToBackend({ apps: sortedApps });
        }
      }
      
    } catch (err) {
      console.error('❌ Error:', err.message);
      Alert.alert('Error', err.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // ✅ Smart sync: Only once per day, not every 30 minutes
    // Data will sync automatically when user opens the app
    // No need for interval polling
  }, []);

  const screenWidth = Dimensions.get('window').width;

  const chartData = {
    labels: weeklyData.map(d => d.label),
    datasets: [{
      data: weeklyData.length > 0 
        ? weeklyData.map(d => Math.max(d.timeMs / (1000 * 60 * 60), 0.1))
        : [0.1]
    }]
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading screen time...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={apps}
        keyExtractor={(item, idx) => `${item.packageName}-${idx}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
        ListHeaderComponent={
          <>
            <View style={styles.timeHeader}>
              <Text style={styles.label}>Screen time</Text>
              <Text style={styles.bigTime}>{totalTime}</Text>
              <Text style={styles.subLabel}>Today</Text>
              
              {/* Sync Status Indicator */}
              {syncStatus && (
                <Text style={[
                  styles.syncStatus,
                  syncStatus.includes('✓') && styles.syncSuccess,
                  syncStatus.includes('✗') && styles.syncError
                ]}>
                  {syncStatus}
                </Text>
              )}
            </View>

            {weeklyData.length > 0 && (
              <View style={styles.chartSection}>
                <BarChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={200}
                  fromZero
                  showValuesOnTopOfBars={false}
                  withInnerLines={false}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1, index) => {
                      return weeklyData[index]?.isToday 
                        ? '#1a73e8' 
                        : `rgba(66, 133, 244, ${opacity * 0.4})`;
                    },
                    labelColor: () => '#666',
                    barPercentage: 0.5,
                    decimalPlaces: 0,
                  }}
                  style={styles.chart}
                />
                
                <View style={styles.daysRow}>
                  {weeklyData.map((day, i) => (
                    <View key={i} style={styles.dayColumn}>
                      <Text style={[
                        styles.dayText,
                        day.isToday && styles.todayText
                      ]}>
                        {day.label}
                      </Text>
                      <Text style={styles.timeText}>
                        {day.timeFormatted}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.dateLine}>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.appRow}>
            {item.iconUri ? (
              <Image source={{ uri: item.iconUri }} style={styles.appIcon} />
            ) : (
              <View style={[styles.appIcon, styles.iconPlaceholder]}>
                <Text style={styles.iconLetter}>
                  {item.appName[0]?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
            
            <View style={styles.appInfo}>
              <Text style={styles.appName} numberOfLines={1}>
                {item.appName}
              </Text>
              <Text style={styles.appTime}>{item.timeFormatted}</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
  timeHeader: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#fafafa' },
  label: { fontSize: 14, color: '#666', marginBottom: 8 },
  bigTime: { fontSize: 52, fontWeight: '300', color: '#000' },
  subLabel: { fontSize: 14, color: '#999', marginTop: 4 },
  syncStatus: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0'
  },
  syncSuccess: { color: '#0f9d58', backgroundColor: '#e6f4ea' },
  syncError: { color: '#d93025', backgroundColor: '#fce8e6' },
  chartSection: { paddingTop: 20, paddingHorizontal: 20, backgroundColor: '#fff' },
  chart: { marginVertical: 8 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, marginBottom: 20 },
  dayColumn: { alignItems: 'center', width: 45 },
  dayText: { fontSize: 12, color: '#999', marginBottom: 4 },
  todayText: { color: '#1a73e8', fontWeight: '600' },
  timeText: { fontSize: 11, color: '#666' },
  dateLine: { paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fafafa' },
  dateText: { fontSize: 15, fontWeight: '500', color: '#000' },
  appRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  appIcon: { width: 40, height: 40, borderRadius: 10, marginRight: 16 },
  iconPlaceholder: { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  iconLetter: { fontSize: 18, fontWeight: '600', color: '#666' },
  appInfo: { flex: 1 },
  appName: { fontSize: 16, color: '#000', marginBottom: 3 },
  appTime: { fontSize: 14, color: '#666' },
  chevron: { fontSize: 24, color: '#ccc' },
});
