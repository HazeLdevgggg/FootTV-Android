import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { ItemList } from "../../utils/ItemListType";
import MyImage from "../tags/MyImage";
import { Button } from "@react-navigation/elements";
import NotificationModal from "./NotificationModal";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";

function ItemListCard(props: ItemList) {


  const MatchEnCours = () => {
    if (props.type === "emission") {
      const [day, month, year] = props.date.split("/");
      const [hour, minute] = props.heure.split("h");
      const matchStart = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`,
      );
      const now = new Date();

      const diffInHours = (now.getTime() - matchStart.getTime()) / 3600000; // différence en heures
      return Math.abs(diffInHours) <= 1;
    }
    else return false
  };

  const [modalVisible, setModalVisible] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <>
      {props.type === "emission" ? (
        <>
          <TouchableOpacity
            style={[
              styles.container,
              {
                backgroundColor: AppConfig.BackGroundButton(darkMode),
                shadowColor: AppConfig.ShadowColor(darkMode),
              },
            ]}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            {/* Gradient overlay pour un effet moderne */}
            <View style={[styles.gradientOverlay, {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
            }]} />

            {/* Container principal avec glassmorphism */}
            <View style={styles.contentContainer}>

              {/* Section logo avec effet de bordure moderne */}
              <View style={styles.logoContainer}>
                <View style={[styles.logoBorder, {
                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }]}>
                  <MyImage
                    source={props.logo}
                    style={styles.logo}
                    contentFit={"contain"}
                  />
                </View>
              </View>

              {/* Section contenu */}
              <View style={styles.textContainer}>

                {/* Header avec statut et heure */}
                <View style={styles.headerRow}>
                  {MatchEnCours() && (
                    <View style={[styles.modernLiveContainer, { marginRight: 12 }]}>
                      <View style={styles.modernLiveDot} />
                      <Text style={styles.modernLiveText}>Match En Cours</Text>
                    </View>
                  )}

                  {props.direct === "0" && (
                    <View style={styles.modernReplayContainer}>
                      <View style={styles.modernReplayDot} />
                      <Text style={styles.modernReplayText}>REPLAY</Text>
                    </View>
                  )}
                </View>

                {/* Date avec style moderne */}
                <Text style={[
                  styles.modernDateText,
                  { color: AppConfig.SecondaryTextColor(darkMode) }
                ]}>
                  {props.heure} | {props.date}
                </Text>

                {/* Titre principal */}
                <Text
                  style={[
                    styles.modernTitleText,
                    { color: AppConfig.MainTextColor(darkMode) }
                  ]}
                  numberOfLines={2}
                >
                  {props.titre}
                </Text>

                {/* Description */}
                <Text
                  style={[
                    styles.modernDescText,
                    { color: AppConfig.SecondaryTextColor(darkMode) }
                  ]}
                  numberOfLines={2}
                >
                  {props.desc}
                </Text>
              </View>
            </View>

            {/* Indicateur d'interaction - SUPPRIMÉ */}
          </TouchableOpacity>

          {modalVisible && (
            <NotificationModal
              item={props}
              isVisible={modalVisible}
              onClose={() => setModalVisible(false)}
            />
          )}
        </>
      ) : (
        null
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginBottom: 12,
    marginHorizontal: 4,
    overflow: 'hidden',
    elevation: 8,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },

  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
  },

  logoContainer: {
    position: 'relative',
    marginRight: 12,
  },

  logoBorder: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    paddingTop: 2,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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

  modernReplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.2)',
  },

  modernReplayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
    marginRight: 6,
  },

  modernReplayText: {
    color: '#34C759',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modernDateText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    opacity: 0.8,
  },

  modernTitleText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    marginBottom: 4,
    letterSpacing: -0.2,
  },

  modernDescText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    opacity: 0.85,
    letterSpacing: -0.1,
  },
});

export default ItemListCard;