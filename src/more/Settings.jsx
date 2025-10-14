import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { NativeModules } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const { AppUsageModule } = NativeModules;

const Settings = () => {
  const [usageData, setUsageData] = useState([]);

  const fetchUsage = async () => {
    try {
      const data = await AppUsageModule.getUsageStats();
      setUsageData(data);
    } catch (err) {
      console.error('Error fetching usage:', err);
    }
  };

  const chartData = {
    labels: usageData.slice(0, 5).map(item => item.appName),
    datasets: [{ data: usageData.slice(0, 5).map(item => item.timeMs / 60000) }], // minutes
  };

  const pieData = usageData.slice(0, 5).map((item, index) => ({
    name: item.appName,
    population: item.timeMs / 60000,
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#AA66CC', '#99CC00'][index % 5],
    legendFontColor: '#FFF',
    legendFontSize: 12,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 App Usage (Digital Wellbeing Clone)</Text>
      <Button title="REFRESH DATA" onPress={fetchUsage} color="#2196F3" />

      {usageData.length > 0 && (
        <>
          <Text style={styles.subtitle}>Top Used Apps</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 16}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            style={styles.chart}
          />

          <PieChart
            data={pieData}
            width={screenWidth - 16}
            height={250}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
          />

          {usageData.slice(0, 10).map((item, index) => (
            <Text key={index} style={styles.appItem}>
              {index + 1}. {item.appName} — {item.timeFormatted}
            </Text>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#000',
  backgroundGradientTo: '#000',
  color: () => '#00FFFF',
  labelColor: () => '#00FFFF',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 8 },
  title: { fontSize: 20, color: '#00FFFF', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#00FFFF', marginTop: 10, textAlign: 'center' },
  chart: { marginVertical: 8, borderRadius: 8 },
  appItem: { color: '#00FFFF', fontSize: 14, marginVertical: 4 },
});

export default Settings;