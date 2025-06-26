import React, { useContext, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
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
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const { darkMode } = useContext(ThemeContext);

  const DateToString = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const DateToStringUI = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          themeVariant={darkMode ? "dark" : "light"}
          locale="fr-FR"
          onChange={(event, date) => {
            if (event.type === "dismissed") {
              setShowPicker(false);
              return;
            }
            if (event.type === "set" && date) {
              setShowPicker(false);
              setSelectedTime(date);
              onFilterChange(DateToString(date));
            }
          }}
        />
      )}
      <View
        style={[
          styles.horizontal,
          styles.horizontal, { marginHorizontal: Value !== "" ? 8 : 4 }
        ]}
      >
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
              name={"calendar-outline"}
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
              {Value !== "" ? DateToStringUI(selectedTime) : "Dates"}
            </Text>
            {Value !== "" && (
              <CloseIcon handleOnPress={() => {
                setSelectedTime(new Date());
                setShowPicker(false);
                onFilterChange?.("");
              }} />
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
});

export default DateFilters;
