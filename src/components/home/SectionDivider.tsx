import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

const SectionDivider = ({ icon, label }: { icon: any; label: string }) => (
  <View style={styles.dividerContainer}>
    <Ionicons
      name={icon}
      size={18}
      color="#3f96ee"
      style={{ marginRight: 8 }}
    />
    <Text style={styles.dividerText}>{label}</Text>
    <View style={styles.dividerLine} />
  </View>
);

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3f96ee",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#3f96ee",
    marginLeft: 8,
    opacity: 0.4,
  },
});
export default SectionDivider;
