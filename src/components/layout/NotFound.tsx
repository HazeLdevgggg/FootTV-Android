import { View, Text } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';
import { AppConfig } from '../../AppConfig';
import { Ionicons } from '@expo/vector-icons';
import MyImage from '../tags/MyImage';
export default function NotFound() {
    const { darkMode } = useContext(ThemeContext);
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: AppConfig.BackgroundColor(darkMode),
            }}
        >
            <MyImage source={require('../../assets/Icon/notfound.png')} style={{ width: 200, height: 200 }} contentFit="contain"/>
            <Text style={{
                color: "gray",
                fontWeight: "900",
                fontSize: 16,
                textAlign: 'center'
            }}>
                Aucun match trouvé pour cette recherche. Tentez de modifier vos filtres ou votre recherche.
            </Text>
        </View>
    );
}