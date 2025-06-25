type NotificationsType = {
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
  notification: {
    minute: string,
    heure: string,
    jour:string
  }
};
export type { NotificationsType };
