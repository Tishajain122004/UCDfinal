// import { View, Text } from 'react-native'
// import React from 'react'

// export default function Settings() {
//   return (
//     <View>
//       <Text>Settings</Text>
//     </View>
//   )
// }

// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, Button, StyleSheet, Dimensions } from "react-native";
// import { BarChart } from "react-native-chart-kit";
// // import AppUsage from "../native/AppUsage"; // Adjust the path as necessary
// import { NativeModules } from "react-native";
// const { AppUsageModule } = NativeModules;


// export default function Settings() {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [usageData, setUsageData] = useState([]);

//   useEffect(() => {
//     checkPermission();
//   }, []);

//   const checkPermission = async () => {
//     const granted = await AppUsageModule.hasUsagePermission();
//     console.log("Usage access granted?", granted);
//     setHasPermission(granted);
//     if (granted) loadUsage();
//   };

//   const loadUsage = async () => {
//     const data = await AppUsageModule.getDailyUsage();
//     console.log("Usage data:", data);
//     setUsageData(data);
//   };

//   if (!hasPermission) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "white", marginBottom: 12 }}>Usage permission not granted</Text>
//         <Button title="Grant Permission" onPress={() => AppUsageModule.openUsageSettings()} />
//       </View>
//     );
//   }

//   const chartData = usageData.map((item) => item.totalTime);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Today's Screen Time</Text>

//       {usageData.length > 0 ? (
//         <BarChart
//           data={{
//             labels: usageData.map((item) => item.packageName.split(".").pop().slice(0, 5)), // short label
//             datasets: [{ data: chartData }],
//           }}
//           width={Dimensions.get("window").width - 30}
//           height={220}
//           yAxisLabel=""
//           yAxisSuffix="m"
//           chartConfig={{
//             backgroundColor: "#000",
//             backgroundGradientFrom: "#000",
//             backgroundGradientTo: "#000",
//             decimalPlaces: 0,
//            color: () => "#008080",      // teal color
// labelColor: () => "#FFFFFF", // white color

//           }}
//           style={{ marginVertical: 8, borderRadius: 16 }}
//         />
//       ) : (
//         <Text style={{ color: "gray", marginBottom: 16 }}>No usage data yet</Text>
//       )}

//       <FlatList
//         data={usageData}
//         keyExtractor={(item) => item.packageName}
//         renderItem={({ item }) => (
//           <View style={styles.row}>
//             <Text style={styles.app}>{item.packageName}</Text>
//             <Text style={{ color: "white" }}>{Math.round(item.totalTime)} min</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "black" },
//   header: { fontSize: 20, fontWeight: "bold", color: "white", marginBottom: 16 },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//     borderBottomWidth: 0.5,
//     borderColor: "#555",
//   },
//   app: { color: "white", flex: 1 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" },
// });









// AppUsageScreen.js
// import React, { useEffect, useState } from "react";
// import { View, Text, Button, FlatList, Alert, ScrollView, Dimensions } from "react-native";
// import { NativeModules } from "react-native";
// import { BarChart } from "react-native-chart-kit";

// const { AppUsageModule } = NativeModules;

// export default function Settings() {
//   const [data, setData] = useState([]);
//   const [hasPermission, setHasPermission] = useState(false);

//   // -----------------------
//   // Check Permission
//   // -----------------------
//   const checkPermission = async () => {
//     try {
//       const granted = await AppUsageModule.hasUsagePermission();
//       setHasPermission(granted);
//       if (!granted) {
//         Alert.alert(
//           "Permission Required",
//           "Please enable Usage Access Permission",
//           [
//             { text: "Open Settings", onPress: () => AppUsageModule.openUsageSettings() },
//             { text: "Cancel", style: "cancel" },
//           ]
//         );
//       }
//     } catch (err) {
//       console.error("Permission check error:", err);
//     }
//   };

//   // -----------------------
//   // Load Daily Usage
//   // -----------------------
//   const loadUsage = async () => {
//     try {
//       const usage = await AppUsageModule.getDailyUsage();
//       console.log("Usage:", usage);
//       setData(usage);
//     } catch (err) {
//       console.error("Error fetching usage:", err);
//     }
//   };

//   useEffect(() => {
//     checkPermission();
//   }, []);

//   // -----------------------
//   // Chart Config
//   // -----------------------
//   const screenWidth = Dimensions.get("window").width;
//   const chartData = {
//     labels: data.map((item) => item.packageName.split(".").pop()), // last word of package name
//     datasets: [
//       {
//         data: data.map((item) => item.totalTime), // in minutes
//       },
//     ],
//   };

//   return (
//     <ScrollView style={{ flex: 1, padding: 20 }}>
//       <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
//         App Usage (Daily)
//       </Text>

