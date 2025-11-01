// // // import React, { useEffect, useState } from 'react';
// // // import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
// // // import { BarChart } from 'react-native-chart-kit';
// // // import { Dimensions } from 'react-native';
// // // import { NativeModules } from 'react-native';
// // // const { AppUsageModule } = NativeModules;

// // // export default function Settings() {
// // //   const [apps, setApps] = useState([]);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [selectedApp, setSelectedApp] = useState(null);

// // //   const loadData = async () => {
// // //     setRefreshing(true);
// // //     try {
// // //       const data = await AppUsageModule.getUsageStats(); // Get all apps with daily breakdown
// // //       setApps(data.slice(0, 10)); // Take top 10 for display
// // //     } catch (err) {
// // //       console.error(err);
// // //     } finally {
// // //       setRefreshing(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     loadData();
// // //   }, []);

// // //   const screenWidth = Dimensions.get('window').width;
// // //   const barData = {
// // //     labels: apps.map(a => a.appName.length > 8 ? a.appName.slice(0,8)+'…' : a.appName),
// // //     datasets: [{ data: apps.map(a => a.timeMs / 60000) }], // minutes
// // //   };

// // //   const renderAppCard = ({ item }) => (
// // //     <TouchableOpacity 
// // //       style={styles.card}
// // //       onPress={() => setSelectedApp(selectedApp === item ? null : item)}
// // //     >
// // //       <View style={styles.iconPlaceholder}>
// // //         <Text style={styles.iconText}>{item.appName.charAt(0).toUpperCase()}</Text>
// // //       </View>
// // //       <View style={styles.info}>
// // //         <Text style={styles.appName}>{item.appName}</Text>
// // //         <Text style={styles.time}>{item.timeFormatted}</Text>
// // //       </View>
// // //       <Text style={styles.arrow}>{selectedApp === item ? '▼' : '▶'}</Text>
// // //     </TouchableOpacity>
// // //   );

// // //   const renderDailyUsage = (app) => {
// // //     if (!app.dailyUsage || app.dailyUsage.length === 0) return null;
    
// // //     return (
// // //       <View style={styles.dailyUsageContainer}>
// // //         <Text style={styles.dailyUsageTitle}>Daily Usage:</Text>
// // //         {app.dailyUsage.map((day, index) => (
// // //           <View key={index} style={styles.dailyUsageItem}>
// // //             <Text style={styles.dailyUsageDate}>{day.date}</Text>
// // //             <Text style={styles.dailyUsageTime}>{day.timeFormatted}</Text>
// // //           </View>
// // //         ))}
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <Text style={styles.title}>App activity details</Text>
// // //       <Text style={styles.subtitle}>Last 7 days</Text>

// // //       <BarChart
// // //         data={barData}
// // //         width={screenWidth - 20}
// // //         height={220}
// // //         fromZero
// // //         chartConfig={{
// // //           backgroundGradientFrom: '#fff',
// // //           backgroundGradientTo: '#fff',
// // //           color: () => '#4C7EFF',
// // //           labelColor: () => '#555',
// // //         }}
// // //         style={styles.chart}
// // //       />

