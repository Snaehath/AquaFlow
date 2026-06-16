import React from "react";
import { View, Text, Pressable } from "react-native";
import { Flame, History, Settings } from "lucide-react-native";
import { useRouter } from "expo-router";

interface HydrationHeaderProps {
  streak: number;
}

const HydrationHeader: React.FC<HydrationHeaderProps> = ({ streak }) => {
  const router = useRouter();

  return (
    <View className="py-4 flex-row justify-between items-start">
      <View className="flex-row items-center">
        <View>
          <Text className="text-sky-950 text-2xl font-black">AquaFlow</Text>
          <View className="flex-row items-center">
            <Text className="text-sky-600 text-xs font-bold uppercase tracking-tighter">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>
            {streak > 0 && (
              <View className="bg-orange-100 px-2 py-0.5 rounded-full ml-2 flex-row items-center">
                <Flame size={10} color="#f97316" fill="#f97316" />
                <Text className="text-orange-600 text-[10px] font-black ml-1">
                  {streak} DAY STREAK
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View className="flex-row">
        <Pressable
          onPress={() => router.push("/history")}
          className="ml-2 p-2 bg-white/80 rounded-full border border-sky-100 shadow-sm"
        >
          <History size={18} color="#0ea5e9" />
        </Pressable>
        <Pressable
          onPress={() => router.push("/settings")}
          className="ml-2 p-2 bg-white/80 rounded-full border border-sky-100 shadow-sm"
        >
          <Settings size={18} color="#0ea5e9" />
        </Pressable>
      </View>
    </View>
  );
};

export default HydrationHeader;