//       <Button title="Fetch Usage" onPress={loadUsage} />

//       {data.length > 0 ? (
//         <>
//           <BarChart
//             data={chartData}
//             width={screenWidth - 30}
//             height={250}
//             yAxisLabel=""
//             yAxisSuffix="m"
//             chartConfig={{
//               backgroundColor: "#1cc910",
//               backgroundGradientFrom: "#eff3ff",
//               backgroundGradientTo: "#efefef",
//               decimalPlaces: 1,
//               color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//               style: { borderRadius: 16 },
//             }}
//             style={{ marginVertical: 20, borderRadius: 16 }}
//           />

//           <FlatList
//             data={data}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({ item }) => (
//               <Text style={{ marginVertical: 4 }}>
//                 {item.packageName} → {item.totalTime.toFixed(2)} mins
//               </Text>
//             )}
//           />
//         </>
//       ) : (
//         <Text style={{ marginTop: 20 }}>No usage data found</Text>
//       )}
//     </ScrollView>
//   );
// }





// Settings.jsx

// import React, { useEffect, useState } from "react";
// import { View, Text, Button, FlatList, Alert, SafeAreaView, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
// import { NativeModules } from "react-native";
// import { BarChart } from "react-native-chart-kit";

// const { AppUsageModule } = NativeModules;

// // ✅ Helper function to format milliseconds into "Xh Ym"
// const formatTime = (ms) => {
//   if (!ms || ms < 60000) {
//     return "Less than 1 min";
//   }
//   const totalMinutes = Math.floor(ms / 60000);
//   const hours = Math.floor(totalMinutes / 60);
//   const minutes = totalMinutes % 60;

//   if (hours > 0) {
//     return `${hours}h ${minutes}m`;
//   }
//   return `${minutes}m`;
// };

// export default function Settings() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const checkAndLoadUsage = async () => {
//     setLoading(true);
//     try {
//       const hasPermission = await AppUsageModule.hasUsagePermission();
//       if (hasPermission) {
//         const usage = await AppUsageModule.getDailyUsage();
//         usage.sort((a, b) => b.totalTime - a.totalTime); // Sort by highest usage
//         setData(usage);
//       } else {
//         Alert.alert(
//           "Permission Required",
//           "This feature requires Usage Access permission to work.",
//           [
//             { text: "Open Settings", onPress: () => AppUsageModule.openUsageSettings() },
//             { text: "Cancel", style: "cancel" },
//           ]
//         );
//       }
//     } catch (err) {
//       console.error("Error fetching usage stats:", err);
//       Alert.alert("Error", "Could not fetch app usage data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAndLoadUsage();
//   }, []);

//   const screenWidth = Dimensions.get("window").width;

//   // Header component that contains everything that isn't the list
//   const ListHeader = () => (
//     <>
//       <Text style={styles.header}>App Usage (Today)</Text>
//       <Button title="Refresh Usage" onPress={checkAndLoadUsage} />
//       {data.length > 0 && (
//         <BarChart
//           data={{
//             labels: data.slice(0, 5).map(item => item.appName.split(' ')[0]), // Show first word of app name
//             datasets: [{ data: data.slice(0, 5).map(item => item.totalTime / 60000) }], // Convert ms to minutes for chart
//           }}
//           width={screenWidth - 40}
//           height={220}
//           yAxisSuffix="m"
//           chartConfig={{
//             backgroundColor: "#1e293b",
//             backgroundGradientFrom: "#1e293b",
//             backgroundGradientTo: "#0f172a",
//             decimalPlaces: 0,
//             color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//           }}
//           style={styles.chart}
//           fromZero
//         />
//       )}
//     </>
//   );

//   return (
//     // ✅ Use SafeAreaView and remove the ScrollView
//     <SafeAreaView style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0ff" style={{ marginTop: 50 }}/>
//       ) : (
//         <FlatList
//           data={data}
//           keyExtractor={(item) => item.packageName}
//           ListHeaderComponent={ListHeader} // ✅ Put chart and header here
//           ListEmptyComponent={
//              <Text style={styles.emptyText}>No usage data found. Please grant permission and press Refresh.</Text>
//           }
//           renderItem={({ item }) => (
//             <View style={styles.row}>
//               <Text style={styles.app} numberOfLines={1}>{item.appName}</Text>
//               {/* ✅ Use the new formatTime function */}
//               <Text style={styles.time}>{formatTime(item.totalTime)}</Text>
//             </View>
//           )}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#000" },
//   header: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 10, marginTop: 10 },
//   chart: { marginVertical: 15, borderRadius: 16 },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 0.5,
//     borderColor: "#333",
//   },
//   app: { color: "white", fontSize: 16, flex: 1, marginRight: 10 },
//   time: { color: "#0ff", fontWeight: "bold", fontSize: 16 },
//   emptyText: { marginTop: 40, color: "gray", textAlign: 'center', fontSize: 16 }
// });


