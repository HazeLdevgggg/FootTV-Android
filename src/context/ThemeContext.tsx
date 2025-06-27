import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { Favoris } from "../utils/FavorisType";
import { AppConfig } from "../AppConfig";
import FiltersType from "../utils/FIltersType";
import { routes } from "../routes/routes";
import Log from "../functions/Log";

type ThemeContextType = {
  onBoarding: number;
  darkMode: boolean;
  editID: string;
  token: string;
  profil_id: string;
  notification_info: string;
  notification_emission: string;
  filters: FiltersType[];
  favoris: Favoris[];
  interstitialLoad: string;
  notificationPending: string;
  setNotificationPending: (value: string) => void;
  setInterstitialLoad: (value: string) => void;
  setFavoris: (favoris: Favoris[]) => void;
  setOnBoarding: (value: number) => void;
  setFilters: (filters: FiltersType[]) => void;
  setNotification_info: (value: string) => void;
  setNotification_emission: (value: string) => void;
  setProfil_id: (value: string) => void;
  setEditID: (value: string) => void;
  setToken: (value: string) => void;
  setDarkMode: (value: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  onBoarding: 2,
  darkMode: true,
  editID: "",
  token: "",
  profil_id: "",
  notification_info: "1",
  notification_emission: "1",
  filters: [],
  favoris: [],
  interstitialLoad: "0",
  notificationPending: "0",
  setNotificationPending: () => {},
  setInterstitialLoad: () => {},
  setFavoris: () => {},
  setOnBoarding: () => {},
  setFilters: () => {},
  setNotification_info: () => {},
  setNotification_emission: () => {},
  setProfil_id: () => {},
  setEditID: () => {},
  setToken: () => {},
  setDarkMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkModeState] = useState(true);
  const [token, setTokenState] = useState("");
  const [profil_id, setProfil_idState] = useState("");
  const [notification_info, setNotification_infoState] = useState("1");
  const [notification_emission, setNotification_emissionState] = useState("1");
  const [filters, setFiltersState] = useState<FiltersType[]>([]);
  const [favoris, setFavorisState] = useState<Favoris[]>([]);
  const [editID, setEditIDState] = useState("");
  const [onBoarding, setOnBoardingState] = useState(undefined);
  const [interstitialLoad, setInterstitialLoadState] = useState("0");
  const [notificationPending, setNotificationPendingState] = useState("0");

  const setDarkMode = async (value: boolean) => {
    await AsyncStorage.setItem("dark_mode", value.toString());
    setDarkModeState(value);
  };

  const setToken = async (value: string) => {
    await AsyncStorage.setItem("token", value);
    setTokenState(value);
  };

  const setProfil_id = async (value: string) => {
    await AsyncStorage.setItem("profil_id", value);
    setProfil_idState(value);
  };

  const setNotification_info = async (value: string) => {
    await AsyncStorage.setItem("notification_info", value);
    setNotification_infoState(value);
  };

  const setNotification_emission = async (value: string) => {
    await AsyncStorage.setItem("notification_emission", value);
    setNotification_emissionState(value);
  };

  const setFilters = async (value: FiltersType[]) => {
    try {
      await AsyncStorage.setItem("filters", JSON.stringify(value));
      setFiltersState(value);
    } catch (e) {
      console.error("Erreur lors de l'enregistrement des filtres :", e);
    }
  };

  const setFavoris = async (value: Favoris[]) => {
    try {
      await AsyncStorage.setItem("favoris", JSON.stringify(value));
      setFavorisState(value);
    } catch (e) {
      console.error("Erreur lors de l'enregistrement des favoris :", e);
    }
  };

  const setOnBoarding = async (value: number) => {
    await AsyncStorage.setItem("onBoarding", value.toString());
    setOnBoardingState(value);
  };

  const setInterstitialLoad = async (value: string) => {
    await AsyncStorage.setItem("interstitialLoad", value);
    setInterstitialLoadState(value);
  };

  const setNotificationPending = async (value: string) => {
    await AsyncStorage.setItem("notificationPending", value);
    setNotificationPendingState(value);
  };

  const InitProfil_id = async () => {
    const os = Platform.OS;
    const savedProfil = await AsyncStorage.getItem("profil_id");

    if (!savedProfil) {
      try {
        const res = await fetch(`${AppConfig.API_BASE_URL}${routes.Profile}?apikey=${AppConfig.API_Key}&profil=0&site=300&version=3.0&plateform=${os}&rand=${Math.random()}`);
        const json = await res.json();
        await setProfil_id(json.profil.id);
        Log("✔️ Nouveau profil ID créé :"+ json.profil.id);
      } catch (e) {
       Log("❌ Erreur lors de la création du profil :"+ e);
      }
    } else {
      try {
        await fetch(`${AppConfig.API_BASE_URL}${routes.Profile}?apikey=${AppConfig.API_Key}&profil=${savedProfil}&site=300&version=3.0&plateform=${os}&rand=${Math.random()}`);
        setProfil_id(savedProfil);
        Log("✅ Profil ID existant validé :"+ savedProfil);
      } catch (e) {
        Log("❌ Erreur lors de la validation du profil :"+ e);
      }
    }
  };

  const loadPreferences = async () => {
    try {
      const [
        savedDarkMode,
        savedToken,
        savedProfilId,
        savedNotifInfo,
        savedNotifEmission,
        savedFilters,
        savedFavoris,
        savedOnBoarding,
        savedInterstitial,
        savedPending
      ] = await Promise.all([
        AsyncStorage.getItem("dark_mode"),
        AsyncStorage.getItem("token"),
        AsyncStorage.getItem("profil_id"),
        AsyncStorage.getItem("notification_info"),
        AsyncStorage.getItem("notification_emission"),
        AsyncStorage.getItem("filters"),
        AsyncStorage.getItem("favoris"),
        AsyncStorage.getItem("onBoarding"),
        AsyncStorage.getItem("interstitialLoad"),
        AsyncStorage.getItem("notificationPending")
      ]);

      setDarkModeState(savedDarkMode === "true");
      setTokenState(savedToken || "");
      setProfil_idState(savedProfilId || "");
      setNotification_infoState(savedNotifInfo || "1");
      setNotification_emissionState(savedNotifEmission || "1");
      setOnBoardingState(Number(savedOnBoarding || 2));
      setInterstitialLoadState(savedInterstitial || "0");
      setNotificationPendingState(savedPending || "0");

      setFiltersState(savedFilters ? JSON.parse(savedFilters) : []);
      setFavorisState(savedFavoris ? JSON.parse(savedFavoris) : []);

      await InitProfil_id();
    } catch (e) {
      console.error("❌ Erreur de chargement des préférences :", e);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        onBoarding,
        darkMode,
        editID,
        token,
        profil_id,
        notification_info,
        notification_emission,
        filters,
        favoris,
        interstitialLoad,
        notificationPending,
        setOnBoarding,
        setDarkMode,
        setEditID: setEditIDState,
        setToken,
        setProfil_id,
        setNotification_info,
        setNotification_emission,
        setFilters,
        setFavoris,
        setInterstitialLoad,
        setNotificationPending,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};