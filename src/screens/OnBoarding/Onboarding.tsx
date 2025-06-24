import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

import { Button } from '../../components/OnBoarding/Button';
import { Pagination } from '../../components/OnBoarding/Pagination';
import { theme } from '../../constants/theme';
import { data, type Data } from '../../data/screens';
import { AppConfig } from '../../AppConfig';

const RenderItem = ({
  item,
  index,
  x,
}: {
  item: Data;
  index: number;
  x: SharedValue<number>;
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { darkMode } = useContext(ThemeContext);

  const imageAnimatedStyle = (HeightMult: number, WidthMult: number) => useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      width: SCREEN_WIDTH * WidthMult,
      height: SCREEN_WIDTH * HeightMult,
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });


  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [60, 0, 60],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [40, 0, 40],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY: translateYAnimation }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      {item.image === require('../../assets/logoNoMadeIn.png') ? (
        <Animated.Image resizeMode="contain" source={item.image} style={imageAnimatedStyle(0.9, 0.9)} />
      ) : item.image === require('../../assets/OnBoarding/image2.png') ? (
        <Animated.Image resizeMode="contain" source={item.image} style={imageAnimatedStyle(1.1, 1.1)} />
      ) : (
        <Animated.Image resizeMode="contain" source={item.image} style={imageAnimatedStyle(1.2, 1.2)} />
      )}

      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        {/* Titre avec effet de gradient */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={[styles.itemTitle, { color: AppConfig.MainTextColor(darkMode) }]}>{item.title}</Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        {/* Sous-titre avec effet de fade */}
        <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
          <View style={styles.textBackground}>
            <Text style={styles.itemText}>{item.text}</Text>
          </View>
        </Animated.View>


      </Animated.View>
    </View>
  );
};

export default function Onboarding() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const flatListRef = useAnimatedRef<FlatList>();

  const flatListIndex = useSharedValue(0);
  const x = useSharedValue(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>;
  }) => {
    flatListIndex.value = viewableItems[0].index ?? 0;
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef as any}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <RenderItem index={index} item={item} x={x} />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <View style={styles.footerContainer}>
        <Pagination data={data} screenWidth={SCREEN_WIDTH} x={x} />
        <Button
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={data.length}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  itemTitle: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -1.2,
    fontFamily: 'System',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    // Simulation d'un gradient text (car React Native ne supporte pas directement)
    // On utilisera une couleur de base et des effets de shadow
  },
  titleUnderline: {
    height: 3,
    width: 60,
    backgroundColor: '#3b82f6',
    marginTop: 15,
    borderRadius: 2,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  subtitleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  textBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  itemText: {
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 26,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
    opacity: 0.95,
    fontFamily: 'System',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
  },
});