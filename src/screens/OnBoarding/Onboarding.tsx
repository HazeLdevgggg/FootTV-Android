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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RenderItem = ({
  item,
  index,
  x,
}: {
  item: Data;
  index: number;
  x: SharedValue<number>;
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const { darkMode } = useContext(ThemeContext);

  // Calculer des tailles adaptatives
  const isSmallScreen = SCREEN_WIDTH < 375;
  const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
  const isLargeScreen = SCREEN_WIDTH >= 414;
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
      [50, 0, 50],
      Extrapolate.CLAMP
    );

    const adjustedWidthMult = isSmallScreen ? WidthMult * 0.95 : isMediumScreen ? WidthMult * 1.0 : WidthMult * 1.05;
    const adjustedHeightMult = isSmallScreen ? HeightMult * 0.95 : isMediumScreen ? HeightMult * 1.0 : HeightMult * 1.05;

    return {
      width: SCREEN_WIDTH * adjustedWidthMult,
      height: SCREEN_HEIGHT * adjustedHeightMult,
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
      [30, 0, 30], // Réduit l'animation
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
      [20, 0, 20], // Réduit l'animation
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
      [15, 0, 15], // Réduit l'animation
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY: translateYAnimation }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <View style={[styles.imageContainer,{ marginTop: SCREEN_HEIGHT * 0.1 }]}>
        <Animated.Image
          resizeMode="contain"
          source={item.image}
          style={
            [item.image === require('../../assets/logoNoMadeIn.png')
              ? imageAnimatedStyle(0.45, 0.9)
              : item.image === require('../../assets/OnBoarding/image2.png')
                ? imageAnimatedStyle(0.5, 0.9)
                : imageAnimatedStyle(0.6, 1)]
          }
        />
      </View>

      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        {/* Titre */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={[
            styles.itemTitle,
            {
              color: AppConfig.MainTextColor(darkMode),
              fontSize: isSmallScreen ? 28 : isMediumScreen ? 32 : 36
            }
          ]}>
            {item.title}
          </Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        {/* Sous-titre */}
        <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
          <View style={[styles.textBackground, { backgroundColor: AppConfig.BackGroundButton(darkMode) }]}>
            <Text style={[
              styles.itemText,
              { fontSize: isSmallScreen ? 15 : isMediumScreen ? 16 : 17 }
            ]}>
              {item.text}
            </Text>
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
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.top  }]}>
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
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
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
    justifyContent: 'center',
    paddingVertical: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '50%',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    maxHeight: '45%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  itemTitle: {
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -1.2,
    fontFamily: 'System',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleUnderline: {
    height: 3,
    width: 50,
    backgroundColor: '#3b82f6',
    marginTop: 12,
    borderRadius: 2,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  textBackground: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemText: {
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.3,
    opacity: 0.95,
    fontFamily: 'System',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    paddingHorizontal: 10,
  },
});