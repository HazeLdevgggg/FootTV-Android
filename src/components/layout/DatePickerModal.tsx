import React, { useContext } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
const DatePickerModal = ({
  isVisible,
  selectedTime,
  onClose,
  onConfirm,
  onReset,
}) => {
  const [tempDate, setTempDate] = React.useState(selectedTime);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  React.useEffect(() => {
    setTempDate(selectedTime);
  }, [selectedTime, isVisible]);

  const handleConfirm = () => {
    onConfirm(tempDate);
  };
  const handleReset = () => {
    onReset();
  };
  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: AppConfig.BackGroundButton(darkMode) },
          ]}
        >
          <TouchableOpacity style={styles.rightArrow} onPress={onClose}>
            <Ionicons name="close-outline" size={28} color="red" />
          </TouchableOpacity>
          <Text style={[styles.text,{color : AppConfig.MainTextColor(darkMode)}]}>Choisissez une date</Text>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="spinner"
            themeVariant={darkMode ? "dark" : "light"}
            onChange={(event, date) => {
              if (date) setTempDate(date);
            }}
          />
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Confirmer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={handleReset}>
            <Text style={styles.buttonText2}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  // Modal styles for DatePickerModal
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    position: "relative",
  },
  rightArrow: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3f96ee",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 60,
    marginTop: 20,
  },
  button2: {
    paddingHorizontal: 60,
    marginTop: 20,
  },
  buttonText2: {
    color: "red",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
export default DatePickerModal;
