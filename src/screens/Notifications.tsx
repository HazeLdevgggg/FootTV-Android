import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import ItemNotifications from "../components/layout/ItemNotifications";
import SectionDivider from "../components/home/SectionDivider";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
import Empty from "../components/layout/Empty";
import { NotificationsType } from "../utils/NotificationsType";
import { useTypedNavigation } from "../navigation/navigation";
import Log from "../functions/Log"

function Notifications() {
  const navigation = useTypedNavigation();
  const { profil_id, darkMode } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState<NotificationsType[]>([]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const url = `${AppConfig.API_BASE_URL}init/emission.php?apikey=2921182712&mode=list&id=${profil_id}&rand=${Math.random()}`;
        Log(url);
        const response = await fetch(url);
        const data = await response.json();
        setNotifications(data.liste);
        Log(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (profil_id) {
      getNotifications();
    }
  }, []); // Re-fetch si profil_id change

  // Fonction pour supprimer une notification par id
  const handleDeleteNotification = (id: string) => {
    setNotifications((current) => current.filter((n) => n.id !== id));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        color="#FF6B6B"
        name="Notifications"
        icon="notifications-outline"
      />
      <View
        style={{
          backgroundColor: AppConfig.BackgroundColor(darkMode),
          flex: 1,
        }}
      >
        <ScrollView  style={{ paddingBottom: 500 }}>
          <SectionDivider
            icon="apps-outline"
            label="Liste des prochaines notifications"
          />
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <ItemNotifications
                key={notification.id}
                item={notification}
                OnPress={() => handleDeleteNotification(notification.id)}
              />
            ))
          ) : (
            <Empty
              title="Aucune notification"
              subtitle="Vous n'avez pas de notification de prochaines matchs"
              icon="notifications-outline"
              color="#FF6B6B"
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export default Notifications;