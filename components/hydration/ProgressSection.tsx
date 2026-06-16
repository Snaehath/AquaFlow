import React from "react";
import { View, Text, Pressable } from "react-native";
import { Droplets, Flame } from "lucide-react-native";
import Animated from "react-native-reanimated";
import WaterBottle from "../WaterBottle";
import { BeverageType } from "../../constants/beverages";

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

        <View className="flex-row mt-2">
          <View className="flex-row items-center bg-sky-100/50 px-3 py-1.5 rounded-full mr-2">
            <Flame size={14} color="#0ea5e9" fill="#0ea5e9" />
            <Text className="text-sky-900 text-[10px] font-bold ml-2">
              {completedBottles} Bottles
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ProgressSection;
