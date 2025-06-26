import React, { useEffect, useState, useContext } from "react";
import { View, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
import ArticleListCard from "../components/home/ArticleListCard";
import Empty from "../components/layout/Empty";
import { Banner } from "../hooks/Pub";
import { ThemeContext } from "../context/ThemeContext";
import Loading from "../components/layout/Loading";
import { AppConfig } from "../AppConfig";
import { routes } from "../routes/routes";
import type { ArticlePageType } from "../utils/ArticlePageType";
import type { Article } from "../utils/ArticleType";

function ArticlePage() {
  const [Article, setArticle] = useState<ArticlePageType[]>([]);
  const [ScrollArticle, setScrollArticle] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [NextPageLoading, setNextPageLoading] = useState(false);
  const [PageCount, setPageCount] = useState(1); // page 1 déjà chargée
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const getInitialArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${AppConfig.API_BASE_URL}${routes.ArticlePage}?apikey=${AppConfig.API_Key}`);
        const data = await response.json();
        setArticle(data.actualites);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getInitialArticles();
  }, []);

  const GetNextPage = async () => {
    setPageCount((prev) => prev + 1);
    try {
        setNextPageLoading(true);
        const response = await fetch(
          `${AppConfig.API_BASE_URL}${routes.Info}?apikey=${AppConfig.API_Key}&page=${PageCount}`,
        );
        const newData = await response.json();
  
        if (Array.isArray(newData.actualites)) {
          const uniqueArticles = newData.actualites.filter(
            (article: Article) => !ScrollArticle.some((existing: Article) => existing.id === article.id)
          );
          setScrollArticle((prev) => [...prev, ...uniqueArticles]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setNextPageLoading(false);
      }
    };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
  };

  return (
    <View>
      <ScreenHeader name="Actualités" icon="newspaper-outline" color="#e83e8c" />
      <ScrollView
        contentContainerStyle={{ marginHorizontal: 12, paddingBottom: 200 }}
        scrollEventThrottle={16}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            GetNextPage();
          }
        }}
      >
        {loading ? (
          <Loading />
        ) : Article.length > 0 ? (
          Article.map((item, index) =>
            item.type === "info" ? (
                <ArticleListCard key={item.id} filtre={""} id={item.id} auteur={item.auteur} date={item.date} titre={item.titre} theme={item.theme} ligue={item.ligue} photo={item.photo} photo_une={item.photo_une} officiel={item.officiel} exclu={item.exclu} video={Number(item.video)} une={item.une} live={item.live} match={item.match} />
            ) : (
              <Banner
                key={"bannerArticle-" + index}
                darkMode={darkMode}
                unitId={item.banner.id}
                pagetype="article"
              />
            )
          )
        ) : (
          <Empty
            title="Aucun article"
            subtitle="Aucun article trouvé"
            icon="newspaper-outline"
            color="#e83e8c"
          />
        )}
        {NextPageLoading && <Loading />}
        {ScrollArticle.length > 0 ? (
            ScrollArticle.filter((item) => !Article.some((a) => a.type === "info" && a.id === item.id)).filter((item) => item.id && item.titre).map((item, index) =>
                <ArticleListCard key={item.id} filtre={""} id={item.id} auteur={item.auteur} date={item.date} titre={item.titre} theme={item.theme} ligue={item.ligue} photo={item.photo} photo_une={item.photo_une} officiel={item.officiel} exclu={item.exclu} video={Number(item.video)} une={item.une} live={item.live} match={item.match} />
            )
        ) : (
            <Empty
                title="Aucun article"
                subtitle="Aucun article trouvé"
                icon="newspaper-outline"
                color="#e83e8c"
            />
        )}
      </ScrollView>
    </View>
  );
}

export default ArticlePage; 