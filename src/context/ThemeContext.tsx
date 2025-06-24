import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, StyleSheet, Platform } from 'react-native';
import { assertEasingIsWorklet } from "react-native-reanimated/lib/typescript/animation/util";
import { Favoris } from "../utils/FavorisType";
import { AppConfig } from "../AppConfig";
import  FiltersType  from "../utils/FIltersType";
import { routes } from "../routes/routes";


type ThemeContextType = {
  onBoarding: number; // 0 finish, 1 Favoris Page, 2 OnBoarding
  darkMode: boolean;
  editID : string;
  token: string;
  profil_id: string;
  notification_info: string;
  notification_emission: string;
  filters: FiltersType[];
  favoris: Favoris[];
  setFavoris: (favoris: Favoris[]) => void;
  setOnBoarding: (value: number) => void;
  setFilters: (filters: FiltersType[]) => void;
  setNotification_info: (value: string) => void;
  setNotification_emission: (value: string) => void;
  setProfil_id: (value: string) => void;
  setEditID : (value : string) => void;
  setToken: (value: string) => void;
  setDarkMode: (value: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  onBoarding: 2,
  setOnBoarding: () => { },
  darkMode: true,
  editID : "",
  token: '',
  profil_id: '',
  notification_info: '',
  notification_emission: '',
  filters: [],
  favoris: [],
  setFavoris: () => { },
  setFilters: () => { },
  setNotification_info: () => { },
  setNotification_emission: () => { },
  setProfil_id: () => { },
  setToken: () => { },
  setEditID : () => { },
  setDarkMode: () => { },
});

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkModeState] = useState(true);
  const [token, setTokenState] = useState<string>("");
  const [profil_id, setProfil_idState] = useState<string>("");
  const [notification_info, setNotification_info] = useState<string>("");
  const [notification_emission, setNotification_emission] = useState<string>("");
  const [filtersState, setFiltersState] = useState<FiltersType[]>([]);
  const [favorisState, setFavorisState] = useState<Favoris[]>([]);
  const [editID, setEditID] = useState<string>("");
  const [onBoardingValue, setOnBoardingValue] = useState<number | undefined>(undefined);

  const setOnBoarding = async (value: number) => {
    try {
      await AsyncStorage.setItem("onBoarding", value.toString());
      setOnBoardingValue(value);
    } catch (e) {
      console.error("Impossible de sauvegarder l'onBoarding:", e);
    }
  };

  const setFilters = async (value: FiltersType[]) => {
    try {
      await AsyncStorage.setItem("filters", JSON.stringify(value));
      setFiltersState(value);
    } catch (e) {
      console.error("Impossible de sauvegarder les filters:", e);
    }
  };

  const setFavoris = async (value: Favoris[]) => {
    try {
      await AsyncStorage.setItem("favoris", JSON.stringify(value));
      setFavorisState(value);
    } catch (e) {
      console.error("Impossible de sauvegarder les favoris:", e);
    }
  };

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem("dark_mode");
      const savedtoken = await AsyncStorage.getItem("token");
      const savedprofil_id = await AsyncStorage.getItem("profil_id");
      const savedNotification_info = await AsyncStorage.getItem("notification_info");
      const savedNotification_emission = await AsyncStorage.getItem("notification_emission");
      const savedFilters = await AsyncStorage.getItem("filters");
      const savedFavoris = await AsyncStorage.getItem("favoris");
      const savedOnBoarding = await AsyncStorage.getItem("onBoarding");

      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters);
          setFiltersState(parsedFilters);
        } catch (e) {
          console.error("Erreur de parsing des filters :", e);
          setFiltersState([]);
        }
      } else {
        setFiltersState([]);
      }

      if (savedFavoris) {
        try {
          const parsedFavoris = JSON.parse(savedFavoris);
          setFavorisState(parsedFavoris);
        } catch (e) {
          console.error("Erreur de parsing des favoris :", e);
          setFavorisState([]);
        }
      } else {
        setFavorisState([]);
      }
      setOnBoardingValue(Number(savedOnBoarding || 2));
      setDarkModeState(saved === "true");
      setDarkMode(saved === "true");
      setTokenState(savedtoken || "");
      setProfil_idState(savedprofil_id || "");
      setNotification_info(savedNotification_info || "1");
      setNotification_emission(savedNotification_emission || "1");
      await InitProfil_id();

    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  const setNotification_info_Update = async (value: string) => {
    await AsyncStorage.setItem("notification_info", value.toString());
    setNotification_info(value);
  };

  const setNotification_emission_Update = async (value: string) => {
    await AsyncStorage.setItem("notification_emission", value.toString());
    setNotification_emission(value);
  };

  const setDarkMode = async (value: boolean) => {
    await AsyncStorage.setItem("dark_mode", value.toString());
    setDarkModeState(value);
  };

  const setProfil_id = async (value: string) => {
    await AsyncStorage.setItem("profil_id", value);
    setProfil_idState(value);
  };

  const setToken = async (value: string) => {
    await AsyncStorage.setItem("token", value);
    setTokenState(value);
  };

  const InitProfil_id = async () => {
    const os = Platform.OS;
    console.log("InitProfil_id Start...");
    if (!await AsyncStorage.getItem("profil_id")) {
      try {
        const response = await fetch(`${AppConfig.API_BASE_URL}${routes.Profile}?apikey=${AppConfig.API_Key}&profil=0&site=300&version=3.0&plateform=${os}`);
        const data = await response.json();
        await setProfil_id(data.profil.id);
        console.log("InitProfil_id User Created",data.profil.id);
      } catch (e) {
        console.error("Error fetching profil_id:", e);
      }
    } else {
      try {
        await fetch(`${AppConfig.API_BASE_URL}${routes.Profile}?apikey=${AppConfig.API_Key}&profil=${profil_id}&site=300&version=3.0&plateform=${os}`);
        const data = await AsyncStorage.getItem("profil_id");
        console.log("InitProfil_id User Validated",data);
        await setProfil_id(data);
      } catch (e) {
        console.error("Error validating profil_id:", e);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ onBoarding: onBoardingValue, setOnBoarding, favoris: favorisState, setFavoris, editID, setEditID,filters: filtersState, setFilters, darkMode, token, setToken, setDarkMode, setProfil_id, profil_id, notification_info, setNotification_info: setNotification_info_Update, notification_emission, setNotification_emission: setNotification_emission_Update }}>
      {children}
    </ThemeContext.Provider>
  );
};