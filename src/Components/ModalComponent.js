import { StyleSheet, View, TouchableOpacity } from "react-native";

export default function ModalComponent({ children, onClose }) {
  return (
    <View style={styles.modalBaseView}>
      <TouchableOpacity onPress={onClose} style={styles.modalBackdropView} />
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
