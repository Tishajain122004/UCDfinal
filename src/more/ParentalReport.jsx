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
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from "react-native-chart-kit";
import { NativeModules } from "react-native";
import { generateUsageReportPDF } from '../services/pdfGeneratorService';

const { UsageStatsModule } = NativeModules;

export default function ParentalReport() {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    fetchUsageStats();
    loadUserName();
  }, []);

  // Load user name from storage
  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.log('Could not load user name:', error);
    }
  };

  // 📊 Fetch usage data from native module
  const fetchUsageStats = async () => {
    try {
      setLoading(true);
      console.log('📱 Fetching usage stats...');
      
      const data = await UsageStatsModule.getUsageStats();
      
      console.log('✅ Received data:', data?.length, 'apps');
      setUsageData(data || []);
      
    } catch (error) {
      console.error("❌ Error fetching usage stats:", error);
      Alert.alert('Error', 'Failed to fetch usage stats. Please grant Usage Access permission.');
    } finally {
      setLoading(false);
    }
  };

  // ⚙️ Open Usage Access Settings directly
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
      Alert.alert("Not Available", "Usage Access is only available on Android");
    }
  };

  // 📄 Download PDF Report
  const handleDownloadPDF = async () => {
    try {
      if (usageData.length === 0) {
        Alert.alert('No Data', 'No usage data available. Please grant Usage Access permission first.');
        return;
      }

      setDownloadingPDF(true);
      console.log('📥 Starting PDF generation...');

      await generateUsageReportPDF(usageData, userName);

    } catch (error) {
      console.error('❌ PDF download failed:', error);
      Alert.alert('Error', 'Failed to download PDF: ' + error.message);
    } finally {
      setDownloadingPDF(false);
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

  // Calculate total time
  const totalTime = usageData.reduce((sum, app) => sum + app.totalTimeInForeground, 0);
  const totalHours = Math.floor(totalTime / (1000 * 60 * 60));
  const totalMinutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a1b9a" />
        <Text style={styles.loadingText}>Loading usage data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={usageData.slice(0, 10)}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.heading}>📊 Screen Time Report</Text>

            {/* Total Time Display */}
            {usageData.length > 0 && (
              <View style={styles.totalTimeBox}>
                <Text style={styles.totalTimeLabel}>Total Screen Time</Text>
                <Text style={styles.totalTimeValue}>
                  {totalHours > 0 ? `${totalHours}h ` : ''}{totalMinutes}m
                </Text>
                <Text style={styles.totalTimeSubtext}>Last 24 hours</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              {/* 🔐 Grant Usage Access */}
              <TouchableOpacity
                style={[styles.actionBtn, styles.permissionBtn]}
                onPress={openUsageAccessSettings}
              >
                <Text style={styles.actionBtnText}>🔐 Grant Access</Text>
              </TouchableOpacity>

              {/* 🔁 Refresh Button */}
              <TouchableOpacity 
                style={[styles.actionBtn, styles.refreshBtn]} 
                onPress={fetchUsageStats}
                disabled={loading}
              >
                <Text style={styles.actionBtnText}>
                  {loading ? '⏳' : '🔄'} Refresh
                </Text>
              </TouchableOpacity>
            </View>

            {/* 📥 Download PDF Button */}
            <TouchableOpacity
              style={[styles.downloadBtn, downloadingPDF && styles.downloadBtnDisabled]}
              onPress={handleDownloadPDF}
              disabled={downloadingPDF || usageData.length === 0}
            >
              {downloadingPDF ? (
                <>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.downloadBtnText}>Generating PDF...</Text>
                </>
              ) : (
                <Text style={styles.downloadBtnText}>📥 Download PDF Report</Text>
              )}
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
              <View style={styles.noDataBox}>
                <Text style={styles.noDataEmoji}>⚠️</Text>
                <Text style={styles.noDataText}>No usage data found</Text>
                <Text style={styles.noDataSubtext}>
                  Please grant Usage Access in settings and use your phone for a while.
                </Text>
              </View>
            )}

            <Text style={styles.subHeading}>📱 Top Apps Usage Details</Text>
          </>
        }
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>{item.packageName.split('.').pop()}</Text>
              <Text style={styles.packageName}>{item.packageName}</Text>
            </View>
            <Text style={styles.time}>
              {Math.round(item.totalTimeInForeground / 60000)} mins
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No apps tracked yet</Text>
          </View>
        }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#1a1a1a',
  },
  totalTimeBox: {
    backgroundColor: '#6a1b9a',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  totalTimeLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  totalTimeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  totalTimeSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  permissionBtn: {
    backgroundColor: "#6a1b9a",
  },
  refreshBtn: {
    backgroundColor: "#ab47bc",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  downloadBtn: {
    backgroundColor: '#8e24aa',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadBtnDisabled: {
    backgroundColor: '#ccc',
  },
  downloadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 20,
    color: '#333',
  },
  chartWrapper: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noDataBox: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    borderStyle: 'dashed',
  },
  noDataEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6a1b9a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  packageName: {
    fontSize: 12,
    color: '#999',
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6a1b9a",
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});