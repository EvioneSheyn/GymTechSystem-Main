import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { RadioButton } from "@/Components/RadioButton";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/Axios";
import ModalComponent from "../../Components/ModalComponent";
import { MaterialIcons } from "@expo/vector-icons";

const chartConfig = {
  backgroundGradientFrom: "#1e2229ff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#080a13ff",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(37, 146, 219, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: true, // optional
};

const defaultData = {
  labels: [0, 0, 0, 0, 0],
  datasets: [
    {
      data: [0, 0, 0, 0, 0],
      color: (opacity = 1) => `rgba(0, 96, 252, ${opacity})`, // line color
      strokeWidth: 5,
    },
  ],
  legend: ["Weight"],
};

const WhiteText = ({ children, style }) => (
  <Text style={[{ color: "white" }, style]}>{children}</Text>
);

const ProgressPage = () => {
  const [profile, setProfile] = useState();
  const [showModal, setShowModal] = useState(false);
  const [newWeight, setNewWeight] = useState(0);
  const [category, setCategory] = useState("Week");
  const [weightRecords, setWeightRecords] = useState({});
  const [weightGap, setWeightGap] = useState({});
  const [chartData, setChartData] = useState(defaultData);

  const options = ["Week", "Month", "Year", "All"];

  useEffect(() => {
    const fetchProfile = async () => {
      const storedProfile = await AsyncStorage.getItem("profile");

      setProfile(JSON.parse(storedProfile));
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const data = {
      labels: [...(weightRecords.dates ?? [0, 0])],
      datasets: [
        {
          data: [...(weightRecords.weights ?? [0, 0])],
          color: (opacity = 1) => `rgba(0, 96, 252, ${opacity})`, // line color
          strokeWidth: 5,
        },
      ],
      legend: ["Weight"],
    };

    setChartData(() => ({ ...data }));
  }, [weightRecords]);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await api.get("/api/weights", {
          params: {
            category: category,
          },
        });

        if (response.status === 200) {
          const weights = response.data.weights;

          const records = await weights.map(({ createdAt, weight }) => ({
            date: new Date(createdAt),
            weight,
          }));

          const datesRecords = await getWeightDates(records);
          const weightDataRecords = await getWeightData(records);

          getWeightGap(records);
          setWeightRecords(() => ({
            dates: [...datesRecords],
            weights: [...weightDataRecords],
          }));
        }
      } catch (error) {
        console.log(
          "Error fetching weight records: ",
          error.response.data.message
        );
      }
    };

    fetchWeights();
  }, [profile]); // TODO add category selection here in the future

  function getWeightDates(records) {
    return records.map(({ date }) =>
      date.toLocaleDateString([], {
        month: "long",
        day: "2-digit",
      })
    );
  }

  function getWeightGap(records) {
    const from = records[0].weight;
    const to = records[records.length - 1].weight;
    const gap = from - to;

    setWeightGap(() => gap);
    return {
      from,
      to,
      lost: gap,
    };
  }

  function getWeightData(records) {
    return records.map(({ weight }) => weight);
  }

  const handleUpdateWeight = async () => {
    try {
      const response = await api.post("/api/update-weight", {
        newWeight: newWeight,
      });

      if (response.status === 200) {
        setProfile((prev) => ({ ...prev, weight: newWeight }));
        await AsyncStorage.setItem("profile", JSON.stringify(profile));
        alert("Succesfully recorded new weight!");
        setShowModal(false);
      }
    } catch (error) {
      console.log("Error updating weight: ", error.response.data.message);
    }
  };

  return (
    <PagesLayout
      showModal={showModal}
      modal={
        <ModalComponent onClose={() => setShowModal(false)}>
          <View style={styles.modalCenterView}>
            <Text style={styles.modalTitleText}>Enter new weight:</Text>
            <Text style={styles.modalSubText}>
              Updating your weight allows us to see your weight progress
            </Text>
            <View style={styles.modalInputView}>
              <TextInput
                keyboardType="numeric"
                style={{ flexGrow: 1 }}
                autoFocus
                onChangeText={(text) => setNewWeight(Number(text))}
              />
              <Text style={{ borderLeftWidth: 1, paddingLeft: 12 }}>Kg</Text>
            </View>
            <View style={styles.modalButtonGroupView}>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleUpdateWeight}
              >
                <WhiteText style={{ fontWeight: "bold" }}>Save</WhiteText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowModal(false)}
              >
                <WhiteText style={{ fontWeight: "bold" }}>Cancel</WhiteText>
              </TouchableOpacity>
            </View>
          </View>
        </ModalComponent>
      }
    >
      <View>
        <Text style={styles.subHeader}>Details of</Text>
        <Text style={styles.mainHeader}>Weight Progress</Text>
      </View>
      {/* {WeightAnalyticsFilter()} */}
      <View
        style={{
          height: 250,
          width: "100%",
          backgroundColor: "#1e293b",
          borderRadius: 16,
          marginTop: 16,
        }}
      >
        <LineChart
          data={chartData}
          width={320}
          height={220}
          verticalLabelRotation={20}
          chartConfig={chartConfig}
          style={{ paddingBottom: 24 }}
          // fromNumber={0}
          fromZero
          bezier
        />
      </View>
      <View style={{ marginTop: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#aaa" }}>
            From{" "}
            <Text style={{ fontWeight: "bold", color: "white" }}>
              {weightGap.from ?? 0}
            </Text>{" "}
            kg
          </Text>
          <Text style={{ color: "#aaa" }}>
            Lost{" "}
            <Text style={{ fontWeight: "bold", color: "white" }}>
              {weightGap.lost ?? 0}
            </Text>{" "}
            kg
          </Text>
        </View>
        <View style={styles.outerBar}>
          <View style={styles.innerBar}></View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 2,
          backgroundColor: "#b1d1f5ff",
          marginTop: 12,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: "#0066ffff",
          alignItems: "center",
          justifyContent: "start",
          paddingVertical: 8,
          paddingHorizontal: 4,
        }}
      >
        <MaterialIcons
          name={"info"}
          style={{ color: "#2b8effff", fontSize: 24 }}
        />
        <Text style={{ fontSize: 11 }}>
          It is recommended to update your weight every month!
        </Text>
      </View>
      <Text
        style={{
          color: "#aaa",
          fontSize: 16,
          marginBottom: 8,
          marginTop: 16,
        }}
      >
        My Goals
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.goalContainer}>
          <Text style={{ color: "white", fontSize: 16 }}>Weight</Text>
          <WhiteText style={{ color: "#aaa", fontSize: 32 }}>
            <WhiteText style={{ fontWeight: "bold" }}>
              {profile?.weight}
            </WhiteText>{" "}
            Kg
          </WhiteText>
        </View>
        <View style={styles.goalContainer}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
            }}
          >
            Goal
          </Text>
          <WhiteText style={{ color: "#aaa", fontSize: 32 }}>
            <WhiteText style={{ fontWeight: "bold" }}>{60}</WhiteText> Kg
          </WhiteText>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addCurrentWeighButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Add Current Weight
        </Text>
      </TouchableOpacity>
    </PagesLayout>
  );

  function WeightAnalyticsFilter() {
    return (
      <View style={styles.optionsContainer}>
        {options.map((item, index) => (
          <RadioButton
            style={{
              paddingHorizontal: 24,
              paddingVertical: 8,
              backgroundColor: category === item ? "#94a3b8" : "transparent",
              borderRadius: 24,
            }}
            color={"white"}
            label={item}
            key={index}
            selected={category === item}
            onPress={() => setCategory(item)}
          />
        ))}
      </View>
    );
  }
};

