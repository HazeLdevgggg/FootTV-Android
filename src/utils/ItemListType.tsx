type EmissionItem = {
  type: 'emission';
  id: string;
  date: string;
  heure: string;
  titre: string;
  desc: string;
  direct: string;
  categorie: string;
  chaine: string;
  logo: string;
  image: string;
  url: string;
};

type PubItem = {
  type: 'pub';
  uniq: string;
  display: number;
  banner: {
    id: string;
    width: number;
    height: number;
  };
  ads: string;
};

type ItemList = EmissionItem | PubItem;

export type { ItemList };
