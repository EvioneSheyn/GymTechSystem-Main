import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { ProgressChart, BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const chartConfig = {
  backgroundGradientFrom: "#1e2229ff",
  backgroundGradientTo: "#080a13ff",
  color: (opacity = 1) => `rgba(37, 146, 219, ${opacity})`,
};

const screenWidth = Dimensions.get("window").width;

const ReportPage = () => {
  const weightLost = 5; // example
  const streak = 12; // days
  const workouts = [3, 4, 2, 5, 4, 3, 6, 0]; // weekly sessions
  const [chartWidth, setChartWidth] = useState(0);

  return (
    <PagesLayout>
      <ScrollView style={{ paddingBottom: 64 }}>
        {/* Header */}
        <Text style={styles.subHeader}>Summary</Text>
        <Text style={styles.mainHeader}>My Report</Text>

        {/* Stat Cards */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weight Lost</Text>
            <Text style={styles.cardValue}>{weightLost} Kg</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Streak</Text>
            <Text style={styles.cardValue}>{streak} days</Text>
          </View>
        </View>
        <BarChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", ""],
            datasets: [{ data: workouts }],
          }}
          width={screenWidth} // use container width
          height={220}
          chartConfig={chartConfig}
          fromZero
          style={{
            borderRadius: 16,
            transform: [{ scaleX: 0.9 }], // 👈 scale down horizontally
            marginLeft: -8, // 👈 recenters chart after scaling
          }}
        />

        {/* Progress Pie */}
        <Text style={styles.sectionTitle}>Goal Completion</Text>
        <ProgressChart
          data={{ labels: ["Weight", "Workouts"], data: [0.6, 0.75] }}
          width={320}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />

        {/* Recommendations */}
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            🎯 You're on track to reach your weight goal in 2 months.
          </Text>
          <Text style={styles.insightText}>
            💪 Workout consistency is improving compared to last week!
          </Text>
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton}>
          <Text style={{ color: "white", textAlign: "center" }}>
            Download Report
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </PagesLayout>
  );
};

export default ReportPage;

const styles = StyleSheet.create({
  mainHeader: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  subHeader: {
    color: "#aaa",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 16,
    width: "48%",
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
  },
  cardValue: {
    color: "#3ad",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 16,
    marginVertical: 12,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 16,
    alignSelf: "center",
  },
  insightBox: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },
  insightText: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
  },
  exportButton: {
    backgroundColor: "#222",
    borderRadius: 24,
    padding: 16,
    width: "100%",
    marginTop: 20,
  },
  chartContainer: {
    width: "100%",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 8, // give breathing room
    marginBottom: 16,
  },
});
