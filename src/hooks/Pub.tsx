import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
    InterstitialAd,
    GAMBannerAd,
    BannerAdSize,
    AdEventType,
} from "react-native-google-mobile-ads";
import mobileAds from "react-native-google-mobile-ads";
import Settings from "../constants/Settings";
import { AppConfig } from "../AppConfig";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
const INTERSTITIAL_UNIT_ID = "/49926454/madeinfoot>appli/une>topic>interstitiel";

let interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ["sports", "football"],
});

let listeners: (() => void)[] = [];
export const initializeGAM = async () => {
    try {
        await mobileAds()
            .initialize()
            .then(() => console.log("✅ Mobile Ads initialized"))
            .catch((e) => console.log("❌ Mobile Ads failed to init:", e));
        setupInterstitialListeners();
        preloadInterstitial();
    } catch (error) {
        console.error("Erreur lors de l'initialisation de Google Ads Manager :", error);
    }
};

// Fonction pour précharger un interstitiel
export const preloadInterstitial = () => {
    if (!interstitial.loaded) {
        if (Settings.app.pub.interstitielLoad === 0) {
            interstitial.load();
        }
    }
};

// Fonction pour afficher un interstitiel si prêt

export const showInterstitial = (onClose?: () => void) => {
    if (interstitial.loaded) {
        const closeListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            console.log("Interstitial ad closed");
            if (onClose) onClose();
            closeListener(); // retire le listener
            preloadInterstitial(); // prépare la prochaine
        });

        interstitial.show();
        Settings.app.pub.interstitielLoad = 0;
    } else {
        console.log("Interstitial ad not loaded, preloading...");
        preloadInterstitial();
        if (onClose) onClose(); // fallback si rien n'est chargé
    }
};

export const setupInterstitialListeners = () => {
    listeners.forEach(remove => remove());
    listeners = [];

    listeners.push(
        interstitial.addAdEventListener(AdEventType.LOADED, () => {
            Settings.app.pub.interstitielLoad = 1;
            console.log("Interstitial ad loaded");
        })
    );
    listeners.push(
        interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            console.log("Interstitial ad closed");
            preloadInterstitial();
        })
    );
    listeners.push(
        interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
            console.log("Interstitial ad error:", error);
        })
    );
};

type BannerProps = {
    unitId: string;
    darkMode: boolean;
};

export const Banner = ({ unitId, darkMode }: BannerProps) => (
    <View style={[
        styles.vertical2,
        {
            backgroundColor: AppConfig.BackGroundButton(darkMode),
            shadowColor: AppConfig.ShadowColor(darkMode),
        },
    ]}>
        <GAMBannerAd
            unitId={unitId}
            sizes={[BannerAdSize.MEDIUM_RECTANGLE]}
            requestOptions={{
                keywords: ["sports", "football"],
                contentUrl: Settings.site.contentUrl,
            }}
        />
    </View>
);

export const BannerHeader = ({ unitId, darkMode }: BannerProps) => (
    <View
        style={[
            styles.BannerHeader,
            {
                backgroundColor: AppConfig.BackGroundButton(darkMode),
                shadowColor: AppConfig.ShadowColor(darkMode),
            },
        ]}
    >
        <View style={{ width: 320, height: 60, justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
            <GAMBannerAd
                unitId={unitId}
                sizes={[BannerAdSize.LEADERBOARD]}
                requestOptions={{
                    keywords: ["sports", "football"],
                    contentUrl: Settings.site.contentUrl,
                }}
            />
        </View>
    </View>
);

export const BannerFooter = ({ unitId, darkMode }: BannerProps) => (
    <View
        style={[
            styles.BannerFooter,
            {
                backgroundColor: AppConfig.BackGroundButton(darkMode),
                shadowColor: AppConfig.ShadowColor(darkMode),
            },
        ]}
    >
        <GAMBannerAd
            unitId={unitId}
            sizes={[BannerAdSize.LEADERBOARD]}
            requestOptions={{
                keywords: ["sports", "football"],
                contentUrl: Settings.site.contentUrl,
            }}
        />
    </View>
);


const styles = StyleSheet.create({
    bannerContainer: {
        width: "100%",
        paddingHorizontal: 12,
        alignItems: "center",
        marginVertical: 10,
    },
    bannerHeaderContainer: {
        width: "100%",
        paddingHorizontal: 12,
        alignItems: "center",
        marginVertical: 10,
        height: 120,
        justifyContent: "center",
    },
    vertical2: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8, // au lieu de padding: 8
        paddingHorizontal: 8,
        borderRadius: 10,
        marginBottom: 12, // au lieu de marginBottom: 6
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
        paddingVertical: 8, // au lieu de padding: 8
        paddingHorizontal: 8,
        borderRadius: 10,
        elevation: 2,
        height: 70,
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    BannerFooter: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
});
