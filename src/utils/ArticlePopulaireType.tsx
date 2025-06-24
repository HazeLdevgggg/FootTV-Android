type ArticlePopulaire = {
  type: "info";
  id: string;
  uniq: string;
  pos: number;
  auteur: string;
  date: string;
  titre: string;
  theme: string;
  ligue: string;
  photo: string;
  photo_une: string;
  exclu: number;
  video: string;     // Attention : c'est une string ici, contrairement à d'autres cas
  une: "0" | "1";
  live: "0" | "1";
  mercato: "0" | "1";
  officiel: "0" | "1";
  match: {
    id: number;
    detail: any[];   // Si tu connais la structure, tu peux remplacer `any` par un type précis
  };
  site: string;
};
export type { ArticlePopulaire };

