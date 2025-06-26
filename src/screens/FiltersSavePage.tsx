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
        if (editID === id) setEditID("");
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
        let updatedCategories = filters.map(cat => {
            if (cat.id !== categoryId) return cat;
            const updated = { ...cat, [field]: value };
            if (field === 'CompetitionID') updated.Competition = '';
            if (field === 'ClubID') updated.Club = '';
            if (field === 'ChannelID') updated.Channel = '';
            return updated;
        });

        const updatedCategory = updatedCategories.find(cat => cat.id === categoryId);
        if (updatedCategory && isFilterEmpty(updatedCategory)) {
            updatedCategories = updatedCategories.filter(cat => cat.id !== categoryId);
            setFilters(updatedCategories);
            if (editID === categoryId) setEditID("");
        } else {
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
            <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                        {"Nom : " + category.name}
                    </Text>
                </View>
                {renderField(category, "search", category.search, "search-outline", "#eea1cd")}
                {renderField(category, "date", category.date && DateToStringUI(category.date), "calendar-outline", "#FFD166")}
                {renderField(category, "CompetitionID", category.Competition, "trophy-outline", "#EF476F")}
                {renderField(category, "ClubID", category.Club, "football-outline", "#06D6A0")}
                {renderField(category, "ChannelID", category.Channel, "tv-outline", "#118AB2")}
                {renderField(category, "EnCours", category.EnCours === "1" && "En cours", "pulse-outline", "#F78C6B")}
                {renderField(category, "CeSoir", category.CeSoir === "1" && "Ce soir", "moon-outline", "#F4A261")}
                {renderField(category, "EnDirect", category.EnDirect === "1" && "En Direct", "radio-outline", "#D72631")}
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

    const renderField = (category: FiltersType, field: string, content: string | boolean, icon: any, color: string) => {
        if (!content) return null;
        return (
            <View style={styles.infoRow}>
                {editID === category.id && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleUpdateField(category.id, field, field.includes("ID") ? "" : "0")}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: "#FFFFFF20" }]}>
                            <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>
                )}
                <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
                    <Ionicons name={icon} size={14} color={color} />
                </View>
                <Text style={[styles.infoText, { color: AppConfig.MainTextColor(darkMode) }]} numberOfLines={1}>
                    {content}
                </Text>
            </View>
        );
    };

    const getFilteredPairs = () => {
        const filtered = [...filters].sort((a, b) =>
            levenshteinDistance(a.name.toLowerCase(), searchText.toLowerCase()) -
            levenshteinDistance(b.name.toLowerCase(), searchText.toLowerCase())
        )

        const pairs: FiltersType[][] = [];
        for (let i = 0; i < filtered.length; i += 2) {
            pairs.push(filtered.slice(i, i + 2));
        }
        return pairs;
    };

    const renderCategoryGrid = () => {
        const pairs = getFilteredPairs();

        if (pairs.length === 0) {
            return (
                <Empty title="Aucun filtre trouvé" subtitle="Ajoutez vos filtres pour ne plus rien rater" icon="search-outline" color="#4ECDC4" />
            );
        }

        return pairs.map((pair, pairIndex) => (
            <View key={`category-pair-${pairIndex}`} style={styles.categoryRow}>
                {pair.map((category, index) => renderCategoryCard(category, index))}
                {pair.length === 1 && <View style={styles.categoryCardPlaceholder} />}
            </View>
        ));
    };

    return (
        <View style={[styles.container, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
            <ScreenHeader color="#4ECDC4" name="Vos Filtres" icon="search-outline" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <SectionDivider icon="apps-outline" label="Liste des filtres" />
                    <View style={{ marginBottom: 16, marginHorizontal: 12 }}>
                        <Search placeholder="Cherchez dans vos filtres" SearchFilter={setSearchText} Value={searchText} />
                    </View>
                    <View style={styles.categoriesContainer}>
                        {renderCategoryGrid()}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingBottom: 50 },
    categoriesContainer: { paddingHorizontal: 16 },
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