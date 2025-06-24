import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
type Tag = {
  color: string;
  text: string;
  icon: string;
};
function getTransparentColor(color: string, alpha: number = 0.15) {
  // Si c'est une couleur hexadécimale (#rrggbb ou #rgb)
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");

    const r = parseInt(
      hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2),
      16,
    );
    const g = parseInt(
      hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4),
      16,
    );
    const b = parseInt(
      hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6),
      16,
    );

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Si c'est une couleur nommée ou déjà en rgb/rgba, retourne une version fixe
  return `rgba(231, 76, 60, ${alpha})`; // valeur par défaut douce rouge
}
function TagArticleList(props: Tag) {
  return (
    <View
      style={[
        styles.liveContainer,
        { backgroundColor: getTransparentColor(props.color) },
      ]}
    >
      <Ionicons
        name={props.icon as any}
        size={12}
        color={props.color}
        style={{ marginRight: 6 }}
      />
      <Text style={[styles.liveText, { color: props.color }]}>
        {props.text}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  liveContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 16,
    marginBottom: 4,
    alignSelf: "flex-start",
    // Ombre iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Ombre Android
    elevation: 4,
  },
  liveText: {
    fontWeight: "500",
    fontSize: 11,
  },
});
export default TagArticleList;
