import React, { useContext, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";
import { AppConfig } from "../../../AppConfig";
import DatePickerModal from "../DatePickerModal";
import CloseIcon from "./CloseIcon";
function ToggleFilters({
  onFilterChange,
  name,
  value,
  icon,
}: {
  onFilterChange: (isApplied: boolean) => void;
  name: string;
  value: boolean;
  icon: string;
}) {
  const { darkMode } = useContext(ThemeContext);

  const handleOnPress = () => {
    onFilterChange(!value);
  }

  return (
    <View
      style={[
        styles.horizontal,{marginHorizontal:value ? 8 : 4}
      ]}
    >
      <TouchableOpacity onPress={() => handleOnPress()}>
        <View
          style={
            value
              ? [styles.filtersboxPressed, styles.filterContainer]
              : [
                styles.filtersbox,
                { backgroundColor: AppConfig.BackGroundButton(darkMode) },
                styles.filterContainer,
              ]
          }
        >
          <Ionicons
            name={icon as any}
            size={20}
            color={value ? "white" : AppConfig.IconColor(darkMode)}
          />
          <Text
            style={
              value
                ? styles.heureText2
                : [styles.heureText, { color: AppConfig.IconColor(darkMode) }]
            }
          >
            {name}
          </Text>
          {value && (
            <CloseIcon handleOnPress={() => handleOnPress()} />
          )}
        </View>
      </TouchableOpacity>
    </View>
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

export default ToggleFilters;
