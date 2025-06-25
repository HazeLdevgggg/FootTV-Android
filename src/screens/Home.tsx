import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
} from "react-native";
import DateToUI from "../functions/DateToUI";
import Loading from "../components/layout/Loading"
import ItemListCard from "../components/home/ItemListCard";
import ArticleListCard from "../components/home/ArticleListCard";
import Filters from "../components/home/Filters";
import SectionDivider from "../components/home/SectionDivider";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import type { ItemList } from "../utils/ItemListType";
import type { Article } from "../utils/ArticleType";
import { Banner, BannerFooter, BannerHeader } from "../hooks/Pub";
import WeekdayFilter from "../components/home/WeekdayFilter";
import { DateHomeType } from "../utils/DateHomeType";
import Empty from "../components/layout/Empty";
import { useTypedNavigation } from "../navigation/navigation";
import { routes } from "../routes/routes";
import { PubPage } from "../utils/PubPageType";
import { setupNotifications } from '../hooks/Notifications';

let notificationsInitialized = false;

function Home() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [ItemList, setItemList] = useState<ItemList[]>([]);
  const [FirstItemList, setFirstItemList] = useState<ItemList[]>([]);
  const [Article, setArticle] = useState<Article[]>([]);
  const [NextPageLoading, setNextPageLoading] = useState<boolean>(false);
  const [PageCount, SetPageCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const context = useContext(ThemeContext);
  const navigator = useTypedNavigation();

  // To know which days are selected
  const [DateHome, setDateHome] = useState<DateHomeType[]>([]);
  const [DateHomeFilter, setDateHomeFilter] = useState<DateHomeType[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [daysLoading, setDaysLoading] = useState<boolean>(false);
  const [Favoris, setFavoris] = useState<string[]>([]);
  const [PubPage, setPubPage] = useState<PubPage>();
  const [filterState, setFilterState] = useState({
    Cesoir: false,
    Direct: false,
    EnCours: false,
  });

  useEffect(() => {

    if (!notificationsInitialized) {
      console.log("Init Notification");
      setupNotifications(navigator, context); // 🔹 Passe la navigation ici
      notificationsInitialized = true;
    }

    const getChannel = async () => {
      try {
        setIsLoading(true);
        console.log(
          `${AppConfig.API_BASE_URL}${routes.Home}?apikey=${AppConfig.API_Key}`,
        );
        const response = await fetch(
          `${AppConfig.API_BASE_URL}${routes.Home}?apikey=${AppConfig.API_Key}`,
        );
        const data = await response.json();
        setItemList(Array.isArray(data.emissions) ? data.emissions : []);
        setFirstItemList(Array.isArray(data.emissions) ? data.emissions : []);
        setPubPage(data.pub_page);
        setArticle(
          Array.isArray(data.actualites)
            ? data.actualites.sort((a, b) => Number(b.une) - Number(a.une))
            : [],
        );
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
      <Loading />
    );
  }
  const MatchEnCours = (date: string, heure: string) => {
    console.log(date, heure);
    const [day, month, year] = date.split("/");
    const [hour, minute] = heure.split("h");
    const matchStart = new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`,
    );
    const now = new Date();
    const diffInHours = (now.getTime() - matchStart.getTime()) / 3600000; // différence en heures
    return Math.abs(diffInHours) <= 1;
  };

  const MatchLesoir = (param: ItemList) => {
    if (param.type === 'emission') {
      const heure = Number(param.heure.split("h")[0]);
      return heure > 18;
    }
    return false;
  }

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    );
  };
  const GetNextPage = async () => {
    try {
      const response = await fetch(
        `${AppConfig.API_BASE_URL}${routes.Info}?apikey=${AppConfig.API_Key}&page=${PageCount}`,
      );
      const newData = await response.json();

      if (Array.isArray(newData.actualites)) {
        const uniqueArticles = newData.actualites.filter(
          (article) => !Article.some((existing) => existing.id === article.id)
        );
        setArticle((prev) => [...prev, ...uniqueArticles]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setNextPageLoading(false);
    }
  };


  const GetDayMatch = async (params: string[], favorisParams: string[]) => {
    setSelectedDays(params);
    try {
      setDaysLoading(true);
      console.log(`${AppConfig.API_BASE_URL}${routes.SearchDate}?apikey=${AppConfig.API_Key}`);
      const response = await fetch(`${AppConfig.API_BASE_URL}${routes.SearchDate}?apikey=${AppConfig.API_Key}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dates: JSON.stringify(params),
          favoris: JSON.stringify(favorisParams),
        }),
      });
      console.log("Dates :", JSON.stringify(params));
      console.log("Favoris :", JSON.stringify(favorisParams));
      const data = await response.json();
      setDateHome(data.dates);
      setDateHomeFilter(data.dates);
      // Réapplique les filtres actifs
      if (filterState) {
        let filtered = JSON.parse(JSON.stringify(data.dates));
        filtered.map((item) => {
          if (filterState.Cesoir) {
            item.emissions = item.emissions.filter((a) => MatchLesoir(a));
          }
          if (filterState.Direct) {
            item.emissions = item.emissions.filter((a) => a.direct === "1");
          }
          if (filterState.EnCours) {
            item.emissions = item.emissions.filter((a) => {
              if (a.date && a.heure) {
                return MatchEnCours(a.date, a.heure);
              }
              return false;
            });
          }
          item.nbr = item.emissions.length;
        });
        setDateHome(filtered);
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setDaysLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: AppConfig.BackgroundColor(darkMode) }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 300 }}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setNextPageLoading(true);
            SetPageCount(PageCount + 1);
            GetNextPage();
          }
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.vertical}>
          <WeekdayFilter onFilterChange={(NewselectedDays) => {
            GetDayMatch(NewselectedDays.length > 0 ? NewselectedDays : [new Date().toISOString().split("T")[0]], Favoris);
          }}></WeekdayFilter>
          <SectionDivider icon="cog-outline" label="Filtres Rapides" />
          <Filters
            onFilterChange={(Cesoir, Direct, EnCours, NewFavoris) => {
              setFilterState({ Cesoir, Direct, EnCours });
              if (NewFavoris.length !== Favoris.length) {
                setFavoris(NewFavoris);
                GetDayMatch(selectedDays.length > 0 ? selectedDays : [new Date().toISOString().split("T")[0]], NewFavoris);
              }
              if (DateHome.length > 0) {
                let filtered = JSON.parse(JSON.stringify(DateHomeFilter));
                filtered.map((item) => {
                  if (Cesoir) {
                    item.emissions = item.emissions.filter((a) => {
                      return MatchLesoir(a)
                    });
                  }
                  if (Direct) {
                    item.emissions = item.emissions.filter((a) =>
                      a.direct === "1"
                    );
                  }
                  if (EnCours) {
                    item.emissions = item.emissions.filter((a) =>
                      item.type === 'emission' ? MatchEnCours(a.date, a.heure) : false
                    );
                  }
                  item.nbr = item.emissions.length;
                })
                setDateHome(filtered);
              } else {
                let filtered = [...FirstItemList];
                if (Cesoir) {
                  filtered = filtered.filter((a) => {
                    return MatchLesoir(a)
                  });
                }
                if (Direct) {
                  filtered = filtered.filter((item) =>
                    item.type === 'emission' && item.direct === "1"
                  );
                }
                if (EnCours) {
                  filtered = filtered.filter((item) =>
                    item.type === 'emission' ? MatchEnCours(item.date, item.heure) : false
                  );
                }
                setItemList(filtered);
              }
            }}
          />
          {PubPage && PubPage.top.display !== 0 && (
            <BannerHeader
              darkMode={darkMode}
              unitId={PubPage.top.banner.id}
            />
          )}
          <SectionDivider icon="football-outline" label={"Les Matchs" + " (" + (DateHome.length > 0 ? DateHome.reduce((acc, item) => acc + item.nbr, 0) : ItemList.length) + ")"} />
          <View style={{ marginHorizontal: 12 }}>
            {daysLoading ? (
              <Loading />
            ) : (
              DateHome.length > 0 ? (
                DateHome.map((item) => (
                  <View key={"home-item-" + item.date}>
                    <SectionDivider icon="calendar-outline" label={DateToUI(item.date) + " (" + item.nbr + ")"} />
                    <React.Fragment key={"home-item-" + item.date}>
                      {item.emissions.length > 0 ? (
                        item.emissions.map((emission, index) => (
                          emission.type === 'emission' ? (
                            <ItemListCard key={emission.id} {...emission} />
                          ) : (
                            <Banner
                              key={"bannerHomeMatch-" + index}
                              darkMode={darkMode}
                              unitId={
                                emission.banner.id
                              }
                            />
                          )
                        ))) : (
                        <Empty title="Aucun Match trouvé" subtitle="Modifiez les filtres ou sélectionnez une autre date" icon="football-outline" color="#3f96ee" />
                      )}
                    </React.Fragment>
                  </View>
                ))
              ) : (
                ItemList.length > 0 ? (
                  ItemList.map((item, index) => (
                    item.type === 'emission' ? (
                      <ItemListCard key={item.id} {...item} />
                    ) : (
                      <Banner
                        key={"bannerHomeMatch-" + index}
                        darkMode={darkMode}
                        unitId={
                          item.banner.id
                        }
                      />
                    )
                  ))
                ) : (
                  <Empty title="Aucun Match trouvé" subtitle="Modifiez les filtres ou pour une recherche plus précise allez sur la page recherche" icon="football-outline" color="#3f96ee" />
                )
              )
            )}
          </View>
          {PubPage.middle.display !== 0 && (
            <View style={{ marginHorizontal: 12 }}>
              <Banner
                darkMode={darkMode}
                unitId={PubPage.middle.banner.id}
              />
            </View>
          )}
          <SectionDivider
            icon="trending-up-outline"
            label="Les dernières infos média & people foot"
          />
          <View style={{ marginHorizontal: 12 }}>
            {Array.isArray(Article) &&
              Article
                .filter(item => item.id && item.titre)
                .map((item, index) => (
                  <ArticleListCard
                    key={"home-article-" + item.id}
                    {...item}
                  />
                ))
            }
          </View>
        </View>
        {NextPageLoading && (
          <Loading />
        )}
      </ScrollView>
      <View style={styles.actionSection}>
        {PubPage.footer.display !== 0 && (
          <BannerFooter
            darkMode={darkMode}
            unitId={PubPage.footer.banner.id}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginBottom: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  vertical: {
    flexDirection: "column",
    flex: 1,
  },
  titreText: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },
  descText: {
    color: "gray",
    fontSize: 11,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3f96ee",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#3f96ee",
    marginLeft: 8,
    opacity: 0.4,
  },
  actionSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
export default Home;