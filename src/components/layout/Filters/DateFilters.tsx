import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";
import { AppConfig } from "../../../AppConfig";
import CloseIcon from "./CloseIcon";
import DateTimePicker from "@react-native-community/datetimepicker";

function DateFilters({
  onFilterChange,
  Value,
}: {
  onFilterChange: (newDate: string) => void;
  Value: string;
}) {
  const { darkMode } = useContext(ThemeContext);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const DateToString = (date: Date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
  };

  const DateToStringUI = (date: Date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleValidate = () => {
    setSelectedDate(tempDate);
    setShowPicker(false);
    onFilterChange(DateToString(tempDate));
  };

  const handleReset = () => {
    setShowPicker(false);
    setSelectedDate(new Date());
    setTempDate(new Date());
    onFilterChange("");
  };

  return (
    <>
      {showPicker && (
        <>
          {Platform.OS === "ios" ? (
            <Modal
              transparent
              animationType="slide"
              visible={showPicker}
              onRequestClose={() => setShowPicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View
                  style={[
                    styles.modalContainer,
                    { backgroundColor: AppConfig.BackgroundColor(darkMode) },
                  ]}
                >
                  <Text style={[styles.modalTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                    Sélectionner une date
                  </Text>

                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    themeVariant={darkMode ? "dark" : "light"}
                    locale="fr-FR"
                    onChange={(_, date) => {
                      if (date) setTempDate(date);
                    }}
                    style={styles.datePicker}
                  />

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      onPress={handleReset}
                      style={[
                        styles.modalButton,
                        { backgroundColor: AppConfig.BackGroundButton(darkMode) },
                      ]}
                    >
                      <Text
                        style={{
                          color: AppConfig.SecondaryTextColor(darkMode),
                          fontWeight: "600",
                        }}
                      >
                        Réinitialiser
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleValidate}
                      style={[styles.modalButton, { backgroundColor: "#3f96ee" }]}
                    >
                      <Text style={{ color: "white", fontWeight: "600" }}>Valider</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              themeVariant={darkMode ? "dark" : "light"}
              locale="fr-FR"
              onChange={(event, date) => {
                if (event.type === "dismissed") {
                  setShowPicker(false);
                  return;
                }
                if (event.type === "set" && date) {
                  setShowPicker(false);
                  setSelectedDate(date);
                  onFilterChange(DateToString(date));
                }
              }}
            />
          )}
        </>
      )}

      <View style={[styles.horizontal, { marginHorizontal: Value !== "" ? 8 : 4 }]}>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <View
            style={
              Value !== ""
                ? [styles.filtersboxPressed, styles.filterContainer]
                : [
                    styles.filtersbox,
                    { backgroundColor: AppConfig.BackGroundButton(darkMode) },
                    styles.filterContainer,
                  ]
            }
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Value !== "" ? "white" : AppConfig.IconColor(darkMode)}
            />
            <Text
              style={
                Value !== ""
                  ? styles.heureText2
                  : [styles.heureText, { color: AppConfig.IconColor(darkMode) }]
              }
            >
              {Value !== "" ? DateToStringUI(selectedDate) : "Dates"}
            </Text>
            {Value !== "" && (
              <CloseIcon
                handleOnPress={handleReset}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  filtersbox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 6,
    paddingVertical: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  filtersboxPressed: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#3f96ee",
    borderRadius: 8,
    marginBottom: 6,
    paddingVertical: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  heureText: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "900",
  },
  heureText2: {
    color: "white",
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "900",
  },
  filterContainer: {
    position: "relative",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  datePicker: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DateFilters;