import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { getWeeklyAnalytics } from '../services/analyticsApi';

const { width } = Dimensions.get('window');

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await getWeeklyAnalytics();
      
      if (response.success) {
        setAnalyticsData(response.data);
      }
    } catch (error) {
      console.error('Load analytics error:', error);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  if (!analyticsData || analyticsData.daily_stats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
        <Text style={styles.emptySubtext}>
          Use your phone for a few days to see analytics
        </Text>
      </View>
    );
  }

  // Prepare data for charts
  const dates = analyticsData.daily_stats.map(item => formatDate(item.date));
  const screenTimes = analyticsData.daily_stats.map(item => 
    Math.round(item.total_time_ms / (1000 * 60 * 60)) // Convert to hours
  );

  // Line Chart Data
  const lineChartData = {
    labels: dates,
    datasets: [{
      data: screenTimes,
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      strokeWidth: 3
    }]
  };

  // Bar Chart Data
  const barChartData = {
    labels: dates,
    datasets: [{
      data: screenTimes
    }]
  };

  // Pie Chart Data (Top 5 Apps)
  const pieChartData = analyticsData.top_apps.map((app, index) => ({
    name: app.appName.length > 15 
      ? app.appName.substring(0, 15) + '...' 
      : app.appName,
    population: Math.round(app.totalTime / (1000 * 60)), // Convert to minutes
    color: COLORS[index % COLORS.length],
    legendFontColor: '#333',
    legendFontSize: 12
  }));

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF'
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Stats */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Last 7 Days</Text>
        <Text style={styles.totalTime}>
          {formatTime(analyticsData.total_screen_time)}
        </Text>
        <Text style={styles.headerSubtitle}>Total Screen Time</Text>
      </View>

      {/* Line Chart - Screen Time Trend */}
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

      {/* Bar Chart - Daily Comparison */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📊 Daily Comparison</Text>
        <BarChart
          data={barChartData}
          width={width - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(76, 217, 100, ${opacity})`,
          }}
          style={styles.chart}
          yAxisSuffix="h"
          showValuesOnTopOfBars
        />
      </View>

      {/* Pie Chart - Top Apps */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>🏆 Top 5 Apps (Total Time)</Text>
        <PieChart
          data={pieChartData}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
          absolute
        />
      </View>

      {/* Top Apps List */}
      <View style={styles.appsListCard}>
        <Text style={styles.chartTitle}>📱 Top Apps Breakdown</Text>
        {analyticsData.top_apps.map((app, index) => (
          <View key={app.packageName} style={styles.appItem}>
            <View style={styles.appRank}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>{app.appName}</Text>
              <Text style={styles.appPackage}>{app.packageName}</Text>
            </View>
            <Text style={styles.appTime}>{app.formattedTime}</Text>
          </View>
        ))}
      </View>

      {/* Daily Details */}
      <View style={styles.dailyDetailsCard}>
        <Text style={styles.chartTitle}>📅 Daily Breakdown</Text>
        {analyticsData.daily_stats.map((day) => (
          <View key={day.date} style={styles.dayItem}>
            <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
            <Text style={styles.dayTime}>{day.total_time_formatted}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF'
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  headerCard: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9
  },
  totalTime: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8
  },
  chartCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  },
  appsListCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  appRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  appInfo: {
    flex: 1
  },
  appName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  appPackage: {
    fontSize: 12,
    color: '#999'
  },
  appTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF'
  },
  dailyDetailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  dayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  dayDate: {
    fontSize: 15,
    color: '#333'
  },
  dayTime: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF'
  }
});

export default Analytics;