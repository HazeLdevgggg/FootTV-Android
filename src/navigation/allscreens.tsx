import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
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
const Stack = createNativeStackNavigator<StackScreens>();
const Tab = createBottomTabNavigator();

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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Competitions" component={Competitions} />
      <Stack.Screen name="Channel" component={Channel} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="LegalMention" component={LegalMention} />
      <Stack.Screen name="ChannelProgram" component={ChannelProgram} />
      <Stack.Screen name="Club" component={Club} />
      <Stack.Screen name="Article" component={Article} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Filters" component={Filters} />
      <Stack.Screen name="Discover" component={Discover} />
      <Stack.Screen name="Favoris" component={Favoris} />
      <Stack.Screen name="FavorisOnBoarding" component={FavorisOnBoarding} />
      <Stack.Screen name="FiltersSave" component={FiltersSavePage} />
    </Stack.Navigator>

  );
  return StackComponent;
};

const AllScreens = () => {
  const { darkMode, setDarkMode, onBoarding, setOnBoarding } = useContext(ThemeContext);
  const DiscoverStack = createStackNavigator("Discover", darkMode);
  const HomeStack = createStackNavigator("Home", darkMode);
  const SettingsStack = createStackNavigator("Settings", darkMode);
  const FiltersStack = createStackNavigator("Filters", darkMode);

  if (onBoarding === 1) {
    return (
      <NavigationContainer>
        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="FavorisOnBoarding" component={FavorisOnBoarding} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        id={undefined}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: AppConfig.BackgroundColor(darkMode),
            borderTopWidth: 0,
            shadowColor:  AppConfig.ShadowColor(darkMode), // pour Android
            elevation: 4, // pour Android
            shadowOpacity: 0.6, // pour iOS
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
          name="FootTV & Moi"
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
