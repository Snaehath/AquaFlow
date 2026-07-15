import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CONFETTI_COUNT = 60;
const COLORS = [
  "#38bdf8", // sky-400
  "#0ea5e9", // sky-500
  "#0284c7", // sky-600
  "#3b82f6", // blue-500
  "#60a5fa", // blue-400
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#fb7185", // rose-400
];

interface ConfettiPieceProps {
  index: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index }) => {
  const startX = Math.random() * SCREEN_WIDTH;
  const size = Math.random() * 8 + 6; // random size between 6 and 14
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const isCircle = Math.random() > 0.5;

  const yVal = useSharedValue(-50);
  const xVal = useSharedValue(startX);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const duration = Math.random() * 2000 + 2500; // 2.5s to 4.5s fall duration
    const delay = Math.random() * 800; // random launch delay

    // Animations
    yVal.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 50, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    // Fade out
    opacity.value = withDelay(
      delay + duration * 0.7,
      withTiming(0, { duration: duration * 0.3 })
    );

    // Rotation
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: Math.random() * 1000 + 1000, easing: Easing.linear }),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: yVal.value },
        { translateX: xVal.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        animatedStyle,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: isCircle ? size / 2 : 2,
        },
      ]}
    />
  );
};

export const Confetti: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: CONFETTI_COUNT }).map((_, index) => (
        <ConfettiPiece key={index} index={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  piece: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
  },
});

export default Confetti;
