import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTypedNavigation } from "../../navigation/navigation";
import SectionDivider from "../../components/home/SectionDivider";
import MyImage from "../../components/tags/MyImage";
import FiltersCompetitionAndClubNoButton from "../../components/layout/Filters/FiltersCompetitionAndClubNoButton";
import { Alert } from "react-native";
import ScreenHeader from "../../components/layout/ScreenHeader/ScreenHeader";
import Empty from "../../components/layout/Empty";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Log from "../../functions/Log"


type FavorisProps = {
    id: string,
    logo: string,
    clubId: string,
    clubName: string,
}

function FavorisOnBoarding() {
    const { darkMode, setDarkMode, setFavoris, favoris, setOnBoarding } = useContext(ThemeContext);

    // HANDLE SUPPRESSION
    const handleDeleteCategory = (id: string) => {
        setFavoris(favoris.filter(cat => cat.id !== id));
    }

    const renderCategoryCard = (category, index) => (
        <View
            key={category.id}
            style={[
                styles.categoryCard,
                {
                    backgroundColor: AppConfig.BackGroundButton(darkMode),
                    shadowColor: AppConfig.ShadowColor(darkMode),
                    marginRight: index % 2 === 0 ? 8 : 0,
                    marginLeft: index % 2 === 1 ? 8 : 0,
                }
            ]}
        >
            <MyImage source={category.logo} style={[styles.logoBorder, {
                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', marginBottom: 12
            }]} contentFit="contain" />
            <Text
                style={[
                    styles.categoryTitle,
                    { color: AppConfig.MainTextColor(darkMode), marginBottom: 14 }
                ]}
                numberOfLines={2}
            >
                {category.clubName}
            </Text>
            <TouchableOpacity style={[styles.arrow, { backgroundColor: "#e74c3c" + "15" }]} onPress={() => handleDeleteCategory(category.id)}>
                <Ionicons
                    name={"trash-outline"}
                    size={16}
                    color={"#e74c3c"}
                />
            </TouchableOpacity>
        </View>
    );

    const renderCategoryGrid = () => {
        const pairs = [];
        for (let i = 0; i < favoris.length; i += 2) {
            pairs.push(favoris.slice(i, i + 2));
        }
        if (favoris.length > 0) {
            return pairs.map((pair, pairIndex) => (
                <View key={`category-pair-${pairIndex}`} style={styles.categoryRow}>
                    {pair.map((category, index) => renderCategoryCard(category, index))}
                    {pair.length === 1 && <View style={styles.categoryCardPlaceholder} />}
                </View>
            ));
        } else {
            return (
                <Empty title="Aucun Favoris trouvé" subtitle="Ajoutez vos favoris pour ne plus rien rater" icon="star-outline" color="#e9d700" />
            );
        }
    };
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: AppConfig.BackgroundColor(darkMode) }}>
            <View style={[styles.container, { backgroundColor: AppConfig.BackgroundColor(darkMode), marginBottom: insets.top }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <SectionDivider icon="apps-outline" label="Liste des favoris" />
                        <View style={styles.categoriesContainer}>
                            {renderCategoryGrid()}
                        </View>
                        <SectionDivider icon="add-outline" label="Ajouter des favoris" />
                        <FiltersCompetitionAndClubNoButton onFilterChange={(ClubId: string, Clublogo: string, CLubName: string) => {
                            if (favoris.find(cat => cat.id === ClubId)) {
                                Alert.alert("Déjà dans les favoris");
                                return;
                            }
                            const newCategory = {
                                id: ClubId,
                                logo: Clublogo,
                                clubId: ClubId,
                                clubName: CLubName,
                            };
                            const updated = [...favoris, newCategory];
                            setFavoris(updated);
                            Log("Favoris added:"+ newCategory);
                        }} />
                    </View>
                </ScrollView>
                <View style={[styles.actionSection, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setOnBoarding(0)}
                    >
                        <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                        <Text style={styles.actionButtonText}>Valider</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingBottom: 50,
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
    logoBorder: {
        width: 70,
        height: 70,
        borderRadius: 14,
        borderWidth: 1.5,
        padding: 3,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        marginBottom: 0,
    },
    categoryRow: {
        flexDirection: "row",
        marginBottom: 16,
        justifyContent: "space-between",
    },
    categoryCard: {
        flex: 1,
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        minHeight: 140,
        justifyContent: "space-between",
    },
    categoryCardPlaceholder: {
        flex: 1,
        marginLeft: 8,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    arrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default FavorisOnBoarding;