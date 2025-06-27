import { useEffect, useState, useContext } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
    GAMBannerAd,
    BannerAdSize,
    TestIds,
} from "react-native-google-mobile-ads";
import mobileAds from "react-native-google-mobile-ads";
import { AppConfig } from "../AppConfig";
import Log from "../functions/Log";
import InterstitialManager from "../functions/InterstitialManager";

// Configuration des bannières avec IDs spécifiques par plateforme
const getBannerUnitId = (type: 'header' | 'content' | 'footer') => {
    const baseId = "/49926454/madeinsupporter>appli>une>topic>";
    
    return Platform.select({
        ios: `${baseId}${type}`, // Assure-toi que ces IDs existent sur iOS
        android: `${baseId}${type}`,
        default: TestIds.BANNER, // ID de test par défaut
    });
};

const buildCustomTargeting = (unitId: string, pagetype: string = 'topic') => {
    return {
        ofts: [
            'foot', 'sports', 'madeinfoot', 'ligue_1', '/sposts/divers',
            'om', 'psg', 'asse', 'stade_rennais', 'fc_nantes', 'ligue_2',
            'ligue_des_champions', 'equipe_de_france', 'monaco', 'losc',
            'real_madrid', 'rc_lens', 'bordeaux', 'montpellier', 'television',
            'coupe_du_monde', 'euro_football', 'ligue_des_champions', 'coupe_de_france_de_football'
        ],
        pagetype,
        pos: getPosFromUnitId(unitId),
        slotName: unitId,
        device: Platform.OS === 'ios' ? 'iphone' : 'smartphone',
    };
};

const getPosFromUnitId = (unitId: string): string => {
    const parts = unitId.split('>');
    return parts[parts.length - 1] || '';
};

// 🔁 Initialisation des ads (version améliorée)
export const initializeGAM = async () => {
    try {
        await mobileAds()
            .initialize()
            .then(() => {
                Log("✅ Mobile Ads initialized");
                // Initialise aussi le manager d'interstitiels
                InterstitialManager.getInstance().initialize();
            })
            .catch((e) => Log("❌ Mobile Ads failed to init: " + e));
    } catch (error) {
        console.error("Erreur lors de l'initialisation de Google Ads Manager :", error);
    }
};

// Hook pour utiliser les interstitiels (version simplifiée)
export const useInterstitial = () => {
    const manager = InterstitialManager.getInstance();
    
    useEffect(() => {
        manager.initialize();
    }, []);

    const showInterstitial = () => {
        manager.forceShow();
    };

    return { showInterstitial };
};

// 🧱 BANNERS (versions améliorées avec meilleure gestion d'erreurs)

type BannerProps = {
    unitId?: string;
    darkMode: boolean;
    pagetype?: string;
    type?: 'header' | 'content' | 'footer';
};

export const Banner = ({ unitId, darkMode, pagetype = "topic", type = 'content' }: BannerProps) => {
    const finalUnitId = unitId || getBannerUnitId(type);
    
    return (
        <View style={[styles.vertical2, {
            backgroundColor: AppConfig.BackGroundButton(darkMode),
            shadowColor: AppConfig.ShadowColor(darkMode),
        }]}>
            <GAMBannerAd
                unitId={finalUnitId}
                sizes={[BannerAdSize.MEDIUM_RECTANGLE]}
                requestOptions={{
                    keywords: ["sports", "football"],
                    contentUrl: "",
                    customTargeting: buildCustomTargeting(finalUnitId, pagetype),
                    requestNonPersonalizedAdsOnly: false, // Important pour iOS
                }}
                onAdLoaded={() => Log("✅ Banner loaded: " + type)}
                onAdFailedToLoad={(error) => Log("❌ Banner failed: " + JSON.stringify(error))}
            />
        </View>
    );
};

export const BannerHeader = ({ unitId, darkMode, pagetype = "topic" }: BannerProps) => {
    const finalUnitId = unitId || getBannerUnitId('header');
    
    return (
        <View style={[styles.BannerHeader, {
            backgroundColor: AppConfig.BackGroundButton(darkMode),
            shadowColor: AppConfig.ShadowColor(darkMode),
        }]}>
            <GAMBannerAd
                unitId={finalUnitId}
                sizes={[BannerAdSize.LARGE_BANNER]}
                requestOptions={{
                    keywords: ["sports", "football"],
                    contentUrl: "",
                    customTargeting: buildCustomTargeting(finalUnitId, pagetype),
                    requestNonPersonalizedAdsOnly: false,
                }}
                onAdLoaded={() => Log("✅ Header banner loaded")}
                onAdFailedToLoad={(error) => Log("❌ Header banner failed: " + JSON.stringify(error))}
            />
        </View>
    );
};

export const BannerFooter = ({ unitId, darkMode, pagetype = "topic" }: BannerProps) => {
    const finalUnitId = unitId || getBannerUnitId('footer');
    
    return (
        <View style={[styles.BannerFooter, {
            backgroundColor: AppConfig.BackGroundButton(darkMode),
            shadowColor: AppConfig.ShadowColor(darkMode),
        }]}>
            <GAMBannerAd
                unitId={finalUnitId}
                sizes={[BannerAdSize.LARGE_BANNER]}
                requestOptions={{
                    keywords: ["sports", "football"],
                    contentUrl: "",
                    customTargeting: buildCustomTargeting(finalUnitId, pagetype),
                    requestNonPersonalizedAdsOnly: false,
                }}
                onAdLoaded={() => Log("✅ Footer banner loaded")}
                onAdFailedToLoad={(error) => Log("❌ Footer banner failed: " + JSON.stringify(error))}
            />
        </View>
    );
};

// 🎨 Styles (inchangés)
const styles = StyleSheet.create({
    vertical2: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
        height: 300,
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    BannerHeader: {
        marginHorizontal: 12,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        borderRadius: 10,
        elevation: 2,
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        overflow: "hidden",
        width: "100%",
        maxWidth: 360,
        alignSelf: "center",
    },
    BannerFooter: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
});