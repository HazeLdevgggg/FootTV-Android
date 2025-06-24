import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SectionDivider from "../components/home/SectionDivider";
import { Ionicons } from "@expo/vector-icons";
import { AppConfig } from "../AppConfig";
import { showConsentNotice } from "../hooks/Didomi";
import { useTypedNavigation } from "../navigation/navigation";
import { routes } from "../routes/routes";
function Settings() {
  const navigation = useTypedNavigation();
  const { darkMode,profil_id, setDarkMode, notification_emission, setNotification_emission, notification_info,setNotification_info } = useContext(ThemeContext);

  // API request when Toggle Match Notifications
  const toggleSwitchMatch = async () => {
    const newValue = notification_emission === "1" ? "0" : "1";
    try {
      const response = await fetch(
        `${AppConfig.API_BASE_URL}${routes.ProfileUpdate}?apikey=${AppConfig.API_Key}&etat=${
          newValue === "1" ? 1 : 0
        }&type=notification-emission&profil=${profil_id}`
      );
      const data = await response.json();
      console.log("Notification Match response:", data);
      await setNotification_emission(newValue);
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  };
  // API request when Toggle Article Notifications
  const toggleSwitchArticle = async () => {
    const newValue = notification_info === "1" ? "0" : "1";
    try {
      const response = await fetch(
        `${AppConfig.API_BASE_URL}${routes.ProfileUpdate}?apikey=${AppConfig.API_Key}&etat=${
          newValue === "1" ? 1 : 0
        }&type=notification-info&profil=${profil_id}`
      );
      const data = await response.json();
      console.log("Notification Article response:", data);
      await setNotification_info(newValue);
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  };

  const toggleSwitchSombre = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ScrollView>
      <View
        style={[
          styles.vertical,
          { backgroundColor: AppConfig.BackgroundColor(darkMode) },
        ]}
      >
        <SectionDivider icon="cog-outline" label="Paramètres" />
        <View style={styles.horizontal2}>
          <Text
            style={[
              styles.titreText,
              { color: AppConfig.MainTextColor(darkMode) },
            ]}
          >
            Notifications des Matchs
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#3f96ee" }}
            thumbColor={notification_emission === "1" ? "white" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchMatch}
            value={notification_emission === "1"}
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
            }}
          />
        </View>
        <Text
          style={[
            styles.descText,
            { color: AppConfig.SecondaryTextColor(darkMode) },
          ]}
        >
          Recevez une alerte 5 minutes avant le début de vos programmes favoris pour ne rien manquer.
        </Text>
        <View style={styles.horizontal2}>
          <Text
            style={[
              styles.titreText,
              { color: AppConfig.MainTextColor(darkMode) },
            ]}
          >
            Notifications des Articles
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#3f96ee" }}
            thumbColor={notification_emission === "1" ? "white" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchArticle}
            value={notification_info === "1"}
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
            }}
          />
        </View>
        <Text
          style={[
            styles.descText,
            { color: AppConfig.SecondaryTextColor(darkMode) },
          ]}
        >
          Soyez informé des dernières actualités et articles sur le monde du foot en temps réel.
        </Text>
        <View style={styles.horizontal2}>
          <Text
            style={[
              styles.titreText,
              { color: AppConfig.MainTextColor(darkMode) },
            ]}
          >
            Mode Sombre
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#3f96ee" }}
            thumbColor={darkMode ? "white" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchSombre}
            value={darkMode}
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
            }}
          />
        </View>
        <Text
          style={[
            styles.descText,
            { color: AppConfig.SecondaryTextColor(darkMode) },
          ]}
        >
          Activez le mode sombre pour une interface plus confortable la nuit ou
          dans les environnements peu éclairés. Ce thème réduit la fatigue
          visuelle et améliore l’autonomie de la batterie sur certains
          appareils.
        </Text>
        <SectionDivider icon="build-outline" label="Autres" />
        <View style={styles.horizontal2}>
          <View style={[styles.featureCard, { backgroundColor: AppConfig.BackGroundButton(darkMode) }]}>
            <TouchableOpacity onPress={() => showConsentNotice()}>
              <View style={styles.featureHeader}>
                <Ionicons name="megaphone-outline" size={24} color="#F9A825" />
                <Text style={[styles.featureTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                  Vos préférences publicitaires
                </Text>
              </View>
              <Text style={[styles.featureDesc, { color: AppConfig.SecondaryTextColor(darkMode) }]}>
              Choisissez si vous souhaitez recevoir des publicités personnalisées ou non.              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.horizontal2}>
          <View style={[styles.featureCard, { backgroundColor: AppConfig.BackGroundButton(darkMode) }]}>
            <TouchableOpacity onPress={() => navigation.push("LegalMention")}>
              <View style={styles.featureHeader}>
                <Ionicons name="document-text-outline" size={24} color="#4CAF50" />
                <Text style={[styles.featureTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                  Mentions Légales
                </Text>
              </View>
              <Text style={[styles.featureDesc, { color: AppConfig.SecondaryTextColor(darkMode) }]}>
                Consultez les informations légales de l’application.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  horizontal2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  vertical: {
    flexDirection: "column",
    flex: 1,
  },

  titreText: {
    fontSize: 16,
    fontWeight: "600",
  },
  descText: {
    color: "gray",
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  featureCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 36,
  },
});

export default Settings;