// // //       <FlatList
// // //         data={apps}
// // //         keyExtractor={(item) => item.packageName}
// // //         refreshing={refreshing}
// // //         onRefresh={loadData}
// // //         renderItem={renderAppCard}
// // //         ListFooterComponent={() => (
// // //           selectedApp ? renderDailyUsage(selectedApp) : null
// // //         )}
// // //       />
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#fff', padding: 10 },
// // //   title: { fontSize: 20, fontWeight: '600', marginBottom: 5 },
// // //   subtitle: { color: '#666', marginBottom: 15 },
// // //   chart: { marginBottom: 15, borderRadius: 8 },
// // //   card: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 8,
// // //     borderBottomWidth: 0.5,
// // //     borderColor: '#ddd',
// // //   },
// // //   iconPlaceholder: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 8,
// // //     marginRight: 12,
// // //     backgroundColor: '#4C7EFF',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   iconText: {
// // //     color: '#fff',
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //   },
// // //   info: { flex: 1 },
// // //   appName: { fontSize: 16, fontWeight: '500' },
// // //   time: { color: '#777', marginTop: 2 },
// // //   arrow: { color: '#999', fontSize: 16, marginLeft: 8 },
// // //   dailyUsageContainer: {
// // //     backgroundColor: '#f8f9fa',
// // //     margin: 10,
// // //     padding: 15,
// // //     borderRadius: 8,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#4C7EFF',
// // //   },
// // //   dailyUsageTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     marginBottom: 10,
// // //     color: '#333',
// // //   },
// // //   dailyUsageItem: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingVertical: 6,
// // //     borderBottomWidth: 0.5,
// // //     borderBottomColor: '#e0e0e0',
// // //   },
// // //   dailyUsageDate: {
// // //     fontSize: 14,
// // //     color: '#666',
// // //     fontWeight: '500',
// // //   },
// // //   dailyUsageTime: {
// // //     fontSize: 14,
// // //     color: '#4C7EFF',
// // //     fontWeight: '600',
// // //   },
// // // });

// // import React, { useEffect, useState } from 'react';
// // import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
// // import { BarChart } from 'react-native-chart-kit';
// // import { Dimensions } from 'react-native';
// // import { NativeModules } from 'react-native';
// // const { AppUsageModule } = NativeModules;

// // export default function Settings() {
// //   const [apps, setApps] = useState([]);
// //   const [refreshing, setRefreshing] = useState(false);

