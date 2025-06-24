import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { ItemChannelType } from "../../utils/ItemChannelType";
import MyImage from "../tags/MyImage";
import { Button } from "@react-navigation/elements";
import { useTypedNavigation } from "../../navigation/navigation";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
type ItemChannelProps = ItemChannelType & { mode: string };

function ItemChannel({ id, nom, logo, mode }: ItemChannelProps) {
  const navigation = useTypedNavigation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={[
        styles.horizontal,
        {
          backgroundColor: AppConfig.BackGroundButton(darkMode),
          shadowColor: AppConfig.ShadowColor(darkMode),
        },
      ]}
      onPress={() => navigation.push("ChannelProgram", { id: id, mode: mode })}
    >
      <View style={styles.logoContainer}>
        <View style={[styles.logoBorder, {
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        }]}>
          <View style={styles.logoBackground}>
            <MyImage
              source={logo}
              style={styles.logo}
              contentFit={"contain"}
            />
          </View>
        </View>
      </View>
      <View style={styles.vertical}>
        <Text
          style={[
            styles.titreText,
            { color: AppConfig.MainTextColor(darkMode) },
          ]}
        >
          {nom}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoBorder: {
    width: 70,
    height: 70,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  logoBackground: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    width: "100%",
    height: "100%",
    padding: 6, // Espace intérieur pour éviter que le logo touche les bords
  },
  horizontal: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    marginBottom: 6,
    overflow: 'hidden',
    elevation: 2,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  vertical: {
    flexDirection: "column",
    marginLeft: 12,
    flex: 1,
  },
  titreText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
export default ItemChannel;
