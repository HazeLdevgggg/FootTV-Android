import React, { useContext, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
import ItemChannel from "./ItemChannel";
import { Favoris } from "../../utils/FavorisType";
import MyImage from "../tags/MyImage";
import Empty from "./Empty";
import CloseIcon from "./Filters/CloseIcon";
import ScreenHeader from "./ScreenHeader/ScreenHeaderNoIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function NotificationTime({
    onValidate,
    matchID,
    date,
    heure,
    name,
    icon,
}: {
    onValidate: (minute:number,heure:number,jour:number) => void;
    matchID: string;
    date: string;
    heure: string;
    name: string;
    icon: string;
}) {
    console.log("date",date)
    console.log("heure",heure)
    const [day, month, year] = date.split("/");
    const [isDropdownVisible, setIsDropdownVisible] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState<boolean>(false);
    const { darkMode } = useContext(ThemeContext);
    const DateNotification = []
    const now = new Date();
    const [hour, minute] = heure.split("h");
    const matchDateTime = new Date(`${year}-${month}-${day}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`);
    console.log("matchDateTime",matchDateTime)
    const diffInMinutes = Math.floor((matchDateTime.getTime() - now.getTime()) / 60000);
    console.log(diffInMinutes)
    if (diffInMinutes >= 5) DateNotification.push({ id: "5", name: "5 minutes avant" });
    if (diffInMinutes >= 60) DateNotification.push({ id: "60", name: "1 heure avant" });
    if (diffInMinutes >= 1440) DateNotification.push({ id: "1440", name: "1 jour avant" });
    type DateNotificationType = {
        id: string;
        name: string;
    };
    var ToggleFilters: { [id: string]: boolean; } = {};
    DateNotification.map((DateNotification: DateNotificationType) => {
        ToggleFilters[DateNotification.id] = false;
    });
    const [DateNotificationToggleFilters, setDateNotificationToggleFilters] = useState<{ [id: string]: boolean; }>(ToggleFilters);

    const handleFilterSelect = (category: DateNotificationType) => {
        setDateNotificationToggleFilters({ ...DateNotificationToggleFilters, [category.id]: !DateNotificationToggleFilters[category.id] });
    };

    const handleFilterValidate = () => {
        setIsDropdownVisible(false);
        setSelectedFilter(true);
        const newparam = Object.keys(DateNotificationToggleFilters).filter((id) => DateNotificationToggleFilters[id]);
        onValidate(newparam.includes("5") ? 1 : 0,newparam.includes("60") ? 1 : 0,newparam.includes("1440") ? 1 : 0);
    }

    const insets = useSafeAreaInsets(); 
    const selectedCount = Object.keys(DateNotificationToggleFilters).filter((id) => DateNotificationToggleFilters[id]).length;

    return (
        <Modal
            visible={isDropdownVisible}
            presentationStyle={Platform.OS === 'ios' ? "pageSheet" : "formSheet"}
            animationType="slide"
            onRequestClose={() => {
                handleFilterValidate()
            }}
        >
            <View style={[styles.modalContainer, { backgroundColor: AppConfig.BackgroundColor(darkMode),paddingTop: insets.top }]}>
                {/* Header avec gradient subtil */}
                <View style={[styles.modalHeader, { backgroundColor: AppConfig.BackgroundColor(darkMode) }]}>
                    <ScreenHeader
                        name="Choisssez vos notifications"
                        OnBackButtonPress={() => {
                            handleFilterValidate()
                        }}
                    />
                </View>
                <View style={{ gap: 40, flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => {
                        Object.keys(DateNotificationToggleFilters).forEach((key) => {
                            DateNotificationToggleFilters[key] = false;
                        });
                        setDateNotificationToggleFilters({ ...DateNotificationToggleFilters });
                    }}>
                        <Text style={{ color: AppConfig.MainTextColor(darkMode), fontSize: 15, fontWeight: "700" }}>Effacer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        Object.keys(DateNotificationToggleFilters).forEach((key) => {
                            DateNotificationToggleFilters[key] = true;
                        });
                        setDateNotificationToggleFilters({ ...DateNotificationToggleFilters });
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
                        {DateNotification.length > 0 ? (
                            <>
                                {DateNotification.map((DateNotification: DateNotificationType, index) => (
                                    <TouchableOpacity
                                        key={DateNotification.id}
                                        onPress={() => handleFilterSelect(DateNotification)}
                                        activeOpacity={0.7}
                                        style={[
                                            styles.dropdownItemEnhanced,
                                            {
                                                backgroundColor: DateNotificationToggleFilters[DateNotification.id]
                                                    ? darkMode ? 'rgba(63, 159, 238, 0.15)' : 'rgba(63, 159, 238, 0.08)'
                                                    : AppConfig.BackGroundButton(darkMode),
                                                borderWidth: DateNotificationToggleFilters[DateNotification.id] ? 1.5 : 1,
                                                borderColor: DateNotificationToggleFilters[DateNotification.id]
                                                    ? '#3f96ee'
                                                    : darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                                            }
                                        ]}
                                    >
                                        <View style={styles.checkboxContainer}>
                                            {DateNotificationToggleFilters[DateNotification.id] ? (
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


                                        <View style={styles.textSection}>
                                            <Text style={[styles.dropdownItemText, {
                                                color: AppConfig.MainTextColor(darkMode),
                                                fontWeight: DateNotificationToggleFilters[DateNotification.id] ? '800' : '700'
                                            }]}>
                                                {DateNotification.name}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </>
                        ) : (
                            <Empty title="Aucun Notifications" subtitle="Le match est déjà terminé vous ne pouvez plus recevoir de notification" icon="calendar-outline" color="#3f96ee" />
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
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
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

export default NotificationTime;