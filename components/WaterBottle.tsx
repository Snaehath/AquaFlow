import { BEVERAGES, BeverageType } from "../constants/beverages";
import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

type Props = {
  progress: number;
  size?: number;
  beverageType?: BeverageType;
};

const AnimatedG = Animated.createAnimatedComponent(G);

const WaterBottle = ({ progress, size = 300, beverageType = "water" }: Props) => {
  // 1. Idle Wave Animation
  const waveAnim = useRef(new Animated.Value(0)).current;
  // 2. Fill Level Animation
  const fillAnim = useRef(new Animated.Value(progress)).current;
  // 3. Impact/Add Animation (Scale & Pulse)
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Get color from constants
  const beverageConfig = BEVERAGES[beverageType] || BEVERAGES.water;
  const liquidColor = beverageConfig.color;

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
    // Trigger "Add" Animation sequence
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
            <Stop offset="0" stopColor={liquidColor} stopOpacity="0.8" />
            <Stop offset="1" stopColor={liquidColor} stopOpacity="1" />
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
