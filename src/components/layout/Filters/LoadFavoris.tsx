import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";
import { AppConfig } from "../../../AppConfig";
import ScreenHeaderResetButton from "../ScreenHeader/ScreenHeaderResetButton";
import ItemChannel from "../ItemChannel";
import { Favoris } from "../../../utils/FavorisType";
import MyImage from "../../tags/MyImage";
import Empty from "../Empty";
import CloseIcon from "./CloseIcon";

function LoadFavoris({
    Value,
    onFilterChange,
    name,
    icon,
}: {
    Value: string[];
    onFilterChange: (category: string[], isApplied: boolean) => void;
    name: string;
    icon: string;
}) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<boolean>(false);
    const { darkMode, favoris } = useContext(ThemeContext);
    var ToggleFilters: { [id: string]: boolean; } = {};

    useEffect(() => {
        setSelectedFilter(Value.length > 0);
    }, [Value]);
    
    favoris.map((favoris: Favoris) => {
        ToggleFilters[favoris.id] = false;
    });
    const [ClubToggleFilters, setClubToggleFilters] = useState<{ [id: string]: boolean; }>(ToggleFilters);

    const handleFilterSelect = (category: Favoris) => {
        setClubToggleFilters({ ...ClubToggleFilters, [category.id]: !ClubToggleFilters[category.id] });
    };

    const handleFilterValidate = () => {
        setClubToggleFilters({});
        setIsDropdownVisible(false);
        setSelectedFilter(true);
        onFilterChange(Object.keys(ClubToggleFilters).filter((id) => ClubToggleFilters[id]), true);
    }

    const handleClearFilter = () => {
        setClubToggleFilters({});
        onFilterChange([], false);
        setSelectedFilter(false);
        setIsDropdownVisible(false);
    };

    const selectedCount = Object.keys(ClubToggleFilters).filter((id) => ClubToggleFilters[id]).length;

    return (
        <View
            style={[
                styles.horizontal,
                styles.horizontal,{marginHorizontal:selectedFilter ? 8 : 4}
            ]}
        >
            <TouchableOpacity onPress={() => setIsDropdownVisible(true)}>
                    <View
                      style={
                        selectedFilter
                          ? [styles.filtersboxPressed, styles.filterContainer]
                          : [
                            styles.filtersbox,
                            { backgroundColor: AppConfig.BackGroundButton(darkMode) },
                            styles.filterContainer,
                          ]
                      }
                    >
                      <Ionicons
                        name={icon as any}
                        size={20}
                        color={selectedFilter ? "white" : AppConfig.IconColor(darkMode)}
                      />
                      <Text
                        style={
                          selectedFilter
                            ? styles.heureText2
                            : [styles.heureText, { color: AppConfig.IconColor(darkMode) }]
                        }
                      >
                        {name}
                      </Text>
                      {selectedFilter && (
                        <CloseIcon handleOnPress={() => handleClearFilter()} />
                      )}
                    </View>
                  </TouchableOpacity>

            {/* Modal moderne avec design amélioré */}
            <Modal
                visible={isDropdownVisible}
                presentationStyle={Platform.OS === 'ios' ? "pageSheet" : "formSheet"}
                animationType="slide"
                onRequestClose={() => setIsDropdownVisible(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
                    {/* Header avec gradient subtil */}
                    <View style={[styles.modalHeader, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
                        <ScreenHeaderResetButton
                            name="Sélectionner vos favoris"
                            OnBackButtonPress={() => setIsDropdownVisible(false)}
                            OnResetButtonPress={handleClearFilter}
                        />
                    </View>
                    <View style={{ gap: 40, flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                        <TouchableOpacity onPress={() => {
                            Object.keys(ClubToggleFilters).forEach((key) => {
                                ClubToggleFilters[key] = false;
                            });
                            setClubToggleFilters({ ...ClubToggleFilters });
                        }}>
                            <Text style={{ color: AppConfig.MainTextColor(darkMode), fontSize: 15, fontWeight: "700" }}>Effacer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            Object.keys(ClubToggleFilters).forEach((key) => {
                                ClubToggleFilters[key] = true;
                            });
                            setClubToggleFilters({ ...ClubToggleFilters });
                        }}>
                            <Text style={{ color: "#3f96ee", fontSize: 15, fontWeight: "700" }}>Tout</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        style={[styles.scrollContainer, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.listContainer}>
                            {favoris.length > 0 ? (
                                <>
                                    {favoris.map((favoris: Favoris, index) => (
                                    <TouchableOpacity
                                        key={favoris.id}
                                        onPress={() => handleFilterSelect(favoris)}
                                        activeOpacity={0.7}
                                        style={[
                                            styles.dropdownItemEnhanced,
                                            {
                                                backgroundColor: ClubToggleFilters[favoris.id]
                                                    ? darkMode ? 'rgba(63, 159, 238, 0.15)' : 'rgba(63, 159, 238, 0.08)'
                                                    : AppConfig.BackGroundButton(darkMode),
                                                borderWidth: ClubToggleFilters[favoris.id] ? 1.5 : 1,
                                                borderColor: ClubToggleFilters[favoris.id]
                                                    ? '#3f96ee'
                                                    : darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                                            }
                                        ]}
                                    >
                                        <View style={styles.checkboxContainer}>
                                            {ClubToggleFilters[favoris.id] ? (
                                                <View style={styles.checkboxSelected}>
                                                    <Ionicons
                                                        name="checkmark"
                                                        size={16}
                                                        color="white"
                                                    />
                                                </View>
                                            ) : (
                                                <View style={[styles.checkboxUnselected, {
                                                    borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'
                                                }]} />
                                            )}
                                        </View>
    
                                        <View style={styles.logoContainer}>
                                            <MyImage
                                                source={favoris.logo}
                                                style={[styles.logoBorder, {
                                                    borderColor: ClubToggleFilters[favoris.id]
                                                        ? '#3f96ee'
                                                        : darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                                }]}
                                                contentFit="fill"
                                            />
                                        </View>
    
                                        <View style={styles.textSection}>
                                            <Text style={[styles.dropdownItemText, {
                                                color: AppConfig.MainTextColor(darkMode),
                                                fontWeight: ClubToggleFilters[favoris.id] ? '800' : '700'
                                            }]}>
                                                {favoris.clubName}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                                </>
                            ) : (
                                <Empty title="Aucun favori" subtitle="Ajoutez des favoris pour les voir ici, pour en ajouter Decouvrir > Favoris" icon="star-outline" color="#e9d700" />
                            )}
                        </View>
                    </ScrollView>

                    {/* Bouton d'action avec design moderne et gradient */}
                    <View style={[styles.actionSection, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
                        <TouchableOpacity
                            style={[styles.actionButton, { opacity: selectedCount > 0 ? 1 : 0.6 }]}
                            onPress={() => handleFilterValidate()}
                            activeOpacity={0.8}
                            disabled={selectedCount === 0}
                        >
                            <View style={styles.actionButtonContent}>
                                <Ionicons name="checkmark-circle" size={22} color="#ffffff" />
                                <Text style={styles.actionButtonText}>
                                    Valider {selectedCount > 0 ? `(${selectedCount})` : ''}
                                </Text>
                            </View>
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
      filterContainer: {
        position: "relative",
      },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        paddingTop: Platform.OS === 'ios' ? 20 : 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 16,
        paddingBottom: 100,
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    dropdownItemEnhanced: {
        flexDirection: "row",
        borderRadius: 20,
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    checkboxContainer: {
        marginRight: 16,
    },
    checkboxSelected: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#3f96ee',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: "#3f96ee",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    checkboxUnselected: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        backgroundColor: 'transparent',
    },
    logoContainer: {
        marginRight: 16,
    },
    logoBorder: {
        width: 60,
        height: 60,
        borderRadius: 16,
        borderWidth: 2,
        padding: 2,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    textSection: {
        flex: 1,
    },
    dropdownItemText: {
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    actionSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.03)',
    },
    actionButton: {
        backgroundColor: '#3f96ee',
        borderRadius: 20,
        elevation: 6,
        shadowColor: "#3f96ee",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        overflow: 'hidden',
    },
    actionButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
        letterSpacing: 0.5,
    },
});

export default LoadFavoris;