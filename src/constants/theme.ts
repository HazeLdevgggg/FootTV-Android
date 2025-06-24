import { AppConfig } from "../AppConfig";
// Only for OnBoarding
export const theme = {
  colors: {
    backgroundColor: AppConfig.BackgroundColor(true),
    backgroundHighlightColor: '#3f96ee',
    textColor: AppConfig.MainTextColor(true),
    textHighlightColor: AppConfig.MainTextColor(true),
  },
};
