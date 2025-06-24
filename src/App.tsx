import { Assets as NavigationAssets } from '@react-navigation/elements';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Allscreens from "./navigation/allscreens";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { StatusBar } from 'expo-status-bar';
import { AppConfig } from "./AppConfig";
import { initializeDidomi } from "../src/hooks/Didomi";
import { initializeGAM, preloadInterstitial } from './hooks/Pub';
import { useContext, useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OnBoarding from "./screens/OnBoarding/Onboarding";
import Loading from './components/layout/Loading';
import Toast from 'react-native-toast-message';
import { ToastConfig, BaseToast } from 'react-native-toast-message';
// Préchargement des assets

Asset.loadAsync([
    ...NavigationAssets,
    require('./assets/OnBoarding/image2.png'),
    require('./assets/OnBoarding/image3.png'),
    require('./assets/Icon/all.png'),
    require('./assets/Icon/notfound.png'),
]);

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

// Composant contenant le fond dynamique
function AppContainer() {
    const { darkMode,setDarkMode, onBoarding, setOnBoarding } = useContext(ThemeContext);
    const backgroundColor = AppConfig.BackgroundColor(darkMode);
    const toastConfig: ToastConfig = {
  
        success: ({ text1, text2, ...rest }) => (
          <BaseToast
            {...rest}
            style={{
              backgroundColor: AppConfig.SecondBackGroundButton(darkMode),
              borderLeftColor: 'green',
            }}
            contentContainerStyle={{
              paddingHorizontal: 15,
            }}
            text1Style={{
              color: AppConfig.MainTextColor(darkMode),
              fontWeight: 'bold',
            }}
            text2Style={{
              color: AppConfig.MainTextColor(darkMode),
            }}
            text1={text1}
            text2={text2}
          />
        ),
      };
    useEffect(() => {
        async function prepareApp() {
            try {
                initializeDidomi();
                initializeGAM();
                preloadInterstitial();
          
            } finally {
                await SplashScreen.hideAsync(); // Hide splash screen after init
            }
        }
        prepareApp();
    }, []);
    if(onBoarding === 2) setDarkMode(true);
    return (
        <>
            <StatusBar style={darkMode ? "light" : "dark"} />
            <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor }}>
                {onBoarding === undefined ? <Loading /> : onBoarding === 2 ? <OnBoarding /> : <Allscreens />}
                <Toast config={toastConfig}/>
            </SafeAreaView>
        </>
    );
}

export function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <AppContainer />
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