// //   const loadData = async () => {
// //     setRefreshing(true);
// //     try {
// //       const data = await AppUsageModule.getUsageStats(10); // top 10
// //       setApps(data);
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setRefreshing(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   const screenWidth = Dimensions.get('window').width;
// //   const barData = {
// //     labels: apps.map(a => a.appName.length > 8 ? a.appName.slice(0,8)+'…' : a.appName),
// //     datasets: [{ data: apps.map(a => a.timeMs / 60000) }], // minutes
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>App activity details</Text>
// //       <Text style={styles.subtitle}>Last 7 days</Text>

// //       <BarChart
// //         data={barData}
// //         width={screenWidth - 20}
// //         height={220}
// //         fromZero
// //         chartConfig={{
// //           backgroundGradientFrom: '#fff',
// //           backgroundGradientTo: '#fff',
// //           color: () => '#4C7EFF',
// //           labelColor: () => '#555',
// //         }}
// //         style={styles.chart}
// //       />

// //       <FlatList
// //         data={apps}
// //         keyExtractor={(item) => item.packageName}
// //         refreshing={refreshing}
// //         onRefresh={loadData}
// //         renderItem={({ item }) => (
// //           <View style={styles.card}>
// //             <Image source={{ uri: item.iconUri }} style={styles.icon} />
// //             <View style={styles.info}>
// //               <Text style={styles.appName}>{item.appName}</Text>
// //               <Text style={styles.time}>{item.timeFormatted}</Text>
// //             </View>
// //           </View>
// //         )}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#fff', padding: 10 },
// //   title: { fontSize: 20, fontWeight: '600', marginBottom: 5 },
// //   subtitle: { color: '#666', marginBottom: 15 },
// //   chart: { marginBottom: 15, borderRadius: 8 },
// //   card: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 8,
// //     borderBottomWidth: 0.5,
// //     borderColor: '#ddd',
// //   },
// //   icon: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
// //   info: { flex: 1 },
// //   appName: { fontSize: 16, fontWeight: '500' },
// //   time: { color: '#777', marginTop: 2 },
// // });

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   ActivityIndicator,
//   Alert,
//   StatusBar,
// } from 'react-native';
// import { BarChart } from 'react-native-chart-kit';
// import { Dimensions } from 'react-native';
// import { NativeModules } from 'react-native';

// const { AppUsageModule } = NativeModules;

// export default function Settings() {
//   const [apps, setApps] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('week'); // 'week' or 'today'

//   const loadData = async (showLoading = true) => {
//     if (showLoading) setRefreshing(true);
    
//     try {
//       const data = viewMode === 'week' 
//         ? await AppUsageModule.getUsageStats(10)
//         : await AppUsageModule.getTodayUsageStats(10);
      
//       setApps(data || []);
//     } catch (err) {
//       console.error('Error loading usage stats:', err);
      
//       if (err.code === 'PERMISSION_DENIED') {
//         Alert.alert(
//           'Permission Required',
//           'Please grant Usage Access permission to view app statistics.',
//           [{ text: 'OK' }]
//         );
//       } else if (err.code === 'EMPTY') {
//         setApps([]);
//       } else {
//         Alert.alert('Error', 'Failed to load app usage data. Please try again.');
//       }
//     } finally {
//       setRefreshing(false);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, [viewMode]);

//   const screenWidth = Dimensions.get('window').width;
  
//   const barData = {
//     labels: apps.length > 0 
//       ? apps.map(a => {
//           const name = a.appName || 'Unknown';
//           return name.length > 8 ? name.slice(0, 7) + '…' : name;
//         })
//       : ['No Data'],
//     datasets: [
//       { 
//         data: apps.length > 0 
//           ? apps.map(a => Math.max(a.timeMs / 60000, 0.1)) // Convert to minutes
//           : [0]
//       }
//     ],
//   };

//   const toggleViewMode = () => {
//     setViewMode(prev => prev === 'week' ? 'today' : 'week');
//   };

//   const getTotalTime = () => {
//     const total = apps.reduce((sum, app) => sum + app.timeMs, 0);
//     const hours = Math.floor(total / 3600000);
//     const minutes = Math.floor((total % 3600000) / 60000);
//     return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4C7EFF" />
//         <Text style={styles.loadingText}>Loading app usage data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>App Activity</Text>
//         <TouchableOpacity
//           style={styles.toggleButton}
//           onPress={toggleViewMode}
//         >
//           <Text style={styles.toggleButtonText}>
//             {viewMode === 'week' ? '7 Days' : 'Today'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {apps.length > 0 && (
//         <View style={styles.totalContainer}>
//           <Text style={styles.totalLabel}>Total screen time</Text>
//           <Text style={styles.totalTime}>{getTotalTime()}</Text>
//         </View>
//       )}

//       {/* Chart */}
//       {apps.length > 0 ? (
//         <BarChart
//           data={barData}
//           width={screenWidth - 32}
//           height={220}
//           fromZero
//           showValuesOnTopOfBars
//           chartConfig={{
//             backgroundColor: '#fff',
//             backgroundGradientFrom: '#fff',
//             backgroundGradientTo: '#fff',
//             decimalPlaces: 0,
//             color: (opacity = 1) => `rgba(76, 126, 255, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.6})`,
//             style: {
//               borderRadius: 16,
//             },
//             propsForBackgroundLines: {
//               strokeDasharray: '',
//               stroke: '#e3e3e3',
//               strokeWidth: 1,
//             },
//           }}
//           style={styles.chart}
//           yAxisSuffix="m"
//         />
//       ) : (
//         <View style={styles.emptyChart}>
//           <Text style={styles.emptyText}>No usage data available</Text>
//           <Text style={styles.emptySubtext}>
//             Start using apps to see statistics
//           </Text>
//         </View>
//       )}

//       {/* App List */}
//       <FlatList
//         data={apps}
//         keyExtractor={(item) => item.packageName}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={() => loadData(true)}
//             colors={['#4C7EFF']}
//           />
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyList}>
//             <Text style={styles.emptyListText}>
//               No apps to display
//             </Text>
//           </View>
//         )}
//         renderItem={({ item, index }) => (
//           <View style={[styles.card, index === apps.length - 1 && styles.lastCard]}>
//             <View style={styles.rankBadge}>
//               <Text style={styles.rankText}>{index + 1}</Text>
//             </View>
//             <Image
//               source={{ uri: item.iconUri }}
//               style={styles.icon}
//               // ===== FIX YAHAA HAI =====
//               // defaultSource={require('./assets/default-app-icon.png')} // Is line ko comment kar diya
//             />
//             <View style={styles.info}>
//               <Text style={styles.appName} numberOfLines={1}>
//                 {item.appName}
//               </Text>
//               <Text style={styles.packageName} numberOfLines={1}>
//                 {item.packageName}
//               </Text>
//             </View>
//             <Text style={styles.time}>{item.timeFormatted}</Text>
//           </View>
//         )}
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// }

