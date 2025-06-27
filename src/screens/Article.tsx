import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import RenderHtml from "react-native-render-html";
import SectionDivider from "../components/home/SectionDivider";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackScreens } from "../navigation/type";
import { Ionicons } from "@expo/vector-icons";
import { useTypedNavigation } from "../navigation/navigation";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import { ArticleDetail } from "../utils/ArticleDetailType";
import { ArticlePopulaire } from "../utils/ArticlePopulaireType";
import ArticleListCard from "../components/home/ArticleListCard";
import { PubPage } from "../utils/PubPageType";
import { BannerHeader, BannerFooter } from "../hooks/Pub";
import type { Article } from "../utils/ArticleType";
import { Banner } from "../hooks/Pub";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
import Loading from "../components/layout/Loading";
import DisplayNews from "../components/news/DisplayNews";
import { routes } from "../routes/routes";
import Log from "../functions/Log"

function Article() {
  const route = useRoute<RouteProp<StackScreens, "ChannelProgram">>();
  const { id } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useTypedNavigation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [Article, setArticle] = useState<ArticleDetail>();
  const [ArticlePopular, setArticlePopular] = useState<ArticlePopulaire[]>([]);
  const { width } = useWindowDimensions();
  const [NextPageLoading, setNextPageLoading] = useState<boolean>(false);
  const [PageCount, SetPageCount] = useState<number>(1);
  const [PageArticle, setPageArticle] = useState<Article[]>([]);
  const [PubPage, setPubPage] = useState<PubPage>();


  useEffect(() => {
    const getChannel = async () => {
      setLoading(true);
      Log(`${AppConfig.API_BASE_URL}${routes.Article}?apikey=${AppConfig.API_Key}&id=${id}`);
      try {
        const response = await fetch(
          `${AppConfig.API_BASE_URL}${routes.Article}?apikey=${AppConfig.API_Key}&id=${id}`,
        );
        Log(`${AppConfig.API_BASE_URL}${routes.Article}?apikey=${AppConfig.API_Key}&id=${id}`);
        const data = await response.json();
        Log(data);
        setArticle(data);
        setArticlePopular(data.populaires.liste ?? []);
        setPubPage(data.pub_page);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getChannel();
  }, [id]);
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
        // Filtrer pour éviter les doublons en utilisant ArticlePopular comme référence
        const uniqueArticles = newData.actualites.filter(
          (article) => !ArticlePopular.some((existing) => existing.id === article.id)
        );
        setPageArticle((prev) => [...prev, ...uniqueArticles]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setNextPageLoading(false);
    }
  };

  return (
    <View>
      <ScreenHeader color="#3f96ee" name="Articles" icon="newspaper-outline" />
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
      ) : (
        <View style={styles.headerContainer}>
          <ScrollView
            style={{
              paddingBottom: 400,
              backgroundColor: AppConfig.BackgroundColor(darkMode),
            }}
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                setNextPageLoading(true);
                SetPageCount(PageCount + 1);
                GetNextPage();
              }
            }}
            scrollEventThrottle={16}
          >
            {PubPage && PubPage.top.display !== 0 && (
              <View style={{ marginBottom: 10 }}>
                <BannerHeader
                  darkMode={darkMode}
                  unitId={PubPage.top.banner.id}
                />
              </View>
            )}
            <View style={{ marginHorizontal: 12 }}>
              {Article && (
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      color: AppConfig.MainTextColor(darkMode),
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 5,
                      borderBottomWidth: 2,
                      borderBottomColor: "#3f96ee",
                      paddingBottom: 4,
                    }}
                  >
                    {Article.titre}
                  </Text>
                  <Text
                    style={{
                      color: AppConfig.SecondaryTextColor(darkMode),
                      fontSize: 14,
                      marginBottom: 10,
                    }}
                  >
                    {Article.theme} · {Article.date} · {Article.auteur}
                  </Text>
                  <DisplayNews {...Article} />
                </View>
              )}
              {ArticlePopular.length > 0 && (
                <>
                  <SectionDivider
                    icon={"analytics-outline"}
                    label={"Article Populaires"}
                  />
                  {ArticlePopular.map((item, index) => {
                    if (item.id !== id) {
                      return (
                        <React.Fragment key={"article-popular-" + item.id}>
                          <ArticleListCard
                            key={"BannerPubArticle-" + item.id}
                            id={item.id}
                            auteur={item.auteur}
                            date={item.date}
                            filtre={""}
                            titre={item.titre}
                            theme={item.theme}
                            ligue={item.ligue}
                            photo={item.photo}
                            photo_une={item.photo_une}
                            officiel={item.officiel}
                            exclu={item.exclu}
                            video={item.video == "1" ? 1 : 0}
                            une={item.une}
                            live={item.live}
                            match={item.match}
                          />
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
                </>
              )}
              {PubPage && PubPage.middle.display !== 0 && (
                <View style={{ marginBottom: 10 }}>
                  <Banner
                    pagetype="article"
                    darkMode={darkMode}
                    unitId={PubPage.middle.banner.id}
                  />
                </View>
              )}
              {PageArticle.length > 0 && (
                <>
                  <SectionDivider
                    icon={"trending-up-outline"}
                    label={"Les dernières infos média & people foot"}
                  />
                  {PageArticle
                    .filter(item => item.id && item.titre)
                    .map((item) => (
                      <ArticleListCard
                        key={"BannerPubArticle2-" + item.id}
                        id={item.id}
                        auteur={item.auteur}
                        date={item.date}
                        filtre={item.filtre}
                        titre={item.titre}
                        theme={item.theme}
                        ligue={item.ligue}
                        photo={item.photo}
                        photo_une={item.photo_une}
                        officiel={""}
                        exclu={item.exclu}
                        video={item.video}
                        une={item.une}
                        live={"0"}
                        match={null}
                      />
                    ))
                  }
                </>
              )}
            </View>
            {NextPageLoading && (
              <Loading />
            )}
          </ScrollView>
        </View>
      )}
      <View style={styles.actionSection}>
        {PubPage && PubPage.footer.display !== 0 && (
          <BannerFooter
            pagetype="article"
            darkMode={darkMode}
            unitId={PubPage.footer.banner.id}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
  },
  actionSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 150,
    right: 0,
  },
});

export default Article;
