import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { Thermometer, Sun } from "lucide-react-native";
import { WeatherState, UserProfile } from "@/types";

interface WeatherCardProps {
  weather: WeatherState | null;
  profile: UserProfile | null;
}

const getConditionNote = (tempF?: number): string => {
  if (!tempF) return "Standard climate conditions";
  if (tempF > 85) return "Warm day outside";
  if (tempF > 75) return "Pleasant and warm outside";
  if (tempF < 50) return "Cool weather outside";
  return "Mild day outside";
};

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, profile }) => {
  const isCelsius = profile?.tempUnit === "C";
  const tempUnit = isCelsius ? "°C" : "°F";
  const displayTemp = weather?.temp
    ? isCelsius
      ? Math.round(((weather.temp - 32) * 5) / 9)
      : Math.round(weather.temp)
    : "--";

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const isWarm = weather?.temp ? weather.temp > 80 : false;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="flex-row items-center px-4 py-3.5 rounded-3xl mb-3 border border-sky-100/80 bg-white/90 shadow-xs"
    >
      <View className="flex-1 flex-row items-center">
        <View className="w-10 h-10 rounded-2xl items-center justify-center mr-3 bg-sky-50">
          {isWarm ? (
            <Sun size={20} color="#0284c7" />
          ) : (
            <Thermometer size={20} color="#0284c7" />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-sky-950 font-black text-sm">
            {weather?.city ?? "Local Climate"}
          </Text>
          <Text className="text-sky-500 text-[11px] font-medium mt-0.5">
            {getConditionNote(weather?.temp)}
          </Text>
        </View>
      </View>
      <View className="items-end pl-2">
        <Text className="text-xl font-black text-sky-950">
          {displayTemp}
          {tempUnit}
        </Text>
      </View>
    </Animated.View>
  );
};

export default React.memo(WeatherCard);
