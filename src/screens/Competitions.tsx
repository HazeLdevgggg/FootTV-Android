import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import ItemCompetitions from "../components/layout/ItemCompetitions";
import { Ionicons } from "@expo/vector-icons";
import { levenshteinDistance } from "../functions/Levenshtein";
import type { Competitions } from "../utils/CompetitionsType";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import { Banner } from "../hooks/Pub";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTypedNavigation } from "../navigation/navigation";
import SectionDivider from "../components/home/SectionDivider";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
import Search from "../components/layout/Search";
import { routes } from "../routes/routes";
function Competitions() {
  const [channels, setChannels] = useState<Competitions[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigation = useTypedNavigation();

  useEffect(() => {
    const getChannel = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${AppConfig.API_BASE_URL}${routes.Competitions}?apikey=${AppConfig.API_Key}`,
        );
        const data = await response.json();
        setChannels(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getChannel();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: AppConfig.BackgroundColor(darkMode),
        }}
      >
        <ActivityIndicator size="large" color="#3f96ee" />
      </View>
    );
  }

  const SearchFilter = (text: string) => {
    setSearchQuery(text);
    const sorted = [...channels].sort(
      (a, b) =>
        levenshteinDistance(a.nom.toLowerCase(), text.toLowerCase()) -
        levenshteinDistance(b.nom.toLowerCase(), text.toLowerCase()),
    );
    setChannels(sorted);
  };

  return (
    <View style={{ backgroundColor: AppConfig.BackgroundColor(darkMode) }}>
      <ScreenHeader color="#3f96ee" name="Compétitions" icon="trophy-outline" />
      <ScrollView >
        <View style={{ marginHorizontal: 12 }}>
          <Search placeholder="Chercher une compétition ..." SearchFilter={SearchFilter} />
          {channels.map((item, index) => (
            <React.Fragment key={"competition-fragment-" + item.id}>
              <ItemCompetitions key={"competition-item-" + item.id} {...item} />
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
export default Competitions;
