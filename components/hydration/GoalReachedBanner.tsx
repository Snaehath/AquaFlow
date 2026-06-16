import React from "react";
import { View, Text } from "react-native";
import { Trophy, CheckCircle2 } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const GoalReachedBanner: React.FC = () => {
  return (
    <Animated.View
      entering={FadeIn}
      className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-3xl mb-6 flex-row items-center"
    >
      <View className="bg-teal-500 p-2 rounded-full mr-3">
        <Trophy size={16} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-teal-900 font-black">
          Hydration Goal Met!
        </Text>
        <Text className="text-teal-600 text-xs font-bold">
          You are Hydrated. Keep it up!
        </Text>
      </View>
      <CheckCircle2 size={20} color="#14b8a6" />
    </Animated.View>
  );
};

export default GoalReachedBanner;
