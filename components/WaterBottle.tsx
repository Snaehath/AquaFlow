import { BEVERAGES } from "../constants";
import { BeverageType } from "../types";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

const interpolateColorJS = (color1: string, color2: string, factor: number) => {
  const c1 = color1.startsWith("#") ? color1 : "#38bdf8";
  const c2 = color2.startsWith("#") ? color2 : "#38bdf8";

  const r1 = parseInt(c1.substring(1, 3), 16);
  const g1 = parseInt(c1.substring(3, 5), 16);
  const b1 = parseInt(c1.substring(5, 7), 16);

  const r2 = parseInt(c2.substring(1, 3), 16);
  const g2 = parseInt(c2.substring(3, 5), 16);
  const b2 = parseInt(c2.substring(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  const rh = r.toString(16).padStart(2, "0");
  const gh = g.toString(16).padStart(2, "0");
  const bh = b.toString(16).padStart(2, "0");

  return `#${rh}${gh}${bh}`;
};

type Props = {
  progress: number;
  size?: number;
  beverageType?: BeverageType;
};

const AnimatedG = Animated.createAnimatedComponent(G);

// Bottle Geometry Constants for viewBox="0 0 100 200"
const BOTTLE_WIDTH = 100;
const BOTTLE_HEIGHT = 200;

const BOTTLE_PATH = `
  M ${BOTTLE_WIDTH * 0.22} ${BOTTLE_HEIGHT * 0.05}
  C ${BOTTLE_WIDTH * 0.22} ${BOTTLE_HEIGHT * 0.02}, ${BOTTLE_WIDTH * 0.78} ${BOTTLE_HEIGHT * 0.02}, ${BOTTLE_WIDTH * 0.78} ${BOTTLE_HEIGHT * 0.05}
  L ${BOTTLE_WIDTH * 0.78} ${BOTTLE_HEIGHT * 0.14}
  C ${BOTTLE_WIDTH * 0.9} ${BOTTLE_HEIGHT * 0.19}, ${BOTTLE_WIDTH * 0.94} ${BOTTLE_HEIGHT * 0.24}, ${BOTTLE_WIDTH * 0.94} ${BOTTLE_HEIGHT * 0.3}
  L ${BOTTLE_WIDTH * 0.94} ${BOTTLE_HEIGHT * 0.86}
  C ${BOTTLE_WIDTH * 0.94} ${BOTTLE_HEIGHT * 0.96}, ${BOTTLE_WIDTH * 0.06} ${BOTTLE_HEIGHT * 0.96}, ${BOTTLE_WIDTH * 0.06} ${BOTTLE_HEIGHT * 0.86}
  L ${BOTTLE_WIDTH * 0.06} ${BOTTLE_HEIGHT * 0.3}
  C ${BOTTLE_WIDTH * 0.06} ${BOTTLE_HEIGHT * 0.24}, ${BOTTLE_WIDTH * 0.1} ${BOTTLE_HEIGHT * 0.19}, ${BOTTLE_WIDTH * 0.22} ${BOTTLE_HEIGHT * 0.14}
  Z
`;

const WaterBottleComponent = ({
  progress,
  size = 300,
  beverageType = "water",
}: Props) => {
  // Dual-Wave Animations
  const waveAnimPrimary = useRef(new Animated.Value(0)).current;
  const waveAnimSecondary = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(progress)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Refs
  const prevProgressRef = useRef(progress);

  // Config
  const beverageConfig = BEVERAGES[beverageType] || BEVERAGES.water;
  const liquidColor = beverageConfig.color;

  // State
  const [currentColor, setCurrentColor] = useState(liquidColor);
  const prevColorRef = useRef(liquidColor);

  // Effects: Liquid Color Morphing
  useEffect(() => {
    if (liquidColor !== prevColorRef.current) {
      const startColor = prevColorRef.current;
      const endColor = liquidColor;
      prevColorRef.current = liquidColor;

      let start: number | null = null;
      const duration = 400;

      let animationFrameId: number;

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const p = Math.min(elapsed / duration, 1);

        setCurrentColor(interpolateColorJS(startColor, endColor, p));

        if (p < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [liquidColor]);

  // Effects: Continuous Dual Wave Physics
  useEffect(() => {
    // Primary foreground wave loop
    Animated.loop(
      Animated.timing(waveAnimPrimary, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    // Secondary background wave loop (different tempo & reverse crest)
    Animated.loop(
      Animated.timing(waveAnimSecondary, {
        toValue: 1,
        duration: 4600,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();
  }, [waveAnimPrimary, waveAnimSecondary]);

  // Effects: Dynamic Fill Transition & Impact Spring
  useEffect(() => {
    const prevProgress = prevProgressRef.current;
    prevProgressRef.current = progress;

    const isOverflow =
      prevProgress > 0 && progress < prevProgress && progress !== 0;

    if (isOverflow) {
      // Bottle completion sequence
      Animated.sequence([
        Animated.timing(fillAnim, {
          toValue: 1.0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.delay(900),
        Animated.timing(fillAnim, {
          toValue: progress,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start();

      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.spring(pulseAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fillAnim, {
          toValue: progress,
          duration: 1100,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 140,
            useNativeDriver: true,
          }),
          Animated.spring(pulseAnim, {
            toValue: 1,
            friction: 4,
            tension: 45,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [progress, fillAnim, pulseAnim]);

  const translateY = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [180, 16],
  });

  const translateXPrimary = waveAnimPrimary.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const translateXSecondary = waveAnimSecondary.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: pulseAnim }],
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 100 200">
        <Defs>
          {/* Main Fluid Gradient */}
          <LinearGradient id="waterGradFront" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={currentColor} stopOpacity="0.9" />
            <Stop offset="0.7" stopColor={currentColor} stopOpacity="1" />
            <Stop offset="1" stopColor={currentColor} stopOpacity="1" />
          </LinearGradient>

          {/* Secondary Back Wave Gradient (Depth layer) */}
          <LinearGradient id="waterGradBack" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={currentColor} stopOpacity="0.45" />
            <Stop offset="1" stopColor={currentColor} stopOpacity="0.7" />
          </LinearGradient>

          {/* Glass Specular Highlights */}
          <LinearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#ffffff" stopOpacity="0.4" />
            <Stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
            <Stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
          </LinearGradient>

          <ClipPath id="bottleClip">
            <Path d={BOTTLE_PATH} />
          </ClipPath>
        </Defs>

        {/* 1. Bottle Glass Outer Shell */}
        <Path
          d={BOTTLE_PATH}
          fill="rgba(240, 249, 255, 0.45)"
          stroke="#bae6fd"
          strokeWidth="1.8"
        />

        {/* 2. Etched Measurement Ticks (Left Edge) */}
        <Path
          d="M 12 140 H 18 M 12 100 H 22 M 12 60 H 18"
          stroke="#7dd3fc"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* 3. Multi-Layer Liquid Flow */}
        <G clipPath="url(#bottleClip)">
          {/* Layer A: Back/Secondary Wave (Depth Layer) */}
          <AnimatedG y={translateY} x={translateXSecondary}>
            <Path
              d="M0 12 Q25 22 50 12 T100 12 T150 12 T200 12 V300 H0 Z"
              fill="url(#waterGradBack)"
            />
          </AnimatedG>

          {/* Layer B: Front/Primary Wave (Rich Fluid Surface) */}
          <AnimatedG y={translateY} x={translateXPrimary}>
            <Path
              d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 V300 H0 Z"
              fill="url(#waterGradFront)"
            />
          </AnimatedG>
        </G>

        {/* 4. Glass Reflection & Sheen Overlays */}
        <Path
          d="M80 65 V150"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.35"
        />
        <Path
          d="M20 75 V140"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* 5. Bottle Cap / Rim Accent */}
        <Path
          d={`M ${BOTTLE_WIDTH * 0.28} ${BOTTLE_HEIGHT * 0.03} H ${BOTTLE_WIDTH * 0.72}`}
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </Svg>
    </Animated.View>
  );
};

export default React.memo(WaterBottleComponent);


