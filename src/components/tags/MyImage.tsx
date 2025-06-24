import React from "react";
import { Image } from "expo-image"; // Ensure this is correctly imported
import { ImageStyle, StyleProp, StyleSheet } from "react-native";

type MyImageProps = {
  source: string;
  style?: StyleProp<ImageStyle>;
  cachePolicy?: "disk" | "memory" | "none" | "memory-disk";
  contentFit?: "cover" | "contain" | "fill" | "scale-down" | "none";
  placeholder?: string;
};

const MyImage: React.FC<MyImageProps> = ({
  source,
  style,
  cachePolicy = "disk",
  contentFit = "cover",
  ...props
}) => {
  return (
    <Image
      source={source}
      style={[styles.defaultStyle, style]}
      cachePolicy={cachePolicy}
      contentFit={contentFit}
      placeholderContentFit="cover"
      transition={800}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    width: 100,
    height: 100,
  },
});

export default MyImage;