export default ProgressPage;

export const styles = StyleSheet.create({
  mainHeader: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  subHeader: {
    color: "#aaa",
  },
  goalContainer: {
    height: 100,
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 14,
  },
  optionsContainer: {
    backgroundColor: "#1e293b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    marginTop: 16,
  },
  outerBar: {
    backgroundColor: "#aaa",
    width: "100%",
    height: 10,
    borderRadius: 24,
    overflow: "hidden",
  },
  innerBar: {
    backgroundColor: "#333",
    width: "50%",
    height: "100%",
    borderRadius: 24,
  },
  modalCenterView: {
    backgroundColor: "white",
    height: 200,
    width: 300,
    zIndex: 11,
    borderRadius: 12,
    padding: 14,
  },
  modalSubText: {
    fontWeight: 600,
    color: "#6e6e6ede",
    fontSize: 12,
  },
  modalTitleText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  modalInputView: {
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#160c0cff",
    borderRadius: 12,
    marginVertical: 12,
  },
  modalButtonGroupView: {
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 6,
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#3ad",
    borderRadius: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(221,81,81,1)",
    borderRadius: 12,
  },
  addCurrentWeighButton: {
    backgroundColor: "#222",
    borderRadius: 24,
    padding: 16,
    width: "100%",
    marginTop: 16,
  },
});
