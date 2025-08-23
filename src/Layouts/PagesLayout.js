import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MainNav from "../Components/MainNav";

const PagesLayout = ({ children, style }) => {
  const navigation = useNavigation();

  return (
    <>
      <ScrollView style={[styles.container, style]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#38bdf8" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              //TODO add information page?
            }}
          >
            <Ionicons
              style={{ fontSize: 24, color: "#ddd" }}
              name="information-circle-outline"
            />
          </TouchableOpacity>
        </View>

        {children}
      </ScrollView>
      <MainNav navigation={navigation} />
    </>
  );
};

export default PagesLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#38bdf8",
    marginLeft: 8,
    fontFamily: "poppins",
  },
});
