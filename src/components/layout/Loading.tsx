import React from "react";
import { View, ActivityIndicator } from "react-native";
import { AppConfig } from "../../AppConfig";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
export default function Loading() {
    const { darkMode } = useContext(ThemeContext);
    return (
        <View
            style={{
                marginTop: 40,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: AppConfig.BackgroundColor(darkMode),
            }}
        >
            <ActivityIndicator size="large" color="#3f96ee" />
        </View>
    )
}