// // ----- Styles (No Changes) -----
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
//     color: '#333',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   toggleButton: {
//     backgroundColor: '#eee',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//   },
//   toggleButtonText: {
//     fontWeight: '600',
//     color: '#333',
//   },
//   totalContainer: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   totalLabel: {
//     fontSize: 16,
//     color: '#666',
//   },
//   totalTime: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//     alignSelf: 'center',
//   },
//   emptyChart: {
//     height: 220,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fafafa',
//     margin: 16,
//     borderRadius: 16,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 4,
//   },
//   listContent: {
//     paddingHorizontal: 16,
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fafafa',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 10,
//   },
//   lastCard: {
//     marginBottom: 30, // Add space at the bottom
//   },
//   rankBadge: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#eee',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   rankText: {
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   icon: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   info: {
//     flex: 1,
//     marginRight: 10,
//   },
//   appName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//   },
//   packageName: {
//     fontSize: 12,
//     color: '#666',
//   },
//   time: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   emptyList: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   emptyListText: {
//     fontSize: 16,
//     color: '#888',
//   },
// });









// Settings.js - Screen Time UI with Day-wise Breakdown
// import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { AppUsageModule } = NativeModules;

export default function Settings() {
  const [weekData, setWeekData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===== Load 7 Days Data =====
  const loadData = async (showLoading = true) => {
    if (showLoading) setRefreshing(true);
    
    try {
      console.log('Settings.js: Loading week data...');
      const data = await AppUsageModule.getUsageStats(10); // Last 7 days
      
      if (data && data.length > 0) {
        // Reverse so today is first [0]
        const reversedData = [...data].reverse();
        setWeekData(reversedData);
        console.log('Settings.js: Loaded', reversedData.length, 'days');
      } else {
        setWeekData([]);
        console.log('Settings.js: No data available');
      }
    } catch (err) {
      console.error('Settings.js: Error loading data:', err);
      
      if (err.code === 'PERMISSION_DENIED') {
        Alert.alert(
          'Permission Required',
          'Please grant Usage Access permission to view app statistics.',
          [{ text: 'Open Settings', onPress: () => {} }]
        );
      } else if (err.code === 'EMPTY') {
        setWeekData([]);
      } else {
        Alert.alert('Error', 'Failed to load screen time data. Please try again.');
      }
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  
  // ===== Get Selected Day's Data =====
  const currentDayData = weekData[selectedDay] || { apps: [], date: 'N/A', dayOfWeek: '' };
  const apps = currentDayData.apps || [];
  
  // ===== Calculate Total Time for Selected Day =====
  const getTotalTime = () => {
    const total = apps.reduce((sum, app) => sum + (app.timeMs || 0), 0);
    const hours = Math.floor(total / 3600000);
    const minutes = Math.floor((total % 3600000) / 60000);
    return { hours, minutes, formatted: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m` };
  };

  // ===== Weekly Chart Data (Bar Chart) =====
  const getWeeklyChartData = () => {
    if (weekData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }]
      };
    }

    return {
      labels: weekData.map(day => day.dayOfWeek || ''),
      datasets: [{
        data: weekData.map(day => {
          const total = (day.apps || []).reduce((sum, app) => sum + (app.timeMs || 0), 0);
          return Math.max(total / 60000, 1); // Convert to minutes, min 1
        })
      }]
    };
  };

  const barData = getWeeklyChartData();

  // ===== Color Palette for Apps =====
  const getProgressColor = (index) => {
    const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#06b6d4'];
    return colors[index % colors.length];
  };

  // ===== Loading State =====
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading screen time data...</Text>
      </View>
    );
  }

  const totalTime = getTotalTime();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050405" />
      
      {/* ===== Modern Header ===== */}
      <View style={styles.modernHeader}>
        <View>
          <Text style={styles.modernTitle}>Screen Time</Text>
          <Text style={styles.modernSubtitle}>Your digital wellbeing</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => loadData(true)}
        >
          <Icon name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            colors={['#8b5cf6']}
            tintColor="#8b5cf6"
          />
        }
      >
        {/* ===== Weekly Overview Chart ===== */}
        {weekData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Last 7 Days Overview</Text>
            <BarChart
              data={barData}
              width={screenWidth - 48}
              height={180}
              fromZero
              showValuesOnTopOfBars={false}
              chartConfig={{
                backgroundColor: '#151517',
                backgroundGradientFrom: '#151517',
                backgroundGradientTo: '#151517',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: '#1f1f23',
                  strokeWidth: 1,
                },
                propsForLabels: {
                  fontSize: 11,
                },
              }}
              style={styles.chart}
              yAxisSuffix="m"
            />
          </View>
        )}

        {/* ===== Day Selector (Horizontal Scroll) ===== */}
        {weekData.length > 0 && (
          <View style={styles.daySelector}>
            <Text style={styles.daySelectorTitle}>Select Day to View Details</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayScrollContent}
            >
              {weekData.map((day, index) => {
                const isSelected = index === selectedDay;
                const dayTotal = (day.apps || []).reduce((sum, app) => sum + (app.timeMs || 0), 0);
                const dayHours = Math.floor(dayTotal / 3600000);
                const dayMinutes = Math.floor((dayTotal % 3600000) / 60000);
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCard,
                      isSelected && styles.dayCardSelected
                    ]}
                    onPress={() => setSelectedDay(index)}
                  >
                    <View style={[
                      styles.dayIndicator, 
                      isSelected && styles.dayIndicatorSelected
                    ]} />
                    <Text style={[styles.dayOfWeek, isSelected && styles.dayOfWeekSelected]}>
                      {day.dayOfWeek}
                    </Text>
                    <Text style={[styles.dayDate, isSelected && styles.dayDateSelected]}>
                      {day.date}
                    </Text>
                    <Text style={[styles.dayTime, isSelected && styles.dayTimeSelected]}>
                      {dayHours > 0 ? `${dayHours}h ${dayMinutes}m` : `${dayMinutes}m`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ===== Total Time Card for Selected Day ===== */}
        {apps.length > 0 && (
          <View style={styles.totalCard}>
            <View style={styles.totalCardHeader}>
              <View style={styles.totalIconWrap}>
                <Icon name="clock-outline" size={28} color="#8b5cf6" />
              </View>
              <View style={styles.totalInfo}>
                <Text style={styles.totalLabel}>
                  {selectedDay === 0 ? 'Today\'s Screen Time' : `Screen Time - ${currentDayData.date}`}
                </Text>
                <Text style={styles.totalTime}>
                  {totalTime.hours > 0 && (
                    <>
                      <Text style={styles.totalTimeValue}>{totalTime.hours}</Text>
                      <Text style={styles.totalTimeUnit}>h </Text>
                    </>
                  )}
                  <Text style={styles.totalTimeValue}>{totalTime.minutes}</Text>
                  <Text style={styles.totalTimeUnit}>m</Text>
                </Text>
              </View>
            </View>
            
            {/* App Count Badge */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="apps" size={16} color="#6B7280" />
                <Text style={styles.statText}>{apps.length} apps used</Text>
              </View>
            </View>
          </View>
        )}

        {/* ===== Apps List for Selected Day ===== */}
        {apps.length > 0 ? (
          <View style={styles.appsListCard}>
            <View style={styles.appsListHeader}>
              <Text style={styles.appsListTitle}>App Breakdown</Text>
              <View style={styles.sortBadge}>
                <Icon name="sort-descending" size={14} color="#9CA3AF" />
                <Text style={styles.sortText}>Most Used</Text>
              </View>
            </View>
            
            {apps.map((item, index) => (
              <View key={item.packageName} style={styles.modernAppCard}>
                {/* Rank Badge */}
                <View style={[styles.modernRankBadge, { backgroundColor: getProgressColor(index) + '20' }]}>
                  <Text style={[styles.modernRankText, { color: getProgressColor(index) }]}>
                    {index + 1}
                  </Text>
                </View>

                {/* App Icon */}
                <View style={styles.modernIconWrap}>
                  {item.iconUri ? (
                    <Image
                      source={{ uri: item.iconUri }}
                      style={styles.modernIcon}
                    />
                  ) : (
                    <View style={[styles.modernIcon, { backgroundColor: getProgressColor(index) + '30', justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ color: getProgressColor(index), fontSize: 20, fontWeight: '700' }}>
                        {item.appName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* App Info */}
                <View style={styles.modernAppInfo}>
                  <Text style={styles.modernAppName} numberOfLines={1}>
                    {item.appName}
                  </Text>
                  <View style={styles.modernAppMeta}>
                    <Icon name="package-variant" size={11} color="#6B7280" />
                    <Text style={styles.modernPackageName} numberOfLines={1}>
                      {item.packageName.split('.').pop()}
                    </Text>
                  </View>
                </View>

                {/* Time Badge */}
                <View style={[styles.modernTimeBadge, { backgroundColor: getProgressColor(index) }]}>
                  <Icon name="clock-outline" size={12} color="#fff" style={{ marginRight: 4 }} />
                  <Text style={styles.modernTimeText}>{item.timeFormatted}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Icon name="clock-alert-outline" size={48} color="#6B7280" />
            </View>
            <Text style={styles.emptyTitle}>No Usage Data</Text>
            <Text style={styles.emptySubtext}>
              {selectedDay === 0 
                ? 'Start using apps to see your screen time statistics' 
                : `No apps were used on ${currentDayData.date}`}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050405',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050405',
  },
  loadingText: {
    marginTop: 16,
    color: '#9CA3AF',
    fontSize: 14,
  },

  // Modern Header
  modernHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
  },
  modernTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  modernSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Chart Card
  chartCard: {
    backgroundColor: '#0E0E10',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },

  // Day Selector
  daySelector: {
    marginBottom: 16,
  },
  daySelectorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  dayScrollContent: {
    paddingHorizontal: 16,
  },
  dayCard: {
    backgroundColor: '#0E0E10',
    borderRadius: 16,
    padding: 14,
    minWidth: 95,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 10,
  },
  dayCardSelected: {
    backgroundColor: '#1a1a2e',
    borderColor: '#8b5cf6',
  },
  dayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
    marginBottom: 8,
  },
  dayIndicatorSelected: {
    backgroundColor: '#8b5cf6',
  },
  dayOfWeek: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  dayOfWeekSelected: {
    color: '#fff',
  },
  dayDate: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
  },
  dayDateSelected: {
    color: '#c4b5fd',
  },
  dayTime: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E5E7EB',
  },
  dayTimeSelected: {
    color: '#fff',
  },

  // Total Card
  totalCard: {
    backgroundColor: '#0E0E10',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  totalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 6,
    fontWeight: '600',
  },
  totalTime: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalTimeValue: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  totalTimeUnit: {
    fontSize: 22,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  // Empty Card
  emptyCard: {
    backgroundColor: '#0E0E10',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Apps List Card
  appsListCard: {
    backgroundColor: '#0E0E10',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  appsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appsListTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  sortBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151517',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  sortText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  // Modern App Card
  modernAppCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151517',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  modernRankBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modernRankText: {
    fontSize: 14,
    fontWeight: '800',
  },
  modernIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#1f1f23',
  },
  modernIcon: {
    width: 44,
    height: 44,
  },
  modernAppInfo: {
    flex: 1,
    marginRight: 12,
  },
  modernAppName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 4,
  },
  modernAppMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modernPackageName: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  modernTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 65,
    justifyContent: 'center',
  },
  modernTimeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});