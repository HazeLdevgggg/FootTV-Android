import React, { useContext, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";
import { AppConfig } from "../../../AppConfig";
import ScreenHeaderNoIcon from "../ScreenHeader/ScreenHeaderNoIcon";
import { Alert } from "react-native";
import Search from "../Search";
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Log from "../../../functions/Log";
type Category = {
    name: string;
    id: string;
    search: string;
    date: string;
    Competition: string;
    CompetitionID: string;
    Club: string;
    ClubID: string;
    Channel: string;
    ChannelID: string;
    CeSoir: string;
    EnCours: string;
    EnDirect: string;
};

function SaveFilters({
    type,
}: {
    type: Category;
}) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<Category | null>(null);
    const { darkMode, filters, setFilters, setEditID } = useContext(ThemeContext);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const insets = useSafeAreaInsets();

    const DateToStringUI = (date: string) => {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    };
    const isFilterEmpty = () => {
        return (
            type.name === "" &&
            type.search === "" &&
            type.date === "" &&
            type.Competition === "" &&
            type.CompetitionID === "" &&
            type.Club === "" &&
            type.ClubID === "" &&
            type.Channel === "" &&
            type.ChannelID === "" &&
            (type.CeSoir === "0" || type.CeSoir === "") &&
            (type.EnCours === "0" || type.EnCours === "") &&
            (type.EnDirect === "0" || type.EnDirect === "")
        );
    };


    return (
        <View
            style={[
                styles.horizontal,
                { backgroundColor: AppConfig.BackgroundColor(darkMode) },
            ]}
        >
            <TouchableOpacity onPress={() => setIsDropdownVisible(true)}>
                <View
                    style={
                        selectedFilter
                            ? styles.filtersboxPressed
                            : [
                                styles.filtersbox,
                                { backgroundColor: AppConfig.BackGroundButton(darkMode) },
                            ]
                    }
                >
                    <Ionicons
                        name={"add-circle-outline"}
                        size={20}
                        color={selectedFilter ? "white" : AppConfig.IconColor(darkMode)}
                    />
                    <Text
                        style={[{
                            color: AppConfig.IconColor(darkMode), marginLeft: 10,
                            fontSize: 12,
                            fontWeight: "900",
                        },

                        ]}
                    >
                        Enregistrer ce filtre
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Modal pour le menu dÃ©roulant */}
            <Modal
                visible={isDropdownVisible}
                presentationStyle={Platform.OS === 'ios' ? "pageSheet" : "formSheet"}
                animationType="slide"
                onRequestClose={() => setIsDropdownVisible(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 40, alignItems: "center" }}>
                        <View style={{ alignItems: "center", justifyContent: "flex-start", width: "100%", paddingTop: insets.top }}>
                            <ScreenHeaderNoIcon name="Enregistrer ce filtre" OnBackButtonPress={() => {
                                {
                                    setIsDropdownVisible(false);
                                    setSearchQuery("");
                                }
                            }} />
                        </View>
                        <View style={{ width: "100%", paddingHorizontal: 12 }}>
                            <Search
                                placeholder="Nom du filtre ..."
                                SearchFilter={(text) => setSearchQuery(text)}
                            />
                        </View>
                        <View
                            key={type.id}
                            style={[
                                styles.categoryCard,
                                {
                                    backgroundColor: AppConfig.BackGroundButton(darkMode),
                                    shadowColor: AppConfig.ShadowColor(darkMode),
                                    alignSelf: 'center',
                                    width: '90%',
                                    marginVertical: 20,
                                },
                            ]}
                        >
                            {/* Contenu des informations */}
                            <View style={styles.cardContent}>
                                <View style={styles.infoRow}>
                                    <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                                        {"Nom : " + searchQuery}
                                    </Text>
                                </View>
                                {type.search !== "" && (
                                    <View style={styles.infoRow}>
                                        <View style={[styles.iconContainer, { backgroundColor: "#eea1cd" + "20" }]}>
                                            <Ionicons name="search-outline" size={20} color="#eea1cd" />
                                        </View>
                                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                                            {type.search}
                                        </Text>
                                    </View>
                                )}
                                {type.date !== "" && (
                                    <View style={styles.infoRow}>
                                        <View style={[styles.iconContainer, { backgroundColor: "#FFD166" + "20" }]}>
                                            <Ionicons name="calendar-outline" size={20} color="#FFD166" />
                                        </View>
                                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                                            {DateToStringUI(type.date)}
                                        </Text>
                                    </View>
                                )}
                                {type.Competition !== "" && (
                                    <View style={styles.infoRow}>
                                        <View style={[styles.iconContainer, { backgroundColor: "#EF476F" + "20" }]}>
                                            <Ionicons name="trophy-outline" size={20} color="#EF476F" />
                                        </View>
                                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                                            {type.Competition}
                                        </Text>
                                    </View>
                                )}
                                {type.Club !== "" && (
                                    <View style={styles.infoRow}>
                                        <View style={[styles.iconContainer, { backgroundColor: "#06D6A0" + "20" }]}>
                                            <Ionicons name="football-outline" size={20} color="#06D6A0" />
                                        </View>
                                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                                            {type.Club}
                                        </Text>
                                    </View>
                                )}
                                {type.Channel !== "" && (
                                    <View style={styles.infoRow}>
                                        <View style={[styles.iconContainer, { backgroundColor: "#118AB2" + "20" }]}>
                                            <Ionicons name="tv-outline" size={20} color="#118AB2" />
                                        </View>
                                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                                            {type.Channel}
                                        </Text>
                                    </View>
                                )}
                                {type.EnCours === "1" && (
                                    <View style={styles.infoRow}>
                                        <View style={[styles.iconContainer, { backgroundColor: "#F78C6B" + "20" }]}>
                                            <Ionicons name="pulse-outline" size={20} color="#F78C6B" />
                                        </View>
                                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                                            {"En cours"}
                                        </Text>
                                    </View>
                                )}
                                {type.CeSoir === "1" && (
                                    <View style={styles.infoRow}>
                                        <View style={[styles.iconContainer, { backgroundColor: "#F4A261" + "20" }]}>
                                            <Ionicons name="moon-outline" size={20} color="#F4A261" />
                                        </View>
                                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                                            {"Ce soir"}
                                        </Text>
                                    </View>
                                )}
                                {type.EnDirect === "1" && (
                                    <View style={styles.infoRow}>
                                        <View style={[styles.iconContainer, { backgroundColor: "#D72631" + "20" }]}>
                                            <Ionicons name="radio-outline" size={20} color="#D72631" />
                                        </View>
                                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                                            {"En Direct"}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                    <View style={[styles.actionSection, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                if (searchQuery === "") {
                                    Alert.alert(
                                        "Erreur",
                                        "Veuillez entrer un nom pour le filtre",
                                        [
                                            {
                                                text: "OK",
                                                onPress: () => Log("OK Pressed"),
                                            },  
                                        ]
                                    );
                                } else if (isFilterEmpty()) {
                                    Alert.alert(
                                        "Erreur",
                                        "Veuillez sélectionner au moins un filtre",
                                        [
                                            {
                                                text: "OK",
                                                onPress: () => Log("OK Pressed"),
                                            },
                                        ]
                                    );
                                } else {
                                    type.name = searchQuery;
                                    type.id = searchQuery+"_"+Date.now();
                                    const newFilter = type;
                                    setFilters([...filters, newFilter]);
                                    setIsDropdownVisible(false);
                                    setEditID("");
                                    Toast.show({
                                        type: 'success',
                                        text1: 'Validé',
                                        text2: 'Le filtre a bien été enregistré',
                                        position: 'top',
                                        topOffset: 60,
                                        visibilityTime: 2000,
                                    });
                                }
                            }}
                        >
                            <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                            <Text style={styles.actionButtonText}>Sauvegarder</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    horizontal: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 4,
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
    categoryCard: {
        borderRadius: 20,
        elevation: 6,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        overflow: 'hidden',
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
    actionSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },

    actionButton: {
        backgroundColor: '#3f96ee',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },

    actionButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },

    cardContent: {
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 16,
        flex: 1,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    infoText: {
        marginBottom: 4,
        fontSize: 13,
        fontWeight: "700",
        flex: 1,
        lineHeight: 18,
    },
    modalContainer: {
        flex: 1,
    },

});

export default SaveFilters;