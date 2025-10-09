import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { NativeModules } from "react-native";

const { UsageStatsModule } = NativeModules;

export default function ParentalReport() {
  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  // 📊 Fetch usage data from native module
  const fetchUsageStats = async () => {
    try {
      const data = await UsageStatsModule.getUsageStats();
      setUsageData(data);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
    }
  };

  // ⚙️ Open Usage Access Settings directly (updated)
  const openUsageAccessSettings = () => {
    if (Platform.OS === "android") {
      try {
        Linking.openURL(
          "package:com.android.settings/.Settings$UsageAccessSettingsActivity"
        );
      } catch (e) {
        console.warn(
          "Could not open Usage Access settings directly, opening app settings instead."
        );
        Linking.openSettings();
      }
    } else {
      alert("Usage Access is only available on Android");
    }
  };

  // 🍰 Prepare Pie Chart Data (top 5 apps)
  const chartData = usageData.slice(0, 5).map((item, index) => ({
    name: item.packageName.split(".").pop(),
    population: item.totalTimeInForeground / 60000, // ms → mins
    color: ["#6a1b9a", "#8e24aa", "#ab47bc", "#ba68c8", "#ce93d8"][index % 5],
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <FlatList
        data={usageData.slice(0, 10)}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.heading}>📊 Screen Time Report</Text>

            {/* 🔐 Grant Usage Access */}
            <TouchableOpacity
              style={styles.permissionBtn}
              onPress={openUsageAccessSettings}
            >
              <Text style={styles.permissionText}>Grant Usage Access</Text>
            </TouchableOpacity>

            {/* 🔁 Refresh Button */}
            <TouchableOpacity style={styles.refreshBtn} onPress={fetchUsageStats}>
              <Text style={styles.refreshText}>🔄 Refresh</Text>
            </TouchableOpacity>

            {/* 🥧 Pie Chart */}
            {chartData.length > 0 ? (
              <View style={styles.chartWrapper}>
                <Text style={styles.subHeading}>Top 5 Apps (Last 24 hrs)</Text>
                <PieChart
                  data={chartData}
                  width={Dimensions.get("window").width - 30}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    color: (opacity = 1) => `rgba(106, 27, 154, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="10"
                  absolute
                />
              </View>
            ) : (
              <Text style={styles.noDataText}>
                ⚠️ No usage data found. Please grant Usage Access in settings.
              </Text>
            )}

            <Text style={styles.subHeading}>Top Apps Usage Details</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.appName}>{item.packageName}</Text>
            <Text style={styles.time}>
              {Math.round(item.totalTimeInForeground / 60000)} mins
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 20,
  },
  permissionBtn: {
    backgroundColor: "#6a1b9a",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  permissionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  refreshBtn: {
    backgroundColor: "#ab47bc",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "600",
  },
  chartWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  noDataText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  appName: {
    fontSize: 14,
    flex: 1,
    flexWrap: "wrap",
  },
  time: {
    fontSize: 14,
    fontWeight: "600",
    color: "purple",
  },
});
