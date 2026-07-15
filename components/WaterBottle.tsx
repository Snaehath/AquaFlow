import { BEVERAGES, BeverageType } from "../constants/beverages";
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

  const rh = r.toString(16).padStart(2, '0');
  const gh = g.toString(16).padStart(2, '0');
  const bh = b.toString(16).padStart(2, '0');

  return `#${rh}${gh}${bh}`;
};

type Props = {
  progress: number;
  size?: number;
  beverageType?: BeverageType;
};

const AnimatedG = Animated.createAnimatedComponent(G);

const WaterBottle = ({ progress, size = 300, beverageType = "water" }: Props) => {
  // Animations
  const waveAnim = useRef(new Animated.Value(0)).current;
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

  // Effects
  useEffect(() => {
    if (liquidColor !== prevColorRef.current) {
      const startColor = prevColorRef.current;
      const endColor = liquidColor;
      prevColorRef.current = liquidColor;

      let start: number | null = null;
      const duration = 400; // 400ms

      let animationFrameId: number;

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        
        setCurrentColor(interpolateColorJS(startColor, endColor, progress));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [liquidColor]);

  useEffect(() => {
    // Loop the idle wave
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();
  }, [waveAnim]);

  useEffect(() => {
    const prevProgress = prevProgressRef.current;
    prevProgressRef.current = progress;

    // Detect bottle completion overflow
    const isOverflow = prevProgress > 0 && progress < prevProgress && progress !== 0;

    if (isOverflow) {
      // Animation sequence: fill to top, hold, then fall to new level
      Animated.sequence([
        Animated.timing(fillAnim, {
          toValue: 1.0,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.delay(1000),
        Animated.timing(fillAnim, {
          toValue: progress,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start();

      // Trigger the "Impact" pulse
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 150,
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
      // Standard animation
      Animated.parallel([
        // Animate the fill level
        Animated.timing(fillAnim, {
          toValue: progress,
          duration: 1200,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }),
        // Trigger the "Impact" pulse
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(pulseAnim, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [progress, fillAnim, pulseAnim]);

  const translateY = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [185, 40],
  });

  const translateX = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  // Bottle Geometry Constants for viewBox="0 0 100 200"
  const width = 100;
  const height = 200;

  const bottlePath = `
  M ${width * 0.2} ${height * 0.05}
  C ${width * 0.2} ${height * 0.02}, ${width * 0.8} ${height * 0.02}, ${width * 0.8} ${height * 0.05}
  L ${width * 0.8} ${height * 0.15}
  C ${width * 0.9} ${height * 0.2}, ${width * 0.95} ${height * 0.25}, ${width * 0.95} ${height * 0.3}
  L ${width * 0.95} ${height * 0.85}
  C ${width * 0.95} ${height * 0.95}, ${width * 0.05} ${height * 0.95}, ${width * 0.05} ${height * 0.85}
  L ${width * 0.05} ${height * 0.3}
  C ${width * 0.05} ${height * 0.25}, ${width * 0.1} ${height * 0.2}, ${width * 0.2} ${height * 0.15}
  Z
`;
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
          <LinearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={currentColor} stopOpacity="0.8" />
            <Stop offset="1" stopColor={currentColor} stopOpacity="1" />
          </LinearGradient>

          <ClipPath id="bottleClip">
            <Path d={bottlePath} />
          </ClipPath>
        </Defs>

        {/* 1. Bottle Glass */}
        <Path
          d={bottlePath}
          fill="rgba(255, 255, 255, 0.4)"
          stroke="#bae6fd"
          strokeWidth="1.5"
        />

        {/* 2. Liquid Flow */}
        <G clipPath="url(#bottleClip)">
          <AnimatedG
            y={translateY}
            x={translateX}
          >
            <Path
              d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 V300 H0 Z"
              fill="url(#waterGrad)"
            />
          </AnimatedG>
        </G>

        {/* 3. Shine Highlights */}
        <Path
          d="M82 70 V150"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.25"
        />
      </Svg>
    </Animated.View>
  );
};

export default WaterBottle;
