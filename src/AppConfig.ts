export class AppConfig {
  public static API_Key = "2921182712";
  public static API_BASE_URL = "https://madeinfoot.ouest-france.fr/ws/api/programme-tv/versions/3.0/";

  // Texte principal : sombre, mais pas noir
  public static MainTextColor(val: boolean): string {
    return val ? "#FFFFFF" : "#1F2937"; // dark: blanc, light: gris foncé
  }

  // Fond général : pas blanc pur en light
  public static BackgroundColor(val: boolean): string {
    return val ? "#0D1117" : "#FFFFFF"; // light: bleu très pâle
  }

  // Texte secondaire
  public static SecondaryTextColor(val: boolean): string {
    return val ? "#8B949E" : "#6B7280"; // déjà bien
  }

  // Fond des boutons principaux
  public static BackGroundButton(val: boolean): string {
    return val ? "#21262D" : "#E2E8F0"; // blanc simple pour bouton clair
  }

  // Fond des boutons secondaires (ou cartes)
  public static SecondBackGroundButton(val: boolean): string {
    return val ? "#30363D" : "#F1F5F9"; // gris très clair
  }

  // Icônes
  public static IconColor(val: boolean): string {
    return val ? "#F0F6FF" : "#4B5563"; // gris foncé pour contraste
  }

  // Ombre
  public static ShadowColor(val: boolean): string {
    return val ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.05)"; // plus douce en light
  }
}