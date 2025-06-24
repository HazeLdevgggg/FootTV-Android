
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

interface EmptyProps {
    title: string;
    subtitle: string;
    icon: string;
    color: string;
}

export default function Empty({ title, subtitle, icon, color }: EmptyProps) {
    const { darkMode } = useContext(ThemeContext);
    return (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: color + "15" }]}>
                <Ionicons name={icon as any} size={48} color={color} opacity={0.3} />
            </View>
            <Text style={[styles.emptyTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                {title}
            </Text>
            <Text style={[styles.emptySubtitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                {subtitle}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.7,
        lineHeight: 20,
    },
});