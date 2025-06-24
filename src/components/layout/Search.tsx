import React, { useContext, useState, useRef } from 'react'
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Platform 
} from 'react-native'
import { AppConfig } from '../../AppConfig'
import { ThemeContext } from '../../context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'

type SearchProps = {
  placeholder: string;
  SearchFilter: (text: string) => void;
  Value?: string;
}

export default function Search({ placeholder, SearchFilter, Value }: SearchProps) {
  const { darkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState(Value ?? "");
  React.useEffect(() => {
    setSearchQuery(Value ?? "");
  }, [Value]);
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleValue, {
        toValue: 1.02,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handleClear = () => {
    setSearchQuery("");
    SearchFilter("");
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      })
    ]).start();
  };

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [darkMode ? '#374151' : '#E5E7EB', '#3B82F6'],
  });

  const shadowOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.25],
  });

  const glowRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          backgroundColor: AppConfig.BackGroundButton(darkMode),
          borderColor: borderColor,
          shadowOpacity: shadowOpacity,
          shadowRadius: glowRadius,
          transform: [{ scale: scaleValue }],
        }
      ]}
    >
      {/* Icône de recherche */}
      <View style={styles.searchIconContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isFocused ? "#3B82F6" : AppConfig.SecondaryTextColor(darkMode)} 
        />
      </View>

      {/* Champ de saisie */}
      <TextInput
        style={[
          styles.textInput,
          { 
            color: AppConfig.MainTextColor(darkMode),
            fontSize: 16,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={AppConfig.SecondaryTextColor(darkMode)}
        onChangeText={(text) => { 
          setSearchQuery(text); 
          SearchFilter(text);
        }}
        value={searchQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        selectionColor="#3B82F6"
      />

      {/* Bouton de suppression avec animation */}
      {searchQuery !== "" && (
        <Animated.View
          style={[
            styles.clearButtonContainer,
            {
              opacity: animatedValue,
              transform: [
                {
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity 
            onPress={handleClear}
            style={styles.clearButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={darkMode ? "#EF4444" : "#DC2626"} 
            />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Effet de lueur pour le focus */}
      {isFocused && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.15],
              }),
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1.5,
    borderRadius: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    elevation: Platform.OS === 'android' ? 8 : 0,
    position: 'relative',
  },
  searchIconContainer: {
    marginRight: 12,
    opacity: 0.8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
    paddingVertical: Platform.OS === 'ios' ? 0 : 2,
  },
  clearButtonContainer: {
    marginLeft: 8,
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    zIndex: -1,
  },
});