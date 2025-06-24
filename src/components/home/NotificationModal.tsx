import React, { useCallback, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
  Dimensions,
  StatusBar,
  Linking,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';

import { ItemList } from "../../utils/ItemListType";
import MyImage from "../tags/MyImage";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
import { showInterstitial } from "../../hooks/Pub";
import ScreenHeaderNoIcon from "../layout/ScreenHeader/ScreenHeaderNoIcon";
import Loading from "../layout/Loading";
import { useState } from "react";
import { routes } from "../../routes/routes";
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import NotificationTime from "../layout/NotificationTIme";
type Props = {
  item: ItemList;
  isVisible: boolean;
  onClose: () => void;
};



const OpenURLButton = (url: string) => {
  const supported = Linking.canOpenURL(url);
  if (supported) {
    Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
  }
};

const NotificationModal = ({ item, isVisible, onClose }: Props) => {
  const [loadingDescription, setLoadingDescription] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("");
  const [NotificationTimeModal, setNotificationTimeModal] = useState<boolean>(false);
useEffect(() => {
    if (item.type === 'emission') {
      const getDescription = async () => {
        setLoadingDescription(true);
        try {
          const response = await fetch(
            `${AppConfig.API_BASE_URL}${routes.Description}?apikey=${AppConfig.API_Key}&id=${item.id}`,
          );
          console.log(`${AppConfig.API_BASE_URL}${routes.Description}?apikey=${AppConfig.API_Key}&id=${item.id}`);
          const data = await response.json();
          setDescription(data.description);
          setLoadingDescription(false);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingDescription(false);
        }
      };
      getDescription();
    }
  }, []);

  if (!item) return null;

  const { darkMode } = useContext(ThemeContext);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case '1':
        return { name: 'radio-button-on', color: '#ff4757' };
      case '0':
        return { name: 'play-circle', color: '#34C759' };
      default:
        return { name: 'time', color: '#ffa502' };
    }
  };



  const MatchEnCours = () => {
    if (item.type === 'emission') {
      const [day, month, year] = item.date.split("/");
      const [hour, minute] = item.heure.split("h");
      const matchStart = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`,
      );
      const now = new Date();

      const diffInHours = (now.getTime() - matchStart.getTime()) / 3600000; // différence en heures
      return Math.abs(diffInHours) <= 1;
    }
    return false;
  };

  const formatCategory = (category: string) => {
    return category?.charAt(0).toUpperCase() + category?.slice(1) || 'Sport';
  };

  if (NotificationTimeModal && item.type === 'emission') {
    return (
      <>
        <NotificationTime onValidate={(param: string[]) => {
          console.log(param);
          setNotificationTimeModal(false);
          onClose();
          console.log(param.length)
          if (param.length > 0) {
            Toast.show({
              type: 'success',
              text1: 'Validé',
              text2: 'La notification a bien été enregistrée',
              position: 'top',
              topOffset: 60,
              visibilityTime: 2000,
            });
          }
          //showInterstitial();
        }} matchID={item.id} date={item.date} heure={item.heure} name="Notification" icon="notifications" />
      </>
    );
  }

  if (item.type !== 'emission') return null;
  return (
    <Modal
      visible={isVisible}
      presentationStyle={Platform.OS === 'ios' ? "pageSheet" : "fullScreen"}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.container, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>

        <ScreenHeaderNoIcon
          name="Détails du Match"
          OnBackButtonPress={onClose}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Card principale */}
          <View style={[styles.matchCard, {
            backgroundColor: AppConfig.BackGroundButton(darkMode),
            shadowColor: AppConfig.ShadowColor(darkMode),
          }]}>

            {/* Logo et statut */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <MyImage
                  source={item.logo}
                  style={styles.logo}
                  contentFit="contain"
                />
              </View>
              {MatchEnCours() && (
                <View style={[styles.modernLiveContainer, { marginTop: 12 }]}>
                  <View style={styles.modernLiveDot} />
                  <Text style={styles.modernLiveText}>Match En Cours</Text>
                </View>
              )}
            </View>

            {/* Titre principal */}
            <Text style={[styles.matchTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
              {item.titre}
            </Text>

            {/* Informations organisées */}
            <View style={styles.infoGrid}>

              {/* Date et heure */}
              <View style={[styles.infoCard, { backgroundColor: AppConfig.SecondBackGroundButton(darkMode) }]}>
                <View style={styles.infoHeader}>
                  <Ionicons name="calendar" size={18} color="#3742fa" />
                  <Text style={[styles.infoLabel, { color: AppConfig.MainTextColor(darkMode) }]}>
                    Date & Heure
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: AppConfig.MainTextColor(darkMode) }]}>
                  {item.date}
                </Text>
                <Text style={[styles.infoSubValue, { color: AppConfig.MainTextColor(darkMode) }]}>
                  {item.heure}
                </Text>
              </View>

              {/* Catégorie */}
              <View style={[styles.infoCard, { backgroundColor: AppConfig.SecondBackGroundButton(darkMode) }]}>
                <View style={styles.infoHeader}>
                  <Ionicons name="football" size={18} color="#ff6b6b" />
                  <Text style={[styles.infoLabel, { color: AppConfig.MainTextColor(darkMode) }]}>
                    Catégorie
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: AppConfig.MainTextColor(darkMode) }]}>
                  {formatCategory(item.categorie)}
                </Text>
              </View>

              {/* Chaîne */}
              <View style={[styles.infoCard, { backgroundColor: AppConfig.SecondBackGroundButton(darkMode) }]}>
                <View style={styles.infoHeader}>
                  <Ionicons name="tv-outline" size={18} color="#00d2d3" />
                  <Text style={[styles.infoLabel, { color: AppConfig.MainTextColor(darkMode) }]}>
                    Chaîne
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: AppConfig.MainTextColor(darkMode) }]}>
                  {item.chaine}
                </Text>
              </View>

              {/* Statut */}
              <View style={[styles.infoCard, { backgroundColor: AppConfig.SecondBackGroundButton(darkMode) }]}>
                <View style={styles.infoHeader}>
                  <Ionicons
                    name={getStatusIcon(item.direct).name as any}
                    size={18}
                    color={getStatusIcon(item.direct).color}
                  />
                  <Text style={[styles.infoLabel, { color: AppConfig.MainTextColor(darkMode) }]}>
                    Statut
                  </Text>
                </View>
                <Text style={[styles.infoValue, {
                  color: AppConfig.MainTextColor(darkMode),
                  fontWeight: '600'
                }]}>
                  {item.direct === "1" ? "En Direct" : "Replay"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                OpenURLButton(item.url)
              }}
              style={[styles.learnMoreButton, {
                backgroundColor: AppConfig.SecondBackGroundButton(darkMode),
                borderColor: '#3f96ee' + '30'
              }]}
              activeOpacity={0.7}
            >
              <View style={styles.learnMoreContent}>
                <View style={styles.learnMoreIconContainer}>
                  <Ionicons
                    name="open-outline"
                    size={20}
                    color="#3f96ee"
                  />
                </View>
                <View style={styles.learnMoreTextContainer}>
                  <Text style={[styles.learnMoreTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                    En savoir plus
                  </Text>
                  <Text style={[styles.learnMoreSubtitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                    Détails complets du match
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#3f96ee"
                  style={styles.learnMoreArrow}
                />
              </View>
            </TouchableOpacity>

            {/* Description */}
            {item.desc && (
              <View style={[styles.descriptionCard, { backgroundColor: AppConfig.SecondBackGroundButton(darkMode) }]}>
                <View style={styles.infoHeader}>
                  <Ionicons name="information-circle" size={18} color="pink" />
                  <Text style={[styles.infoLabel, { color: AppConfig.MainTextColor(darkMode) }]}>
                    Description
                  </Text>
                </View>
                <Text style={[styles.descriptionText, { color: AppConfig.MainTextColor(darkMode) }]}>
                  {item.desc}
                </Text>
                {loadingDescription ? (
                  <Loading />
                ) : (
                  description == "" ? (
                    <>
                    </>
                  ) : (
                    <Text style={[styles.descriptionText, { color: AppConfig.MainTextColor(darkMode) }]}>
                      {description}
                    </Text>
                  )
                )}
              </View>
            )}

          </View>
        </ScrollView>

        {/* Bouton d'action moderne */}
        <View style={[styles.actionSection, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setNotificationTimeModal(true);
            }}
          >
            <Ionicons name="notifications" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Me Notifier</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    flex: 1,
  },
  modernLiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },

  modernLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },

  modernLiveText: {
    color: '#FF3B30',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  learnMoreButton: {
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  learnMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  learnMoreIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#3f96ee' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  learnMoreTextContainer: {
    flex: 1,
  },

  learnMoreTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },

  learnMoreSubtitle: {
    fontSize: 12,
    opacity: 0.7,
    fontWeight: '400',
  },

  learnMoreArrow: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  matchCard: {
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginBottom: 20,
  },

  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  logoContainer: {
    position: 'relative',
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 20,
  },


  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  infoCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    opacity: 0.7,
    textTransform: 'uppercase',
  },

  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },

  infoSubValue: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },

  descriptionCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },

  actionSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },

  actionButton: {
    backgroundColor: '#3f96ee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default NotificationModal;