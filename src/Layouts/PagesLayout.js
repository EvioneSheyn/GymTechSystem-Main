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
  isHeadless = false,
  withInformation = false,
}) => {
  const navigation = useNavigation();
  return (
    <AuthGuard>
      <View style={styles.mainContainer}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 80, // Space for fixed bottom nav
          }}
          enableOnAndroid={true}
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
        >
          <ScrollView style={[styles.container, style]}>
            {!isHeadless && (
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
                {withInformation && (
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
                )}
                
              </View>
            )}
            {children}
          </ScrollView>
        </KeyboardAwareScrollView>
        <MainNav navigation={navigation} />
        {showModal && modal}
      </View>
    </AuthGuard>
  );
};

export default PagesLayout;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
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