// screens/AppUsageScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { NativeModules } from "react-native";

const { AppUsageModule } = NativeModules;

function minutesToHhMm(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.floor(totalMinutes % 60);
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export default function Settings() {
  const [hasPermission, setHasPermission] = useState(false);
  const [days, setDays] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(6); // 0..6; 6 is today

  const checkPermission = async () => {
    try {
      const granted = await AppUsageModule.hasUsagePermission();
      setHasPermission(Boolean(granted));
      if (granted) {
        await loadWeekly();
      }
    } catch (e) {
      setHasPermission(false);
    }
  };

  const loadWeekly = async () => {
    try {
      const res = await AppUsageModule.getWeeklyUsage();
      // res: { days: [{ label, date, totalMinutes, apps: [{packageName,appName,totalMinutes,icon}]}] }
      const nextDays = Array.isArray(res?.days) ? res.days : [];
      setDays(nextDays);
      setSelectedIndex(Math.max(0, nextDays.length - 1));
    } catch (e) {
      setDays([]);
    }
  };

  useEffect(() => {
    checkPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white", marginBottom: 12 }}>Usage permission not granted</Text>
        <Button title="Grant Permission" onPress={() => AppUsageModule.openUsageSettings()} />
      </View>
    );
  }

  const labels = days.map((d) => d.label);
  const dataPoints = days.map((d) => d.totalMinutes);
  const selectedDay = days[selectedIndex] || { totalMinutes: 0, apps: [] };
  const todayTotal = (days[days.length - 1] && days[days.length - 1].totalMinutes) || 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Screen time</Text>
        <Text style={styles.totalToday}>{minutesToHhMm(todayTotal)}</Text>
      </View>

      {days.length > 0 ? (
        <TouchableOpacity activeOpacity={0.85} onPress={loadWeekly}>
          <BarChart
            data={{
              labels,
              datasets: [{ data: dataPoints }],
            }}
            width={Dimensions.get("window").width - 32}
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix="m"
            chartConfig={{
              backgroundColor: "#000",
              backgroundGradientFrom: "#000",
              backgroundGradientTo: "#000",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`,
              labelColor: () => '#bbb',
              propsForBackgroundLines: { strokeDasharray: "3 6", stroke: "#333" },
            }}
            style={{ marginVertical: 8, borderRadius: 12 }}
            withInnerLines
            showBarTops={false}
          />
        </TouchableOpacity>
      ) : (
        <Text style={{ color: "gray", marginBottom: 16 }}>No usage data yet</Text>
      )}

      <View style={styles.daySelector}>
        {days.map((d, i) => (
          <TouchableOpacity key={String(d.date)} onPress={() => setSelectedIndex(i)} style={styles.dayPill}>
            <Text style={[styles.dayText, i === selectedIndex && styles.dayTextActive]}>{d.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subHeader}>{selectedIndex === days.length - 1 ? "Today" : selectedDay.label} apps</Text>

      <FlatList
        data={selectedDay.apps}
        keyExtractor={(item) => item.packageName}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const imgSrc = item.icon ? { uri: `data:image/png;base64,${item.icon}` } : null;
          return (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                {imgSrc ? <Image source={imgSrc} style={styles.icon} /> : <View style={styles.iconPlaceholder} />}
                <View style={{ marginLeft: 10 }}>
                  <Text numberOfLines={1} style={styles.appName}>{item.appName || item.packageName}</Text>
                  <Text style={styles.pkg} numberOfLines={1}>{item.packageName}</Text>
                </View>
              </View>
              <Text style={styles.time}>{minutesToHhMm(item.totalMinutes)}</Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={{ color: "#888", paddingVertical: 8 }}>No apps recorded</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "black" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  header: { fontSize: 20, fontWeight: "bold", color: "white" },
  totalToday: { color: "#00ffff", fontSize: 16, fontWeight: "600" },
  subHeader: { color: "#ccc", marginVertical: 8, fontSize: 14 },
  daySelector: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  dayPill: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, backgroundColor: "#151515" },
  dayText: { color: "#888" },
  dayTextActive: { color: "#00ffff", fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 10 },
  icon: { width: 28, height: 28, borderRadius: 6 },
  iconPlaceholder: { width: 28, height: 28, borderRadius: 6, backgroundColor: "#333" },
  appName: { color: "white", fontSize: 14, maxWidth: Dimensions.get("window").width * 0.5 },
  pkg: { color: "#777", fontSize: 12 },
  time: { color: "white", fontWeight: "600" },
  separator: { height: 1, backgroundColor: "#222" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" },
});