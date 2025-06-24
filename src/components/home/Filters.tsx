import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Pressable,
  Text,
  ScrollView,
  FlatList,
} from "react-native";
import MyImage from "../tags/MyImage";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
import ToggleFilters from "../layout/Filters/ToggleFilters";
import LoadFavoris from "../layout/Filters/LoadFavoris";
import { useTypedNavigation } from "../../navigation/navigation";
import ResetToggleFilters from "../layout/Filters/ResetToggleFilters";
function Filters({
  onFilterChange,
}: {
  onFilterChange: (CeSoir: boolean, Direct: boolean, EnCours: boolean, Favoris: string[]) => void;
}) {
  const navigator = useTypedNavigation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [isPressedDirect, setIsPressedDirect] = React.useState(false);
  const [isPressedSoir, setIsPressedSoir] = React.useState(false);
  const [isPressedEnCours, setIsPressedEnCours] = React.useState(false);
  const [Reset, setReset] = React.useState(false);
  const [Favoris, setFavoris] = React.useState<string[]>([]);

  const CeSoirPressed = () => {
    const newValue = !isPressedSoir;
    setIsPressedSoir(newValue);
    onFilterChange?.(newValue, isPressedDirect, isPressedEnCours, Favoris);
  };
  const DirectPressed = () => {
    const newValue = !isPressedDirect;
    setIsPressedDirect(newValue);
    onFilterChange?.(isPressedSoir, newValue, isPressedEnCours, Favoris);
  };
  const EnCoursPressed = () => {
    const newValue = !isPressedEnCours;
    setIsPressedEnCours(newValue);
    onFilterChange?.(isPressedSoir, isPressedDirect, newValue, Favoris);
  };

  const HandleResetFilter = () => {
    setFavoris([]);
    setReset(!Reset);
    setIsPressedDirect(false);
    setIsPressedSoir(false);
    setIsPressedEnCours(false);
    onFilterChange?.(false, false, false, []);
  }

  const CheckEmptyFilter = () => {
    return (
      isPressedDirect ||
      isPressedSoir ||
      isPressedEnCours ||
      Favoris.length > 0
    );
  };
    return (
    <>
      <View style={styles.horizontal}>
        <ToggleFilters icon="radio-outline" name="En Direct" value={isPressedDirect} onFilterChange={() => DirectPressed()} />
        <ToggleFilters icon="pulse-outline" name="Match en cours" value={isPressedEnCours} onFilterChange={() => EnCoursPressed()} />
        <ToggleFilters icon="moon-outline" name="Le Soir" value={isPressedSoir} onFilterChange={() => CeSoirPressed()} />
        <LoadFavoris Value={Favoris} onFilterChange={(category: string[], isApplied: boolean) => {
          if (isApplied) {
            setFavoris(category);
            onFilterChange?.(isPressedSoir, isPressedDirect, isPressedEnCours, category);
          } else {
            setFavoris([]);
            onFilterChange?.(isPressedSoir, isPressedDirect, isPressedEnCours, []);
          }
        }} name="Vos Favoris" icon="star-outline" />
        <ToggleFilters icon="add-outline" name="Voir Plus" value={false} onFilterChange={() => {
          if (navigator.getParent()) {
            navigator.getParent().navigate("Recherche");
          }
        }} />
        {CheckEmptyFilter() && <ResetToggleFilters icon="close" value={Reset} onFilterChange={() => HandleResetFilter()} />}

      </View>
    </>
  );
}
const styles = StyleSheet.create({
  horizontal: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginHorizontal: 12,
    flexWrap: "wrap",
  },
});
export default Filters;
