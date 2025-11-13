import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { NativeModules } from 'react-native';
const { AppUsageModule } = NativeModules;

const { width } = Dimensions.get('window');

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weeklyData, setWeeklyData] = useState([]);
  const [topApps, setTopApps] = useState([]);
  const [totalWeekTime, setTotalWeekTime] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      console.log('📊 Loading weekly analytics...');
      const result = await AppUsageModule.getUsageStats();

      if (result && result.weeklyData) {
        setWeeklyData(result.weeklyData);

        const totalMs = result.weeklyData.reduce((sum, day) => sum + day.timeMs, 0);
        setTotalWeekTime(totalMs);

        const appTotals = {};
        result.weeklyData.forEach(day => {
          day.apps.forEach(app => {
            if (!appTotals[app.packageName]) {
              appTotals[app.packageName] = {
                packageName: app.packageName,
                appName: app.appName,
                totalTime: 0,
              };
            }
            appTotals[app.packageName].totalTime += app.timeMs;
          });
        });

        const topAppsArray = Object.values(appTotals)
          .sort((a, b) => b.totalTime - a.totalTime)
          .slice(0, 5);
        setTopApps(topAppsArray);
      } else {
        Alert.alert('Info', 'No weekly data available');
      }
    } catch (error) {
      console.error('❌ Load analytics error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getDailyAverage = () => {
    if (weeklyData.length === 0) return '0m';
    const avg = totalWeekTime / weeklyData.length;
    return formatTime(avg);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C8BFF" />
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  if (weeklyData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
        <Text style={styles.emptySubtext}>
          Use your phone for a few days to see analytics
        </Text>
      </View>
    );
  }

  // Chart Data
  const labels = weeklyData.map(d => d.label);
  const dataPoints = weeklyData.map(d => Math.max(d.timeMs / (1000 * 60 * 60), 0.1));

  const lineChartData = {
    labels,
    datasets: [{
      data: dataPoints,
      color: (opacity = 1) => `rgba(76, 139, 255, ${opacity})`,
      strokeWidth: 3,
    }],
  };

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
  const pieChartData = topApps.map((app, index) => ({
    name: app.appName.length > 12 ? app.appName.substring(0, 12) + '...' : app.appName,
    population: Math.round(app.totalTime / (1000 * 60 * 60)),
    color: COLORS[index],
    legendFontColor: '#ccc',
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundColor: '#121212',
    backgroundGradientFrom: '#121212',
    backgroundGradientTo: '#121212',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(76, 139, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: { r: '5', strokeWidth: '2', stroke: '#4C8BFF' },
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
    >
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>📊 Weekly Analytics</Text>
        <Text style={styles.totalTime}>{formatTime(totalWeekTime)}</Text>
        <Text style={styles.headerSubtitle}>Total Screen Time</Text>
        <Text style={styles.avgTime}>Daily Average: {getDailyAverage()}</Text>
      </View>

      {/* Line Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📈 Daily Screen Time Trend</Text>
        <LineChart
          data={lineChartData}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          yAxisSuffix="h"
        />
      </View>

      {/* Pie Chart */}
      {topApps.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>🏆 Top 5 Apps (Weekly Hours)</Text>
          <PieChart
            data={pieChartData}
            width={width - 40}
            height={240}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            style={styles.chart}
            hasLegend={false}
            absolute
          />

          {/* Labels below chart */}
          <View style={styles.pieLabels}>
            {topApps.map((app, index) => (
              <View key={app.packageName} style={styles.pieLabelRow}>
                <View style={[styles.colorDot, { backgroundColor: COLORS[index] }]} />
                <Text style={styles.pieLabelText}>
                  {app.appName} — {formatTime(app.totalTime)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Daily Details */}
      <View style={styles.dailyDetailsCard}>
        <Text style={styles.chartTitle}>📅 Daily Breakdown</Text>
        {weeklyData.map((day, index) => (
          <TouchableOpacity
            key={day.date}
            onPress={() => setSelectedDay(selectedDay === index ? null : index)}
            style={styles.dayItem}
          >
            <View style={styles.dayHeader}>
              <Text style={styles.dayDate}>{day.label} - {day.date}</Text>
              <Text style={styles.dayTime}>{day.timeFormatted}</Text>
            </View>

            {selectedDay === index && day.apps.length > 0 && (
              <View style={styles.dayApps}>
                {day.apps.map((app, appIdx) => (
                  <View key={appIdx} style={styles.dayAppItem}>
                    <Text style={styles.dayAppName}>{app.appName}</Text>
                    <Text style={styles.dayAppTime}>{formatTime(app.timeMs)}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#ccc' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#aaa', textAlign: 'center' },
  headerCard: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2c',
  },
  headerTitle: { fontSize: 16, color: '#4C8BFF', opacity: 0.9 },
  totalTime: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginVertical: 8 },
  headerSubtitle: { fontSize: 14, color: '#ccc', opacity: 0.8 },
  avgTime: { fontSize: 14, color: '#ccc', opacity: 0.9, marginTop: 8 },
  chartCard: {
    backgroundColor: '#1e1e1e',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2b2b2b',
  },
  chartTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 16 },
  chart: { marginVertical: 8, borderRadius: 16 },
  pieLabels: { marginTop: 16 },
  pieLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginRight: 8 },
  pieLabelText: { fontSize: 14, color: '#ddd' },
  dailyDetailsCard: {
    backgroundColor: '#1e1e1e',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2b2b2b',
  },
  dayItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2f2f2f' },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayDate: { fontSize: 15, color: '#eee', fontWeight: '500' },
  dayTime: { fontSize: 15, fontWeight: '600', color: '#4C8BFF' },
  dayApps: { marginTop: 10, backgroundColor: '#2a2a2a', borderRadius: 8, padding: 12 },
  dayAppItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  dayAppName: { fontSize: 14, color: '#ccc' },
  dayAppTime: { fontSize: 14, color: '#888', fontWeight: '500' },
});

export default Analytics;
