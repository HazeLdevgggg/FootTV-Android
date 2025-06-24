import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext } from "react";
import { AppConfig } from "../../../AppConfig";

type CloseIconProps = {
    handleOnPress: () => void;
}
export default function CloseIcon({ handleOnPress }: CloseIconProps) {
    const { darkMode } = useContext(ThemeContext);
    return (
        <>
            <TouchableOpacity
                onPress={() => handleOnPress()}
                style={styles.closeButton}
            >
                <Ionicons name="close" size={18} color={"white"} />
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    closeButton: {
        position: "absolute",
        top: -10,
        right: -10,
        backgroundColor: "#e74c3c",
        height: 20,
        width: 20,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
});