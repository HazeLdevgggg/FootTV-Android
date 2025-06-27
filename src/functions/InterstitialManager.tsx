// InterstitialManager.ts - Version complètement refaite
import { useEffect } from "react";
import { Platform } from "react-native";
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from "react-native-google-mobile-ads";
import mobileAds from "react-native-google-mobile-ads";
import Log from "./Log";

// Configuration des IDs selon la plateforme
const INTERSTITIAL_UNIT_ID = Platform.select({
    ios: TestIds.INTERSTITIAL, // Utilise TestIds pour tester d'abord
    android: "/49926454/madeinsupporter>appli>une>topic>interstitiel",
    default: TestIds.INTERSTITIAL,
});

class InterstitialManager {
    private static instance: InterstitialManager;
    private interstitial: InterstitialAd | null = null;
    private pageCount = 0;
    private isInitialized = false;
    private listeners: (() => void)[] = [];
    private lastShowTime = 0;
    private readonly MIN_INTERVAL = 1;
    private loadStartTime = 0;
    private readonly LOAD_TIMEOUT = 15000; // 15 secondes timeout

    static getInstance(): InterstitialManager {
        if (!InterstitialManager.instance) {
            InterstitialManager.instance = new InterstitialManager();
        }
        return InterstitialManager.instance;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Attend un peu que les SDK soient prêts
            setTimeout(() => {
                this.createNewInterstitial();
            }, 2000);
            
            this.isInitialized = true;
        } catch (error) {
            Log("❌ Mobile Ads failed to init: " + error);
        }
    }

    private createNewInterstitial() {
        try {
            Log("🏗️ Création nouvel interstitiel...");
            
            // Nettoie complètement l'ancien
            this.destroyCurrentInterstitial();

            // Crée le nouvel interstitiel
            this.interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT_ID!, {
                requestNonPersonalizedAdsOnly: Platform.OS === 'ios' ? false : true,
                keywords: ["sports", "football"],
            });

            Log("✅ Interstitiel créé avec ID: " + INTERSTITIAL_UNIT_ID);
            
            this.setupEventListeners();
            this.loadAd();
            
        } catch (error) {
            Log("❌ Erreur création: " + error);
        }
    }

    private setupEventListeners() {
        if (!this.interstitial) return;

        Log("🎧 Configuration des listeners...");

        this.listeners.push(
            this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
                const loadTime = Date.now() - this.loadStartTime;
                Log(`✅ INTERSTITIAL LOADED en ${loadTime}ms`);
            })
        );

        this.listeners.push(
            this.interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
                Log("❌ INTERSTITIAL ERROR: " + JSON.stringify(error));
                Log("🔄 Tentative de rechargement dans 5 secondes...");
                setTimeout(() => {
                    this.loadAd();
                }, 5000);
            })
        );

        this.listeners.push(
            this.interstitial.addAdEventListener(AdEventType.OPENED, () => {
                Log("📱 Interstitial OPENED");
            })
        );

        this.listeners.push(
            this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
                Log("📱 Interstitial CLOSED");
                this.lastShowTime = Date.now();
                
                // Recrée un nouvel interstitiel après fermeture
                setTimeout(() => {
                    this.createNewInterstitial();
                }, 3000);
            })
        );
    }

    private loadAd() {
        if (!this.interstitial) {
            Log("❌ Pas d'interstitiel pour charger");
            return;
        }

        try {
            this.loadStartTime = Date.now();
            Log("🔄 CHARGEMENT INTERSTITIEL START...");
            this.interstitial.load();
            
            // Timeout de sécurité
            setTimeout(() => {
                if (this.interstitial && !this.interstitial.loaded) {
                    Log("⏰ Timeout de chargement, recréation...");
                    this.createNewInterstitial();
                }
            }, this.LOAD_TIMEOUT);
            
        } catch (error) {
            Log("❌ Erreur load: " + error);
        }
    }

    private destroyCurrentInterstitial() {
        // Nettoie les listeners
        this.listeners.forEach(unsubscribe => {
            try {
                unsubscribe();
            } catch (e) {
                Log("Erreur cleanup listener: " + e);
            }
        });
        this.listeners = [];
        
        // Remet à null
        this.interstitial = null;
        Log("🧹 Interstitiel détruit");
    }

    incrementPageCount() {
        this.pageCount++;
        Log(`📄 Page count: ${this.pageCount}`);

        const shouldShow = this.pageCount === 3 || (this.pageCount > 3 && (this.pageCount - 3) % 10 === 0);
        
        if (shouldShow) {
            Log("🎯 Tentative d'affichage interstitiel...");
            this.showInterstitial();
        }
    }

    private showInterstitial() {
        const now = Date.now();
        
        // Vérifie l'intervalle minimum
        if (now - this.lastShowTime < this.MIN_INTERVAL) {
            Log(`⏱️ Trop tôt (${Math.round((this.MIN_INTERVAL - (now - this.lastShowTime)) / 1000)}s restantes)`);
            return;
        }

        if (!this.interstitial) {
            Log("❌ Aucun interstitiel disponible");
            this.createNewInterstitial();
            return;
        }

        // Debug de l'état
        Log(`🔍 État: loaded=${this.interstitial.loaded}`);

        if (this.interstitial.loaded) {
            try {
                Log("🚀 AFFICHAGE INTERSTITIEL");
                this.interstitial.show();
            } catch (error) {
                Log("❌ Erreur affichage: " + error);
            }
        } else {
            Log("⏳ Interstitiel pas encore chargé");
            // Force un rechargement
            this.loadAd();
        }
    }

    // Méthodes publiques
    forceShow() {
        Log("🔧 FORCE SHOW");
        this.lastShowTime = 0;
        this.showInterstitial();
    }

    resetPageCount() {
        this.pageCount = 0;
        Log("🔄 Page count reset à 0");
    }

    // Debug info
    getStatus() {
        const status = {
            isInitialized: this.isInitialized,
            hasInterstitial: !!this.interstitial,
            isLoaded: this.interstitial?.loaded || false,
            pageCount: this.pageCount,
            unitId: INTERSTITIAL_UNIT_ID,
            platform: Platform.OS,
        };
        Log("📊 Status: " + JSON.stringify(status));
        return status;
    }

    // Test de chargement manuel
    testLoad() {
        Log("🧪 TEST MANUAL LOAD");
        if (!this.interstitial) {
            this.createNewInterstitial();
        } else {
            this.loadAd();
        }
    }
}

// Hook simplifié
export const useInterstitialManager = () => {
    const manager = InterstitialManager.getInstance();
    
    useEffect(() => {
        Log("🚀 Hook: Initialisation manager");
        manager.initialize();
    }, []);

    return {
        incrementPageCount: () => manager.incrementPageCount(),
        forceShow: () => manager.forceShow(),
        resetPageCount: () => manager.resetPageCount(),
        getStatus: () => manager.getStatus(),
        testLoad: () => manager.testLoad(),
    };
};

export default InterstitialManager;