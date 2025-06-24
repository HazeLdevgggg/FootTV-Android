import messaging from '@react-native-firebase/messaging';
import Settings from '../constants/Settings';
import { useTypedNavigation } from '../navigation/navigation';
import { Platform } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

interface DataType {
  infos: string;
  direct: string;
  site: string;
}

// Fonction pour configurer les notifications
export async function setupNotifications(navigation) {
  
  console.log("Initialisation des Notifications");
  //const { token, setToken, notification_emission, setNotification_emission, notification_info, setNotification_info } = useContext(ThemeContext);
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

  // On regarde si on déjà le NewToken
  /*if (token != NewToken) {
    console.log("On enregistre le NewToken dans la BDD");
    setToken(NewToken);
    setNotification_emission("1");
    setNotification_info("1");
  }*/

  // Écouter les notifications lorsque l'app est en premier plan
  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!' + remoteMessage);
    //console.log(remoteMessage);
    const data = remoteMessage.data;
    //navigate(navigation,data.infos,data.direct);
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message reçu en arrière-plan :', remoteMessage);
  });

  // Gérer les notifications lorsqu'on clique dessus et que l'app est en arrière-plan ou fermée
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background state' + remoteMessage);
    console.log(remoteMessage);
    const data = remoteMessage.data;
    Settings.push.pending = 1;
    Settings.push.data.infos = String(data.infos);
    Settings.push.data.direct = String(data.direct);
    Settings.push.data.site = String(data.site);
    //navigate(navigation,data.infos,data.direct,data.site);
  });

  // Vérifier si l'application a été ouverte par une notification lorsqu'elle était fermée
  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log('Notification caused app to open from quit state:' + remoteMessage);
      const data = remoteMessage.data;
      navigate(navigation, data.infos, data.direct, data.site);
    }
  });
}

function navigate(navigation, info, direct, site) {
  if (info != 0)
    navigation.push("News", { itemId: info, site })
  if (direct != 0)
    navigation.push("Match", { itemId: direct })
}

/*export async function createNotificationChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default', // L'ID doit être le même que celui envoyé par Firebase
      name: 'Notifications générales',
      importance: AndroidImportance.HIGH, // Assure l'affichage immédiat
      sound: 'default', // Active le son
      vibration: true, // Active la vibration
    });
  }
}*/