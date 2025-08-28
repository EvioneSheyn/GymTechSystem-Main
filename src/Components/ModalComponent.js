import { StyleSheet, View, TouchableOpacity } from "react-native";

export default function ModalComponent({ children, setShowModal }) {
  return (
    <View style={styles.modalBaseView}>
      <TouchableOpacity
        onPress={() => setShowModal(false)}
        style={styles.modalBackdropView}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  modalBaseView: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    pointerEvents: "none",
  },
  modalBackdropView: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000057",
    zIndex: 11,
  },
});
