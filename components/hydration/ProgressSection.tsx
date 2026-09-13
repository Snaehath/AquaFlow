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
  dailyReference?: number;
  effectiveGoal?: number;
  completedBottles: number;
  onAdd: (amount: number) => void;
  onReset: () => void;
  hintStyle: any;
}

const getIntradayPacing = (): { text: string; bg: string; textCol: string } => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return { text: "Morning · A few gentle sips", bg: "bg-sky-50 border-sky-100", textCol: "text-sky-700" };
  } else if (currentHour < 17) {
    return { text: "Afternoon · A little water whenever you're ready", bg: "bg-cyan-50 border-cyan-100", textCol: "text-cyan-800" };
  } else if (currentHour < 21) {
    return { text: "Evening · Gentle sips as your day winds down", bg: "bg-indigo-50 border-indigo-100", textCol: "text-indigo-700" };
  } else {
    return { text: "Night · Light sips before sleep", bg: "bg-purple-50 border-purple-100", textCol: "text-purple-700" };
  }
};

const ProgressSection: React.FC<ProgressSectionProps> = ({
  progress,
  lastBeverageType,
  actualIntake,
  dailyReference,
  effectiveGoal,
  completedBottles,
  onAdd,
  onReset,
  hintStyle,
}) => {
  const pacing = getIntradayPacing();
  const refValue = dailyReference ?? effectiveGoal ?? 2500;

  const formattedIntake =
    actualIntake >= 1000
      ? `${(actualIntake / 1000).toFixed(actualIntake % 100 === 0 ? 1 : 2)} L`
      : `${actualIntake} ml`;

  const formattedRef = `~${(refValue / 1000).toFixed(1)} L`;
  
  // Note: remainder represents volume consumed beyond completed reference bottles (+X ml), NOT volume remaining to drink
  const remainder = actualIntake % refValue;

  const bottleText =
    completedBottles === 0
      ? `1st bottle · ${Math.round(progress * 100)}%`
      : `${completedBottles} ${
          completedBottles === 1 ? "bottle" : "bottles"
        }${remainder > 0 ? ` · +${remainder} ml` : ""}`;


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
        <View className="flex-row items-baseline">
          <Text className="text-sky-950 text-4xl font-black">
            {formattedIntake}
          </Text>
          <Text className="text-sky-400 text-xs font-bold ml-1.5 uppercase tracking-wider">
            today
          </Text>
        </View>

        <Text className="text-sky-500/80 text-xs font-medium mt-0.5">
          Daily reference · {formattedRef}
        </Text>

        <View className="flex-row items-center mt-2.5 gap-2">
          <View className="flex-row items-center bg-sky-100/60 px-3 py-1.5 rounded-full">
            <Droplets size={13} color="#0ea5e9" />
            <Text className="text-sky-900 text-[10px] font-bold ml-1.5">
              {bottleText}
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


