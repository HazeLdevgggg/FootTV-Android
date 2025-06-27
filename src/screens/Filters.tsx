import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useContext, useRef, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import { Ionicons } from "@expo/vector-icons";
import { useTypedNavigation } from "../navigation/navigation";
import SectionDivider from "../components/home/SectionDivider";
import { SearchType } from "../utils/SearchType";
import { ResultSearchType } from "../utils/ResultSearchType";
import FiltersPageSection from ".././components/layout/FiltersPageSection";
import { ActivityIndicator } from "react-native";
import ItemListCard from "../components/home/ItemListCard";
import React from "react";
import Loading from "../components/layout/Loading";
import NotFound from "../components/layout/NotFound";
import Search from "../components/layout/Search";
import { routes } from "../routes/routes";
import { ItemList } from "../utils/ItemListType";
import { Banner, BannerHeader, BannerFooter } from "../hooks/Pub";
import { PubPage } from "../utils/PubPageType";
import Log from "../functions/Log"

async function GetResult(
    props: SearchType,
    { OnFinish }: { OnFinish: (Loading: boolean) => void }
): Promise<{ res: ItemList[]; pub: PubPage }> {
    try {
        OnFinish(true);
        Log("Props :"+ props);
        Log(`${AppConfig.API_BASE_URL}${routes.Search}?apikey=${AppConfig.API_Key}`)
        const response = await fetch(`${AppConfig.API_BASE_URL}${routes.Search}?apikey=${AppConfig.API_Key}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                search: props.search, // si "" pas de recherche basé sur le texte sinon filtrer par le texte
                CeSoir: props.CeSoir, // si "0" ou "1" pour filtrer les matchs de ce soir
                EnDirect: props.EnDirect, // si "0" ou "1" pour filtrer les matchs en direct
                EnCour: props.EnCour,
                ClubId: props.ClubId, // si "" pas de filtre sur le club sinon filtrer par l'ID du club
                CompetitionId: props.CompetitionId, // si "" pas de filtre sur la compétition sinon filtrer par l'ID de la compétition
                ChannelId: props.ChannelId, // si "" pas de filtre sur la chaîne sinon filtrer par l'ID de la chaîne
                date: props.date, // si "" pas de filtre sur la date sinon filtrer par la date (format DD/MM/YYYY)
                Favoris: props.Favoris,
            }),
        });
        Log(`>> search : ${props.search}`);
        Log(`>> CeSoir : ${props.CeSoir}`);
        Log(`>> EnCour : ${props.EnCour}`);
        Log(`>> EnDirect : ${props.EnDirect}`);
        Log(`>> ClubId : ${props.ClubId}`);
        Log(`>> CompetitionId : ${props.CompetitionId}`);
        Log(`>> ChannelId : ${props.ChannelId}`);
        Log(`>> date : ${props.date}`);
        Log(`>> Favoris : ${props.Favoris}`);
        if (!response.ok) {
            console.warn("Erreur HTTP :", response.status);
            return { res: [], pub: undefined };
        }
        const data = await response.json();
        if (data?.Favoris && typeof data.Favoris === 'string') {
            data.Favoris = JSON.parse(data.Favoris);
        }
        Log(">> response :"+ data.data);
        Log(">> response :"+ data.test);

        return { res: data.emissions as ItemList[], pub: data.pub_page };

    } catch (error) {
        console.error("Erreur dans GetResult:", error);
        return { res: [] as ItemList[], pub: undefined };
    } finally {
        OnFinish(false);
    }
}



function Filters() {
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); const navigation = useTypedNavigation();
    const { darkMode } = useContext(ThemeContext);
    // Is Loading To show loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // To know if the user typed something in the search input
    const [searchQuery, setSearchQuery] = useState("");
    // Filters : Club
    const [clubId, setClubId] = useState<string>("");
    // Filters : Ce Compétition
    const [competitionId, setCompetitionId] = useState<string>("");
    // Filters : Channel
    const [channelId, setChannelId] = useState<string>("");
    // Filters : En Date
    const [date, setDate] = useState<string>("");
    // Filters : En Direct
    const [enDirect, setEnDirect] = useState<boolean>(false);
    // Filters : Ce Soir
    const [ceSoir, setCeSoir] = useState<boolean>(false);
    // Filters : EnCour
    const [EnCour, setEnCour] = useState<boolean>(false);
    // Results of the search
    const [results, setResults] = useState<ItemList[]>([] as ItemList[]);
    // SearchParam Or No
    const [searchParamNull, setSearchParamNull] = useState<boolean>(false);
    // Favoris
    const [favoris, setFavoris] = useState<string[]>([]);
    // PubPage
    const [PubPage, setPubPage] = useState<PubPage>();
    // Function to handle the search if the text is modified
    const handleSearchWhenTextModified = (text: string) => {
        setSearchQuery(text);

        // Nettoyage du timeout précédent
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Création du nouveau timeout
        debounceTimeoutRef.current = setTimeout(() => {
            const searchParams: SearchType = {
                search: text,
                CeSoir: ceSoir ? "1" : "0",
                EnDirect: enDirect ? "1" : "0",
                EnCour: EnCour ? "1" : "0",
                ClubId: clubId,
                CompetitionId: competitionId,
                ChannelId: channelId,
                date: date,
                Favoris: JSON.stringify(favoris),
            };

            if (text !== "" || clubId !== "" || competitionId !== "" || channelId !== "" || date !== "" || ceSoir !== false || enDirect !== false || EnCour != false || favoris.length > 0) {
                setSearchParamNull(false);
                setIsLoading(true);
                GetResult(searchParams, {
                    OnFinish: (loading: boolean) => setIsLoading(loading),
                }).then((data) => {
                    if (data.res) setResults(data.res);
                    if (data.pub) setPubPage(data.pub);
                    else console.warn("Aucun résultat trouvé");
                });
            } else {
                setSearchParamNull(true);
            }
        }, 500);
    };
    // Function to handle the search if a filter is modified
    const handleSearchWhenFilterModified = (
        searchValue: string,
        newCeSoir: boolean,
        newEnDirect: boolean,
        newClubId: string,
        newCompetitionId: string,
        newChannelId: string,
        newDate: string,
        newEnCour: boolean,
        newFavoris: string[],
    ) => {
        const searchParams: SearchType = {
            search: searchValue,
            CeSoir: newCeSoir ? "1" : "0",
            EnDirect: newEnDirect ? "1" : "0",
            EnCour: newEnCour ? "1" : "0",
            ClubId: newClubId,
            CompetitionId: newCompetitionId,
            ChannelId: newChannelId,
            date: newDate,
            Favoris: JSON.stringify(newFavoris),
        };
        if (searchValue !== "" || newClubId !== "" || newCompetitionId !== "" || newChannelId !== "" || newDate !== "" || newCeSoir !== false || newEnDirect !== false || newEnCour != false || newFavoris.length > 0) {
            setSearchParamNull(false);
            GetResult(searchParams, {
                OnFinish: (loading: boolean) => setIsLoading(loading),
            }).then((data) => {
                if (data.res) setResults(data.res);
                if (data.pub) setPubPage(data.pub);
                else console.warn("Aucun résultat trouvé");
            });
        } else {
            setSearchParamNull(true);
        }
    };
    return (
        <View
            style={[
                styles.container,
                { backgroundColor: AppConfig.BackgroundColor(darkMode) },
            ]}
        >
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <SectionDivider label="Recherches" icon="search-outline"></SectionDivider>
                <View style={{ paddingHorizontal: 12 }}>
                    <Search
                        placeholder="Chercher un match, un club ..."
                        SearchFilter={(text: string) => handleSearchWhenTextModified(text)}
                        Value={searchQuery}
                    />
                </View>
                <SectionDivider label="Filtres" icon="filter-circle-outline"></SectionDivider>
                <FiltersPageSection
                    OnFilterChange={(SearchValue, CeSoir, EnDirect, ClubId, CompetitionId, ChannelId, date, EnCour, Favoris) => {
                        setFavoris(Favoris);
                        setSearchQuery(SearchValue);
                        setCeSoir(CeSoir);
                        setEnDirect(EnDirect);
                        setClubId(ClubId);
                        setCompetitionId(CompetitionId);
                        setChannelId(ChannelId);
                        setDate(date);
                        handleSearchWhenFilterModified(SearchValue, CeSoir, EnDirect, ClubId, CompetitionId, ChannelId, date, EnCour, Favoris);

                    }}
                    SearchValue={searchQuery}
                />
                <SectionDivider label={"Résultats" + " (" + (searchParamNull ? "0" : results.length) + ")"} icon="rocket-outline"></SectionDivider>
                {PubPage && PubPage.top.display !== 0 && (
                  <View style={{ marginBottom: 10 }}>
                      <BannerHeader
                        darkMode={darkMode}
                        unitId={PubPage.top.banner.id}
                    />
                  </View>
                )}
                <View style={{ marginHorizontal: 12 }}>
                    {isLoading && (
                        <Loading />
                    )}
                    {results.length > 0 && !searchParamNull ? (
                        <>
                            {results.map((item) =>
                                item.type === 'emission' ? (
                                    <ItemListCard key={item.id} {...item}
                                        direct={item.direct}
                                        categorie={item.categorie}
                                        chaine={item.chaine}
                                        logo={item.logo}
                                        image={item.image}
                                    />
                                ) : (
                                    <Banner
                                        key={"bannerHomeMatch-" + item.uniq}
                                        darkMode={darkMode}
                                        unitId={item.banner.id}
                                    />
                                )
                            )}
                        </>
                    ) : (
                        !isLoading && (searchParamNull || results.length === 0) && (
                            <NotFound />
                        )

                    )}
                </View>
            </ScrollView>
            <View style={styles.actionSection}>
                {PubPage && PubPage.footer.display !== 0 && (
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
    container: {
        flex: 1,
    },
    actionSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    scroll: {
        paddingBottom: 300,
    },
});

export default Filters;