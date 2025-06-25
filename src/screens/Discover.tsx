import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";
import SectionDivider from "../components/home/SectionDivider";
import { Ionicons } from "@expo/vector-icons";
import { AppConfig } from "../AppConfig";
import { showConsentNotice } from "../hooks/Didomi";
import { useTypedNavigation } from "../navigation/navigation";

const { width: screenWidth } = Dimensions.get('window');

function Discover() {
    const navigation = useTypedNavigation();
    const [isEnabledMatch, setIsEnabledMatch] = useState(false);
    const [isEnabledArticle, setIsEnabledArticle] = useState(false);
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const toggleSwitchMatch = () => setIsEnabledMatch((previousState) => !previousState);
    const toggleSwitchArticle = () => setIsEnabledArticle((previousState) => !previousState);
    const toggleSwitchSombre = () => {
        setDarkMode(!darkMode);
    };

    const categories = [
        {
            id: "competitions",
            title: "Compétitions & Clubs",
            icon: "trophy-outline",
            color: "#3f96ee",
            bgGradient: ["#3f96ee", "#5ba3f5"],
            onPress: () => navigation.push("Competitions"),
        },
        {
            id: "channels",
            title: "Nos Chaînes",
            icon: "tv-outline",
            color: "#28a745",
            bgGradient: ["#28a745", "#34ce57"],
            onPress: () => navigation.push("Channel"),
        }
    ];

    const renderCategoryCard = (category, index) => (
        <TouchableOpacity
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
            onPress={category.onPress}
            activeOpacity={0.8}
        >
            <View style={[styles.iconContainer, { backgroundColor: category.color + "20" }]}>
                <Ionicons
                    name={category.icon}
                    size={32}
                    color={category.color}
                />
            </View>
            <Text
                style={[
                    styles.categoryTitle,
                    { color: AppConfig.MainTextColor(darkMode) }
                ]}
                numberOfLines={2}
            >
                {category.title}
            </Text>
            <View style={[styles.arrow, { backgroundColor: category.color + "15" }]}>
                <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={category.color}
                />
            </View>
        </TouchableOpacity>
    );

    const renderCategoryGrid = () => {
        const pairs = [];
        for (let i = 0; i < categories.length; i += 2) {
            pairs.push(categories.slice(i, i + 2));
        }

        return pairs.map((pair, pairIndex) => (
            <View key={`category-pair-${pairIndex}`} style={styles.categoryRow}>
                {pair.map((category, index) => renderCategoryCard(category, index))}
                {pair.length === 1 && <View style={styles.categoryCardPlaceholder} />}
            </View>
        ));
    };

    return (
        <ScrollView>
            <View
                style={[
                    styles.vertical,
                    { backgroundColor: AppConfig.BackgroundColor(darkMode) },
                ]}
            >
                <SectionDivider icon="stats-chart-outline" label="Stats" />
                <View
                    style={[
                        styles.statsContainer,
                        {
                            backgroundColor: AppConfig.BackGroundButton(darkMode),
                        },
                    ]}
                >
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="trophy" size={24} color="#FFD700" />
                        </View>
                        <Text
                            style={[
                                styles.statNumber,
                                { color: AppConfig.MainTextColor(darkMode) },
                            ]}
                        >
                            {AppConfig.Competition_Number}
                        </Text>
                        <Text
                            style={[
                                styles.statLabel,
                                { color: AppConfig.SecondaryTextColor(darkMode) },
                            ]}
                        >
                            Ligues
                        </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="tv" size={24} color="#3f96ee" />
                        </View>
                        <Text
                            style={[
                                styles.statNumber,
                                { color: AppConfig.MainTextColor(darkMode) },
                            ]}
                        >
                            {AppConfig.Channel_Number}
                        </Text>
                        <Text
                            style={[
                                styles.statLabel,
                                { color: AppConfig.SecondaryTextColor(darkMode) },
                            ]}
                        >
                            Chaînes
                        </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="people" size={24} color="#28a745" />
                        </View>
                        <Text
                            style={[
                                styles.statNumber,
                                { color: AppConfig.MainTextColor(darkMode) },
                            ]}
                        >
                            {AppConfig.Club_Number}
                        </Text>
                        <Text
                            style={[
                                styles.statLabel,
                                { color: AppConfig.SecondaryTextColor(darkMode) },
                            ]}
                        >
                            Clubs
                        </Text>
                    </View>
                </View>

                <SectionDivider icon="apps-outline" label="Catégories" />
                <View style={styles.categoriesContainer}>
                    {renderCategoryGrid()}
                </View>

                {/* Section bonus avec style moderne */}
                <SectionDivider icon="folder-outline" label="Mon espace & réglages" />
                <View style={styles.featuresContainer}>
                    <View style={[styles.featureCard, { backgroundColor: AppConfig.BackGroundButton(darkMode) }]}>
                        <TouchableOpacity onPress={() => navigation.push("Favoris")}>
                            <View style={styles.featureHeader}>
                                <Ionicons name="star-outline" size={24} color="#e9d700" />
                                <Text style={[styles.featureTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                                    Favoris
                                </Text>
                            </View>
                            <Text style={[styles.featureDesc, { color: AppConfig.SecondaryTextColor(darkMode) }]}>
                                Gérez vos clubs favoris : ajoutez-en ou retirez-les à tout moment.
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.featureCard, { backgroundColor: AppConfig.BackGroundButton(darkMode) }]}>
                        <TouchableOpacity onPress={() => navigation.push("FiltersSave")}>
                            <View style={styles.featureHeader}>
                                <Ionicons name="search-outline" size={24} color="#4ECDC4" />
                                <Text style={[styles.featureTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                                    Vos Filtres
                                </Text>
                            </View>
                            <Text style={[styles.featureDesc, { color: AppConfig.SecondaryTextColor(darkMode) }]}>
                                Sauvegardez, modifiez ou supprimez vos filtres pour retrouver vos recherches en un clic.                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.featureCard, { backgroundColor: AppConfig.BackGroundButton(darkMode) }]}>
                        <TouchableOpacity onPress={() => navigation.push("Notifications")}>
                            <View style={styles.featureHeader}>
                                <Ionicons name="notifications-outline" size={24} color="#FF6B6B" />
                                <Text style={[styles.featureTitle, { color: AppConfig.MainTextColor(darkMode) }]}>
                                    Notifications
                                </Text>
                            </View>
                            <Text style={[styles.featureDesc, { color: AppConfig.SecondaryTextColor(darkMode) }]}>
                                Consultez vos prochaines notifications, envoyées 5 minutes avant chaque match.
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    vertical: {
        flexDirection: "column",
        flex: 1,
        paddingBottom: 32,
    },

    // Stats améliorées
    statsContainer: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginBottom: 10,
        padding: 20,
        borderRadius: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    statIconContainer: {
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        backgroundColor: "#3f96ee30",
        marginHorizontal: 12,
    },

    // Catégories en grille moderne
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
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
        lineHeight: 18,
        marginBottom: 12,
    },
    arrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    // Section fonctionnalités bonus
    featuresContainer: {
        paddingHorizontal: 16,
        gap: 12,
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
        marginBottom: 8,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 12,
    },
    featureDesc: {
        fontSize: 13,
        lineHeight: 18,
        marginLeft: 36,
    },
});

export default Discover;