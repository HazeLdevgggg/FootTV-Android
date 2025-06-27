import { useEffect, useState, useContext } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
    InterstitialAd,
    GAMBannerAd,
    BannerAdSize,
    AdEventType,
} from "react-native-google-mobile-ads";
import mobileAds from "react-native-google-mobile-ads";
import { AppConfig } from "../AppConfig";
import Log from "../functions/Log"

// 🔁 Interstitial global (garde-le global)
const INTERSTITIAL_UNIT_ID = "/49926454/madeinsupporter>appli/une>topic>interstitiel";
const buildCustomTargeting = (unitId: string, pagetype: string = 'topic') => {
  return {
    ofts: [
      'foot', 'sports', 'madeinfoot', 'ligue_1', '/sposts/divers',
      'om', 'psg', 'asse', 'stade_rennais', 'fc_nantes', 'ligue_2',
      'ligue_des_champions', 'equipe_de_france', 'monaco', 'losc',
      'real_madrid', 'rc_lens', 'bordeaux', 'montpellier','television',
      'coupe_du_monde','euro_football','ligue_des_champions','coupe_de_france_de_football'
    ],
    pagetype,
    pos: getPosFromUnitId(unitId),
    slotName: unitId,
    device: 'smartphone',
  };
};

const getPosFromUnitId = (unitId: string): string => {
    const parts = unitId.split('>');
    return parts[parts.length - 1] || '';
};

let interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ["sports", "football"],
});
let listeners: (() => void)[] = [];

// 🔁 Initialisation des ads
export const initializeGAM = async () => {
    try {
        await mobileAds()
            .initialize()
            .then(() => Log("✅ Mobile Ads initialized"))
            .catch((e) => Log("❌ Mobile Ads failed to init:"+ e));
        setupInterstitialListeners();
        preloadInterstitial();
    } catch (error) {
        console.error("Erreur lors de l'initialisation de Google Ads Manager :", error);
    }
};

export const preloadInterstitial = () => {
    if (!interstitial.loaded) {
        interstitial.load();
    }
};


export const useInterstitial = () => {
    useEffect(() => {
        setupInterstitialListeners();
        preloadInterstitial();
    }, []);

    const showInterstitial = (onClose?: () => void) => {
        if (interstitial.loaded) {
            interstitial.show();
        } else {
            Log("Interstitial ad not loaded, preloading...");
            preloadInterstitial();
            if (onClose) onClose();
        }
    };

    return { showInterstitial };
};

// Modifie aussi setupInterstitialListeners pour gérer le callback
export const setupInterstitialListeners = () => {
    listeners.forEach(remove => remove());
    listeners = [];

    listeners.push(
        interstitial.addAdEventListener(AdEventType.LOADED, () => {
            Log("Interstitial ad loaded");
        })
    );
    
    listeners.push(
        interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            Log("Interstitial ad closed");
            preloadInterstitial();
        })
    );
    
    listeners.push(
        interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
            Log("Interstitial ad error: " + error);
        })
    );
};
// 🧱 BANNERS
type BannerProps = {
    unitId: string;
    darkMode: boolean;
    pagetype?: string;
};

export const Banner = ({ unitId, darkMode, pagetype="topic" }: BannerProps) => (
    <View style={[styles.vertical2, {
        backgroundColor: AppConfig.BackGroundButton(darkMode),
        shadowColor: AppConfig.ShadowColor(darkMode),
    }]}>
        <GAMBannerAd
            unitId={unitId}
            sizes={[BannerAdSize.MEDIUM_RECTANGLE]}
            requestOptions={{
                keywords: ["sports", "football"],
                contentUrl: "",
                customTargeting: buildCustomTargeting(unitId, pagetype),
            }}
        />
    </View>
);

export const BannerHeader = ({ unitId, darkMode, pagetype="topic" }: BannerProps) => (
    <View
        style={[
            styles.BannerHeader,
            {
                backgroundColor: AppConfig.BackGroundButton(darkMode),
                shadowColor: AppConfig.ShadowColor(darkMode),
            },
        ]}
    >
        <GAMBannerAd
            unitId={unitId}
            sizes={[BannerAdSize.LARGE_BANNER ]}
            requestOptions={{
                keywords: ["sports", "football"],
                contentUrl: "",
                customTargeting: buildCustomTargeting(unitId, pagetype),
            }}
        />
    </View>
);

export const BannerFooter = ({ unitId, darkMode, pagetype="topic" }: BannerProps) => (
    <View style={[styles.BannerFooter, {
        backgroundColor: AppConfig.BackGroundButton(darkMode),
        shadowColor: AppConfig.ShadowColor(darkMode),
    }]}>
        <GAMBannerAd
            unitId={unitId}
            sizes={[BannerAdSize.LARGE_BANNER ]}
            requestOptions={{
                keywords: ["sports", "football"],
                contentUrl: "",
                customTargeting: buildCustomTargeting(unitId, pagetype),
            }}
        />
    </View>
);

// 🎨 Styles
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
        overflow: "hidden", // 🔐 important pour forcer la box à ne pas déborder
        width: "100%", // 🔒 s'adapte à l'écran
        maxWidth: 360, // 🧱 largeur max pour que la pub reste bien dans sa boîte
        alignSelf: "center", // 🧲 centre la bannière
    },
    BannerFooter: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
});