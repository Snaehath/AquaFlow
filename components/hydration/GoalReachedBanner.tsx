import React from "react";
import { View, Text, Pressable } from "react-native";
import { Trophy, CheckCircle2, X } from "lucide-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface GoalReachedBannerProps {
  onDismiss?: () => void;
}

const GoalReachedBanner: React.FC<GoalReachedBannerProps> = ({ onDismiss }) => {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-3xl mb-4 flex-row items-center shadow-xs"
    >
      <View className="bg-emerald-500 p-2.5 rounded-2xl mr-3 shadow-xs">
        <Trophy size={18} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-emerald-950 font-black text-sm">
          Daily Goal Smashed! 🏆
        </Text>
        <Text className="text-emerald-600 text-xs font-semibold">
          You reached 100% hydration today!
        </Text>
      </View>
      {onDismiss ? (
        <Pressable
          onPress={onDismiss}
          className="p-2 bg-emerald-100/60 rounded-full active:bg-emerald-200 ml-2"
        >
          <X size={14} color="#059669" />
        </Pressable>
      ) : (
        <CheckCircle2 size={20} color="#10b981" />
      )}
    </Animated.View>
  );
};

export default React.memo(GoalReachedBanner);


