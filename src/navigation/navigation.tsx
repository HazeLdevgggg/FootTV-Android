import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // Import du type natif
import { StackScreens } from "./type";

export const useTypedNavigation = () => {
  return useNavigation<NativeStackNavigationProp<StackScreens>>();
};
