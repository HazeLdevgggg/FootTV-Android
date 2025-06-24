import React, { useContext, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";
import { AppConfig } from "../../../AppConfig";
function ResetToggleFilters({
  onFilterChange,
  value,
  icon,
}: {
  onFilterChange: (isApplied: boolean) => void;
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
            [
                styles.filtersbox,
                { backgroundColor: "#e74c3c" },
                styles.filterContainer,
              ]
          }
        >
          <Ionicons
            name={icon as any}
            size={20}
            color={value ? "white" : AppConfig.IconColor(darkMode)}
          />
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
  filterContainer: {
    position: "relative",
  },
});

export default ResetToggleFilters;
