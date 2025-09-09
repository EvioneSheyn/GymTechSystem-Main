import { StyleSheet, View } from "react-native";
import { WhiteText } from "@/Components/WhiteText";

const ScheduleDate = ({ record }) => (
  <View
    style={{
      backgroundColor: "#4a576b2d",
      borderLeftWidth: 4,
      borderLeftColor: "#49ff9bff",
      padding: 12,

      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    }}
  >
    <WhiteText style={{ fontSize: 32, paddingHorizontal: 12 }}>
      {record.day}
  </WhiteText>
    <View
      style={{
        paddingLeft: 12,
        borderLeftWidth: 1,
      }}
    >
      <WhiteText style={{ fontWeight: 700 }}>{record.title}</WhiteText>
      <WhiteText
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#aaa",
        }}
      >
        {record.time.trim()}
      </WhiteText>
    </View>
  </View>
);

export default ScheduleDate;
