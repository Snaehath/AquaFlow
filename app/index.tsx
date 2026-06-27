// libraries
import * as Haptics from "expo-haptics";
import { Plus } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// store & hooks
import { useHydrationStore } from "@/store/hydrationStore";
import { useHydration } from "../hooks/useHydration";

// constants & components
import { BeverageType } from "../constants/beverages";
import QuickAdd from "../components/QuickAdd";

// hydration components
import HydrationHeader from "../components/hydration/HydrationHeader";
import ProgressSection from "../components/hydration/ProgressSection";
import WeatherCard from "../components/hydration/WeatherCard";
import GoalReachedBanner from "../components/hydration/GoalReachedBanner";
import CustomLogModal from "../components/hydration/CustomLogModal";
import { useToastStore } from "@/store/toastStore";
import { Confetti } from "../components/ui/Confetti";

const Dashboard = () => {
  // hydration hook
  const {
    actualIntake,
    addIntake,
    resetIntake,
    isLoading,
    progress,
    completedBottles,
    weather,
    effectiveGoal,
    isGoalReached,
    lastBeverageType,
    logs,
    removeLog,
    streak,
    profile,
  } = useHydration();

  // store state
  const alwaysNotify = useHydrationStore((s) => s.alwaysNotify);
  const setAlwaysNotify = useHydrationStore((s) => s.setAlwaysNotify);

  // local state & refs
  const [showCustomLog, setShowCustomLog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const showToast = useToastStore((s) => s.showToast);
  const prevCompletedBottles = useRef(completedBottles);

  // Trigger Confetti on bottle completion
  useEffect(() => {
    if (completedBottles > prevCompletedBottles.current) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      prevCompletedBottles.current = completedBottles;
      return () => clearTimeout(timer);
    } else {
      prevCompletedBottles.current = completedBottles;
    }
  }, [completedBottles]);

  // Goal reached side effect
  useEffect(() => {
    if (isGoalReached && !alwaysNotify) {
      Alert.alert(
        "Goal Reached! 🏆",
        "Congratulations! You've met your daily hydration goal. Would you like to keep receiving reminders to stay extra hydrated?",
        [
          { text: "No, I'm good", style: "cancel" },
          {
            text: "Yes, keep 'em coming",
            onPress: () => setAlwaysNotify(true),
          },
        ],
      );
    }
  }, [isGoalReached, alwaysNotify, setAlwaysNotify]);



  // Pulsing hint animation
  const hintOpacity = useSharedValue(0);
  const hintStyle = useAnimatedStyle(() => ({ opacity: hintOpacity.value }));

  useEffect(() => {
    if (!isLoading && actualIntake === 0 && logs.length === 0) {
      hintOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.3, { duration: 800 }),
        ),
        -1,
        true,
      );
    } else {
      hintOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isLoading, actualIntake, logs.length, hintOpacity]);

  const handleUndo = useCallback(() => {
    if (logs.length > 0) {
      removeLog(logs[0].id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [logs, removeLog]);

  const handleAdd = useCallback(
    (amount: number, type: BeverageType = "water") => {
      addIntake(amount, type);
      const beverageName = type.charAt(0).toUpperCase() + type.slice(1);
      showToast({
        title: `${beverageName} Logged`,
        description: `Successfully added ${amount}ml of ${type}.`,
        variant: "success",
        action: {
          label: "Undo",
          onPress: handleUndo,
        },
      });
    },
    [addIntake, showToast, handleUndo],
  );

  const handleReset = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Reset today's intake?",
      "This will permanently clear all logs for today. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => resetIntake() },
      ],
    );
  }, [resetIntake]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-sky-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexGrow: 1, justifyContent: "space-between" }}>
          <View>
            <HydrationHeader streak={streak} />

            <ProgressSection
              progress={progress}
              lastBeverageType={lastBeverageType}
              actualIntake={actualIntake}
              effectiveGoal={effectiveGoal}
              completedBottles={completedBottles}
              onAdd={handleAdd}
              onReset={handleReset}
              hintStyle={hintStyle}
            />
          </View>

          <View>
            {isGoalReached && <GoalReachedBanner />}

            <WeatherCard weather={weather} profile={profile} />

            <QuickAdd onAdd={handleAdd} />

            <Pressable
              onPress={() => setShowCustomLog(true)}
              className="bg-sky-500 p-4 rounded-2xl flex-row items-center justify-center shadow-md my-2"
              style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.95 : 1 }] },
              ]}
            >
              <Plus color="white" size={20} />
              <Text className="text-white font-black text-lg ml-2">Custom Log</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>



      <CustomLogModal
        visible={showCustomLog}
        onClose={() => setShowCustomLog(false)}
        onConfirm={(amount) => handleAdd(amount, "water")}
      />

      {showConfetti && <Confetti />}
    </SafeAreaView>
  );
};

export default Dashboard;
