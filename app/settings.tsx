import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Info,
  Minus,
  Plus,
  Save,
  Sliders,
  Smartphone,
  Trash2,
  User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [isSaving, setIsSaving] = useState(false);

  const storeReminderInterval = useHydrationStore((s) => s.reminderInterval);
  const setStoreReminderInterval = useHydrationStore(
    (s) => s.setReminderInterval,
  );
  const storeHapticsEnabled = useHydrationStore((s) => s.hapticsEnabled);
  const setStoreHapticsEnabled = useHydrationStore((s) => s.setHapticsEnabled);
  const clearAllData = useHydrationStore((s) => s.clearAllData);

  const [interval, setIntervalState] = useState(90);
  const [haptics, setHaptics] = useState(true);

  useEffect(() => {
    const load = async () => {
      const p = await getProfile();
      if (p) {
        setProfile(p);
        setWeight(p.weight ? p.weight.toString() : "70");
        setActivity(p.activityLevel || 1);
        setTempUnit(p.tempUnit || "F");
      }
      setIntervalState(
        storeReminderInterval !== undefined ? storeReminderInterval : 90,
      );
      setHaptics(storeHapticsEnabled ?? true);
    };
    load();
  }, [storeReminderInterval, storeHapticsEnabled]);

  const parsedWeight = parseFloat(weight) || 70;
  const simulatedReference = calculateDailyReference({
    weight: parsedWeight,
    activityLevel: activity,
    gender: profile.gender || "other",
    tempUnit,
  });

  const adjustWeight = (delta: number) => {
    hapticLight();
    const current = parseFloat(weight) || 70;
    const next = Math.max(20, Math.min(300, current + delta));
    setWeight(next.toString());
  };

  const handleSave = async () => {
    const val = parseFloat(weight);
    if (isNaN(val) || val <= 10 || val > 500) {
      Alert.alert(
        "Invalid Weight",
        "Please enter a valid weight between 10 and 500 kg.",
      );
      return;
    }

    hapticMedium();
    setIsSaving(true);
    const newProfile: UserProfile = {
      ...profile,
      weight: val,
      activityLevel: activity,
      tempUnit,
    };
    await saveProfile(newProfile);
    await setStoreReminderInterval(interval);
    setStoreHapticsEnabled(haptics);
    setIsSaving(false);
    Alert.alert("Saved! 💧", "Your hydration preferences have been updated.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
      {/* Top Navigation Bar */}
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
        {/* 1. UNIFIED HYDRATION PROFILE CARD */}
        <View className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm mb-5">
          <View className="flex-row items-center mb-5">
            <View className="bg-sky-100 p-3 rounded-2xl mr-3.5">
              <User size={20} color="#0284c7" />
            </View>
            <View className="flex-1">
              <Text className="text-sky-950 font-black text-base">
                Hydration Profile
              </Text>
              <Text className="text-sky-500 text-xs font-medium">
                Personalized body baseline & daily movement
              </Text>
            </View>
          </View>

          {/* Weight Stepper & Input */}
          <Text className="text-sky-900/60 text-[11px] font-bold uppercase tracking-wider mb-2">
            Body Weight
          </Text>
          <View className="flex-row items-center bg-sky-50 p-2 rounded-2xl border border-sky-100 mb-5">
            <Pressable
              onPress={() => adjustWeight(-1)}
              style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.9 : 1 }] },
              ]}
              className="w-11 h-11 bg-white rounded-xl items-center justify-center border border-sky-100 shadow-sm"
            >
              <Minus size={18} color="#0284c7" strokeWidth={2.5} />
            </Pressable>

            <View className="flex-1 flex-row items-center justify-center px-4">
              <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                style={{
                  color: "#082f49",
                  fontWeight: "900",
                  fontSize: 24,
                  textAlign: "center",
                  padding: 0,
                  minWidth: 60,
                }}
                maxLength={4}
              />
              <Text className="text-sky-400 font-bold text-base ml-1">kg</Text>
            </View>

            <Pressable
              onPress={() => adjustWeight(1)}
              style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.9 : 1 }] },
              ]}
              className="w-11 h-11 bg-white rounded-xl items-center justify-center border border-sky-100 shadow-sm"
            >
              <Plus size={18} color="#0284c7" strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Activity Level Segmented Selector */}
          <Text className="text-sky-900/60 text-[11px] font-bold uppercase tracking-wider mb-2">
            Daily Energy Level
          </Text>
          <View className="flex-row gap-2 mb-5">
            {[
              { label: "Sedentary", sub: "1.0x", value: 1 },
              { label: "Active", sub: "1.2x", value: 1.2 },
              { label: "Athletic", sub: "1.5x", value: 1.5 },
            ].map((opt) => {
              const isSelected = activity === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    hapticLight();
                    setActivity(opt.value as any);
                  }}
                  style={{
                    backgroundColor: isSelected ? "#0ea5e9" : "#f0f9ff",
                    borderColor: isSelected ? "#0ea5e9" : "#e0f2fe",
                  }}
                  className="flex-1 py-3 px-2 rounded-2xl border items-center shadow-sm"
                >
                  <Text
                    style={{ color: isSelected ? "#ffffff" : "#082f49" }}
                    className="text-xs font-black"
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={{ color: isSelected ? "#e0f2fe" : "#38bdf8" }}
                    className="text-[9px] font-bold mt-0.5"
                  >
                    {opt.sub}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Live Calculated Target Preview */}
          <View className="bg-sky-50 p-4 rounded-2xl border border-sky-200/60">
            <View className="flex-row items-center mb-1">
              <Info size={16} color="#0284c7" />
              <Text className="text-sky-900 text-xs font-semibold ml-2 flex-1">
                Estimated daily reference:{" "}
                <Text className="font-black text-sky-950 text-sm">
                  ~{simulatedReference} ml
                </Text>{" "}
                / day
              </Text>
            </View>
            <Text className="text-sky-500/80 text-[11px] leading-4 ml-6">
              This is a general reference, not a limit. Listen to your body and thirst cues.
            </Text>
          </View>
        </View>

        {/* 2. REMINDERS & PREFERENCES CARD */}
        <View className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm mb-5">
          <View className="flex-row items-center mb-5">
            <View className="bg-sky-100 p-3 rounded-2xl mr-3.5">
              <Sliders size={20} color="#0284c7" />
            </View>
            <View className="flex-1">
              <Text className="text-sky-950 font-black text-base">
                Preferences & Reminders
              </Text>
              <Text className="text-sky-500 text-xs font-medium">
                Schedules and tactile feedback
              </Text>
            </View>
          </View>

          {/* Reminder Frequency */}
          <Text className="text-sky-900/60 text-[11px] font-bold uppercase tracking-wider mb-2">
            Reminders
          </Text>
          <View className="flex-row gap-2 mb-2">
            {[
              { label: "Every 90m", value: 90 },
              { label: "Every 2h", value: 120 },
              { label: "Every 3h", value: 180 },
              { label: "Off", value: 0 },
            ].map((opt) => {
              const isSelected = interval === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    hapticLight();
                    setIntervalState(opt.value);
                  }}
                  style={{
                    backgroundColor: isSelected ? "#0ea5e9" : "#f0f9ff",
                    borderColor: isSelected ? "#0ea5e9" : "#e0f2fe",
                  }}
                  className="flex-1 py-2.5 rounded-2xl border items-center shadow-sm"
                >
                  <Text
                    style={{ color: isSelected ? "#ffffff" : "#082f49" }}
                    className="text-xs font-black"
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text className="text-sky-400 text-[11px] mb-5 leading-4">
            Gentle reminders throughout your waking hours (Quiet hours: 10:00 PM → 8:00 AM).
          </Text>

          {/* Temperature Unit */}
          <Text className="text-sky-900/60 text-[11px] font-bold uppercase tracking-wider mb-2">
            Temperature Unit
          </Text>
          <View className="flex-row gap-2 mb-5">
            {[
              { label: "Celsius (°C)", value: "C" },
              { label: "Fahrenheit (°F)", value: "F" },
            ].map((opt) => {
              const isSelected = tempUnit === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    hapticLight();
                    setTempUnit(opt.value as any);
                  }}
                  style={{
                    backgroundColor: isSelected ? "#0ea5e9" : "#f0f9ff",
                    borderColor: isSelected ? "#0ea5e9" : "#e0f2fe",
                  }}
                  className="flex-1 py-2.5 rounded-2xl border items-center shadow-sm"
                >
                  <Text
                    style={{ color: isSelected ? "#ffffff" : "#082f49" }}
                    className="text-xs font-black"
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="h-px bg-sky-100 w-full mb-3" />

          {/* Haptic Toggle Switch */}
          <View className="flex-row items-center justify-between py-1">
            <View>
              <Text className="text-sky-950 font-bold text-sm">
                Tactile Haptics
              </Text>
              <Text className="text-sky-400 text-xs">
                Log feedback & subtle bottle fills
              </Text>
            </View>
            <Pressable
              onPress={() => {
                hapticMedium();
                setHaptics(!haptics);
              }}
              style={{
                backgroundColor: haptics ? "#0ea5e9" : "#e2e8f0",
                justifyContent: "center",
                alignItems: haptics ? "flex-end" : "flex-start",
              }}
              className="w-12 h-7 rounded-full p-1"
            >
              <View className="w-5 h-5 bg-white rounded-full shadow-sm" />
            </Pressable>
          </View>
        </View>

        {/* 3. SYSTEM & DATA MANAGEMENT */}
        <View className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm mb-5">
          <View className="flex-row items-center mb-4">
            <View className="bg-sky-100 p-3 rounded-2xl mr-3.5">
              <Smartphone size={20} color="#0284c7" />
            </View>
            <View className="flex-1">
              <Text className="text-sky-950 font-black text-base">
                Data & Privacy
              </Text>
              <Text className="text-sky-500 text-xs font-medium">
                100% offline & stored locally on device
              </Text>
            </View>
          </View>

          {/* Wipe Data Button */}
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
                        "Data Wiped",
                        "All local data has been successfully cleared.",
                        [{ text: "OK", onPress: () => router.replace("/") }],
                      );
                    },
                  },
                ],
              );
            }}
            className="flex-row items-center justify-between py-3.5 active:opacity-60"
          >
            <View className="flex-row items-center">
              <Trash2 size={16} color="#ef4444" />
              <Text className="text-red-500 font-bold text-sm ml-2.5">
                Erase All Data
              </Text>
            </View>
            <Text className="text-red-400 text-xs font-bold">Reset</Text>
          </Pressable>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="bg-sky-500 active:bg-sky-600 p-4 rounded-2xl flex-row items-center justify-center shadow-md mb-6"
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Save color="white" size={18} />
              <Text className="text-white font-black text-base ml-2">
                Save Changes
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

