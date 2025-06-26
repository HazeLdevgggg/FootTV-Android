import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTypedNavigation } from "../navigation/navigation";
import SectionDivider from "../components/home/SectionDivider";
import MyImage from "../components/tags/MyImage";
import FiltersCompetitionAndClubNoButton from "../components/layout/Filters/FiltersCompetitionAndClubNoButton";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
import Empty from "../components/layout/Empty";
import Search from "../components/layout/Search";
import { levenshteinDistance } from "../functions/Levenshtein";

function Favoris() {
  const navigation = useTypedNavigation();
  const { darkMode, setFavoris, favoris } = useContext(ThemeContext);
  const [searchText, setSearchText] = useState('');

  if (!favoris) return null;

  const handleDeleteCategory = (id: string) => {
    setFavoris(favoris.filter(cat => cat.id !== id));
  };

  const filteredFavoris = searchText.length > 0
    ? [...favoris].sort((a, b) =>
        levenshteinDistance(a.clubName.toLowerCase(), searchText.toLowerCase()) -
        levenshteinDistance(b.clubName.toLowerCase(), searchText.toLowerCase())
      )
    : favoris;

  const renderCategoryCard = (category, index) => (
    <View
      key={category.id}
      style={[
        styles.categoryCard,
        {
          backgroundColor: AppConfig.BackGroundButton(darkMode),
          shadowColor: AppConfig.ShadowColor(darkMode),
          marginRight: index % 2 === 0 ? 8 : 0,
          marginLeft: index % 2 === 1 ? 8 : 0,
        }
      ]}
    >
      <MyImage
        source={category.logo}
        style={[styles.logoBorder, {
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          marginBottom: 12
        }]}
        contentFit="contain"
      />
      <Text
        style={[
          styles.categoryTitle,
          { color: AppConfig.MainTextColor(darkMode), marginBottom: 14 }
        ]}
        numberOfLines={2}
      >
        {category.clubName}
      </Text>
      <TouchableOpacity style={[styles.arrow, { backgroundColor: "#e74c3c15" }]} onPress={() => handleDeleteCategory(category.id)}>
        <Ionicons name={"trash-outline"} size={16} color={"#e74c3c"} />
      </TouchableOpacity>
    </View>
  );

  const renderCategoryGrid = () => {
    if (filteredFavoris.length === 0) {
      return (
        <Empty
          title="Aucun Favoris trouvé"
          subtitle="Ajoutez vos favoris pour ne plus rien rater"
          icon="star-outline"
          color="#e9d700"
        />
      );
    }

    const pairs = [];
    for (let i = 0; i < filteredFavoris.length; i += 2) {
      pairs.push(filteredFavoris.slice(i, i + 2));
    }

    return pairs.map((pair, pairIndex) => (
      <View key={`category-pair-${pairIndex}`} style={styles.categoryRow}>
        {pair.map((category, index) => renderCategoryCard(category, index))}
        {pair.length === 1 && <View style={styles.categoryCardPlaceholder} />}
      </View>
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
      <ScreenHeader color="#e9d700" name="Favoris" icon="star-outline" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionDivider icon="apps-outline" label="Liste des favoris" />
          <View style={{ paddingBottom: 10, marginHorizontal: 12 }}>
            <Search placeholder="Cherchez dans vos favoris" SearchFilter={setSearchText} Value={searchText} />
          </View>
          <View style={styles.categoriesContainer}>
            {renderCategoryGrid()}
          </View>
          <SectionDivider icon="add-outline" label="Ajouter des favoris" />
          <FiltersCompetitionAndClubNoButton onFilterChange={(ClubId: string, Clublogo: string, CLubName: string) => {
            if (favoris.find(cat => cat.id === ClubId)) {
              Alert.alert("Déjà dans les favoris");
              return;
            }
            const newCategory = {
              id: ClubId,
              logo: Clublogo,
              clubId: ClubId,
              clubName: CLubName,
            };
            const updated = [...favoris, newCategory];
            setFavoris(updated);
          }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 50,
  },
  logoBorder: {
    width: 70,
    height: 70,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  categoryRow: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  categoryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minHeight: 140,
    justifyContent: "space-between",
  },
  categoryCardPlaceholder: {
    flex: 1,
    marginLeft: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Favoris;