// Résultat de la requet Post avec les plusieurs résultats sous cette forme :
type ResultSearchType = {
    id: string;
    date: string; // format DD/MM/YYYY
    heure: string; // format HH:mm
    titre: string;
    desc: string;
    direct: string; // "1" ou "0"
    categorie: string;
    chaine: string;
    logo: string;
    image: string;
    url: string;
}
export type { ResultSearchType };