const Settings = {
  production: false,
  site: {
    nom: "FootTV",
    id: "0",
    url: "https://madeinfoot.ouest-france.fr",
    couleur1: "#3f96ee",
    contentUrl: "",
  },
  app: {
    debug: true,
    name: "FootTV",
    version: "1.0",
    url: "https://madeinfoot.ouest-france.fr/ws/api/",
    versionAPI: "3.0",
    plateforme: "inconnu",
    bdd: "madeinfoot.db",
    key: "2921182712",
    page: 0,
    didomi: {
      id: "539b86a7-a602-4da6-a9a5-560546b3bc2b",
      notice: "2VYrTq9V",
    },
    pub: {
      interstitielLoad: 0,
      interstitiel: {
        loading: 0,
        first: 200,
        other: 300,
      },
    },
    taboola: {
      id: "sdk-tester-demo",
    },
    facebook: {
      id: "634904239189115",
    },
  },
  profil: {
    id: 0,
    token: "",
    infos: 0,
    favoris: {
      nbr: 0,
      equipe: {
        id: 0,
        nom: "",
        logo: "",
        notification: 1,
        couleur: "#eee",
        couleur2: "#000",
      },
    },
    suivi: {
      nbr: 0,
      liste: [],
    },
  },
  push: {
    pending: 0,
    data: {
      infos: "0",
      direct: "0",
      site: "0",
    },
  },
};

export default Settings;
