import React, { useContext, useEffect, useState } from "react";
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

function calculateTimeRemaining(dateStr: string, timeStr: string) {
  // Convertir la date format "09/12/2006" et l'heure format "23h45"
  const [day, month, year] = dateStr.split('/').map(Number);
  
  // Parser l'heure au format "23h45"
  const timeMatch = timeStr.match(/(\d{1,2})h(\d{2})/);
  if (!timeMatch) {
    return { expired: true, text: "Format invalide" };
  }
  
  const hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  
  const matchDate = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();
  
  const timeDiff = matchDate.getTime() - now.getTime();
  
  if (timeDiff <= 0) {
    return { expired: true, text: "Match commencé" };
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return { expired: false, text: `Dans ${days}j ${hoursRemaining}h` };
  } else if (hoursRemaining > 0) {
    return { expired: false, text: `Dans ${hoursRemaining}h ${minutesRemaining}min` };
  } else {
    return { expired: false, text: `Dans ${minutesRemaining}min` };
  }
}

type Props = {
  item: NotificationsType;
  OnPress: (id: string) => void;
};

function ItemNotifications({ item, OnPress }: Props) {
  const { darkMode, profil_id } = useContext(ThemeContext);
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(item.date, item.heure));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(item.date, item.heure));
    }, 60000); // Met à jour chaque minute

    return () => clearInterval(interval);
  }, [item.date, item.heure]);

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

        {/* Countdown Section */}
        <View style={styles.countdownRow}>
          <View
            style={[
              styles.countdownContainer,
              {
                backgroundColor: timeRemaining.expired
                  ? darkMode
                    ? "rgba(239, 68, 68, 0.15)"
                    : "rgba(239, 68, 68, 0.1)"
                  : darkMode
                  ? "rgba(16, 185, 129, 0.15)"
                  : "rgba(16, 185, 129, 0.1)",
              },
            ]}
          >
            <View style={styles.countdownContent}>
              <Ionicons
                name={timeRemaining.expired ? "play-circle-outline" : "timer-outline"}
                size={16}
                color={timeRemaining.expired ? "#ef4444" : "#10b981"}
                style={styles.countdownIcon}
              />
              <Text
                style={[
                  styles.countdownText,
                  {
                    color: timeRemaining.expired ? "#ef4444" : "#10b981",
                    fontWeight: "700",
                  },
                ]}
              >
                {timeRemaining.text}
              </Text>
              {!timeRemaining.expired && (
                <View style={styles.pulseDot}>
                  <View
                    style={[
                      styles.pulseDotInner,
                      { backgroundColor: "#10b981" },
                    ]}
                  />
                </View>
              )}
            </View>
          </View>
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
    marginBottom: 10,
  },
  timeIcon: {
    marginRight: 6,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  countdownRow: {
    marginBottom: 12,
  },
  countdownContainer: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  countdownContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  countdownIcon: {
    marginRight: 6,
  },
  countdownText: {
    fontSize: 13,
    letterSpacing: 0.5,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.8,
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