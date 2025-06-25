import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import MyImage from "../tags/MyImage";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
import { NotificationsType } from "../../utils/NotificationsType";

function formatReminderLabel(key: string, value: string) {
  switch (key) {
    case "minute":
      return `5 min`;
    case "heure":
      return `1 h`;
    case "jour":
      return `1 j`;
    default:
      return value;
  }
}

type Props = {
  item: NotificationsType;
  OnPress: (id: string) => void;
};

function ItemNotifications({ item, OnPress }: Props) {
  const { darkMode, profil_id } = useContext(ThemeContext);

  const handleDelete = async () => {
    try {
      console.log(`${AppConfig.API_BASE_URL}init/emission.php?apikey=2921182712&mode=delete&id=${profil_id}&emission=${item.id}`)
      const response = await fetch(
        `${AppConfig.API_BASE_URL}init/emission.php?apikey=2921182712&mode=delete&id=${profil_id}&emission=${item.id}`,
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    OnPress(item.id);
  };

  // Vérifie si on doit afficher les rappels (au moins une valeur non vide et > 0)
  const hasReminders =
    item.notification &&
    (Number(item.notification.minute) > 0 ||
      Number(item.notification.heure) > 0 ||
      Number(item.notification.jour) > 0);

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
            source={item.logo}
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
            {item.titre}
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
            {item.heure} • {item.date}
          </Text>
        </View>

        {/* Rappels Section */}
        {hasReminders && (
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
              {["jour", "heure", "minute"].map((key) => {
                const value = item.notification[key];
                if (Number(value) > 0) {
                  return (
                    <View
                      key={key}
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
                        {formatReminderLabel(key, value)}
                      </Text>
                    </View>
                  );
                }
                return null;
              })}
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
    marginHorizontal: 16,
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