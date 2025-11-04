// import React, { useEffect, useState } from 'react';
// import { saveTodayAnalytics } from '../services/analyticsApi'; // Add this import at top

// import { 
//   View, 
//   Text, 
//   FlatList, 
//   Image, 
//   StyleSheet, 
//   ActivityIndicator,
//   RefreshControl,
//   Alert,
// } from 'react-native';
// import { BarChart } from 'react-native-chart-kit';
// import { Dimensions } from 'react-native';
// import { NativeModules } from 'react-native';
// const { AppUsageModule } = NativeModules;

// export default function Settings() {
//   const [apps, setApps] = useState([]);
//   const [totalTime, setTotalTime] = useState('0m');
//   const [totalTimeMs, setTotalTimeMs] = useState(0);
//   const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const loadData = async () => {
//     setRefreshing(true);
//     try {
//       console.log('Calling AppUsageModule.getUsageStats()...');
      
//       const result = await AppUsageModule.getUsageStats();
      
//       console.log('Result received:', result);
      
//       if (result && result.apps) {
//         const sortedApps = result.apps.sort((a, b) => b.timeMs - a.timeMs);
        
//         console.log('Sorted apps count:', sortedApps.length);
//         console.log('Total time:', result.totalTime);
//         console.log('Weekly data:', result.weeklyData);
        
//         setApps(sortedApps);
//         setTotalTime(result.totalTime || '0m');
//         setTotalTimeMs(result.totalTimeMs || 0);
        
//         // Set weekly data (Mon-Sun)
//         if (result.weeklyData && result.weeklyData.length === 7) {
//           setWeeklyData(result.weeklyData);
//         }
//       } else {
//         console.error('Invalid result format:', result);
//         Alert.alert('Error', 'Invalid data format received');
//       }
//     } catch (err) {
//       console.error('Error loading usage stats:', err);
//       Alert.alert('Error', err.message || 'Failed to load usage stats');
//     } finally {
//       setRefreshing(false);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log('Component mounted, loading data...');
//     loadData();
//   }, []);

//   const screenWidth = Dimensions.get('window').width;
  
//   // Prepare bar chart data for the week (Mon-Sun)
//   const barData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [{
//       data: weeklyData.map(ms => Math.max(0.1, ms / 60000)) // Convert to minutes
//     }],
//   };

//   // Get current day index (0=Mon, 6=Sun)
//   const getCurrentDayIndex = () => {
//     const today = new Date().getDay();
//     return today === 0 ? 6 : today - 1; // Convert Sun=0 to Sun=6
//   };

//   const getFormattedDate = () => {
//     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const date = new Date();
//     return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4C7EFF" />
//         <Text style={styles.loadingText}>Loading app usage data...</Text>
//       </View>
//     );
//   }

//   const currentDayIndex = getCurrentDayIndex();

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>App activity details</Text>
//       </View>

//       <FlatList
//         ListHeaderComponent={
//           <>
//             {/* Total Time Display */}
//             <View style={styles.totalTimeContainer}>
//               <Text style={styles.screenTimeLabel}>Screen time</Text>
//               <Text style={styles.totalTime}>{totalTime}</Text>
//               <Text style={styles.todayLabel}>Today</Text>
//             </View>

//             {/* Weekly Chart */}
//             <View style={styles.chartContainer}>
//               <BarChart
//                 data={barData}
//                 width={screenWidth - 40}
//                 height={200}
//                 fromZero
//                 showValuesOnTopOfBars={false}
//                 withInnerLines={true}
//                 chartConfig={{
//                   backgroundGradientFrom: '#fff',
//                   backgroundGradientTo: '#fff',
//                   color: (opacity = 1, index) => {
//                     // Highlight current day with darker blue
//                     return index === currentDayIndex ? '#4C7EFF' : `rgba(76, 126, 255, ${opacity * 0.4})`;
//                   },
//                   labelColor: () => '#888',
//                   barPercentage: 0.7,
//                   decimalPlaces: 0,
//                   propsForBackgroundLines: {
//                     strokeDasharray: '', // solid lines
//                     stroke: '#e3e3e3',
//                     strokeWidth: 1,
//                   },
//                 }}
//                 style={styles.chart}
//               />
//               <View style={styles.weekDays}>
//                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
//                   <Text 
//                     key={day} 
//                     style={[
//                       styles.dayLabel,
//                       index === currentDayIndex && styles.todayDayLabel
//                     ]}
//                   >
//                     {day}
//                   </Text>
//                 ))}
//               </View>
//             </View>

