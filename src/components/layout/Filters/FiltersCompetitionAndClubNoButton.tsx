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
import ItemChannel from "../ItemChannel";
import { levenshteinDistance } from "../../../functions/Levenshtein";
import { ThemeContext } from "../../../context/ThemeContext";
import { AppConfig } from "../../../AppConfig";
import { Banner } from "../../../hooks/Pub"
import { Ionicons } from "@expo/vector-icons";
import type { Competitions } from "../../../utils/CompetitionsType";
import type { Club } from "../../../utils/ClubType";
import { useTypedNavigation } from "../../../navigation/navigation";
import MyImage from "../../tags/MyImage";
import { Platform } from 'react-native';
import ScreenHeaderNoIcon from "../ScreenHeader/ScreenHeaderNoIcon";
import Loading from "../Loading";
import ListItem from "./ListItem";
import Search from "../Search";
import { routes } from "../../../routes/routes";

type FiltersCompetitionAndClubProps = {
    onFilterChange: (ClubID: string, ClubLogo: string, CLubName: string) => void;
};

function FiltersCompetitionAndClubNoButton({ onFilterChange }: FiltersCompetitionAndClubProps) {
    const navigation = useTypedNavigation();
    const [Competitions, setCompetitions] = useState<Competitions[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { darkMode } = useContext(ThemeContext);
    // Club and competition ID
    const [ClubID, setClubID] = useState<string>("");
    const [ClubLogo, setClublogo] = useState<string>("");
    // Other
    const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    const [showClubModal, setShowClubModal] = useState(false);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isClubLoading, setIsClubLoading] = useState(false);
    const [selectedCompetitionId, setSelectedCompetitionId] = useState("");

    useEffect(() => {
        const getChannel = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${AppConfig.API_BASE_URL}${routes.Competitions}?apikey=${AppConfig.API_Key}`,
                );
                const data = await response.json();
                setCompetitions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        getChannel();
    }, []);


    const handleCompetitionPress = async (id: string) => {
        setSearchQuery("");
        setSelectedCompetitionId(id);
        setShowModal(false); // Close competition modal first
        setShowClubModal(true); 
        setIsClubLoading(true);
        try {
            const response = await fetch(`${AppConfig.API_BASE_URL}${routes.Club}?ligue=${id}&apikey=${AppConfig.API_Key}`);
            const data = await response.json();
            if (data.clubs) setClubs(data.clubs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsClubLoading(false);
        }
    };

    const handleClubPress = (id: string, logo: string, name: string) => {
        setSearchQuery("");
        setClubID(id);
        onFilterChange(id, logo, name);
        setShowClubModal(false);
        setShowModal(false);
        setIsFilterApplied(true);
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
                    { backgroundColor: AppConfig.BackgroundColor(darkMode) },
                ]}
            >
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <TouchableOpacity
                        onPress={() => setShowModal(true)}
                        style={[styles.featureCard, { backgroundColor: AppConfig.BackGroundButton(darkMode), flex: 1 }]}
                    >
                        <View style={styles.featureHeader}>
                            <Ionicons name="add-circle-outline" size={24} color="#e68bbe" />
                            <Text style={[styles.featureTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                                Ajouter un club favori
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle={Platform.OS === 'ios' ? "pageSheet" : "formSheet"}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
                    <ScreenHeaderNoIcon name="Sélectionner une compétition" OnBackButtonPress={() => setShowModal(false)} />
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
                            <Search placeholder="Chercher une compétition ..." SearchFilter={SearchFilter} />
                            {Competitions.map((item, index) => (
                                <React.Fragment key={"channel-fragment-" + item.id}>
                                    <ListItem
                                        logo={item.logo}
                                        name={item.nom}
                                        country={item.pays}
                                        onPress={() => handleCompetitionPress(item.id)}
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
                    <ScreenHeaderNoIcon name="Sélectionner un club" OnBackButtonPress={() => setShowClubModal(false)} />
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
                            <Search placeholder="Chercher un club ..." SearchFilter={SearchFilterClub} />
                            {clubs.map((item, index) => (
                                <React.Fragment key={"club-fragment-" + item.id}>
                                    <ListItem
                                        logo={item.logo}
                                        name={item.nom}
                                        onPress={() => handleClubPress(item.id, item.logo, item.nom)}
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
        paddingHorizontal: 4,
        marginVertical: 5,
    },
    featureCard: {
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    featureHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 12,
    },
    // Styles pour la modal
    modalContainer: {
        paddingTop: Platform.OS === "ios" ? 20 : 10,
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingBottom: 20,
    },
});

export default FiltersCompetitionAndClubNoButton;