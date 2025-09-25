import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { Dimensions } from "react-native";
import {
  BarChart as BarChartGifted,
  PieChart,
} from "react-native-gifted-charts";
import { api } from "@/Axios";

const screenWidth = Dimensions.get("window").width;

const donutData = [
  { value: 60, color: "#3b82f6", text: "Weight" },
  { value: 70, color: "#10b981", text: "Workouts" },
];

const mock_data = [
  { label: "Jan", value: 400 },
  { label: "Feb", value: 300 },
  { label: "Mar", value: 200 },
  { label: "Apr", value: 278 },
  { label: "May", value: 189 },
];

const ReportPage = () => {
  const [streak, setStreak] = useState(0);
  const [weightReport, setWeightReport] = useState({});
  const [reportData, setReportData] = useState(mock_data);

  useEffect(() => {
    fetchMonthlyWorkout();
    fetchStreakCount();
    fetchWeightReport();
  }, []);

  async function fetchMonthlyWorkout() {
    try {
      const response = await api.get("/api/report/monthly-workouts");

      console.log("Report Response: ", response.data);
      if (response) {
        console.log("Report Data: ", response.data.reportData);
        setReportData(response.data.reportData);
      }
    } catch (error) {}
  }

  async function fetchStreakCount() {
    try {
      const response = await api.get("/api/report/streak");

      if (response) {
        const streak = response.data.streak;
        console.log("Streak Count: ", streak);
        setStreak(streak);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  async function fetchWeightReport() {
    try {
      const response = await api.get("/api/report/weight-summary");

      if (response) {
        console.log("Weight Report: ", response.data);
        setWeightReport(response.data);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  return (
    <PagesLayout>
      <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
        {/* Header */}
        <Text style={styles.subHeader}>Summary</Text>
        <Text style={styles.mainHeader}>My Report</Text>

        {/* Stat Cards */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weight {weightReport.status}</Text>
            <Text style={styles.cardValue}>{weightReport.difference} Kg</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Streak</Text>
            <Text style={styles.cardValue}>{streak} days</Text>
          </View>
        </View>

        {/* Bar Chart */}
        <Text style={styles.sectionTitle}>Monthly Progress</Text>
        <View style={styles.chartContainer}>
          <BarChartGifted
            data={reportData}
            barWidth={28}
            barBorderRadius={6}
            frontColor="#3b82f6"
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            noOfSections={4}
            xAxisColor="transparent"
            yAxisTextStyle={{ color: "#9ca3af", fontSize: 12 }}
            xAxisLabelTextStyle={{ color: "#d1d5db", fontSize: 12 }}
          />
        </View>

        {/* Insights */}
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
    marginTop: 8,
  },
  subHeader: {
    color: "#aaa",
    marginBottom: 4,
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
    fontSize: 14,
  },
  cardValue: {
    color: "#3b82f6",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 16,
    marginVertical: 12,
  },
  chartContainer: {
    width: "100%",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    overflow: "visible", // ✅ allow labels to render outside
    paddingBottom: 24, // ✅ extra space for x-axis labels
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
    backgroundColor: "#3b82f6",
    borderRadius: 24,
    padding: 16,
    width: "100%",
    marginTop: 20,
  },
});
