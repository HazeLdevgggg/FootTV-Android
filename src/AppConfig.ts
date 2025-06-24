import AsyncStorage from "@react-native-async-storage/async-storage";

export class AppConfig {
  public static API_Key = "2921182712";
  public static API_BASE_URL= "https://madeinfoot.ouest-france.fr/ws/api/programme-tv/versions/3.0/";
  
  public static MainTextColor(val: boolean): string {
    return val ? "#FFFFFF" : "#0D1117";
  }

  public static PubEachNumberOfBlock(): number {
    return 4;
  }

  public static BackgroundColor(val: boolean): string {
    return val ? "#0D1117" : "#d4d4d4";
  }

  public static SecondaryTextColor(val: boolean): string {
    return val ? "#8B949E" : "#656D76";
  }

  public static BackGroundButton(val: boolean): string {
    return val ? "#21262D" : "#f4f4f4";
  }

  public static SecondBackGroundButton(val: boolean): string {
    return val ? "#30363D" : "#E5E7EB"; // Plus clair en dark, plus foncé en light
  }


  public static IconColor(val: boolean): string {
    return val ? "#F0F6FF" : "#24292F";
  }

  public static ShadowColor(val: boolean): string {
    return val ? "rgba(0, 0, 0)" : "rgba(31, 35, 40)";
  }
}