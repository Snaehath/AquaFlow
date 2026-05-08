import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  CheckCircle2,
  Droplets,
  Flame,
  History,
  Plus,
  Settings,
  Thermometer,
  Trophy,
  Undo,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useHydrationStore } from "@/store/hydrationStore";
import QuickAdd from "../components/QuickAdd";
import WaterBottle from "../components/WaterBottle";
import { BeverageType } from "../constants/beverages";
import { useHydration } from "../hooks/useHydration";

// ─── Custom Log Modal ────────────────────────────────────────────────────────

type CustomLogModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

const CustomLogModal = ({
  visible,
  onClose,
  onConfirm,
}: CustomLogModalProps) => {
  const [raw, setRaw] = useState("");

  const amount = parseInt(raw, 10);
  const isValid = !isNaN(amount) && amount > 0 && amount <= 3000;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(amount);
    setRaw("");
    onClose();
  };

  const handleClose = () => {
    setRaw("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end"
      >
        <Pressable className="flex-1" onPress={handleClose} />
        <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10 border-t border-sky-100">
          <View className="w-10 h-1 bg-sky-100 rounded-full self-center mb-6" />
          <Text className="text-sky-950 text-xl font-black mb-1">
            Custom Log
          </Text>
          <Text className="text-sky-400 text-xs font-medium mb-6">
            Enter the amount in ml (max 3000ml)
          </Text>

          <View className="flex-row items-center bg-sky-50 px-5 py-4 rounded-2xl border border-sky-100 mb-6">
            <TextInput
              className="flex-1 text-sky-950 font-black text-4xl"
              placeholder="250"
              placeholderTextColor="#bae6fd"
              keyboardType="number-pad"
              value={raw}
              onChangeText={setRaw}
              autoFocus
              maxLength={4}
            />
            <Text className="text-sky-400 font-bold text-lg ml-2">ml</Text>
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              className="flex-1 bg-sky-50 p-4 rounded-2xl items-center border border-sky-100"
            >
              <Text className="text-sky-700 font-bold">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              disabled={!isValid}
              className={`flex-[2] p-4 rounded-2xl items-center ${isValid ? "bg-sky-500" : "bg-sky-200"}`}
            >
              <Text
                className={`font-black text-lg ${isValid ? "text-white" : "text-sky-300"}`}
              >
                Log {isValid ? `${amount}ml` : ""}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard = () => {
  const router = useRouter();
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

  const alwaysNotify = useHydrationStore((s) => s.alwaysNotify);
  const setAlwaysNotify = useHydrationStore((s) => s.setAlwaysNotify);

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
  }, [isGoalReached, alwaysNotify]);

  const [showUndo, setShowUndo] = useState(false);
  const [showCustomLog, setShowCustomLog] = useState(false);

  // Fixed: use proper ReturnType instead of `any`
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showUndo) {
      undoTimer.current = setTimeout(() => setShowUndo(false), 4000);
    }
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, [showUndo]);

  // Pulsing hint animation for first-time users
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

  // Fixed: explicit BeverageType instead of `any` — defined before early return
  const handleAdd = useCallback(
    (amount: number, type: BeverageType = "water") => {
      addIntake(amount, type);
      setShowUndo(true);
    },
    [addIntake],
  );

  const handleUndo = useCallback(() => {
    if (logs.length > 0) {
      removeLog(logs[0].id);
      setShowUndo(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [logs, removeLog]);

  // Fixed: long-press reset now shows a confirmation dialog
  const handleLongPressReset = useCallback(() => {
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

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center bg-sky-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );

  const isHeatwave = (weather?.multiplier ?? 1) > 1;
  const isCelsius = profile?.tempUnit === "C";
  const tempUnit = isCelsius ? "°C" : "°F";
  const displayTemp = weather?.temp
    ? isCelsius
      ? Math.round(((weather.temp - 32) * 5) / 9)
      : Math.round(weather.temp)
    : "--";

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
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

        {/* Bottle + progress */}
        <View className="items-center py-6">
          <Pressable
            onPress={() => handleAdd(250)}
            style={({ pressed }) => [
              { transform: [{ scale: pressed ? 0.95 : 1 }] },
            ]}
          >
            <WaterBottle
              progress={progress}
              size={280}
              beverageType={lastBeverageType}
            />
          </Pressable>

          {/* Empty-state tap hint for first-time users */}
          <Animated.View
            style={hintStyle}
            className="flex-row items-center mt-2 mb-2"
          >
            <Droplets size={12} color="#0ea5e9" />
            <Text className="text-sky-400 text-xs font-bold ml-1">
              Tap the bottle to log 250ml
            </Text>
          </Animated.View>

          {/* Fixed: long-press now shows confirmation dialog */}
          <Pressable
            onLongPress={handleLongPressReset}
            className="items-center mt-2"
          >
            <Text className="text-sky-950 text-5xl font-black">
              {actualIntake > 0 && actualIntake % effectiveGoal === 0
                ? effectiveGoal
                : actualIntake % effectiveGoal}
              <Text className="text-xl text-sky-300 font-medium">
                {" "}
                / {effectiveGoal} ml
              </Text>
            </Text>

            <View className="flex-row mt-4">
              <View className="flex-row items-center bg-sky-100/50 px-3 py-1.5 rounded-full mr-2">
                <Flame size={14} color="#0ea5e9" fill="#0ea5e9" />
                <Text className="text-sky-900 text-[10px] font-bold ml-2">
                  {completedBottles} Bottles
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Goal reached banner */}
        {isGoalReached && (
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
        )}

        {/* Weather card — Fixed: uses tempUnit variable, not hardcoded °F */}
        <View className="flex-row items-center bg-white/80 px-4 py-3 rounded-3xl mb-6 border border-sky-100 shadow-sm">
          <View className="flex-1 flex-row items-center">
            <Thermometer size={20} color={isHeatwave ? "#f59e0b" : "#0ea5e9"} />
            <View className="ml-3">
              <Text className="text-sky-900 font-bold text-sm">
                {weather?.city ?? "Local Environment"}
              </Text>
              <Text className="text-sky-500 text-[10px] font-medium">
                {isHeatwave
                  ? "Increased goal due to heat"
                  : "Standard goal for current weather"}
              </Text>
            </View>
          </View>
          <Text className="text-sky-950 font-black text-lg">
            {displayTemp}
            {tempUnit}
          </Text>
        </View>

        <QuickAdd onAdd={handleAdd} />

        {/* Fixed: Custom Log now opens the real amount-input modal */}
        <Pressable
          onPress={() => setShowCustomLog(true)}
          className="bg-sky-500 p-5 rounded-3xl flex-row items-center justify-center shadow-lg my-6"
          style={({ pressed }) => [
            { transform: [{ scale: pressed ? 0.95 : 1 }] },
          ]}
        >
          <Plus color="white" size={20} />
          <Text className="text-white font-black text-lg ml-2">Custom Log</Text>
        </Pressable>

        <View className="h-20" />
      </ScrollView>

      {/* Undo snackbar */}
      {showUndo && (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutDown}
          className="absolute bottom-10 left-6 right-6"
        >
          <Pressable
            onPress={handleUndo}
            className="bg-sky-900 px-6 py-4 rounded-3xl flex-row items-center justify-between shadow-2xl border border-sky-800"
          >
            <View className="flex-row items-center">
              <Undo size={18} color="white" />
              <Text className="text-white font-bold ml-3">
                Logged {logs[0]?.amount}ml {logs[0]?.type}
              </Text>
            </View>
            <Text className="text-sky-300 font-black uppercase text-xs">
              Undo
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Custom Log Modal */}
      <CustomLogModal
        visible={showCustomLog}
        onClose={() => setShowCustomLog(false)}
        onConfirm={(amount) => handleAdd(amount, "water")}
      />
    </SafeAreaView>
  );
};

export default Dashboard;
