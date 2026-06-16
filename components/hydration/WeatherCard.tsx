import React from "react";
import { View, Text } from "react-native";
import { Thermometer } from "lucide-react-native";
import { WeatherState, UserProfile } from "@/types";

interface WeatherCardProps {
  weather: WeatherState | null;
  profile: UserProfile | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, profile }) => {
  const isHeatwave = (weather?.multiplier ?? 1) > 1;
  const isCelsius = profile?.tempUnit === "C";
  const tempUnit = isCelsius ? "°C" : "°F";
  const displayTemp = weather?.temp
    ? isCelsius
      ? Math.round(((weather.temp - 32) * 5) / 9)
      : Math.round(weather.temp)
    : "--";

  return (
    <View className="flex-row items-center bg-white/80 px-4 py-3 rounded-3xl mb-2 border border-sky-100 shadow-sm">
      <View className="flex-1 flex-row items-center">
        <Thermometer size={20} color={isHeatwave ? "#f59e0b" : "#0ea5e9"} />
        <View className="ml-3">
          <Text className="text-sky-900 font-bold text-sm">
            {weather?.city ?? "Local Environment"}
          </Text>
          <Text className="text-sky-500 text-[10px] font-medium">
            {isHeatwave
              ? "Increased goal due to heat"
              : "Standard goal for current weather"}
          </Text>
        </View>
      </View>
      <Text className="text-sky-950 font-black text-lg">
        {displayTemp}
        {tempUnit}
      </Text>
    </View>
  );
};

export default WeatherCard;
