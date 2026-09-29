import React from "react";
import { View, Text } from "react-native";
import { Sun, Cloud } from "lucide-react-native";
import { WeatherState, UserProfile } from "@/types";

interface WeatherCardProps {
  weather: WeatherState | null;
  profile: UserProfile | null;
}

const getConditionNote = (tempF?: number): string => {
  if (!tempF) return "Mild outside";
  if (tempF > 85) return "Warm outside";
  if (tempF > 75) return "Pleasant outside";
  if (tempF < 50) return "Cool outside";
  return "Mild outside";
};

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, profile }) => {
  const isCelsius = profile?.tempUnit === "C";
  const tempUnit = isCelsius ? "°C" : "°F";
  const displayTemp = weather?.temp
    ? isCelsius
      ? Math.round(((weather.temp - 32) * 5) / 9)
      : Math.round(weather.temp)
    : null;

  if (!displayTemp && !weather?.city) {
    return null;
  }

  const isWarm = weather?.temp ? weather.temp > 75 : true;
  const condition = getConditionNote(weather?.temp);

  return (
    <View className="flex-row items-center justify-center py-1.5 my-1">
      {isWarm ? (
        <Sun size={13} color="#0284c7" />
      ) : (
        <Cloud size={13} color="#0284c7" />
      )}
      <Text className="text-sky-900/60 text-xs font-medium ml-1.5">
        {displayTemp !== null ? `${displayTemp}${tempUnit} · ` : ""}
        {condition}
        {weather?.city ? ` in ${weather.city}` : ""}
      </Text>
    </View>
  );
};

export default React.memo(WeatherCard);
