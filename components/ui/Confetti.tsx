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

// Concentric ripple ring
const RippleRing: React.FC<{ delay: number; size: number }> = ({ delay, size }) => {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withTiming(2.2, {
        duration: 1600,
        easing: Easing.out(Easing.cubic),
      })
    );
    opacity.value = withDelay(
      delay,
      withTiming(0, {
        duration: 1600,
        easing: Easing.out(Easing.quad),
      })
    );
  }, [delay, scale, opacity]);

  const style = useAnimatedStyle(() => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: "#38bdf8",
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    position: "absolute",
  }));

  return <Animated.View style={style} />;
};

// Subtle refraction droplet
const RefractionParticle: React.FC<{ angle: number; distance: number; delay: number }> = ({
  angle,
  distance,
  delay,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: 1200,
        easing: Easing.out(Easing.quad),
      })
    );
  }, [delay, progress]);

  const targetX = Math.cos(angle) * distance;
  const targetY = Math.sin(angle) * distance;

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      position: "absolute",
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "#0ea5e9",
      transform: [
        { translateX: targetX * p },
        { translateY: targetY * p },
        { scale: (1 - p * 0.4) },
      ],
      opacity: (1 - p) * 0.7,
    };
  });

  return <Animated.View style={style} />;
};

export const LiquidRefraction: React.FC = () => {
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    angle: (i / 12) * Math.PI * 2,
    distance: 70 + (i % 3) * 25,
    delay: (i % 4) * 60,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Concentric gentle water ripples */}
      <RippleRing delay={0} size={140} />
      <RippleRing delay={200} size={140} />
      <RippleRing delay={400} size={140} />

      {/* Gentle water refraction sparks */}
      {particles.map((p, idx) => (
        <RefractionParticle
          key={idx}
          angle={p.angle}
          distance={p.distance}
          delay={p.delay}
        />
      ))}
    </View>
  );
};

// Backward compatible export
export const Confetti = LiquidRefraction;
export const WaterDropletBurst = LiquidRefraction;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
});

export default React.memo(LiquidRefraction);
