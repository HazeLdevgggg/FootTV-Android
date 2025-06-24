import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTypedNavigation } from "../navigation/navigation";
import SectionDivider from "../components/home/SectionDivider";
import ScreenHeader from "../components/layout/ScreenHeader/ScreenHeader";
import Empty from "../components/layout/Empty";
import Search from "../components/layout/Search";
import FiltersType from "../utils/FIltersType";
import { levenshteinDistance } from "../functions/Levenshtein";

function FiltersSavePage() {
    const navigation = useTypedNavigation();
    const { darkMode, filters, setFilters, setEditID, editID } = useContext(ThemeContext);
    const [searchText, setSearchText] = useState('');

    // Initialiser seulement au premier rendu
    useEffect(() => {
        if (filters.length === 0) {
            setFilters(filters);
        }
    }, [filters]);

    const DateToStringUI = (date: string) => {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    };

    const handleDeleteCategory = (id: string) => {
        const updatedList = filters.filter(cat => cat.id !== id);
        setFilters(updatedList);
        // Sortir du mode édition si on supprime la carte en cours d'édition
        if (editID === id) {
            setEditID("");
        }
    };

    const isFilterEmpty = (type: FiltersType) => {
        return (
            type.search === "" &&
            type.date === "" &&
            type.CompetitionID === "" &&
            type.ClubID === "" &&
            type.ChannelID === "" &&
            (type.CeSoir === "0" || type.CeSoir === "") &&
            (type.EnCours === "0" || type.EnCours === "") &&
            (type.EnDirect === "0" || type.EnDirect === "")
        );
    };

    const handleUpdateField = (categoryId: string, field: string, value: string) => {
        console.log("categoryId", categoryId);
        let updatedCategories = filters.map(cat => {
            if (cat.id !== categoryId) return cat;

            const updated = { ...cat, [field]: value };

            // Si on vide un ID, on vide aussi le nom lisible correspondant
            if (field === 'CompetitionID') updated.Competition = '';
            if (field === 'ClubID') updated.Club = '';
            if (field === 'ChannelID') updated.Channel = '';

            return updated;
        });

        const updatedCategory = updatedCategories.find(cat => cat.id === categoryId);
        console.log("Handle");
        console.log(updatedCategory);
        if (updatedCategory && isFilterEmpty(updatedCategory)) {
            console.log("On va le supprimer");
            updatedCategories = updatedCategories.filter(cat => cat.id !== categoryId);
            setFilters(updatedCategories);
            if (editID === categoryId) {
                console.log("On va le supprimer2");
                setEditID("");
            }
        } else {
            console.log("On va le mettre à jour");
            setFilters(updatedCategories);
            setEditID(categoryId);
        }
    };

    const renderCategoryCard = (category: FiltersType, index: number) => (
        <View
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
                        {editID === category.id && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleUpdateField(category.id, 'search', '')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: "#FFFFFF" + "20" }]}>
                                    <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        )}
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
                        {editID === category.id && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleUpdateField(category.id, 'date', '')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: "#FFFFFF" + "20" }]}>
                                    <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        )}
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
                        {editID === category.id && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleUpdateField(category.id, 'CompetitionID', '')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: "#FFFFFF" + "20" }]}>
                                    <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        )}
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
                        {editID === category.id && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleUpdateField(category.id, 'ClubID', '')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: "#FFFFFF" + "20" }]}>
                                    <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        )}
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
                        {editID === category.id && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleUpdateField(category.id, 'ChannelID', '')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: "#FFFFFF" + "20" }]}>
                                    <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        )}
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
                        {editID === category.id && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleUpdateField(category.id, 'EnCours', '0')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: "#FFFFFF" + "20" }]}>
                                    <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        )}
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
                        {editID === category.id && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleUpdateField(category.id, 'CeSoir', '0')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: "#FFFFFF" + "20" }]}>
                                    <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        )}
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
                        {editID === category.id && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleUpdateField(category.id, 'EnDirect', '0')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: "#FFFFFF" + "20" }]}>
                                    <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        )}
                        <View style={[styles.iconContainer, { backgroundColor: "#D72631" + "20" }]}>
                            <Ionicons name="radio-outline" size={14} color="#D72631" />
                        </View>
                        <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                            {"En Direct"}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.deleteRow}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCategory(category.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <View style={[styles.iconContainer, { backgroundColor: "#E53935" + "20" }]}>
                        <Ionicons name="trash-outline" size={20} color="#E53935" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => editID === category.id ? setEditID("") : setEditID(category.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <View style={[styles.iconContainer, { backgroundColor: editID === category.id ? "#4ECDC4" + "20" : "#FFFFFF" + "20" }]}>
                        <Ionicons name={editID === category.id ? "checkmark-outline" : "create-outline"} size={20} color={editID === category.id ? "#4ECDC4" : "#FFFFFF"} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCategoryGrid = () => {
        const pairs: FiltersType[][] = [];
        for (let i = 0; i < filters.length; i += 2) {
            pairs.push(filters.slice(i, i + 2));
        }

        if (filters.length > 0) {
            return pairs.map((pair, pairIndex) => (
                <View key={`category-pair-${pairIndex}`}>
                    <View style={{ marginBottom: 10 }}>
                        <Search placeholder="Cherchez dans vos filtres" SearchFilter={(text) => setSearchText(text)} Value={searchText} />
                    </View>
                    <View key={`category-pair-${pairIndex}`} style={styles.categoryRow}>
                        {pair.map((category, index) => renderCategoryCard(category, index))}
                        {pair.length === 1 && <View style={styles.categoryCardPlaceholder} />}
                    </View>
                </View>
            ));
        } else {
            return (
                <Empty title="Aucun filtre trouvé" subtitle="Ajoutez vos filtres pour ne plus rien rater" icon="search-outline" color="#4ECDC4" />
            );
        }
    };

    const renderSearchGrid = () => {
        const filtered = [...filters].sort(
            (a, b) =>
                levenshteinDistance(a.name.toLowerCase(), searchText.toLowerCase()) -
                levenshteinDistance(b.name.toLowerCase(), searchText.toLowerCase())
        );
        const pairs: FiltersType[][] = [];
        for (let i = 0; i < filtered.length; i += 2) {
            pairs.push(filtered.slice(i, i + 2));
        }
        if (filtered.length > 0) {
            return pairs.map((pair, pairIndex) => (
                <View key={`category-pair-${pairIndex}`}>
                    <View style={{ marginBottom: 10 }}>
                        <Search placeholder="Cherchez dans vos filtres" SearchFilter={(text) => setSearchText(text)} Value={searchText} />
                    </View>
                    <View key={`category-pair-${pairIndex}`} style={styles.categoryRow}>
                        {pair.map((category, index) => renderCategoryCard(category, index))}
                        {pair.length === 1 && <View style={styles.categoryCardPlaceholder} />}
                    </View>
                </View>
            ));
        } else {
            return (
                <Empty title="Aucun filtre trouvé" subtitle="Ajoutez vos filtres pour ne plus rien rater" icon="search-outline" color="#4ECDC4" />
            );
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
            <ScreenHeader color="#4ECDC4" name="Vos Filtres" icon="search-outline" />

            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.content}>
                    <SectionDivider icon="apps-outline" label="Liste des filtres" />
                    <View style={[styles.categoriesContainer]}>{searchText.length > 0 ? renderSearchGrid() : renderCategoryGrid()}</View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingBottom: 50 },
    categoriesContainer: { paddingHorizontal: 16, marginBottom: 0 },
    categoryRow: { flexDirection: "row", marginBottom: 16, justifyContent: "space-between" },
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
    deleteButton: {
        padding: 2,
        width: 30,
        height: 30,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Contenu de la carte
    cardContent: {
        marginTop: 20,
        paddingHorizontal: 16,
        flex: 1,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    deleteRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
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
        marginBottom: 4,
        fontSize: 13,
        fontWeight: "700",
        flex: 1,
        lineHeight: 18,
    },

});

export default FiltersSavePage;