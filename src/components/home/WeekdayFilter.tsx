import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { AppConfig } from "../../AppConfig";
import DateToUI from "../../functions/DateToUI";
interface WeekdayFilterProps {
  onFilterChange: (selectedDays: string[]) => void;
}

function WeekdayFilter({ onFilterChange }: WeekdayFilterProps) {
  const { darkMode } = useContext(ThemeContext);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [weekdays, setWeekdays] = useState<{ short: string, full: string, id: string }[]>([]);

  useEffect(() => {
    const newWeekdays = [];
    let number = 0;
    let counter = 0;
  
    while (number < 7) {
      const date = new Date(Date.now() + counter);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const currentDay = date.toLocaleDateString('fr-FR', options);
      const NewDay = currentDay[0].toUpperCase() + currentDay.slice(1);
      newWeekdays.push({ short: currentDay[0].toUpperCase(), full: NewDay, id: `${year}-${month}-${day}` });
      number++;
      counter += 24 * 3600 * 1000;
    }
  
    setWeekdays(newWeekdays);
    setSelectedDays([...selectedDays, newWeekdays[0].id]);
  }, []);

  
  const toggleDay = (dayId: string) => {
    const newSelectedDays = [...[],dayId];
      if(newSelectedDays.length === 0){
        setSelectedDays([...[],weekdays[0].id]);
        onFilterChange([...[],weekdays[0].id]);
      }else{
        setSelectedDays(newSelectedDays);
        onFilterChange(newSelectedDays);
      }
  };

  const clearAll = () => {
    setSelectedDays([...[],weekdays[0].id]);
    onFilterChange([...[],weekdays[0].id]);
  };

  const selectAll = () => {
    const allDays = weekdays.map(day => day.id);
    setSelectedDays(allDays);
    onFilterChange(allDays);
  };

  return (
    <View style={styles.container}>
      {/* Header avec actions */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: AppConfig.MainTextColor(darkMode) }]}>
          7 prochains jours
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={clearAll} style={styles.actionButton}>
            <Text style={[styles.actionText, { color: AppConfig.SecondaryTextColor(darkMode) }]}>
              {selectedDays.length > 1 && `Effacer (${selectedDays.length})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={selectAll} style={styles.actionButton}>
            <Text style={[styles.actionText, { color: "#3f96ee" }]}>
              Tout
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grille des jours */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {weekdays.map((day, index) => {
          const isSelected = selectedDays.includes(day.id);
          const isWeekend = day.id === 'saturday' || day.id === 'sunday';
          
          return (
            <TouchableOpacity
              key={day.id}
              onPress={() => toggleDay(day.id)}
              style={[
                styles.dayButton,
                {
                  backgroundColor: isSelected 
                    ? (isWeekend ? AppConfig.BackGroundButton(darkMode) : "#3f96ee")
                    : AppConfig.BackGroundButton(darkMode),
                  shadowColor: AppConfig.ShadowColor(darkMode),
                  borderColor: isSelected 
                    ? (isWeekend ? AppConfig.BackGroundButton(darkMode)  : "#3f96ee")
                    : "transparent",
                }
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.dayShort,
                {
                  color: isSelected 
                    ? "white" 
                    : AppConfig.MainTextColor(darkMode),
                  fontWeight: isSelected ? "700" : "600"
                }
              ]}>
                {day.short}
              </Text>
              <Text style={[
                styles.dayFull,
                {
                  color: isSelected 
                    ? "rgba(255,255,255,0.9)" 
                    : AppConfig.SecondaryTextColor(darkMode),
                  fontWeight: isSelected ? "600" : "500"
                }
              ]}>
                {day.full}
              </Text>
              <Text style={[
                styles.dayFull,
                {
                  color: isSelected 
                    ? "rgba(255,255,255,0.9)" 
                    : AppConfig.SecondaryTextColor(darkMode),
                  fontWeight: isSelected ? "600" : "500"
                }
              ]}>
                {DateToUI(day.id)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  daysContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  
  dayButton: {
    minWidth: 80,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 2,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  
  dayShort: {
    fontSize: 20,
    marginBottom: 2,
  },
  
  dayFull: {
    fontSize: 10,
    textAlign: 'center',
  },
});

export default WeekdayFilter;

// Fonction utilitaire pour obtenir le jour actuel en français
export const getCurrentDayInFrench = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' as const };
  return date.toLocaleDateString('fr-FR', options);
}