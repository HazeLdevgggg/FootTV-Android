// MontserratText.js
import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

export type MyTextProps = TextProps & {
  style?: TextProps["style"];
  children?: React.ReactNode;
};

export function MyText({ style, children, ...props }: MyTextProps) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

export function MyTextBold({ style, children, ...props }: MyTextProps) {
  return (
    <Text style={[styles.textbold, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins-Regular", // Assurez-vous que la police est chargée
    color: "#000", // Couleur de texte par défaut, modifiable selon le besoin
    fontSize: 12, // Taille de texte par default
    //letterSpacing: 0.2
  },
  textbold: {
    fontFamily: "Poppins-Bold", // Assurez-vous que la police est chargée
    color: "#000", // Couleur de texte par défaut, modifiable selon le besoin
    fontSize: 12, // Taille de texte par default
    //letterSpacing: 0.2
  },
});
