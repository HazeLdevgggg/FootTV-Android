type Article = {
  id: string;
  auteur: string;
  date: string;
  filtre: string;
  titre: string;
  theme: string;
  ligue: string;
  photo: string;
  photo_une: string;
  officiel: string;
  exclu: number;
  video: number;
  une: string;
  live: string;
  match: {
    id: number;
    detail: {
      date: string;
      dom: string;
      dom_img: string;
      vis: string;
      vis_img: string;
      score: string;
      final: string;
      penalty: number;
      prolongation: number;
      etat: string;
    }[];
  };
};
export type { Article };
