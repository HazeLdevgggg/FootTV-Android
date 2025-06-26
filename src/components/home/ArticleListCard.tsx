import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Article } from "../../utils/ArticleType";
import MyImage from "../tags/MyImage";
import TagArticle from "./TagArticle";
import NotificationModal from "./NotificationModal";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
import { useTypedNavigation } from "../../navigation/navigation";

function ArticleListCard(props: Article) {
  const navigation = useTypedNavigation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.push("Article", { id: props.id })}
        activeOpacity={0.85}
      >
        {props.une === "1" ? (
          // Version Une (Article principal) - Style harmonisé avec bordure
          <View
            style={[
              styles.vertical2,
              {
                backgroundColor: AppConfig.BackGroundButton(darkMode),
                shadowColor: AppConfig.ShadowColor(darkMode),
              },
            ]}
          >
            {/* Gradient overlay pour un effet moderne */}
            <View style={[styles.gradientOverlay, {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
            }]} />

            {/* Container image avec bordure moderne pour la Une */}
            <View style={styles.imageContainerUne}>
              <View style={[styles.imageBorderUne, {
                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }]}>
                <MyImage
                  source={props.photo_une}
                  style={styles.imageUne}
                  contentFit={"cover"}
                />
              </View>
            </View>

            {/* Container texte avec alignement fixe */}
            <View style={styles.textContainerUne}>
              {/* Tags avec alignement à gauche fixe */}
              <View style={styles.modernTagsRowUne}>
                {props.theme && (
                  <View style={styles.modernLiveContainer}>
                    <View style={styles.modernLiveDot} />
                    <Text style={styles.modernLiveText}>{props.theme}</Text>
                  </View>
                )}
                {!!props.exclu && (
                  <View style={styles.modernExcluContainer}>
                    <View style={styles.modernExcluDot} />
                    <Text style={styles.modernExcluText}>EXCLU</Text>
                  </View>
                )}
                {!!props.video && (
                  <View style={styles.modernVideoContainer}>
                    <View style={styles.modernVideoDot} />
                    <Text style={styles.modernVideoText}>VIDÉO</Text>
                  </View>
                )}
              </View>

              {/* Titre avec alignement fixe */}
              <Text
                style={[
                  styles.modernTitleTextUne,
                  { color: AppConfig.MainTextColor(darkMode) },
                ]}
              >
                {props.titre}
              </Text>

              {/* Auteur et date avec alignement fixe */}
              <Text
                style={[
                  styles.modernAuthorText,
                  { color: AppConfig.SecondaryTextColor(darkMode) },
                ]}
              >
                {props.date}
              </Text>
            </View>
          </View>
        ) : (
          // Version standard (Article liste)
          <View
            style={[
              styles.container,
              {
                backgroundColor: AppConfig.BackGroundButton(darkMode),
                shadowColor: AppConfig.ShadowColor(darkMode),
              },
            ]}
          >
            {/* Gradient overlay pour un effet moderne */}
            <View style={[styles.gradientOverlay, {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
            }]} />

            {/* Container principal avec glassmorphism */}
            <View style={styles.contentContainer}>

              {/* Section image avec effet de bordure moderne */}
              <View style={styles.imageContainer}>
                <View style={[styles.imageBorder, {
                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }]}>
                  <MyImage
                    source={props.photo_une}
                    style={styles.image}
                    contentFit={"cover"}
                  />
                </View>
              </View>

              {/* Section contenu */}
              <View style={styles.textContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",flexWrap:"wrap"   }}>
                  <View style={styles.modernTagsRow}>
                  {props.theme && (
                  <View style={styles.modernLiveContainer}>
                    <View style={styles.modernLiveDot} />
                    <Text style={styles.modernLiveText}>{props.theme}</Text>
                  </View>
                )}
                    {!!props.exclu && (
                      <View style={styles.modernExcluContainer}>
                        <View style={styles.modernExcluDot} />
                        <Text style={styles.modernExcluText}>EXCLU</Text>
                      </View>
                    )}
                    {!!props.video && (
                      <View style={styles.modernVideoContainer}>
                        <View style={styles.modernVideoDot} />
                        <Text style={styles.modernVideoText}>VIDÉO</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.modernDateText,
                      { color: AppConfig.SecondaryTextColor(darkMode), paddingVertical: 6 }
                    ]}
                  >
                    {props.date}
                  </Text>
                </View>


                {/* Titre principal */}
                <Text
                  style={[
                    styles.modernTitleText,
                    { color: AppConfig.MainTextColor(darkMode) }
                  ]}
                >
                  {props.titre}
                </Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  // Styles pour la version standard
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

  // Styles pour la version Une (harmonisés)
  vertical2: {
    flexDirection: "column",
    backgroundColor: "#f8f9fa",
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
  modernDateText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },

  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
  },

  // Image container pour version standard
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },

  imageBorder: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },

  // Image container pour version Une avec même style de bordure
  imageContainerUne: {
    padding: 10,

    position: 'relative',
    width: '100%',
  },

  imageBorderUne: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  imageUne: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },

  textContainer: {
    flex: 1,
    paddingTop: 2,
  },

  // Container texte pour la Une avec alignement fixe
  textContainerUne: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    width: '100%', // Force la largeur complète
  },

  modernTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // Tags row pour la Une avec alignement à gauche forcé
  modernTagsRowUne: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Force l'alignement à gauche
    alignItems: 'flex-start',
    width: '100%', // Assure la largeur complète
  },

  modernTitleText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    marginBottom: 6,
    letterSpacing: -0.2,
    flexWrap: 'wrap',
  },

  modernTitleTextUne: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 8,
    letterSpacing: -0.2,
    textAlign: 'left', // Force l'alignement à gauche
    width: '100%', // Assure la largeur complète
  },

  modernAuthorText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    letterSpacing: -0.1,
    textAlign: 'left', // Force l'alignement à gauche
  },

  // Tags modernes pour EXCLU
  modernExcluContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 156, 18, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.2)',
    marginRight: 8,
    marginBottom: 4,
  },

  modernExcluDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f39c12',
    marginRight: 6,
  },

  modernExcluText: {
    color: '#f39c12',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Tags modernes pour VIDÉO
  modernVideoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 89, 182, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.2)',
    marginRight: 8,
    marginBottom: 4,
  },

  modernVideoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9b59b6',
    marginRight: 6,
  },

  modernVideoText: {
    color: '#9b59b6',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Tags modernes pour LIVE
  modernLiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
    marginRight: 8,
    marginBottom: 4,
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
});

export default ArticleListCard;