import React, { useContext, useEffect, useState } from "react";
import type { Club } from "../utils/ClubType";
import ItemChannel from "../components/layout/ItemChannel";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackScreens } from "../navigation/type";
import { Ionicons } from "@expo/vector-icons";
import { useTypedNavigation } from "../navigation/navigation";
import { levenshteinDistance } from "../functions/Levenshtein";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import { Banner } from "../hooks/Pub";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
import Loading from "../components/layout/Loading";
import Search from "../components/layout/Search";
import { routes } from "../routes/routes";
function Club() {
  const route = useRoute<RouteProp<StackScreens, "Club">>();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [channels, setChannels] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { id } = route.params;
  const navigation = useTypedNavigation();
  useEffect(() => {
    const getChannel = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${AppConfig.API_BASE_URL}${routes.Club}?apikey=${AppConfig.API_Key}&ligue=${id}`,
        );
        const data = await response.json();
        if (!data.clubs || data.clubs.length === 0) {
          setEmpty(true);
          setChannels([]);
          return;
        }
        setChannels(data.clubs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getChannel();
  }, [id]);

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
    <>
      <ScreenHeader color="#3f96ee" name="Club" icon="trophy-outline" />
      {loading ? (
        <Loading />
      ) : empty ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons
            name={"videocam-off-outline"}
            size={90}
            style={{ color: "#3f96ee", marginBottom: 20 }}
          ></Ionicons>
          <Text style={{ color: "gray", fontWeight: "900", fontSize: 18 }}>
            Aucun Programme de prévu
          </Text>
        </View>
      ) : (
        <View style={{ backgroundColor: AppConfig.BackgroundColor(darkMode) }}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingBottom: 200,
            }}
          >
            <Search placeholder="Chercher un match ..." SearchFilter={SearchFilter} />
            <ItemChannel
              key={"club-all-competitions"}
              id={id}
              mode={"0"}
              nom={"Voir toute la compétitions"}
              logo={require("../assets/Icon/all.png")}
            />
            {channels.map((items, index) => (
              <React.Fragment key={"club-fragment-" + items.id}>
                <ItemChannel
                  key={"club-item-" + items.id}
                  id={items.id}
                  mode={"1"}
                  nom={items.nom}
                  logo={items.logo}
                />
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}


export default Club;
