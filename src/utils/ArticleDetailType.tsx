interface ArticleDetail {
  id: string;
  next_id: number;
  previous_id: number;
  auteur: string;
  date: string;
  titre: string;
  theme: string;
  contenu: {
    nbr: number;
    liste: ContenuElement[];
  };
  info: string;
  actu_live: number;
  live: any;
  url: string;
  nbr_iframe: number;
  iframe: any[];
  nbr_tweet: number;
  iframe_twitter: string;
  player: string;
  video: string;
  photo: string;
  legende: string;
  nbtweet: number;
  twitter: any[];
  nbinstagram: number;
  instagram: any[];
  nbfacebook: number;
  facebook: any[];
  mots: any;
  nbmots: number;
  nbligue: any;
  ligue: any;
  joueurs: any;
  nbjoueurs: number;
  clubs: any;
  nbclubs: number;
  album: number;
  album_photo: any[];
  nbpopulaire: number;
  populaires: {
    nbr: number;
    liste: any[];
  };
  affiche_photo: number;
  youtube: number;
  sondage: {
    nbr: number;
    id: number;
    titre: string;
    reponses: any[];
  };
  themes: {
    nbr: number;
    liste: any[];
  };
  pub_page: {
    top: BannerSection;
    middle: BannerSection;
    footer: BannerSection;
  };
  pub_article_bottom: string;
}

interface ContenuElement {
  pos: number;
  html: number;
  match: {
    display: number;
    data: any[];
  };
  notes: {
    display: number;
    data: any[];
  };
  contenu: string;
  pub: {
    display: number;
    banner: Banner | Banner[];
  };
}

interface BannerSection {
  display: number;
  banner: Banner;
}

interface Banner {
  id: string;
  width: number;
  height: number;
}

export type { ArticleDetail };