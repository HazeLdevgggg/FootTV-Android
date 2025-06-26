type ArticleMatchDetail = {
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
  };
  
  type ArticleMatch = {
    id: number;
    detail: ArticleMatchDetail[];
  };
  
  type InfoArticle = {
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
    video: string;
    une: string;
    live: string;
    mercato: string;
    officiel: string;
    match: ArticleMatch;
    site: string;
  };
  
  type PubArticle = {
    type: "pub";
    uniq: string;
    display: number;
    banner: {
      id: string;
      width: number;
      height: number;
    };
    ads: string;
  };
  
  type ArticlePageType = InfoArticle | PubArticle;
  
  export type { ArticlePageType };