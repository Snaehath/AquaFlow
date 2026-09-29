import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ExternalLink,
  Info,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserProfile } from "@/types";
import { DEFAULT_PROFILE } from "../constants";
import { getProfile, saveProfile } from "../services/ProfileService";
import { useHydrationStore } from "../store/hydrationStore";
import { hapticLight, hapticMedium } from "../utils/haptics";
import { calculateDailyReference } from "../utils/hydration";

const Settings = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState<1 | 1.2 | 1.5>(1);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("F");

  const storeReminderInterval = useHydrationStore((s) => s.reminderInterval);
  const setStoreReminderInterval = useHydrationStore(
    (s) => s.setReminderInterval,
  );
  const storeHapticsEnabled = useHydrationStore((s) => s.hapticsEnabled);
  const setStoreHapticsEnabled = useHydrationStore((s) => s.setHapticsEnabled);
  const clearAllData = useHydrationStore((s) => s.clearAllData);

  useEffect(() => {
    const load = async () => {
      const p = await getProfile();
      if (p) {
        setProfile(p);
        setWeight(p.weight ? p.weight.toString() : "70");
        setActivity(p.activityLevel || 1);
        setTempUnit(p.tempUnit || "F");
      }
    };
    load();
  }, []);

  const parsedWeight = parseFloat(weight) || 70;
  const simulatedReference = calculateDailyReference({
    weight: parsedWeight,
    activityLevel: activity,
    gender: profile.gender || "other",
    tempUnit,
  });

  // Immediate save helper for profile changes
  const updateAndSaveProfile = async (updates: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...profile,
      weight: updates.weight ?? parsedWeight,
      activityLevel: updates.activityLevel ?? activity,
      tempUnit: updates.tempUnit ?? tempUnit,
    };
    setProfile(updated);
    await saveProfile(updated);
  };

  const adjustWeight = (delta: number) => {
    hapticLight();
    const current = parseFloat(weight) || 70;
    const next = Math.max(20, Math.min(300, current + delta));
    setWeight(next.toString());
    updateAndSaveProfile({ weight: next });
  };

  const handleWeightTextChange = (text: string) => {
    setWeight(text);
    const val = parseFloat(text);
    if (!isNaN(val) && val >= 20 && val <= 300) {
      updateAndSaveProfile({ weight: val });
    }
  };

  const handleActivityChange = (val: 1 | 1.2 | 1.5) => {
    hapticLight();
    setActivity(val);
    updateAndSaveProfile({ activityLevel: val });
  };

  const handleTempUnitChange = (unit: "C" | "F") => {
    hapticLight();
    setTempUnit(unit);
    updateAndSaveProfile({ tempUnit: unit });
  };

  const handleIntervalChange = async (minutes: number) => {
    hapticLight();
    await setStoreReminderInterval(minutes);
  };

  const handleHapticsToggle = () => {
    hapticMedium();
    setStoreHapticsEnabled(!storeHapticsEnabled);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
      {/* Top Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => {
            hapticLight();
            router.back();
          }}
          className="p-2 -ml-2 rounded-full"
        >
          <ChevronLeft color="#082f49" size={24} />
        </Pressable>
        <Text className="text-sky-950 text-xl font-black">Settings</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION: YOUR DETAILS */}
        <Text className="text-sky-900/50 text-[11px] font-bold uppercase tracking-wider mb-2 ml-2">
          Your Details
        </Text>
        <View className="bg-white rounded-3xl border border-sky-100/80 shadow-xs mb-6 overflow-hidden">
          {/* Weight Row */}
          <View className="p-4 flex-row items-center justify-between border-b border-sky-50">
            <View>
              <Text className="text-sky-950 font-bold text-sm">Weight</Text>
              <Text className="text-sky-400 text-xs">Used for baseline reference</Text>
            </View>
            <View className="flex-row items-center bg-sky-50 px-2 py-1 rounded-2xl border border-sky-100">
              <Pressable
                onPress={() => adjustWeight(-1)}
                className="w-8 h-8 bg-white rounded-xl items-center justify-center border border-sky-100"
              >
                <Minus size={15} color="#0284c7" strokeWidth={2.5} />
              </Pressable>
              <View className="flex-row items-center px-3">
                <TextInput
                  value={weight}
                  onChangeText={handleWeightTextChange}
                  keyboardType="numeric"
                  style={{
                    color: "#082f49",
                    fontWeight: "800",
                    fontSize: 18,
                    textAlign: "center",
                    padding: 0,
                    minWidth: 40,
                  }}
                  maxLength={4}
                />
                <Text className="text-sky-500 font-bold text-xs ml-1">kg</Text>
              </View>
              <Pressable
                onPress={() => adjustWeight(1)}
                className="w-8 h-8 bg-white rounded-xl items-center justify-center border border-sky-100"
              >
                <Plus size={15} color="#0284c7" strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>

          {/* Activity Row */}
          <View className="p-4 border-b border-sky-50">
            <Text className="text-sky-950 font-bold text-sm mb-2.5">
              Daily Movement
            </Text>
            <View className="flex-row gap-2">
              {[
                { label: "Sedentary", value: 1 },
                { label: "Active", value: 1.2 },
                { label: "Athletic", value: 1.5 },
              ].map((opt) => {
                const isSelected = activity === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => handleActivityChange(opt.value as any)}
                    style={{
                      backgroundColor: isSelected ? "#0ea5e9" : "#f0f9ff",
                      borderColor: isSelected ? "#0ea5e9" : "#e0f2fe",
                    }}
                    className="flex-1 py-2 rounded-xl border items-center shadow-xs"
                  >
                    <Text
                      style={{ color: isSelected ? "#ffffff" : "#082f49" }}
                      className="text-xs font-bold"
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Estimated Reference Info Row */}
          <View className="p-4 bg-sky-50/50 flex-row items-start">
            <Info size={15} color="#0284c7" className="mt-0.5" />
            <View className="flex-1 ml-2.5">
              <Text className="text-sky-950 text-xs font-bold">
                Estimated daily reference: ~{simulatedReference} ml
              </Text>
              <Text className="text-sky-500/80 text-[11px] leading-4 mt-0.5">
                A gentle baseline based on your physiology, never a quota.
              </Text>
            </View>
          </View>
        </View>

        {/* SECTION: REMINDERS */}
        <Text className="text-sky-900/50 text-[11px] font-bold uppercase tracking-wider mb-2 ml-2">
          Reminders
        </Text>
        <View className="bg-white rounded-3xl border border-sky-100/80 shadow-xs mb-6 p-4">
          <Text className="text-sky-950 font-bold text-sm mb-2.5">
            Frequency
          </Text>
          <View className="flex-row gap-2 mb-3">
            {[
              { label: "Every 90m", value: 90 },
              { label: "Every 2h", value: 120 },
              { label: "Every 3h", value: 180 },
              { label: "Off", value: 0 },
            ].map((opt) => {
              const isSelected = storeReminderInterval === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => handleIntervalChange(opt.value)}
                  style={{
                    backgroundColor: isSelected ? "#0ea5e9" : "#f0f9ff",
                    borderColor: isSelected ? "#0ea5e9" : "#e0f2fe",
                  }}
                  className="flex-1 py-2.5 rounded-xl border items-center shadow-xs"
                >
                  <Text
                    style={{ color: isSelected ? "#ffffff" : "#082f49" }}
                    className="text-xs font-bold"
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text className="text-sky-400 text-[11px] leading-4">
            Quiet hours strictly active (10:00 PM → 8:00 AM).
          </Text>
        </View>

        {/* SECTION: DISPLAY & HAPTICS */}
        <Text className="text-sky-900/50 text-[11px] font-bold uppercase tracking-wider mb-2 ml-2">
          Display & Haptics
        </Text>
        <View className="bg-white rounded-3xl border border-sky-100/80 shadow-xs mb-6 overflow-hidden">
          {/* Temperature Unit */}
          <View className="p-4 flex-row items-center justify-between border-b border-sky-50">
            <View>
              <Text className="text-sky-950 font-bold text-sm">Temperature</Text>
              <Text className="text-sky-400 text-xs">For ambient weather awareness</Text>
            </View>
            <View className="flex-row gap-1.5 bg-sky-50 p-1 rounded-xl border border-sky-100">
              {(["C", "F"] as const).map((unit) => {
                const isSelected = tempUnit === unit;
                return (
                  <Pressable
                    key={unit}
                    onPress={() => handleTempUnitChange(unit)}
                    style={{
                      backgroundColor: isSelected ? "#0ea5e9" : "transparent",
                    }}
                    className="px-3 py-1.5 rounded-lg"
                  >
                    <Text
                      style={{
                        color: isSelected ? "#ffffff" : "#0284c7",
                        fontWeight: "700",
                        fontSize: 12,
                      }}
                    >
                      °{unit}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Vibrations Toggle */}
          <View className="p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-sky-950 font-bold text-sm">Tactile Vibrations</Text>
              <Text className="text-sky-400 text-xs">Subtle haptic pulses when logging</Text>
            </View>
            <Pressable
              onPress={handleHapticsToggle}
              style={{
                backgroundColor: storeHapticsEnabled ? "#0ea5e9" : "#e2e8f0",
                justifyContent: "center",
                alignItems: storeHapticsEnabled ? "flex-end" : "flex-start",
              }}
              className="w-12 h-7 rounded-full p-1"
            >
              <View className="w-5 h-5 bg-white rounded-full shadow-sm" />
            </Pressable>
          </View>
        </View>

        {/* SECTION: DATA & PRIVACY */}
        <Text className="text-sky-900/50 text-[11px] font-bold uppercase tracking-wider mb-2 ml-2">
          Data & Privacy
        </Text>
        <View className="bg-white rounded-3xl border border-sky-100/80 shadow-xs mb-8 overflow-hidden">
          <Pressable
            onPress={() => {
              hapticLight();
              Linking.openURL("https://snaehath.github.io/AquaFlow/#privacy");
            }}
            className="p-4 flex-row items-center justify-between border-b border-sky-50 active:bg-sky-50/50"
          >
            <View className="flex-row items-center">
              <ShieldCheck size={16} color="#0284c7" />
              <Text className="text-sky-950 font-bold text-sm ml-2.5">
                Privacy Policy
              </Text>
            </View>
            <ExternalLink size={14} color="#94a3b8" />
          </Pressable>

          <Pressable
            onPress={() => {
              Alert.alert(
                "Delete All Local Data?",
                "This will permanently erase all your hydration logs, daily history, and profile settings.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete Everything",
                    style: "destructive",
                    onPress: () => {
                      clearAllData();
                      Alert.alert(
                        "Data Cleared",
                        "All local data has been erased.",
                        [{ text: "OK", onPress: () => router.replace("/") }],
                      );
                    },
                  },
                ],
              );
            }}
            className="p-4 flex-row items-center justify-between active:bg-red-50/40"
          >
            <View className="flex-row items-center">
              <Trash2 size={16} color="#ef4444" />
              <Text className="text-red-500 font-bold text-sm ml-2.5">
                Erase All Data
              </Text>
            </View>
            <Text className="text-red-400 text-xs font-semibold">Reset</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
