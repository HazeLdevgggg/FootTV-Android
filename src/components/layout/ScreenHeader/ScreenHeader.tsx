import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext } from "react";
import { AppConfig } from "../../../AppConfig";
import { useTypedNavigation } from "../../../navigation/navigation";
type ScreenHeaderProps = {
  color: string;
  name: string;
  icon: string;
}
function ScreenHeader(props: ScreenHeaderProps) {
  const navigation = useTypedNavigation();
  const { darkMode } = useContext(ThemeContext);
  return (
    <View style={[styles.modernHeader, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.modernBackButton, {
          backgroundColor: AppConfig.BackGroundButton(darkMode),
          shadowColor: AppConfig.ShadowColor(darkMode)
        }]}
        activeOpacity={0.8}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={darkMode ? "#E5E7EB" : "#3f96ee"}
        />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <View style={[styles.headerIconContainer, { backgroundColor: props.color + "15" }]}>
          <Ionicons name={props.icon as any} size={20} color={props.color} />
        </View>
        <Text style={[styles.modernHeaderTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
          {props.name}
        </Text>
      </View>
      <View style={{ width: 40 }} />
    </View>
  );
}
const styles = StyleSheet.create({
  modernHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modernHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },


  modernBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});
export default ScreenHeader;