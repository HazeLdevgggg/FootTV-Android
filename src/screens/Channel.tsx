import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import ItemChannel from "../components/layout/ItemChannel";
import { levenshteinDistance } from "../functions/Levenshtein";
import type { ItemChannelType } from "../utils/ItemChannelType";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import { Banner } from "../hooks/Pub";
import { Ionicons } from "@expo/vector-icons";
import { useTypedNavigation } from "../navigation/navigation";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
import Search from "../components/layout/Search";
import { routes } from "../routes/routes";
function Channel() {
  const navigation = useTypedNavigation();
  const [channels, setChannels] = useState<ItemChannelType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const getChannel = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${AppConfig.API_BASE_URL}${routes.Channel}?apikey=${AppConfig.API_Key}`,
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
      <ScreenHeader color="#28a745" name="Chaînes" icon="tv-outline" />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 200,
          marginHorizontal: 12,
          backgroundColor: AppConfig.BackgroundColor(darkMode),
        }}
      >
        <Search placeholder="Chercher une chaîne ..." SearchFilter={SearchFilter} />
        {channels.map((item, index) => (
          <React.Fragment key={"channel-fragment-" + item.id}>
            <ItemChannel mode={"2"} key={"channel-item-" + item.id} {...item} />
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
}
export default Channel;
