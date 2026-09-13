import { useRouter } from "expo-router";
import {
  Activity,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Lock,
  Minus,
  Plus,
  Save,
  Sliders,
  Smartphone,
  Trash2,
  User,
  X,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserProfile } from "@/types";
import { ACHIEVEMENTS_DATA, DEFAULT_PROFILE } from "../constants";
import { getProfile, saveProfile } from "../services/ProfileService";
import { useHydrationStore } from "../store/hydrationStore";
import { hapticLight, hapticMedium } from "../utils/haptics";
import { calculateBaseGoal } from "../utils/hydration";

const Settings = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState<1 | 1.2 | 1.5>(1);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("F");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAch, setSelectedAch] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isScienceExpanded, setIsScienceExpanded] = useState(false);

  const unlockedAchievements = useHydrationStore((s) => s.unlockedAchievements);
  const storeReminderInterval = useHydrationStore((s) => s.reminderInterval);
  const setStoreReminderInterval = useHydrationStore(
    (s) => s.setReminderInterval,
  );
  const storeHapticsEnabled = useHydrationStore((s) => s.hapticsEnabled);
  const setStoreHapticsEnabled = useHydrationStore((s) => s.setHapticsEnabled);
  const storeCelebrationLevel = useHydrationStore((s) => s.celebrationLevel);
  const setStoreCelebrationLevel = useHydrationStore(
    (s) => s.setCelebrationLevel,
  );
  const clearAllData = useHydrationStore((s) => s.clearAllData);

  const [interval, setIntervalState] = useState(90);
  const [haptics, setHaptics] = useState(true);
  const [celebrationLevel, setCelebrationLevelState] = useState<
    "full" | "subtle" | "off"
  >("subtle");

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
      setCelebrationLevelState(storeCelebrationLevel || "subtle");
    };
    load();
  }, [storeReminderInterval, storeHapticsEnabled, storeCelebrationLevel]);

  const parsedWeight = parseFloat(weight) || 70;
  const simulatedGoal = calculateBaseGoal({
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
    setStoreCelebrationLevel(celebrationLevel);
    setIsSaving(false);
    Alert.alert("Saved! 💧", "Your hydration profile has been updated.", [
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
          paddingBottom: 32,
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
                Personalized body baseline & activity
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
          <View className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200/60 flex-row items-center">
            <Zap size={16} color="#0284c7" />
            <Text className="text-sky-900 text-xs font-semibold ml-2.5 flex-1">
              Calculated Base Goal:{" "}
              <Text className="font-black text-sky-950 text-sm">
                {simulatedGoal} ml
              </Text>{" "}
              / day
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
                Schedules and device settings
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

          {/* Celebration Intensity */}
          <Text className="text-sky-900/60 text-[11px] font-bold uppercase tracking-wider mb-2">
            Celebrations
          </Text>
          <View className="flex-row gap-2 mb-5">
            {[
              { label: "Subtle", value: "subtle" },
              { label: "Full", value: "full" },
              { label: "Off", value: "off" },
            ].map((opt) => {
              const isSelected = celebrationLevel === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    hapticLight();
                    setCelebrationLevelState(opt.value as any);
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
                Container weight & celebration pulses
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
                100% offline & stored locally
              </Text>
            </View>
          </View>

          {/* Wipe Data Button */}
          <Pressable
            onPress={() => {
              Alert.alert(
                "Delete All Local Data?",
                "This will permanently erase all your hydration logs, daily streak history, settings, and achievements.",
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

        {/* 4. MILESTONES & ACHIEVEMENTS (Reference) */}
        <View className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm mb-5">
          <View className="flex-row items-center mb-5">
            <View className="bg-orange-100 p-3 rounded-2xl mr-3.5">
              <Award size={20} color="#ea580c" />
            </View>
            <View className="flex-1">
              <Text className="text-sky-950 font-black text-base">
                Milestones & Badges
              </Text>
              <Text className="text-sky-500 text-xs font-medium">
                Tap badges to view achievements
              </Text>
            </View>
          </View>

          {/* Symmetrical 2x2 Grid */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              rowGap: 12,
            }}
          >
            {ACHIEVEMENTS_DATA.map((ach) => {
              const isUnlocked = unlockedAchievements.includes(ach.id);
              return (
                <Pressable
                  key={ach.id}
                  onPress={() => {
                    hapticLight();
                    setSelectedAch(ach);
                    setModalVisible(true);
                  }}
                  style={({ pressed }) => [
                    {
                      width: "48%",
                      minHeight: 110,
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 14,
                      paddingHorizontal: 8,
                      borderRadius: 22,
                      backgroundColor: isUnlocked ? "#f0f9ff" : "#f8fafc",
                      borderColor: isUnlocked ? "#bae6fd" : "#e2e8f0",
                      borderWidth: 1,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isUnlocked ? (
                      <Image
                        source={ach.image}
                        style={{ width: 48, height: 48 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: "#f1f5f9",
                          borderColor: "#cbd5e1",
                          borderWidth: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Lock size={18} color="#94a3b8" />
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      marginTop: 6,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        fontWeight: "900",
                        color: isUnlocked ? "#082f49" : "#64748b",
                        textAlign: "center",
                      }}
                    >
                      {ach.title}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 5. HYDRATION SCIENCE GUIDE (Collapsible Reference) */}
        <Pressable
          onPress={() => {
            hapticLight();
            setIsScienceExpanded(!isScienceExpanded);
          }}
          className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm mb-8"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="bg-sky-100 p-3 rounded-2xl mr-3.5">
                <Activity size={20} color="#0284c7" />
              </View>
              <View className="flex-1">
                <Text className="text-sky-950 font-black text-base">
                  Hydration Science
                </Text>
                <Text className="text-sky-500 text-xs font-medium">
                  Learn how beverage contributions are calculated
                </Text>
              </View>
            </View>
            {isScienceExpanded ? (
              <ChevronUp size={20} color="#0284c7" />
            ) : (
              <ChevronDown size={20} color="#94a3b8" />
            )}
          </View>

          {isScienceExpanded && (
            <View className="gap-2 mt-4 pt-4 border-t border-sky-50">
              {[
                {
                  name: "Water",
                  coeff: "100%",
                  desc: "Pure baseline hydration with zero loss",
                  color: "text-sky-600",
                  bg: "bg-sky-50",
                },
                {
                  name: "Electrolytes",
                  coeff: "115%",
                  desc: "Enhanced mineral osmolarity & retention",
                  color: "text-cyan-600",
                  bg: "bg-cyan-50",
                },
                {
                  name: "Fruit Juice",
                  coeff: "95%",
                  desc: "High water volume with natural carbohydrates",
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
                {
                  name: "Herbal / Tea",
                  coeff: "92%",
                  desc: "Gentle hydration with natural antioxidants",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  name: "Coffee",
                  coeff: "90%",
                  desc: "Hydrating with mild caffeine diuretic offset",
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
              ].map((item) => (
                <View
                  key={item.name}
                  className={`p-3 rounded-2xl ${item.bg} flex-row items-center justify-between`}
                >
                  <View className="flex-1 pr-2">
                    <Text className="text-sky-950 font-bold text-xs">
                      {item.name}
                    </Text>
                    <Text className="text-sky-500/80 text-[10px]">
                      {item.desc}
                    </Text>
                  </View>
                  <Text className={`font-black text-xs ${item.color}`}>
                    {item.coeff}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Pressable>
      </ScrollView>

      {/* Achievement Details Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40 px-6">
          <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl border border-sky-100">
            {/* Header / Dismiss */}
            <View className="w-full flex-row justify-end">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="p-2 bg-sky-50 rounded-full active:bg-sky-100"
              >
                <X size={18} color="#0ea5e9" />
              </Pressable>
            </View>

            {/* Content */}
            {selectedAch &&
              (() => {
                const isUnlocked = unlockedAchievements.includes(
                  selectedAch.id,
                );

                return (
                  <>
                    <View className="my-4 items-center">
                      {isUnlocked ? (
                        <Image
                          source={selectedAch.image}
                          style={{ width: 90, height: 90 }}
                          resizeMode="contain"
                        />
                      ) : (
                        <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center border border-slate-200">
                          <Lock size={36} color="#94a3b8" />
                        </View>
                      )}
                    </View>

                    <Text className="text-lg font-black text-sky-950 mt-2 text-center">
                      {selectedAch.title}
                    </Text>

                    <Text className="text-xs text-center text-sky-900/60 mt-2 px-4 leading-5">
                      {selectedAch.description}
                    </Text>

                    <View className="mt-6 w-full gap-2">
                      <View
                        style={{
                          backgroundColor: isUnlocked ? "#f0fdfa" : "#f8fafc",
                          borderColor: isUnlocked ? "#99f6e4" : "#e2e8f0",
                        }}
                        className="flex-row items-center justify-center p-3 rounded-2xl border"
                      >
                        <Text
                          style={{ color: isUnlocked ? "#0f766e" : "#64748b" }}
                          className="font-bold text-xs"
                        >
                          {isUnlocked ? "Unlocked 🏅" : "Locked 🔒"}
                        </Text>
                      </View>

                      {isUnlocked && (
                        <Pressable
                          onPress={() => setModalVisible(false)}
                          className="flex-row items-center justify-center bg-sky-500 active:bg-sky-600 p-3.5 rounded-2xl shadow-sm"
                        >
                          <Text className="text-white font-black text-xs">
                            Done
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </>
                );
              })()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Settings;
