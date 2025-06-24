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
    Platform,
} from "react-native";
import ItemChannel from "../../../components/layout/ItemChannel";
import { levenshteinDistance } from "../../../functions/Levenshtein";
import type { ItemChannelType } from "../../../utils/ItemChannelType";
import { ThemeContext } from "../../../context/ThemeContext";
import { AppConfig } from "../../../AppConfig";
import { Banner } from "../../../hooks/Pub";
import { Ionicons } from "@expo/vector-icons";
import { useTypedNavigation } from "../../../navigation/navigation";
import MyImage from "../../tags/MyImage";
import Loading from "../Loading";
import ListItem from "./ListItem";
import Search from "../Search";
import CloseIcon from "./CloseIcon";
import { routes } from "../../../routes/routes";
import ScreenHeaderResetButton from "../ScreenHeader/ScreenHeaderResetButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ChannelFiltersProps = {
    onFilterChange: (id: string, name: string) => void;
    Value: string;
};

function ChannelFilters({ onFilterChange, Value }: ChannelFiltersProps) {
    const navigation = useTypedNavigation();
    const [channels, setChannels] = useState<ItemChannelType[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { darkMode } = useContext(ThemeContext);
    const [showModal, setShowModal] = useState<boolean>(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const getChannel = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${AppConfig.API_BASE_URL}${routes.Channel}?apikey=${AppConfig.API_Key}`,
                );
                const data = await response.json();
                const sortedChannels = [...data].sort((a, b) => {
                    if (a.id === Value) return -1;
                    if (b.id === Value) return 1;
                    return 0;
                });
                setChannels(sortedChannels);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        getChannel();
    }, [Value]);

    const handleChannelPress = (id: string, name: string) => {
        onFilterChange(id, name);
        setShowModal(false);
    }

    const handleReset = () => {
        onFilterChange("", "");
        setShowModal(false);
    }

    const SearchFilter = (text: string) => {
        setSearchQuery(text);
        const sorted = [...channels].sort(
            (a, b) =>
                levenshteinDistance(a.nom.toLowerCase(), text.toLowerCase()) -
                levenshteinDistance(b.nom.toLowerCase(), text.toLowerCase()),
        );
        setChannels(sorted);
    };

    return (
        <>
            <View
                style={[
                    styles.horizontal,
                    styles.horizontal, { marginHorizontal: Value !== "" ? 8 : 4 }
                ]}
            >
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <View
                        style={
                            Value !== ""
                                ? [styles.filtersboxPressed, styles.filterContainer]
                                : [
                                    styles.filtersbox,
                                    { backgroundColor: AppConfig.BackGroundButton(darkMode) },
                                    styles.filterContainer,
                                ]
                        }
                    >
                        <Ionicons
                            name={"tv-outline"}
                            size={20}
                            color={Value !== "" ? "white" : AppConfig.IconColor(darkMode)}
                        />
                        <Text
                            style={
                                Value !== ""
                                    ? styles.heureText2
                                    : [styles.heureText, { color: AppConfig.IconColor(darkMode) }]
                            }
                        >
                            Chaines
                        </Text>
                        {Value !== "" && (
                            <CloseIcon handleOnPress={() => handleReset()} />
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: AppConfig.BackgroundColor(darkMode),paddingTop: insets.top }]}>
                    <ScreenHeaderResetButton
                        name="Sélectionner une chaîne"
                        OnBackButtonPress={() => setShowModal(false)}
                        OnResetButtonPress={handleReset}
                    />

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
                                placeholder="Chercher une chaîne..."
                                SearchFilter={(text: string) => SearchFilter(text)}
                            />
                            {channels.map((item, index) => (
                                <React.Fragment key={"channel-fragment-" + item.id}>
                                    <ListItem
                                        logo={item.logo}
                                        name={item.nom}
                                        color={item.id === Value ? "green" : null}
                                        onPress={() => handleChannelPress(item.id, item.nom)}
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
        flex: 1,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 50, // Pour éviter la status bar
    },
    headerButton: {
        padding: 8,
        minWidth: 50,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 100,
    },
});

export default ChannelFilters;