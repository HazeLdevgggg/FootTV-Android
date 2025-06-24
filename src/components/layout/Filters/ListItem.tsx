
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../../../context/ThemeContext';
import { AppConfig } from '../../../AppConfig';
import MyImage from '../../tags/MyImage';

type ListItemProps = {
    logo: string;
    name: string;
    country?: string;
    color?: string;
    onPress: () => void;
};
export default function ListItem({ logo, name, country, color, onPress }: ListItemProps) {
    const { darkMode } = useContext(ThemeContext);
    return (
        <>
            <TouchableOpacity
                style={[
                    styles.horizontal,
                    {
                        backgroundColor: color ?? AppConfig.BackGroundButton(darkMode),
                        shadowColor: AppConfig.ShadowColor(darkMode),
                    },
                ]}
                onPress={() => onPress()}
            >
                <View style={styles.logoContainer}>
                    <View style={[styles.logoBorder, {
                        borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    }]}>
                        <View style={styles.logoBackground}>
                            <MyImage
                                source={logo}
                                style={styles.logo}
                                contentFit={"contain"}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.vertical}>
                    <Text
                        style={[
                            styles.titreText,
                            { color: AppConfig.MainTextColor(darkMode) },
                        ]}
                    >
                        {name} {country ? "| " + country : ""}
                    </Text>
                </View>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    horizontal: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: 16,
        marginBottom: 6,
        overflow: 'hidden',
        elevation: 2,
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      vertical: {
        flexDirection: "column",
        marginLeft: 12,
        flex: 1,
      },
    titreText: {
        fontSize: 14,
        fontWeight: "600",
      },
    logo: {
        width: '100%',
        height: '100%',
    },
    logoContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    logoBorder: {
        width: 70,
        height: 70,
        borderRadius: 14,
        borderWidth: 1.5,
        padding: 3,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    logoBackground: {
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        width: "100%",
        height: "100%",
        padding: 6, // Espace intérieur pour éviter que le logo touche les bords
    },
});