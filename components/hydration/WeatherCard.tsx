import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { Thermometer, Flame } from "lucide-react-native";
import { WeatherState, UserProfile } from "@/types";

interface WeatherCardProps {
  weather: WeatherState | null;
  profile: UserProfile | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, profile }) => {
  const multiplier = weather?.multiplier ?? 1;
  const isHeatwave = multiplier > 1.0;
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

  const percentageBoost = Math.round((multiplier - 1) * 100);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className={`flex-row items-center px-4 py-3.5 rounded-3xl mb-2 border shadow-sm ${
        isHeatwave
          ? "bg-amber-50/90 border-amber-200/80"
          : "bg-white/80 border-sky-100"
      }`}
    >
      <View className="flex-1 flex-row items-center">
        <View
          className={`w-10 h-10 rounded-2xl items-center justify-center mr-3 ${
            isHeatwave ? "bg-amber-100" : "bg-sky-50"
          }`}
        >
          {isHeatwave ? (
            <Flame size={20} color="#d97706" />
          ) : (
            <Thermometer size={20} color="#0ea5e9" />
          )}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-sky-950 font-black text-sm">
              {weather?.city ?? "Local Climate"}
            </Text>
            {isHeatwave && (
              <View className="bg-amber-500/15 px-2 py-0.5 rounded-full ml-2">
                <Text className="text-amber-700 text-[9px] font-black uppercase tracking-tight">
                  +{percentageBoost}% Heat Boost
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sky-500/90 text-[11px] font-semibold mt-0.5">
            {isHeatwave
              ? "Goal boosted automatically for heat hydration"
              : "Standard hydration for climate"}
          </Text>
        </View>
      </View>
      <View className="items-end pl-2">
        <Text
          className={`text-xl font-black ${
            isHeatwave ? "text-amber-600" : "text-sky-950"
          }`}
        >
          {displayTemp}
          {tempUnit}
        </Text>
      </View>
    </Animated.View>
  );
};

export default React.memo(WeatherCard);


