import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import { ScrollView, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import ItemNotifications from "../components/layout/ItemNotifications";
import { Ionicons } from "@expo/vector-icons";
import { useTypedNavigation } from "../navigation/navigation";
import SectionDivider from "../components/home/SectionDivider";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
function Notifications() {
  const navigation = useTypedNavigation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  return (
    <View>
      <ScreenHeader color="#FF6B6B" name="Notifications" icon="notifications-outline" />
      <View
        style={{
          backgroundColor: AppConfig.BackgroundColor(darkMode),
          marginHorizontal: 12,
        }}
      >
        <ScrollView style={{ paddingBottom: 300 }}>
          <SectionDivider icon="apps-outline" label="Liste des prochaînes notifications" />
          <ItemNotifications
            id={"ddd"}
            heure={"10h20"}
            title={"Paris-Inter"}
            logo={
              "https://madeinfoot.ouest-france.fr/images/logo-ligues/app16.png"
            }
            date={"10/09/12"}
            notificationID={["5","60","3600","86400","604800",]}
          />
        </ScrollView>
      </View>
    </View>
  );
}
export default Notifications;
