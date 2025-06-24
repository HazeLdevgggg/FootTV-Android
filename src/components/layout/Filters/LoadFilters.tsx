import React, { useContext, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";
import { AppConfig } from "../../../AppConfig";
import ScreenHeaderResetButton from "../ScreenHeader/ScreenHeaderResetButton";
import ItemChannel from "../ItemChannel";
import Empty from "../Empty";
import DateToStringUI from "../../../functions/DateToUI";
import Search from "../Search";
import { levenshteinDistance } from "../../../functions/Levenshtein";
import FiltersType from "../../../utils/FIltersType";
import SectionDivider from "../../home/SectionDivider";

function LoadFilters({
    onFilterChange,
    icon,
}: {
    onFilterChange: (category: FiltersType, isApplied: boolean) => void;
    icon: string;
}) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<FiltersType | null>(null);
    const { darkMode, filters, setFilters } = useContext(ThemeContext);


    const [localFilters, setLocalFilters] = useState<FiltersType[]>(filters);
    const handleFilterSelect = (category: FiltersType) => {
        setSelectedFilter(category);
        setIsDropdownVisible(false);
        onFilterChange(category, true);
    };

    const handleClearFilter = () => {
        onFilterChange(selectedFilter, false);
        setSelectedFilter(null);
        setIsDropdownVisible(false);
    };

    const renderCategoryCard = (category: FiltersType, index: number) => (
        <TouchableOpacity
            key={category.id}
            style={[
                styles.categoryCard,
                {
                    backgroundColor: AppConfig.BackGroundButton(darkMode),
                    shadowColor: AppConfig.ShadowColor(darkMode),
                    marginRight: index % 2 === 0 ? 8 : 0,
                    marginLeft: index % 2 === 1 ? 8 : 0,
                },
            ]}
            onPress={() => handleFilterSelect(category)}
        >

            {/* Contenu des informations */}

            <View style={styles.cardContent}>

                <View style={styles.infoRow}>
                    <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                        {"Nom : " + category.name}
                    </Text>
                </View>
                {category.search !== "" && (
                    <View style={styles.infoRow}>
                        <View style={[styles.iconContainer, { backgroundColor: "#eea1cd" + "20" }]}>
                            <Ionicons name="search-outline" size={14} color="#eea1cd" />
                        </View>
                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                            {category.search}
                        </Text>
                    </View>
                )}
                {category.date !== "" && (
                    <View style={styles.infoRow}>
                        <View style={[styles.iconContainer, { backgroundColor: "#FFD166" + "20" }]}>
                            <Ionicons name="calendar-outline" size={14} color="#FFD166" />
                        </View>
                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                            {DateToStringUI(category.date)}
                        </Text>
                    </View>
                )}
                {category.Competition !== "" && (
                    <View style={styles.infoRow}>
                        <View style={[styles.iconContainer, { backgroundColor: "#EF476F" + "20" }]}>
                            <Ionicons name="trophy-outline" size={14} color="#EF476F" />
                        </View>
                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                            {category.Competition}
                        </Text>
                    </View>
                )}
                {category.Club !== "" && (
                    <View style={styles.infoRow}>
                        <View style={[styles.iconContainer, { backgroundColor: "#06D6A0" + "20" }]}>
                            <Ionicons name="football-outline" size={14} color="#06D6A0" />
                        </View>
                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                            {category.Club}
                        </Text>
                    </View>
                )}
                {category.Channel !== "" && (
                    <View style={styles.infoRow}>
                        <View style={[styles.iconContainer, { backgroundColor: "#118AB2" + "20" }]}>
                            <Ionicons name="tv-outline" size={14} color="#118AB2" />
                        </View>
                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                            {category.Channel}
                        </Text>
                    </View>
                )}
                {category.EnCours === "1" && (
                    <View style={styles.infoRow}>
                        <View style={[styles.iconContainer, { backgroundColor: "#F78C6B" + "20" }]}>
                            <Ionicons name="pulse-outline" size={14} color="#F78C6B" />
                        </View>
                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                            {"En cours"}
                        </Text>
                    </View>
                )}
                {category.CeSoir === "1" && (
                    <View style={styles.infoRow}>
                        <View style={[styles.iconContainer, { backgroundColor: "#F4A261" + "20" }]}>
                            <Ionicons name="moon-outline" size={14} color="#F4A261" />
                        </View>
                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                            {"Ce soir"}
                        </Text>
                    </View>
                )}
                {category.EnDirect === "1" && (
                    <View style={styles.infoRow}>
                        <View style={[styles.iconContainer, { backgroundColor: "#D72631" + "20" }]}>
                            <Ionicons name="radio-outline" size={14} color="#D72631" />
                        </View>
                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                            {"En Direct"}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderCategoryGrid = () => {
        const pairs: FiltersType[][] = [];
        for (let i = 0; i < filters.length; i += 2) {
            pairs.push(filters.slice(i, i + 2));
        }

        if (filters.length > 0) {
            return pairs.map((pair, pairIndex) => (
                <View key={`category-pair-${pairIndex}`} style={styles.categoryRow}>
                    {pair.map((category, index) => renderCategoryCard(category, index))}
                    {pair.length === 1 && <View style={styles.categoryCardPlaceholder} />}
                </View>
            ));
        } else {
            return (
                <Empty title="Aucun filtre trouvé" subtitle="Ajoutez vos filtres pour ne plus rien rater" icon="search-outline" color="#4ECDC4" />
            );
        }
    };

    return (
        <View
            style={[
                styles.categoryRow,
                { backgroundColor: AppConfig.BackgroundColor(darkMode) },
            ]}
        >
            <TouchableOpacity onPress={() => setIsDropdownVisible(true)}>
                <View
                    style={
                        [
                            styles.filtersbox,
                            { backgroundColor: AppConfig.BackGroundButton(darkMode) },
                        ]
                    }
                >
                    <Ionicons
                        name={icon as any}
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
                        Charger un filtre
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Modal pour le menu déroulant */}
            <Modal
                visible={isDropdownVisible}
                presentationStyle={Platform.OS === 'ios' ? "pageSheet" : "formSheet"}
                animationType="slide"
                onRequestClose={() => setIsDropdownVisible(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: AppConfig.BackgroundColor(darkMode), justifyContent: "flex-start", alignItems: "center" }]}>
                    <View style={{ alignItems: "center", justifyContent: "flex-start", width: "100%", paddingTop: 20 }}>
                        <ScreenHeaderResetButton name="Sélectionner une filtre" OnBackButtonPress={() => setIsDropdownVisible(false)} OnResetButtonPress={handleClearFilter} />
                    </View>
                    <ScrollView
                        style={[
                            { backgroundColor: AppConfig.BackgroundColor(darkMode), width: "100%" }
                        ]}
                        contentContainerStyle={{ width: "100%" }}
                    >
                        {localFilters.length > 0 ? (
                            <>
                                <SectionDivider icon="apps-outline" label="Liste des filtres" />
                                <View style={[styles.categoriesContainer, { marginTop: 20 }]}>{renderCategoryGrid()}</View>
                            </>
                        ) : (
                            <Empty title="Aucun filtre" subtitle="Ajoutez des filtres pour les voir ici. Pour en créer, rendez-vous sur la page Recherche, sélectionnez vos filtres, puis appuyez sur Sauvegarder ce filtre" icon="search-outline" color="#4ECDC4" />
                        )}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    categoryRow: { flexDirection: "row", marginBottom: 16, justifyContent: "space-between" },
 
    categoriesContainer: { paddingHorizontal: 16, marginBottom: 0 },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    infoText: {
        fontSize: 13,
        fontWeight: "700",
        lineHeight: 18,
        marginBottom: 4,
        marginRight: 8,
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
    modalContainer: {
        flex: 1,
    },
    categoryCard: {
        flex: 1,
        borderRadius: 20,
        elevation: 6,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        minHeight: 180,
        overflow: 'hidden',
    },
    categoryCardPlaceholder: { flex: 1, marginLeft: 8 },

    // Contenu de la carte
    cardContent: {
        marginTop: 20,
        paddingHorizontal: 16,
        flex: 1,
    },
});

export default LoadFilters;