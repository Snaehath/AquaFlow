import React from "react";
import { View, Text, Pressable } from "react-native";
import { Droplets } from "lucide-react-native";
import Animated from "react-native-reanimated";
import WaterBottle from "../WaterBottle";
import { BeverageType } from "@/types";
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

const getIntradayPacing = (): { text: string; bg: string; textCol: string } => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return { text: "Morning: A few gentle sips 🌅", bg: "bg-sky-50 border-sky-100", textCol: "text-sky-700" };
  } else if (currentHour < 17) {
    return { text: "Afternoon: A small glass whenever you're ready ⚡", bg: "bg-cyan-50 border-cyan-100", textCol: "text-cyan-800" };
  } else if (currentHour < 21) {
    return { text: "Evening: Gentle sips as your day winds down 🌙", bg: "bg-indigo-50 border-indigo-100", textCol: "text-indigo-700" };
  } else {
    return { text: "Night: Light sips before sleep 💤", bg: "bg-purple-50 border-purple-100", textCol: "text-purple-700" };
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
  const pacing = getIntradayPacing();

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
          {actualIntake}
          <Text className="text-lg text-sky-400 font-medium">
            {" "}
            / {effectiveGoal} ml
          </Text>
        </Text>

        <View className="flex-row items-center mt-2 gap-2">
          <View className="flex-row items-center bg-sky-100/60 px-3 py-1.5 rounded-full">
            <Droplets size={13} color="#0ea5e9" />
            <Text className="text-sky-900 text-[10px] font-bold ml-1.5">
              {completedBottles} {completedBottles === 1 ? "Bottle" : "Bottles"}
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


