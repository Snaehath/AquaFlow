import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withRepeat,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Lightweight count for a delicate, uncluttered celebration
const CONFETTI_COUNT = 32;

// Soft, harmonious pastel and jewel tones
const COLORS = [
  "#38bdf8", // sky
  "#0ea5e9", // ocean
  "#22d3ee", // cyan
  "#34d399", // soft mint
  "#fbbf24", // warm gold
  "#f472b6", // soft rose
  "#818cf8", // soft lavender
];

interface ConfettiPieceProps {
  index: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index }) => {
  const startX = Math.random() * SCREEN_WIDTH;
  const size = Math.random() * 4 + 5; // 5px to 9px
  const color = COLORS[index % COLORS.length];
  const isRound = Math.random() > 0.4;
  const drift = (Math.random() - 0.5) * 60; // gentle horizontal drift

  const yVal = useSharedValue(-20);
  const xVal = useSharedValue(startX);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0.95);

  useEffect(() => {
    const duration = Math.random() * 800 + 2200; // 2.2s to 3.0s
    const delay = Math.random() * 400;

    // Smooth descent across screen
    yVal.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 30, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    // Subtle horizontal drift
    xVal.value = withDelay(
      delay,
      withTiming(startX + drift, {
        duration,
        easing: Easing.inOut(Easing.quad),
      })
    );

    // Soft fade near the bottom
    opacity.value = withDelay(
      delay + duration * 0.65,
      withTiming(0, { duration: duration * 0.35 })
    );

    // Gentle tumbling rotation
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, {
          duration: Math.random() * 800 + 1200,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: yVal.value },
      { translateX: xVal.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        animatedStyle,
        {
          width: size,
          height: isRound ? size : size * 1.3,
          backgroundColor: color,
          borderRadius: isRound ? size / 2 : 2,
        },
      ]}
    />
  );
};

export const Confetti: React.FC = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {Array.from({ length: CONFETTI_COUNT }).map((_, index) => (
      <ConfettiPiece key={index} index={index} />
    ))}
  </View>
);

export const WaterDropletBurst = Confetti;

const styles = StyleSheet.create({
  piece: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
  },
});

export default React.memo(Confetti);



