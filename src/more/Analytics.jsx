// AnalyticsScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
  // Dummy state (replace later with DB data)
  const [data, setData] = useState({
    studyTime: "0.0h",
    sessions: 0,
    screenTime: "6.5h",
    streak: "0d",
    focusScores: [0, 0, 0, 0],
    screenTimeDistribution: [
      { name: "Productive", population: 62, color: "#28a745", legendFontColor: "#fff" },
      { name: "Neutral", population: 23, color: "#f0ad4e", legendFontColor: "#fff" },
      { name: "Distracting", population: 15, color: "#dc3545", legendFontColor: "#fff" },
    ],
  });

  // Example: fetch from DB later
  useEffect(() => {
    // fetchDataFromDB().then(res => setData(res))
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics</Text>
      <Text style={styles.subHeader}>Track your study habits and progress</Text>

      {/* Top Stats Cards */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Icon name="time-outline" size={24} color="#9b8cf6" />
          <Text style={styles.cardTitle}>Study Time</Text>
          <Text style={styles.cardValue}>{data.studyTime}</Text>
        </View>

        <View style={styles.card}>
          <Icon name="radio-button-on-outline" size={24} color="#9b8cf6" />
          <Text style={styles.cardTitle}>Sessions</Text>
          <Text style={styles.cardValue}>{data.sessions}</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Icon name="phone-portrait-outline" size={24} color="#9b8cf6" />
          <Text style={styles.cardTitle}>Screen Time</Text>
          <Text style={styles.cardValue}>{data.screenTime}</Text>
        </View>

        <View style={styles.card}>
          <Icon name="flame-outline" size={24} color="#9b8cf6" />
          <Text style={styles.cardTitle}>Streak</Text>
          <Text style={styles.cardValue}>{data.streak}</Text>
        </View>
      </View>

      {/* Focus Score Trend */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Focus Score Trend</Text>
        <LineChart
          data={{
            labels: ["M", "T", "W", "T", "F", "S", "S"],
            datasets: [{ data: data.focusScores }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#1c1c1c",
            backgroundGradientFrom: "#1c1c1c",
            backgroundGradientTo: "#1c1c1c",
            color: (opacity = 1) => `rgba(155, 140, 246, ${opacity})`,
            labelColor: () => "#999",
          }}
          bezier
          style={styles.chartStyle}
        />
      </View>

      {/* Screen Time Distribution */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Screen Time Distribution</Text>
        <PieChart
          data={data.screenTimeDistribution}
          width={screenWidth - 40}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          chartConfig={{
            color: () => "#fff",
          }}
          absolute
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    color: "#9b8cf6",
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeader: {
    color: "#aaa",
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    width: "48%",
    padding: 15,
    alignItems: "center",
  },
  cardTitle: {
    color: "#aaa",
    marginTop: 5,
  },
  cardValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  chartTitle: {
    color: "#fff",
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 16,
  },
  chartStyle: {
    borderRadius: 12,
  },
});
