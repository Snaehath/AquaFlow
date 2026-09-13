import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const DROPLET_COUNT = 24;
const DROPLET_COLORS = [
  "#38bdf8", // sky-400
  "#0ea5e9", // sky-500
  "#0284c7", // sky-600
  "#7dd3fc", // sky-300
  "#06b6d4", // cyan-500
  "#22d3ee", // cyan-400
];

interface DropletPieceProps {
  index: number;
}

const DropletPiece: React.FC<DropletPieceProps> = ({ index }) => {
  // Spawn around horizontal center with slight spread
  const startX = SCREEN_WIDTH * 0.5 + (Math.random() - 0.5) * (SCREEN_WIDTH * 0.7);
  const startY = SCREEN_HEIGHT * 0.42 + (Math.random() - 0.5) * 80;
  const size = Math.random() * 6 + 6; // 6 to 12px
  const color = DROPLET_COLORS[index % DROPLET_COLORS.length];

  // Random trajectory: gentle upward drift, slight horizontal float
  const targetX = startX + (Math.random() - 0.5) * 120;
  const targetY = startY - (Math.random() * 90 + 40);

  const xVal = useSharedValue(startX);
  const yVal = useSharedValue(startY);
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    const duration = Math.random() * 300 + 600; // 600ms to 900ms
    const delay = Math.random() * 150;

    xVal.value = withDelay(
      delay,
      withTiming(targetX, { duration, easing: Easing.out(Easing.quad) })
    );

    yVal.value = withDelay(
      delay,
      withTiming(targetY, { duration, easing: Easing.out(Easing.quad) })
    );

    scale.value = withDelay(
      delay,
      withTiming(1, { duration: duration * 0.4, easing: Easing.out(Easing.back(1.2)) })
    );

    opacity.value = withDelay(
      delay + duration * 0.45,
      withTiming(0, { duration: duration * 0.55, easing: Easing.in(Easing.quad) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: xVal.value },
        { translateY: yVal.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.droplet,
        animatedStyle,
        {
          width: size,
          height: size * 1.25,
          backgroundColor: color,
          borderRadius: size / 2,
          borderTopLeftRadius: size * 0.15,
          borderTopRightRadius: size * 0.15,
        },
      ]}
    />
  );
};

export const WaterDropletBurst: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: DROPLET_COUNT }).map((_, index) => (
        <DropletPiece key={index} index={index} />
      ))}
    </View>
  );
};

export const Confetti = WaterDropletBurst;

const styles = StyleSheet.create({
  droplet: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
  },
});

export default WaterDropletBurst;

