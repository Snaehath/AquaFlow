import { useHydrationStore } from "@/store/hydrationStore";
import { hapticLight } from "@/utils/haptics";
import { useRouter } from "expo-router";
import { Flame, History, Settings, Sparkles, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";

interface HydrationHeaderProps {
  streak: number;
}

const getMotivation = (streak: number): string => {
  if (streak <= 1)
    return "Start strong! Every drop counts toward your healthy habit.";
  if (streak < 3)
    return "Consistency is building! Keep the momentum alive today.";
  if (streak < 7)
    return "Incredible flow! You're creating an unbreakable routine.";
  if (streak < 14)
    return "Champion tier! Your body is loving this healthy streak.";
  return "Legendary hydrator! You've mastered daily water intake.";
};

const HydrationHeader: React.FC<HydrationHeaderProps> = ({ streak }) => {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showStreakModal, setShowStreakModal] = useState(false);
  const longestStreak = useHydrationStore((s) => s.longestStreak) || streak;

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
      ]),
    ).start();
  }, [pulseAnim]);

  const openStreakModal = () => {
    hapticLight();
    setShowStreakModal(true);
  };

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
              <Pressable
                onPress={openStreakModal}
                style={({ pressed }) => [
                  { transform: [{ scale: pressed ? 0.94 : 1 }] },
                ]}
                className="bg-orange-100 px-2.5 py-0.5 rounded-full ml-2 flex-row items-center active:bg-orange-200"
              >
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Flame size={11} color="#f97316" fill="#f97316" />
                </Animated.View>
                <Text className="text-orange-600 text-[10px] font-black ml-1">
                  {streak} DAY STREAK
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
      <View className="flex-row">
        <Pressable
          onPress={() => router.push("/history")}
          className="ml-2 p-2 bg-white/80 rounded-full border border-sky-100 shadow-sm active:bg-sky-50"
        >
          <History size={18} color="#0ea5e9" />
        </Pressable>
        <Pressable
          onPress={() => router.push("/settings")}
          className="ml-2 p-2 bg-white/80 rounded-full border border-sky-100 shadow-sm active:bg-sky-50"
        >
          <Settings size={18} color="#0ea5e9" />
        </Pressable>
      </View>

      {/* Streak Status & Motivation Modal */}
      <Modal
        visible={showStreakModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStreakModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40 px-6">
          <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl border border-sky-100">
            {/* Header / Dismiss */}
            <View className="w-full flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="bg-orange-100 p-2 rounded-xl mr-2.5">
                  <Flame size={20} color="#ea580c" fill="#ea580c" />
                </View>
                <Text className="text-sky-950 font-black text-lg">
                  Streak Health
                </Text>
              </View>
              <Pressable
                onPress={() => setShowStreakModal(false)}
                className="p-2 bg-sky-50 rounded-full active:bg-sky-100"
              >
                <X size={16} color="#0284c7" />
              </Pressable>
            </View>

            {/* Streak Metrics Cards */}
            <View className="flex-row gap-3 w-full my-3">
              <View className="flex-1 bg-orange-50 border border-orange-200/70 p-4 rounded-2xl items-center">
                <Text className="text-orange-500 text-[10px] font-black uppercase tracking-wider">
                  Current Streak
                </Text>
                <Text className="text-orange-600 text-3xl font-black mt-1">
                  {streak} <Text className="text-sm font-bold">Days</Text>
                </Text>
              </View>

              <View className="flex-1 bg-sky-50 border border-sky-200/70 p-4 rounded-2xl items-center">
                <Text className="text-sky-500 text-[10px] font-black uppercase tracking-wider">
                  Best Record
                </Text>
                <Text className="text-sky-700 text-3xl font-black mt-1">
                  {longestStreak}{" "}
                  <Text className="text-sm font-bold">Days</Text>
                </Text>
              </View>
            </View>

            {/* Daily Consistency Motivation */}
            <View className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 w-full mt-2">
              <View className="flex-row items-center mb-1">
                <Sparkles size={14} color="#0284c7" />
                <Text className="text-sky-950 font-black text-xs ml-1.5">
                  Daily Consistency
                </Text>
              </View>
              <Text className="text-sky-700 text-xs leading-5">
                {getMotivation(streak)}
              </Text>
            </View>

            {/* Confirmation CTA */}
            <Pressable
              onPress={() => setShowStreakModal(false)}
              className="bg-sky-500 active:bg-sky-600 py-3.5 px-6 rounded-2xl items-center justify-center w-full mt-5 shadow-sm"
            >
              <Text className="text-white font-black text-sm">
                Stay Hydrated
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(HydrationHeader);
