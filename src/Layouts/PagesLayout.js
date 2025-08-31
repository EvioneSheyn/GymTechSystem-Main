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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import AuthGuard from "../Guards/AuthGuard";

const PagesLayout = ({
  children,
  style,
  modal,
  showModal = false,
  isLoading = false,
}) => {
  const navigation = useNavigation();

  if (isLoading) {
    return <ActivityIndicator animating={true} color={MD2Colors.red800} />;
  }

  return (
    // <KeyboardAwareScrollView
    //   style={{ flex: 1 }}
    //   contentContainerStyle={{
    //     flexGrow: 1,
    //     justifyContent: "flex-end",
    //   }}
    //   enableOnAndroid={true}
    //   extraScrollHeight={20} // space above keyboard
    // >
    <AuthGuard>
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
      {showModal && modal}
    </AuthGuard>
    // </KeyboardAwareScrollView>
  );
};

export default PagesLayout;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
