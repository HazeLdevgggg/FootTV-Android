import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FiltersChannel from './Filters/DateFilters'; // Filtre de la date
import ChannelFilters from './Filters/ChannelFilters';
import ToggleFilters from './Filters/ToggleFilters'; // Filter de type booléen
import FiltersCompetitionAndClub from './Filters/FiltersCompetitionAndClub'; // Filtre de type liste déroulante
import LoadFilters from './Filters/LoadFilters';
import SaveFilters from './Filters/SaveFilters';
import LoadFavoris from './Filters/LoadFavoris';
import SectionDivider from '../home/SectionDivider';
import ResetToggleFilters from './Filters/ResetToggleFilters';
import Log from '../../functions/Log';
export default function FiltersPageSection({
  OnFilterChange,
  SearchValue,
}: {
  OnFilterChange: (
    SearchValue: string,
    CeSoir: boolean,
    EnDirect: boolean,
    ClubId: string,
    CompetitionId: string,
    ChannelId: string,
    date: string,
    EnCour: boolean,
    Favoris: string[],
  ) => void;
  SearchValue: string;
}) {
  // Stocke les valeurs localement
  const [CeSoir, setCeSoir] = useState(false);
  const [EnDirect, setEnDirect] = useState(false);
  const [EnCour, setEnCour] = useState(false);
  const [ClubId, setClubId] = useState('');
  const [ClubName, setClubName] = useState('');
  const [CompetitionId, setCompetitionId] = useState('');
  const [CompetitionName, setCompetitionName] = useState('');
  const [ChannelId, setChannelId] = useState('');
  const [nameChannel, setNameChannel] = useState('');
  const [date, setDate] = useState('');

  const [Favoris, setFavoris] = useState<string[]>([]);
  const [Reset, setReset] = useState(false);

  // Fonctions pour passer la date en string
  const toggleCeSoir = () => {
    const newCeSoir = !CeSoir;
    setCeSoir(newCeSoir);
    OnFilterChange(SearchValue, newCeSoir, EnDirect, ClubId, CompetitionId, ChannelId, date, EnCour, Favoris);
  };
  const toggleEnDirect = () => {
    const newEnDirect = !EnDirect;
    setEnDirect(newEnDirect);
    OnFilterChange(SearchValue, CeSoir, newEnDirect, ClubId, CompetitionId, ChannelId, date, EnCour, Favoris);
  }
  const setClubAndCompetition = (clubId: string, competitionId: string, nameClub: string, nameCompetition: string) => {
    setClubId(clubId);
    setCompetitionId(competitionId);
    setClubName(nameClub);
    setCompetitionName(nameCompetition);
    OnFilterChange(SearchValue, CeSoir, EnDirect, clubId, competitionId, ChannelId, date, EnCour, Favoris);
  }
  const setChannel = (id: string, name: string) => {
    setChannelId(id);
    setNameChannel(name);
    OnFilterChange(SearchValue, CeSoir, EnDirect, ClubId, CompetitionId, id, date, EnCour, Favoris);
  };
  const setDateFilter = (newDate: string) => {
    setDate(newDate);
  }
  const toggleEnCour = () => {
    const newEnCourt = !EnCour;
    setEnCour(newEnCourt);
    OnFilterChange(SearchValue, CeSoir, EnDirect, ClubId, CompetitionId, ChannelId, date, newEnCourt, Favoris);
  }

  const CheckEmptyFilter = () => {
    return (
      Favoris.length > 0 ||
      CeSoir ||
      EnDirect ||
      EnCour ||
      ClubId !== "" ||
      CompetitionId !== "" ||
      ChannelId !== "" ||
      date !== ""
    );
  };
  const HandleResetFilter = () => {
    setClubName("");
    setCompetitionName("");
    setNameChannel("");
    setFavoris([]);
    setReset(!Reset);
    setCeSoir(false);
    setEnDirect(false);
    setEnCour(false);
    setClubId("");
    setCompetitionId("");
    setChannelId("");
    setDateFilter("");
    OnFilterChange("", false, false, "", "", "", "", false, []);
  }
  // Finir les Filtres l'affichage a chaque fois qu'un filtre est modifié ...
  return (
    <View >
      <View style={{
        marginHorizontal: 12,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        flexWrap: "wrap",
      }}>
        <FiltersChannel Value={date} onFilterChange={(newDate: string) => {
          setDateFilter(newDate);
          OnFilterChange(SearchValue, CeSoir, EnDirect, ClubId, CompetitionId, ChannelId, newDate, EnCour, Favoris);
        }}
        />
        <FiltersCompetitionAndClub ClubID={ClubId} CompetitionID={CompetitionId} onFilterChange={(id: string, competitionId: string, nameClub: string, nameCompetition: string) => {
          setClubAndCompetition(id, competitionId, nameClub, nameCompetition);
        }} />
        <ChannelFilters Value={ChannelId} onFilterChange={(id: string, name: string) => {
          setChannel(id, name)
          OnFilterChange(SearchValue, CeSoir, EnDirect, ClubId, CompetitionId, id, date, EnCour, Favoris);
        }} />
        <ToggleFilters icon="radio-outline" name="En Direct" value={EnDirect} onFilterChange={() => toggleEnDirect()} />
        <ToggleFilters icon="moon-outline" name="Ce soir" value={CeSoir} onFilterChange={() => toggleCeSoir()} />
        <ToggleFilters icon="pulse-outline" name="Match en cours" value={EnCour} onFilterChange={() => toggleEnCour()} />
        <LoadFavoris Value={Favoris} onFilterChange={(newFavoris: string[], isApplied: boolean) => {
          if (isApplied) {
            Log(">> newFavoris :" + newFavoris);
            setFavoris(newFavoris);
            OnFilterChange(SearchValue, CeSoir, EnDirect, ClubId, CompetitionId, ChannelId, date, EnCour, newFavoris);
          }
          else {
            OnFilterChange(SearchValue, CeSoir, EnDirect, ClubId, CompetitionId, ChannelId, date, EnCour, []);
            setFavoris([]);
          }
        }} name="Favoris" icon="star-outline" />
        {CheckEmptyFilter() && <ResetToggleFilters icon="close" value={Reset} onFilterChange={() => HandleResetFilter()} />}
      </View>
      <SectionDivider label="Gestion des filtres" icon="folder-outline" />
      <View style={{
        marginHorizontal: 12,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        flexWrap: "wrap",
      }}>

        <LoadFilters onFilterChange={(filters, isApplied: boolean) => {
          if (isApplied) {
            setClubAndCompetition(filters.ClubID, filters.CompetitionID, filters.Club, filters.Competition);
            setChannel(filters.ChannelID, filters.Channel);
            setDateFilter(filters.date);
            setCeSoir(filters.CeSoir === "" || filters.CeSoir === "0" ? false : true);
            setEnDirect(filters.EnDirect === "" || filters.EnDirect === "0" ? false : true);
            setEnCour(filters.EnCours === "" || filters.EnCours === "0" ? false : true);
            OnFilterChange(filters.search, filters.CeSoir === "" || filters.CeSoir === "0" ? false : true, filters.EnDirect === "" || filters.EnDirect === "0" ? false : true, filters.ClubID, filters.CompetitionID, filters.ChannelID, filters.date, filters.EnCours === "" || filters.EnCours === "0" ? false : true, Favoris);
          }
          else {
            setClubAndCompetition("", "", "", "");
            setChannel("", "");
            setDateFilter("");
            setCeSoir(false);
            setEnDirect(false);
            setEnCour(false);
            OnFilterChange("", false, false, "", "", "", "", false, Favoris);
          }
        }} icon="filter-outline" />

        <SaveFilters type={
          {
            name: "",
            id: "",
            search: SearchValue,
            date: date,
            Competition: CompetitionName,
            CompetitionID: CompetitionId,
            Club: ClubName,
            ClubID: ClubId,
            Channel: nameChannel,
            ChannelID: ChannelId,
            CeSoir: CeSoir ? "1" : "0",
            EnCours: EnCour ? "1" : "0",
            EnDirect: EnDirect ? "1" : "0",
          }
        } />
      </View>
    </View>
  );
}