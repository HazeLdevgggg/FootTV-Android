import React, { useContext, useEffect, useMemo, useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import Settings from "../screens/Settings";
import Competitions from "../screens/Competitions";
import LegalMention from "../screens/LegalMention";
import Channel from "../screens/Channel";
import ChannelProgram from "../screens/ChannelProgram";
import Home from "../screens/Home";
import { StackScreens } from "./type";
import { Ionicons } from "@expo/vector-icons";
import Club from "../screens/Club";
import { ThemeContext } from "../context/ThemeContext";
import { AppConfig } from "../AppConfig";
import Article from "../screens/Article";
import Notifications from "../screens/Notifications";
import { View, Text, StyleSheet } from "react-native";
import MyImage from "../components/tags/MyImage";
import Filters from "../screens/Filters";
import Discover from "../screens/Discover";
import Favoris from "../screens/Favoris";
import FiltersSavePage from "../screens/FiltersSavePage";
import FavorisOnBoarding from "../screens/OnBoarding/FavorisOnBoarding";
import ArticlePage from "../screens/ArticlePage";
import { useInterstitialManager } from "../functions/InterstitialManager";
import Log from "../functions/Log";

const Stack = createNativeStackNavigator<StackScreens>();
const Tab = createBottomTabNavigator();

// 🎯 HOOK DE TRACKING DE PAGE
const usePageTracking = (screenName?: string) => {
  const isFocused = useIsFocused();
  const { incrementPageCount } = useInterstitialManager();

  useEffect(() => {
    if (isFocused) {
      Log(`📄 Page active: ${screenName || 'Unknown'}`);
      incrementPageCount();
    }
  }, [isFocused, incrementPageCount, screenName]);
};

// 🧱 WRAPPERS POUR CHAQUE ÉCRAN AVEC TRACKING
const HomeWithTracking = () => {
  usePageTracking('Home');
  return <Home />;
};

const CompetitionsWithTracking = () => {
  usePageTracking('Competitions');
  return <Competitions />;
};

const ChannelWithTracking = () => {
  usePageTracking('Channel');
  return <Channel />;
};

const SettingsWithTracking = () => {
  usePageTracking('Settings');
  return <Settings />;
};

const LegalMentionWithTracking = () => {
  usePageTracking('LegalMention');
  return <LegalMention />;
};

const ChannelProgramWithTracking = () => {
  usePageTracking('ChannelProgram');
  return <ChannelProgram />;
};

const ClubWithTracking = () => {
  usePageTracking('Club');
  return <Club />;
};

const ArticleWithTracking = () => {
  usePageTracking('Article');
  return <Article />;
};

const NotificationsWithTracking = () => {
  usePageTracking('Notifications');
  return <Notifications />;
};

const FiltersWithTracking = () => {
  usePageTracking('Filters');
  return <Filters />;
};

const DiscoverWithTracking = () => {
  usePageTracking('Discover');
  return <Discover />;
};

const FavorisWithTracking = () => {
  usePageTracking('Favoris');
  return <Favoris />;
};

const FavorisOnBoardingWithTracking = () => {
  usePageTracking('FavorisOnBoarding');
  return <FavorisOnBoarding />;
};

const FiltersSavePageWithTracking = () => {
  usePageTracking('FiltersSavePage');
  return <FiltersSavePage />;
};

const ArticlePageWithTracking = () => {
  usePageTracking('ArticlePage');
  return <ArticlePage />;
};

// 📚 CRÉATION DES STACK NAVIGATORS
const createStackNavigator = (
  initialRoute: keyof StackScreens,
  darkMode: boolean,
) => {
  const StackComponent = () => (
    <Stack.Navigator
      id={undefined}
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        headerShadowVisible: true,
        headerStyle: {
          backgroundColor: AppConfig.BackgroundColor(darkMode),
        },
        headerTintColor: "#000",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: AppConfig.BackgroundColor(darkMode),
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeWithTracking} />
      <Stack.Screen name="Competitions" component={CompetitionsWithTracking} />
      <Stack.Screen name="Channel" component={ChannelWithTracking} />
      <Stack.Screen name="Settings" component={SettingsWithTracking} />
      <Stack.Screen name="LegalMention" component={LegalMentionWithTracking} />
      <Stack.Screen name="ChannelProgram" component={ChannelProgramWithTracking} />
      <Stack.Screen name="Club" component={ClubWithTracking} />
      <Stack.Screen name="Article" component={ArticleWithTracking} />
      <Stack.Screen name="Notifications" component={NotificationsWithTracking} />
      <Stack.Screen name="Filters" component={FiltersWithTracking} />
      <Stack.Screen name="Discover" component={DiscoverWithTracking} />
      <Stack.Screen name="Favoris" component={FavorisWithTracking} />
      <Stack.Screen name="FavorisOnBoarding" component={FavorisOnBoardingWithTracking} />
      <Stack.Screen name="FiltersSave" component={FiltersSavePageWithTracking} />
      <Stack.Screen name="ArticlePage" component={ArticlePageWithTracking} />
    </Stack.Navigator>
  );
  return StackComponent;
};

// 🏠 COMPOSANT PRINCIPAL
const AllScreens = () => {
  const { darkMode, setDarkMode, onBoarding, setOnBoarding } = useContext(ThemeContext);
  
  // Initialise le manager d'interstitiels
  //const { incrementPageCount, forceShow, resetPageCount } = useInterstitialManager();
  
  const DiscoverStack = useMemo(() => createStackNavigator("Discover", darkMode), [darkMode]);
  const HomeStack = useMemo(() => createStackNavigator("Home", darkMode), [darkMode]);
  const SettingsStack = useMemo(() => createStackNavigator("Settings", darkMode), [darkMode]);
  const FiltersStack = useMemo(() => createStackNavigator("Filters", darkMode), [darkMode]);

  // 🎯 GESTION DE L'ONBOARDING
  if (onBoarding === 1) {
    return (
      <NavigationContainer>
        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="FavorisOnBoarding" component={FavorisOnBoardingWithTracking} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // 🏠 NAVIGATION PRINCIPALE
  return (
    <NavigationContainer>
      <Tab.Navigator
        id={undefined}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: AppConfig.BackgroundColor(darkMode),
            borderTopWidth: 0,
            shadowColor: AppConfig.ShadowColor(darkMode),
            elevation: 4,
            shadowOpacity: 0.6,
          },
          tabBarActiveTintColor: "#3f96ee",
          tabBarInactiveTintColor: AppConfig.MainTextColor(darkMode),
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
        }}
      >
        <Tab.Screen
          name="Accueil"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Recherche"
          component={FiltersStack}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "search" : "search-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Mon FootTV"
          component={DiscoverStack}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "extension-puzzle" : "extension-puzzle-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Paramètres"
          component={SettingsStack}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "cog" : "cog-outline"} size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AllScreens;
