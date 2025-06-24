import React, { useContext, useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Modal,
} from "react-native";
import ItemChannel from "../../../components/layout/ItemChannel";
import { levenshteinDistance } from "../../../functions/Levenshtein";
import { ThemeContext } from "../../../context/ThemeContext";
import { AppConfig } from "../../../AppConfig";
import { Banner } from "../../../hooks/Pub";
import { Ionicons } from "@expo/vector-icons";
import type { Competitions } from "../../../utils/CompetitionsType";
import type { Club } from "../../../utils/ClubType";
import { useTypedNavigation } from "../../../navigation/navigation";
import MyImage from "../../tags/MyImage";
import { Platform } from 'react-native';
import ScreenHeaderResetButton from "../ScreenHeader/ScreenHeaderResetButton";
import Loading from "../Loading"; ``
import ListItem from "./ListItem"
import Search from "../Search";
import CloseIcon from "./CloseIcon";
import { routes } from "../../../routes/routes";


type FiltersCompetitionAndClubProps = {
    ClubID: string,
    CompetitionID: string,
    onFilterChange: (ClubID: string, CompetitionID: string, ClubName: string, CompetitionName: string) => void;
};

function FiltersCompetitionAndClub({ onFilterChange, ClubID, CompetitionID }: FiltersCompetitionAndClubProps) {
    const navigation = useTypedNavigation();
    const [Competitions, setCompetitions] = useState<Competitions[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { darkMode } = useContext(ThemeContext);
    // Club and competition ID
    const [ClubIdTemp, setClubIdTemp] = useState<string>("");
    const [ClubName, setClubName] = useState<string>("");
    const [CompetitionName, setCompetitionName] = useState<string>("");
    // Other
    const [showModal, setShowModal] = useState<boolean>(false);

    const [showClubModal, setShowClubModal] = useState(false);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isClubLoading, setIsClubLoading] = useState(false);

    useEffect(() => {
        const getChannel = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${AppConfig.API_BASE_URL}${routes.Competitions}?apikey=${AppConfig.API_Key}`,
                );
                const data = await response.json();
                const sortedCompetitions = [...data].sort((a, b) => {
                    if (a.id === CompetitionID) return -1;
                    if (b.id === CompetitionID) return 1;
                    return 0;
                });
                setCompetitions(sortedCompetitions)
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        getChannel();
    }, [CompetitionID]);


    const handleCompetitionPress = async (id: string, name: string) => {
        setCompetitionName(name);
        onFilterChange("", id, "", name);
        setShowModal(false); // Close competition modal first
        setShowClubModal(true);
        setIsClubLoading(true);
        try {
            const response = await fetch(`${AppConfig.API_BASE_URL}${routes.Club}?apikey=${AppConfig.API_Key}&ligue=${id}`);
            const data = await response.json();
            const sortedClubs = [...data.clubs].sort((a, b) => {
                if (a.id === ClubID) return -1;
                if (b.id === ClubID) return 1;
                return 0;
            });
            if (data.clubs) setClubs(sortedClubs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsClubLoading(false);
        }
    };

    const handleClubPress = (id: string, name: string) => {
        setClubIdTemp(id);
        onFilterChange(id, CompetitionID, name, CompetitionName);
        setShowClubModal(false);
        setShowModal(false);
    };

    const handleClubReset = () => {
        onFilterChange("", CompetitionID, "", CompetitionName);
        setShowClubModal(false);
        setShowModal(false);
    };

    const handleReset = () => {
        onFilterChange("", "", "", "");
        setShowModal(false);
    };

    const SearchFilter = (text: string) => {
        setSearchQuery(text);
        const sorted = [...Competitions].sort(
            (a, b) =>
                levenshteinDistance(a.nom.toLowerCase(), text.toLowerCase()) -
                levenshteinDistance(b.nom.toLowerCase(), text.toLowerCase()),
        );
        setCompetitions(sorted);
    };

    const SearchFilterClub = (text: string) => {
        setSearchQuery(text);
        const sorted = [...clubs].sort(
            (a, b) =>
                levenshteinDistance(a.nom.toLowerCase(), text.toLowerCase()) -
                levenshteinDistance(b.nom.toLowerCase(), text.toLowerCase()),
        );
        setClubs(sorted);
    };

    return (
        <>
            <View
                style={[
                    styles.horizontal,
                    styles.horizontal, { marginHorizontal: ClubID !== "" || CompetitionID !== "" ? 8 : 4 }
                ]}
            >
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <View
                        style={
                            ClubID !== "" || CompetitionID !== ""
                                ? [styles.filtersboxPressed, styles.filterContainer]
                                : [
                                    styles.filtersbox,
                                    { backgroundColor: AppConfig.BackGroundButton(darkMode) },
                                    styles.filterContainer,
                                ]
                        }
                    >
                        <Ionicons
                            name={"trophy-outline"}
                            size={20}
                            color={ClubID !== "" || CompetitionID !== "" ? "white" : AppConfig.IconColor(darkMode)}
                        />
                        <Text
                            style={
                                ClubID !== "" || CompetitionID !== ""
                                    ? styles.heureText2
                                    : [styles.heureText, { color: AppConfig.IconColor(darkMode) }]
                            }
                        >
                            Compétitions & Clubs
                        </Text>
                        {CompetitionID !== "" && (
                            <CloseIcon handleOnPress={() => handleReset()} />
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle={Platform.OS === 'ios' ? "pageSheet" : "formSheet"}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
                    <ScreenHeaderResetButton name="Sélectionner une compétition" OnBackButtonPress={() => setShowModal(false)} OnResetButtonPress={handleReset} />
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <ScrollView
                            contentContainerStyle={[
                                styles.scrollContent,
                                { backgroundColor: AppConfig.BackgroundColor(darkMode) }
                            ]}
                            showsVerticalScrollIndicator={false}
                        >
                            <Search
                                placeholder="Chercher une compétition..."
                                SearchFilter={(text: string) => SearchFilter(text)}
                            />
                            {Competitions.map((item, index) => (
                                <React.Fragment key={"channel-fragment-" + item.id}>
                                    <ListItem
                                        key={"competition-" + item.id}
                                        name={item.nom}
                                        logo={item.logo}
                                        country={item.pays}
                                        color={item.id === CompetitionID ? "green" : null}
                                        onPress={() => { handleCompetitionPress(item.id, item.nom), setSearchQuery("") }}
                                    />
                                </React.Fragment>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </Modal>

            <Modal
                visible={showClubModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowClubModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
                    <ScreenHeaderResetButton name="Sélectionner un club" OnBackButtonPress={() => setShowClubModal(false)} OnResetButtonPress={handleClubReset} />
                    {isClubLoading ? (
                        <Loading />
                    ) : (
                        <ScrollView
                            contentContainerStyle={[
                                styles.scrollContent,
                                { backgroundColor: AppConfig.BackgroundColor(darkMode) }
                            ]}
                            showsVerticalScrollIndicator={false}
                        >
                            <Search
                                placeholder="Chercher un club..."
                                SearchFilter={(text: string) => SearchFilterClub(text)}
                            />
                            <ListItem
                                logo={require("../../../assets/Icon/all.png")}
                                name="Voir toute la compétition"
                                color={ClubIdTemp === "" ? "green" : null}
                                onPress={() => {
                                    onFilterChange("", CompetitionID, "", CompetitionName);
                                    setShowClubModal(false);
                                    setShowModal(false);
                                }}
                            />
                            {clubs.map((item, index) => (
                                <React.Fragment key={"club-fragment-" + item.id}>
                                    <ListItem
                                        key={"club-" + item.id}
                                        name={item.nom}
                                        logo={item.logo}
                                        color={item.id === ClubIdTemp ? "green" : null}
                                        onPress={() => handleClubPress(item.id, item.nom)}
                                    />
                                </React.Fragment>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    horizontal: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
      },
      filtersbox: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 6,
        paddingVertical: 3,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      filtersboxPressed: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: "#3f96ee",
        borderRadius: 8,
        marginBottom: 6,
        paddingVertical: 3,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      filterContainer: {
        position: "relative",
      },
    heureText: {
        marginLeft: 10,
        fontSize: 12,
        fontWeight: "900",
    },
    heureText2: {
        color: "white",
        marginLeft: 10,
        fontSize: 12,
        fontWeight: "900",
    },
    // Styles pour la modal
    modalContainer: {
        paddingTop: Platform.OS === "ios" ? 20 : 10,
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 100,
    },
});

export default FiltersCompetitionAndClub;