//             {/* Date Header */}
//             <View style={styles.dateHeader}>
//               <Text style={styles.dateText}>{getFormattedDate()}</Text>
//             </View>
//           </>
//         }
//         data={apps}
//         keyExtractor={(item) => item.packageName}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={loadData} />
//         }
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             {item.iconUri ? (
//               <Image 
//                 source={{ uri: item.iconUri }} 
//                 style={styles.icon}
//                 onError={() => console.log('Icon load error for:', item.packageName)}
//               />
//             ) : (
//               <View style={[styles.icon, styles.iconPlaceholder]}>
//                 <Text style={styles.iconPlaceholderText}>
//                   {(item.appName || 'A')[0].toUpperCase()}
//                 </Text>
//               </View>
//             )}
//             <View style={styles.info}>
//               <Text style={styles.appName}>{item.appName || item.packageName}</Text>
//               <Text style={styles.time}>{item.timeFormatted || '0m'}</Text>
//             </View>
//             <View style={styles.timerIcon}>
//               <Text style={styles.timerText}>⏳</Text>
//             </View>
//           </View>
//         )}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No app usage data available</Text>
//             <Text style={styles.emptySubText}>Grant usage access permission to see your app activity</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: '#666',
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   title: { 
//     fontSize: 22, 
//     fontWeight: '600',
//     color: '#000',
//   },
//   totalTimeContainer: {
//     alignItems: 'center',
//     paddingVertical: 30,
//     backgroundColor: '#fafafa',
//   },
//   screenTimeLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   totalTime: {
//     fontSize: 48,
//     fontWeight: '300',
//     color: '#000',
//   },
//   todayLabel: {
//     fontSize: 14,
//     color: '#999',
//     marginTop: 5,
//   },
//   chartContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     backgroundColor: '#fff',
//   },
//   chart: { 
//     borderRadius: 8,
//     marginVertical: 8,
//   },
//   weekDays: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 10,
//   },
//   dayLabel: {
//     fontSize: 12,
//     color: '#999',
//     width: 40,
//     textAlign: 'center',
//   },
//   todayDayLabel: {
//     color: '#4C7EFF',
//     fontWeight: '600',
//   },
//   dateHeader: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: '#f9f9f9',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   dateText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#000',
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderBottomWidth: 0.5,
//     borderColor: '#f0f0f0',
//     backgroundColor: '#fff',
//   },
//   icon: { 
//     width: 48, 
//     height: 48, 
//     borderRadius: 12, 
//     marginRight: 15,
//   },
//   iconPlaceholder: {
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconPlaceholderText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#666',
//   },
//   info: { 
//     flex: 1,
//   },
//   appName: { 
//     fontSize: 16, 
//     fontWeight: '500',
//     color: '#000',
//     marginBottom: 4,
//   },
//   time: { 
//     color: '#777', 
//     fontSize: 14,
//   },
//   timerIcon: {
//     padding: 5,
//   },
//   timerText: {
//     fontSize: 20,
//     opacity: 0.4,
//   },
//   emptyContainer: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 8,
//   },
//   emptySubText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//   },
// });


import React, { useEffect, useState } from 'react';
import { saveTodayAnalytics } from '../services/analyticsApi';

import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { NativeModules } from 'react-native';
const { AppUsageModule } = NativeModules;

export default function Settings() {
  const [apps, setApps] = useState([]);
  const [totalTime, setTotalTime] = useState('0m');
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(''); // For debugging

  const loadData = async () => {
    setRefreshing(true);
    try {
      console.log('📱 Calling AppUsageModule.getUsageStats()...');
      
      const result = await AppUsageModule.getUsageStats();
      
      console.log('✅ Result received:', JSON.stringify(result, null, 2));
      
      if (result && result.apps) {
        // Sort apps by time (handle both timeMs and totalTimeInForeground)
        const sortedApps = result.apps
          .map(app => ({
            ...app,
            // Normalize the time field
            timeMs: app.timeMs || app.totalTimeInForeground || 0,
            timeFormatted: app.timeFormatted || formatTime(app.timeMs || app.totalTimeInForeground || 0),
            appName: app.appName || app.packageName.split('.').pop() // Fallback for app name
          }))
          .filter(app => app.timeMs > 0) // Filter out apps with 0 usage
          .sort((a, b) => b.timeMs - a.timeMs);
        
        console.log(`📊 Sorted apps count: ${sortedApps.length}`);
        console.log('🔝 Top 5 apps:', sortedApps.slice(0, 5).map(a => `${a.appName}: ${a.timeFormatted}`));
        
        setApps(sortedApps);
        
        // Handle total time
        const totalMs = result.totalTimeMs || result.totalScreenTime || 0;
        setTotalTimeMs(totalMs);
        setTotalTime(result.totalTime || formatTime(totalMs));
        
        // Set weekly data (Mon-Sun)
        if (result.weeklyData && result.weeklyData.length === 7) {
          setWeeklyData(result.weeklyData);
        }

        // 🔥 SAVE TO DATABASE - Only if we have valid data
        if (sortedApps.length > 0 && totalMs > 0) {
          try {
            setSaveStatus('Saving...');
            console.log('💾 Attempting to save analytics...');
            
            const analyticsPayload = {
              totalScreenTime: totalMs,
              apps: sortedApps.map(app => ({
                packageName: app.packageName,
                appName: app.appName,
                totalTimeInForeground: app.timeMs,
                timeFormatted: app.timeFormatted,
                iconUri: app.iconUri || null
              }))
            };

            console.log('📤 Payload:', JSON.stringify(analyticsPayload, null, 2));

            const saveResult = await saveTodayAnalytics(analyticsPayload);
            
            console.log('✅ Analytics saved successfully:', saveResult);
            setSaveStatus('✓ Saved');
            
            // Clear status after 2 seconds
            setTimeout(() => setSaveStatus(''), 2000);
            
          } catch (saveError) {
            console.error('❌ Analytics save failed:', saveError);
            setSaveStatus('⚠ Save failed');
            
            // Show detailed error in debug mode
            if (__DEV__) {
              console.error('Save error details:', {
                message: saveError.message,
                response: saveError.response?.data,
                status: saveError.response?.status
              });
            }
            
            // Don't block UI - clear status after 3 seconds
            setTimeout(() => setSaveStatus(''), 3000);
          }
        } else {
          console.warn('⚠️ No valid data to save (apps:', sortedApps.length, 'totalMs:', totalMs, ')');
        }
        
      } else {
        console.error('❌ Invalid result format:', result);
        Alert.alert('Error', 'Invalid data format received');
      }
    } catch (err) {
      console.error('💥 Error loading usage stats:', err);
      Alert.alert('Error', err.message || 'Failed to load usage stats');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Helper function to format time
  const formatTime = (ms) => {
    if (!ms || ms === 0) return '0m';
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  useEffect(() => {
    console.log('🚀 Component mounted, loading data...');
    loadData();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  
  // Prepare bar chart data for the week (Mon-Sun)
  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: weeklyData.map(ms => Math.max(0.1, ms / 60000)) // Convert to minutes, min 0.1 to show bar
    }],
  };

  // Get current day index (0=Mon, 6=Sun)
  const getCurrentDayIndex = () => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Convert Sun=0 to Sun=6
  };

  const getFormattedDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date();
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C7EFF" />
        <Text style={styles.loadingText}>Loading app usage data...</Text>
      </View>
    );
  }

  const currentDayIndex = getCurrentDayIndex();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>App activity details</Text>
        {/* Debug: Show save status */}
        {saveStatus !== '' && (
          <Text style={styles.saveStatus}>{saveStatus}</Text>
        )}
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Total Time Display */}
            <View style={styles.totalTimeContainer}>
              <Text style={styles.screenTimeLabel}>Screen time</Text>
              <Text style={styles.totalTime}>{totalTime}</Text>
              <Text style={styles.todayLabel}>
                Today · {totalTimeMs > 0 ? `${Math.floor(totalTimeMs / 60000)} minutes` : '0 minutes'}
              </Text>
            </View>

            {/* Weekly Chart */}
            <View style={styles.chartContainer}>
              <BarChart
                data={barData}
                width={screenWidth - 40}
                height={200}
                fromZero
                showValuesOnTopOfBars={false}
                withInnerLines={true}
                chartConfig={{
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  color: (opacity = 1, index) => {
                    return index === currentDayIndex ? '#4C7EFF' : `rgba(76, 126, 255, ${opacity * 0.4})`;
                  },
                  labelColor: () => '#888',
                  barPercentage: 0.7,
                  decimalPlaces: 0,
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: '#e3e3e3',
                    strokeWidth: 1,
                  },
                }}
                style={styles.chart}
              />
              <View style={styles.weekDays}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <Text 
                    key={day} 
                    style={[
                      styles.dayLabel,
                      index === currentDayIndex && styles.todayDayLabel
                    ]}
                  >
                    {day}
                  </Text>
                ))}
              </View>
            </View>

            {/* Date Header */}
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>{getFormattedDate()}</Text>
              <Text style={styles.appCount}>{apps.length} apps used</Text>
            </View>
          </>
        }
        data={apps}
        keyExtractor={(item, index) => `${item.packageName}-${index}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.iconUri ? (
              <Image 
                source={{ uri: item.iconUri }} 
                style={styles.icon}
                onError={(e) => {
                  console.log('Icon load error for:', item.packageName, e.nativeEvent.error);
                }}
              />
            ) : (
              <View style={[styles.icon, styles.iconPlaceholder]}>
                <Text style={styles.iconPlaceholderText}>
                  {(item.appName || 'A')[0].toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.info}>
              <Text style={styles.appName} numberOfLines={1}>
                {item.appName || item.packageName}
              </Text>
              <Text style={styles.time}>{item.timeFormatted || '0m'}</Text>
            </View>
            <View style={styles.timerIcon}>
              <Text style={styles.timerText}>⏳</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No app usage data available</Text>
            <Text style={styles.emptySubText}>Grant usage access permission to see your app activity</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { 
    fontSize: 22, 
    fontWeight: '600',
    color: '#000',
  },
  saveStatus: {
    fontSize: 12,
    color: '#4C7EFF',
    fontWeight: '500',
  },
  totalTimeContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fafafa',
  },
  screenTimeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  totalTime: {
    fontSize: 48,
    fontWeight: '300',
    color: '#000',
  },
  todayLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  chartContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  chart: { 
    borderRadius: 8,
    marginVertical: 8,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  dayLabel: {
    fontSize: 12,
    color: '#999',
    width: 40,
    textAlign: 'center',
  },
  todayDayLabel: {
    color: '#4C7EFF',
    fontWeight: '600',
  },
  dateHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  appCount: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  icon: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    marginRight: 15,
  },
  iconPlaceholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  info: { 
    flex: 1,
  },
  appName: { 
    fontSize: 16, 
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  time: { 
    color: '#777', 
    fontSize: 14,
  },
  timerIcon: {
    padding: 5,
  },
  timerText: {
    fontSize: 20,
    opacity: 0.4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});