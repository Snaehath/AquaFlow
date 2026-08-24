import React from "react";
import { View, Text, Pressable } from "react-native";
import { Droplets, Flame, Compass } from "lucide-react-native";
import Animated from "react-native-reanimated";
import WaterBottle from "../WaterBottle";
import { BeverageType } from "../../constants/beverages";
import { hapticLight } from "@/utils/haptics";

interface ProgressSectionProps {
  progress: number;
  lastBeverageType: BeverageType;
  actualIntake: number;
  effectiveGoal: number;
  completedBottles: number;
  onAdd: (amount: number) => void;
  onReset: () => void;
  hintStyle: any;
}

const getIntradayPacing = (intakeRatio: number): { text: string; bg: string; textCol: string } => {
  const currentHour = new Date().getHours();
  if (intakeRatio >= 1.0) {
    return { text: "Daily Goal Smashed! 🏆 Keep flowing", bg: "bg-emerald-50 border-emerald-200/80", textCol: "text-emerald-700" };
  }
  if (currentHour < 12) {
    return { text: "Morning Pace: Aim for ~35% by noon 🌅", bg: "bg-sky-50 border-sky-100", textCol: "text-sky-700" };
  } else if (currentHour < 17) {
    return { text: "Afternoon Boost: 65% suggested by 5 PM ⚡", bg: "bg-cyan-50 border-cyan-100", textCol: "text-cyan-800" };
  } else if (currentHour < 21) {
    return { text: "Evening Flow: Gentle sips to reach goal 🌙", bg: "bg-indigo-50 border-indigo-100", textCol: "text-indigo-700" };
  } else {
    return { text: "Night Wind-down: Light sips before sleep 💤", bg: "bg-purple-50 border-purple-100", textCol: "text-purple-700" };
  }
};

const ProgressSection: React.FC<ProgressSectionProps> = ({
  progress,
  lastBeverageType,
  actualIntake,
  effectiveGoal,
  completedBottles,
  onAdd,
  onReset,
  hintStyle,
}) => {
  const pacing = getIntradayPacing(actualIntake / Math.max(effectiveGoal, 1));

  return (
    <View className="items-center py-2">
      <Pressable
        onPress={() => onAdd(250)}
        style={({ pressed }) => [
          { transform: [{ scale: pressed ? 0.95 : 1 }] },
        ]}
      >
        <WaterBottle
          progress={progress}
          size={220}
          beverageType={lastBeverageType}
        />
      </Pressable>

      <Animated.View
        style={hintStyle}
        className="flex-row items-center mt-1 mb-1"
      >
        <Droplets size={12} color="#0ea5e9" />
        <Text className="text-sky-400 text-xs font-bold ml-1">
          Tap the bottle to log 250ml
        </Text>
      </Animated.View>

      <Pressable
        onLongPress={onReset}
        onPressIn={() => {
          hapticLight();
        }}
        style={({ pressed }) => [
          { transform: [{ scale: pressed ? 0.94 : 1 }] },
        ]}
        className="items-center mt-1"
      >
        <Text className="text-sky-950 text-4xl font-black">
          {actualIntake > 0 && actualIntake % effectiveGoal === 0
            ? effectiveGoal
            : actualIntake % effectiveGoal}
          <Text className="text-lg text-sky-300 font-medium">
            {" "}
            / {effectiveGoal} ml
          </Text>
        </Text>

        <View className="flex-row items-center mt-2 gap-2">
          <View className="flex-row items-center bg-sky-100/60 px-3 py-1.5 rounded-full">
            <Flame size={13} color="#0ea5e9" fill="#0ea5e9" />
            <Text className="text-sky-900 text-[10px] font-bold ml-1.5">
              {completedBottles} Bottles
            </Text>
          </View>
          <View className={`px-3 py-1.5 rounded-full border ${pacing.bg}`}>
            <Text className={`text-[10px] font-black ${pacing.textCol}`}>
              {pacing.text}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default React.memo(ProgressSection);


