import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import RenderHtml from "react-native-render-html";
import { useTypedNavigation } from "../navigation/navigation";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
import Loading from "../components/layout/Loading";
import { routes } from "../routes/routes";
import Log from "../functions/Log"
function LegalMention() {
  const { darkMode } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [legalMention, setLegalMention] = useState(null);

  const navigation = useTypedNavigation();
  useEffect(() => {
    const getChannel = async () => {
      Log(`${AppConfig.API_BASE_URL}${routes.LegalMention}?apikey=${AppConfig.API_Key}`);
      try {
        const response = await fetch(
          `${AppConfig.API_BASE_URL}${routes.LegalMention}?apikey=${AppConfig.API_Key}`,
        );
        const data = await response.json();
        setLegalMention(data.contenu);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getChannel();
  }, []);

  return (
    <View>
      <ScreenHeader color="#4CAF50" name="Mentions Légales" icon="newspaper-outline" />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: AppConfig.BackgroundColor(darkMode) },
        ]}
      >
        {loading ? (
          <Loading />
        ) : (
          <>
            <RenderHtml
              contentWidth={width}
              source={{ html: legalMention }}
              baseStyle={{
                color: AppConfig.MainTextColor(darkMode),
                fontSize: 13,
                lineHeight: 20,
              }}
              tagsStyles={{
                h1: {
                  fontSize: 20,
                  color: "#3f96ee",
                  fontWeight: "700",
                  marginBottom: 16,
                  marginTop: 24,
                },
                h2: {
                  fontSize: 16,
                  color: "#3f96ee",
                  fontWeight: "600",
                  marginBottom: 8,
                  marginTop: 16,
                },
                p: {
                  marginBottom: 12,
                  color: AppConfig.SecondaryTextColor(darkMode),
                },
                strong: {
                  fontWeight: "700",
                },
              }}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    flexGrow: 1,
    paddingBottom : 300,
  },
});

export default LegalMention;