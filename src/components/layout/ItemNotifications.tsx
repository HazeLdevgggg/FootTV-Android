import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ItemChannelType } from "../../utils/ItemChannelType";
import MyImage from "../tags/MyImage";
import { Button } from "@react-navigation/elements";
import { useTypedNavigation } from "../../navigation/navigation";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
import { Ionicons } from "@expo/vector-icons";
import { NotificationsType } from "../../utils/NotificationsType";

function ItemNotifications(props: NotificationsType) {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const formatNotificationTime = (id: string): string => {
    const timeMap: Record<string, string> = {
      "5": "5 min",
      "60": "1h",
      "3600": "1j",
      "86400": "1sem",
      "604800": "1mois",
    };
    return timeMap[id] || id;
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la notification",
      "Êtes-vous sûr de vouloir supprimer cette notification ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => {} },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: AppConfig.BackGroundButton(darkMode),
          shadowColor: AppConfig.ShadowColor(darkMode),
        },
      ]}
    >
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View
          style={[
            styles.logoContainer,
            {
              borderColor: darkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)",
              backgroundColor: darkMode
                ? "rgba(255,255,255,0.02)"
                : "rgba(255,255,255,0.5)",
            },
          ]}
        >
          <MyImage
            source={props.logo}
            style={styles.logo}
            contentFit={"contain"}
          />
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.titleText,
              { color: AppConfig.MainTextColor(darkMode) },
            ]}
            numberOfLines={2}
          >
            {props.title}
          </Text>
        </View>

        <View style={styles.timeRow}>
          <Ionicons
            name="time-outline"
            size={14}
            color={AppConfig.SecondaryTextColor(darkMode)}
            style={styles.timeIcon}
          />
          <Text
            style={[
              styles.timeText,
              { color: AppConfig.SecondaryTextColor(darkMode) },
            ]}
          >
            {props.heure} • {props.date}
          </Text>
        </View>

        {/* Rappels Section */}
        {props.notificationID && props.notificationID.length > 0 && (
          <View style={styles.reminderRow}>
            <Ionicons
              name="notifications-outline"
              size={14}
              color={darkMode ? "#64748b" : "#6b7280"}
              style={styles.reminderIcon}
            />
            <Text
              style={[
                styles.reminderLabel,
                { color: AppConfig.SecondaryTextColor(darkMode) },
              ]}
            >
              Rappels:
            </Text>
            <View style={styles.reminderTags}>
              {props.notificationID.slice(0, props.notificationID.length).map((id, index) => (
                <View
                  key={index}
                  style={[
                    styles.reminderTag,
                    {
                      backgroundColor: darkMode
                        ? "rgba(59, 130, 246, 0.15)"
                        : "rgba(59, 130, 246, 0.1)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.reminderTagText, 
                      { color: darkMode ? "#60a5fa" : "#3b82f6" },
                    ]}
                  >
                    {formatNotificationTime(id)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Action Section */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            {
              backgroundColor: darkMode
                ? "rgba(239, 68, 68, 0.12)"
                : "rgba(239, 68, 68, 0.08)",
            },
          ]}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 20,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logoSection: {
    marginRight: 14,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  contentSection: {
    flex: 1,
    paddingTop: 2,
  },
  titleRow: {
    marginBottom: 8,
  },
  titleText: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timeIcon: {
    marginRight: 6,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  reminderIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  reminderLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginRight: 8,
  },
  reminderTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  reminderTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  moreTag: {
    minWidth: 28,
    alignItems: "center",
  },
  reminderTagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  actionSection: {
    marginLeft: 12,
    paddingTop: 4,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ItemNotifications;
