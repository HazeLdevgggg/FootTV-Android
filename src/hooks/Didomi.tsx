// didomiUtils.ts
import { Didomi } from "@didomi/react-native";
import Log from "../functions/Log"

export const testConsent = async () => {
  const didomi = await Didomi.shouldUserStatusBeCollected();
};

// Fonction pour initialiser Didomi
export const initializeDidomi = async () => {
  try {
    Didomi.onReady().then(() => {
      Log("Didomi SDK is ready");
      // Vous pouvez appeler des actions ici, comme afficher manuellement la notice
      testConsent();
    });

    // Initialisation du SDK Didomi
    Didomi.initialize(
      "539b86a7-a602-4da6-a9a5-560546b3bc2b",
      undefined,
      undefined,
      undefined,
      false,
      undefined,
      "RrwX6PZF",
    );
    Didomi.setupUI();
    Log("Didomi SDK initialized");
  } catch (error) {
    console.error("Error initializing Didomi:", error);
  }
};

// Fonction pour afficher la fenêtre de consentement
export const showConsentNotice = async () => {
  Log("On essaye d'afficher la fenêtre de consentement");
  try {
    await Didomi.showPreferences();
    Log("Consent notice displayed");
  } catch (error) {
    Log("Error displaying consent notice:"+ error);
  }
};
