export type Data = {
  id: number;
  image: any;
  title: string;
  text: string;
};
// On Boarding Screen Pages you can add as many as you want
export const data: Data[] = [
  {
    id: 1,
    image: require('../assets/logoNoMadeIn.png'),
    title: 'Bienvenue',
    text: 'FootTV est l’application idéale pour suivre tous les matchs à venir, recevoir des notifications et profiter d’une recherche ultra fluide grâce à ses favoris et filtres enregistrés.',
  },
  {
    id: 2,
    image: require('../assets/OnBoarding/image2.png'),
    title: 'Recherche',
    text: 'Trouvez en quelques secondes tous les matchs de football dans le monde grâce à des filtres intuitifs et ultra précis.',
  },
  {
    id: 3,
    image: require('../assets/OnBoarding/image3.png'),
    title: 'Prêt à jouer ?',
    text: 'Commencez par ajouter vos clubs favoris pour ne plus jamais manquer un seul match.',
  },
];
