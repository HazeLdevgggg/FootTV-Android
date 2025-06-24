import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext } from "react";
import { AppConfig } from "../../../AppConfig";
import { useTypedNavigation } from "../../../navigation/navigation";
type ScreenHeaderPropsResetButton = {
    name: string;
    OnBackButtonPress: () => void;
    OnResetButtonPress: () => void;
}
function ScreenHeaderResetButton(props: ScreenHeaderPropsResetButton) {
    const navigation = useTypedNavigation();
    const { darkMode } = useContext(ThemeContext);
    return (
        <View style={[styles.modernHeader, { backgroundColor: AppConfig.BackgroundColor(darkMode), justifyContent: "space-between", alignItems: "center" }]}>
            <TouchableOpacity
                onPress={props.OnBackButtonPress}
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
                <Text style={[styles.modernHeaderTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                    {props.name}
                </Text>
            </View>
            <TouchableOpacity onPress={props.OnResetButtonPress} style={{
                backgroundColor: "#e74c3c" + "15",
                height: 30,
                width: 30,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Ionicons
                    name="trash-outline"
                    size={20}
                    color={"#e74c3c"}
                />
            </TouchableOpacity>
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
});
export default ScreenHeaderResetButton;