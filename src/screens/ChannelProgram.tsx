import React, { useContext, useEffect, useState } from "react";
import type { ChannelProgramType } from "../utils/ChannelProgramType";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import SectionDivider from "../components/home/SectionDivider";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackScreens } from "../navigation/type";
import { Ionicons } from "@expo/vector-icons";
import { useTypedNavigation } from "../navigation/navigation";
import FiltersChannel from "../components/layout/Filters/DateFilters";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import { Banner } from "../hooks/Pub";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
import ItemListCard from "../components/home/ItemListCard";
import NotFound from "../components/layout/NotFound";
import { routes } from "../routes/routes";
function ChannelProgram() {
  const route = useRoute<RouteProp<StackScreens, "ChannelProgram">>();
  const { id } = route.params;
  const { mode } = route.params;
  const [channels, setChannels] = useState<ChannelProgramType[]>([]);
  const [empty, setEmpty] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useTypedNavigation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const DateToStringUI = (date: string) => {
    if (!date) return "";
    const dateSplit = date.split("-");
    if (dateSplit.length !== 3) return "";
    return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
  };

  useEffect(() => {
    const getChannel = async () => {
      setLoading(true);
      try {
        console.log(
          `${AppConfig.API_BASE_URL}${routes.ChannelProgram}?apikey=${AppConfig.API_Key}&mode=${mode}&id=${id}`,
        );
        const response = await fetch(
          `${AppConfig.API_BASE_URL}${routes.ChannelProgram}?apikey=${AppConfig.API_Key}&mode=${mode}&id=${id}`,
        );
        const data = await response.json();
        if (!data.programmes || data.programmes.length === 0) {
          setChannels([]);
          setEmpty(true);
          return;
        }
        const flattened = data.programmes.flatMap((block: any) =>
          block.emissions.map((item: any) => ({
            ...item,
            date: block.date,
          })),
        );
        setChannels(flattened);
        setEmpty(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getChannel();
  }, [id]);
  return (
    <>
      <ScreenHeader color="#3f96ee" name="Programmes" icon="calendar-outline" />
      <SectionDivider icon={"cog-outline"} label={"Filtres Rapides"} />
      <View style={{ marginHorizontal: 12 }}>
        <FiltersChannel
          Value={selectedDate}
          onFilterChange={(newDate) => {
            console.log("Filtre appliqué :", newDate);
            if (!newDate) {
              setIsFilterApplied(false);
              setSelectedDate("");
            } else {
              setIsFilterApplied(true);
              setSelectedDate(DateToStringUI(newDate));
            }
          }}
        />
      </View>
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: AppConfig.BackgroundColor(darkMode),
          }}
        >
          <ActivityIndicator size="large" color="#3f96ee" />
        </View>
      ) : empty ? (
        <NotFound />
      ) : (
        <View style={{ backgroundColor: AppConfig.BackgroundColor(darkMode) }}>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 300,
            }}
          >
            {Object.entries(
              channels.reduce(
                (acc: { [key: string]: ChannelProgramType[] }, item) => {
                  if (!acc[item.date]) acc[item.date] = [];
                  acc[item.date].push(item);
                  return acc;
                },
                {},
              ),
            ).map(([date, items]) => {
              if (!isFilterApplied) {
                return (
                  <View key={date} style={{
                  }}>
                    <SectionDivider icon={"calendar-outline"} label={date} />
                    {items.map((item, index) => (
                      <React.Fragment key={"program-fragment-" + item.id}>
                        <View key={"ChannelProgramResult" + id} style={{ marginHorizontal: 12 }}>
                          <ItemListCard
                           type= 'emission'
                           id={item.id}
                           date={item.date}
                           heure={item.heure}
                           titre={item.titre}
                           desc={item.desc}
                           direct={item.direct}
                           categorie={item.categorie}
                           chaine={item.chaine}
                           logo={item.logo}
                           image={item.image}
                           url={item.url}
                          />
                        </View>
                        {index > 0 &&
                          index % AppConfig.PubEachNumberOfBlock() === 0 && (
                            <Banner
                              darkMode={darkMode}
                              key={"banner-program-filtre-" + index}
                              unitId={
                                "/49926454/madeinfoot>appli/une>topic>interstitiel"
                              }
                            />
                          )}

                      </React.Fragment>
                    ))}
                  </View>
                );
              }
              if (date === selectedDate) {
                return (
                  <View key={date}>
                    <SectionDivider icon={"calendar-outline"} label={date} />
                    {items.map((item, index) => (
                      <React.Fragment key={"program-fragment-" + item.id}>
                        {index > 0 &&
                          index % AppConfig.PubEachNumberOfBlock() === 0 && (
                            <Banner
                              key={"banner-program-" + index}
                              darkMode={darkMode}
                              unitId={
                                "/49926454/madeinfoot>appli/une>topic>interstitiel"
                              }
                            />
                          )}
                        <ItemListCard
                          key={"program-item-" + item.id}
                          type="emission"
                          {...item}
                        />
                      </React.Fragment>
                    ))}
                  </View>
                );
              }
              return null;
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: 12,
    marginTop: 50,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    padding: 6,
  },
  modernHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  modernHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },


  modernBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  arrow: {
    width: 30,
    height: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

});

export default ChannelProgram;
