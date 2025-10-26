import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { Dimensions } from "react-native";
import {
  BarChart as BarChartGifted,
  PieChart,
} from "react-native-gifted-charts";
import { api } from "@/Axios";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import ErrorHandler from "@/Components/ErrorHandler";

const screenWidth = Dimensions.get("window").width;

const donutData = [
  { value: 60, color: "#3b82f6", text: "Weight" },
  { value: 70, color: "#10b981", text: "Workouts" },
];

// Empty data for when no workouts exist
const empty_data = [
  { label: "No Data", value: 0, frontColor: "#6b7280" },
];

const ReportPage = () => {
  const [streak, setStreak] = useState(0);
  const [weightReport, setWeightReport] = useState({});
  const [reportData, setReportData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchMonthlyWorkout();
    fetchStreakCount();
    fetchWeightReport();
  }, []);

  async function fetchMonthlyWorkout() {
    try {
      const response = await api.get("/api/report/monthly-workouts");

      console.log("Report Response: ", response.data);
      if (response && response.data.reportData && Array.isArray(response.data.reportData) && response.data.reportData.length > 0) {
        console.log("Report Data: ", response.data.reportData);
        // Process the data to ensure it has the correct format
        const processedData = response.data.reportData.map((item, index) => ({
          label: item.label || `Month ${index + 1}`,
          value: Math.max(0, Number(item.value) || 0), // Ensure non-negative numeric values
          frontColor: "#3b82f6",
        }));
        setReportData(processedData);
      } else {
        // No workout data available
        setReportData([]);
      }
    } catch (error) {
      console.log("Error fetching monthly workout data:", error);
      setReportData([]);
    }
  }

  async function fetchStreakCount() {
    try {
      const response = await api.get("/api/report/streak");

      if (response) {
        const streak = response.data.streak;
        console.log("Streak Count: ", streak);
        setStreak(Number(streak) || 0); // Ensure numeric value
      }
    } catch (error) {
      console.log("Error fetching streak:", error);
      setStreak(0);
    }
  }

  async function fetchWeightReport() {
    try {
      const response = await api.get("/api/report/weight-summary");

      if (response) {
        console.log("Weight Report: ", response.data);
        const weightData = response.data || {};
        // Ensure numeric values for weight difference
        setWeightReport({
          ...weightData,
          difference: Number(weightData.difference) || 0,
          status: weightData.status || 'No data'
        });
      }
    } catch (error) {
      console.log("Error fetching weight report:", error);
      setWeightReport({
        difference: 0,
        status: 'No data'
      });
    }
  }

  const generatePDFReport = async () => {
    setIsGeneratingPDF(true);
    setErrorMessage("");

    try {
      const currentDate = new Date().toLocaleDateString();
      
      // Create HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>GymTech Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #3b82f6;
              margin: 0;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .stat-card {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
            }
            .stat-title {
              font-size: 14px;
              color: #666;
              margin-bottom: 8px;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #3b82f6;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #333;
              margin-bottom: 15px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .insights {
              background: #e3f2fd;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #2196f3;
            }
            .insight-item {
              margin-bottom: 10px;
              font-size: 14px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GymTech Fitness Report</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-title">Weight Progress</div>
              <div class="stat-value">${weightReport.difference !== undefined ? 
                `${weightReport.difference > 0 ? '+' : ''}${Number(weightReport.difference).toFixed(1)} Kg` : 
                '0 Kg'
              }</div>
              <div style="font-size: 12px; color: #666;">${weightReport.status || 'No data'}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Current Streak</div>
              <div class="stat-value">${Number(streak) || 0} days</div>
              <div style="font-size: 12px; color: #666;">Workout consistency</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Monthly Workout Progress</div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              ${reportData.length > 0 ? reportData.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px; background: white; border-radius: 4px;">
                  <span><strong>${item.label}</strong></span>
                  <span>${Number(item.value) || 0} workouts</span>
                </div>
              `).join('') : `
                <div style="text-align: center; padding: 20px; color: #666;">
                  <p>No workout data available yet. Complete your first workout to see progress here!</p>
                </div>
              `}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Insights & Recommendations</div>
            <div class="insights">
              ${reportData.length > 0 ? `
                <div class="insight-item">🎯 You're on track to reach your weight goal in 2 months.</div>
                <div class="insight-item">💪 Workout consistency is improving compared to last week!</div>
                <div class="insight-item">📈 Keep maintaining your current streak for better results.</div>
                <div class="insight-item">🥗 Consider tracking your meals more consistently for optimal progress.</div>
              ` : `
                <div class="insight-item">🚀 Start your fitness journey by completing your first workout!</div>
                <div class="insight-item">📊 Track your meals to get a complete picture of your health.</div>
                <div class="insight-item">🎯 Set a weight goal to see your progress over time.</div>
                <div class="insight-item">💪 Consistency is key - aim for regular workouts and meal tracking.</div>
              `}
            </div>
          </div>

          <div class="footer">
            <p>This report was generated by GymTech System</p>
            <p>For more detailed analytics, visit the app dashboard</p>
          </div>
        </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Fitness Report',
        });
      } else {
        Alert.alert('Success', 'PDF report generated successfully!');
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrorMessage('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <PagesLayout>
      <ErrorHandler 
        error={errorMessage} 
        onDismiss={() => setErrorMessage("")}
        type="error"
      />
      <ScrollView>
        {/* Header */}
        <Text style={styles.subHeader}>Summary</Text>
        <Text style={styles.mainHeader}>My Report</Text>

        {/* Stat Cards */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weight {weightReport.status || 'Progress'}</Text>
            <Text style={styles.cardValue}>
              {weightReport.difference !== undefined ? 
                `${weightReport.difference > 0 ? '+' : ''}${Number(weightReport.difference).toFixed(1)} Kg` : 
                '0 Kg'
              }
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Streak</Text>
            <Text style={styles.cardValue}>{Number(streak) || 0} days</Text>
          </View>
        </View>

        {/* Bar Chart */}
        <Text style={styles.sectionTitle}>Monthly Progress</Text>
        <View style={styles.chartContainer}>
          {reportData.length > 0 ? (
          <BarChartGifted
            data={reportData}
              barWidth={32}
              barBorderRadius={8}
            frontColor="#3b82f6"
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
              noOfSections={Math.max(4, Math.ceil(Math.max(...reportData.map(d => d.value || 0)) / 5))}
            xAxisColor="transparent"
            yAxisTextStyle={{ color: "#9ca3af", fontSize: 12 }}
            xAxisLabelTextStyle={{ color: "#d1d5db", fontSize: 12 }}
              isAnimated
              animationDuration={1200}
              showGradient
              gradientColor="#60a5fa"
              spacing={16}
              showVerticalLines={false}
              showHorizontalLines={true}
              horizontalLinesColor="#374151"
              maxValue={Math.max(...reportData.map(d => d.value || 0)) + 5}
              height={220}
              width={screenWidth - 80}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataTitle}>No Workout Data Yet</Text>
              <Text style={styles.noDataMessage}>
                Complete your first workout to see your monthly progress chart here!
              </Text>
            </View>
          )}
        </View>

        {/* Insights */}
        <View style={styles.insightBox}>
          {reportData.length > 0 ? (
            <>
          <Text style={styles.insightText}>
            🎯 You're on track to reach your weight goal in 2 months.
          </Text>
          <Text style={styles.insightText}>
            💪 Workout consistency is improving compared to last week!
          </Text>
              <Text style={styles.insightText}>
                📈 Keep maintaining your current streak for better results.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.insightText}>
                🚀 Start your fitness journey by completing your first workout!
              </Text>
              <Text style={styles.insightText}>
                📊 Track your meals to get a complete picture of your health.
              </Text>
              <Text style={styles.insightText}>
                🎯 Set a weight goal to see your progress over time.
              </Text>
            </>
          )}
        </View>

        {/* Export Button */}
        <TouchableOpacity 
          style={[styles.exportButton, isGeneratingPDF && styles.exportButtonDisabled]}
          onPress={generatePDFReport}
          disabled={isGeneratingPDF}
        >
          <Text style={styles.exportButtonText}>
            {isGeneratingPDF ? "Generating PDF..." : "Download Report"}
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
    alignItems: "center",
    justifyContent: "center",
  },
  exportButtonDisabled: {
    backgroundColor: "#6b7280",
    opacity: 0.6,
  },
  exportButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noDataTitle: {
    color: "#9ca3af",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noDataMessage: {
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
