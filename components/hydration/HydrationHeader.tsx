import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Flame, History, Settings } from "lucide-react-native";
import { useRouter } from "expo-router";

interface HydrationHeaderProps {
  streak: number;
}

const HydrationHeader: React.FC<HydrationHeaderProps> = ({ streak }) => {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

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
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Flame size={10} color="#f97316" fill="#f97316" />
                </Animated.View>
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
