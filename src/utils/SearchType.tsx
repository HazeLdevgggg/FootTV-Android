type SearchType = {
    search : string; // "" = pas de filtrer sinon filtrer par le texte
    CeSoir : string; // "0" | "1"
    EnDirect : string; // "0" | "1"
    EnCour : string //"0" | "1"
    ClubId : string; // "" = pas de filtrer sinon filtrer par le clubId
    CompetitionId : string; // "" = pas de filtrer sinon filtrer par la competitionId
    ChannelId : string; // "" = pas de filtrer sinon filtrer par le channelId
    date : string; // "" = pas de filtrer sinon filtrer par la date format DD/MM/YYYY
    Favoris : string; // "" = pas de filtrer sinon filtrer par les favoris
}
export type {SearchType};

// Requete POST pour les récupérer exactement les mêmes noms comme param dans le body