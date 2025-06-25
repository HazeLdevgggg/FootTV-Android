import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import { AppConfig } from '../AppConfig';
import { routes } from '../routes/routes';

interface DataType {
  infos: string;
  direct: string;
  site: string;
}

interface NotificationContext {
  notificationPending: string;
  setNotificationPending: (value: string) => void;
  token: string;
  profil_id: string;
  setToken: (value: string) => void;
  setProfil_id: (value: string) => void;
  notification_info: string,
  notification_emission: string,
  setNotification_emission: (value: string) => void;
  setNotification_info: (value: string) => void;
}

// Fonction pour configurer les notifications
export async function setupNotifications(navigation, context: NotificationContext) {
  console.log("Initialisation des Notifications");
  const {
    token,
    profil_id,
    setToken,
    setProfil_id,
    notification_emission,
    setNotification_emission,
    notification_info,
    setNotification_info,
    notificationPending,
    setNotificationPending
  } = context;

  // Demander la permission pour les notifications
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.log('Authorization status: ' + authStatus);
    return;
  }

  // Obtenir et afficher le NewToken FCM
  const NewToken = await messaging().getToken();
  console.log('FCM NewToken: ' + NewToken);

  // Si le token a changé, on l’enregistre
  if (NewToken != token || token === "") {

    console.log(`${AppConfig.API_BASE_URL}${routes.Push}?apikey=${AppConfig.API_Key}&site=300`);
    try{
      const response = await fetch(`${AppConfig.API_BASE_URL}${routes.Push}?apikey=${AppConfig.API_Key}&site=300`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profil: profil_id,
          token: NewToken,
          rand: Math.random()
        }),
      });
      if(response.ok){
        console.log("On enregistre le NewToken dans la base de donnée");
        const data = await response.json();
        console.log(data);
      }else{
        console.error("Error enregistring NewToken:", response);
      }
    }catch(e){
      console.error("Error enregistring NewToken:", e);
    }
    console.log("On enregistre le NewToken dans le contexte");
    setToken(NewToken);
    setNotification_emission("1");
    setNotification_info("1");
  }

  // Écouter les notifications lorsque l'app est en premier plan
  messaging().onMessage(async remoteMessage => {
    console.log('FCM message reçu en premier plan:', remoteMessage);
    const data = remoteMessage.data;
   // navigate(navigation, data.infos, data.direct);
  });

  // Notifications reçues en arrière-plan
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message reçu en arrière-plan :', remoteMessage);
  });

  // Notification déclenchant l'ouverture depuis l'arrière-plan
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Ouverture depuis arrière-plan via notification:', remoteMessage);
    const data = remoteMessage.data;
    setNotificationPending("1");
    setNotification_info(String(data.infos));
    setNotification_emission(String(data.direct));
    navigate(navigation, data.infos, data.direct);
  });

  // Notification déclenchant l'ouverture depuis l'état fermé
  const initialNotification = await messaging().getInitialNotification();
  if (initialNotification) {
    console.log('Ouverture depuis état fermé via notification:', initialNotification);
    const data = initialNotification.data;
    navigate(navigation, data.infos, data.direct);
  }
}

// Navigation vers la page selon la donnée
function navigate(navigation, info, match) {
  if (info && info != "0") {
    navigation.push("Article", { id: info });
  }
  if (match && match != "0") {
    navigation.push("Notifications");
  }
}

// Création du canal de notification Android
export async function createNotificationChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Notifications générales',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  }
}