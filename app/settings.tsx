import { UserProfile } from "@/types";
import { useRouter } from "expo-router";
import {
  Activity,
  Award,
  Bell,
  ChevronLeft,
  Clock,
  Lock,
  Save,
  Scale,
  Share2,
  Smartphone,
  Thermometer,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ACHIEVEMENTS_DATA } from "../constants/achievements";
import { getProfile, saveProfile } from "../services/ProfileService";
import { useHydrationStore } from "../store/hydrationStore";
import { sendTestNotificationWithActions } from "../services/NotificationService";

const Settings = () => {

  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<1 | 1.2 | 1.5>(1);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("F");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAch, setSelectedAch] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const unlockedAchievements = useHydrationStore((s) => s.unlockedAchievements);
  const storeReminderInterval = useHydrationStore((s) => s.reminderInterval);
  const setStoreReminderInterval = useHydrationStore((s) => s.setReminderInterval);
  const storeHapticsEnabled = useHydrationStore((s) => s.hapticsEnabled);
  const setStoreHapticsEnabled = useHydrationStore((s) => s.setHapticsEnabled);
  const clearAllData = useHydrationStore((s) => s.clearAllData);

  const [interval, setIntervalState] = useState(60);
  const [haptics, setHaptics] = useState(true);

  useEffect(() => {
    const load = async () => {
      const p = await getProfile();
      setProfile(p);
      setWeight(p.weight.toString());
      setActivity(p.activityLevel);
      setTempUnit(p.tempUnit || "F");
      setIntervalState(storeReminderInterval);
      setHaptics(storeHapticsEnabled);
    };
    load();
  }, [storeReminderInterval, storeHapticsEnabled]);

  const handleSave = async () => {
    if (!profile) return;
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > 500) {
      Alert.alert(
        "Invalid Weight",
        "Please enter a valid weight between 1 and 500 kg."
      );
      return;
    }

    setIsSaving(true);
    const newProfile: UserProfile = {
      ...profile,
      weight: parsedWeight,
      activityLevel: activity,
      tempUnit,
    };
    await saveProfile(newProfile);
    await setStoreReminderInterval(interval);
    setStoreHapticsEnabled(haptics);
    setIsSaving(false);
    Alert.alert("Saved!", "Your profile has been updated.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  if (!profile)
    return (
      <View className="flex-1 items-center justify-center bg-sky-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-sky-50">
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft color="#082f49" size={24} />
        </Pressable>
        <Text className="text-sky-950 text-xl font-black">Settings</Text>
        <View className="w-10" />
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView className="px-6 mt-4" showsVerticalScrollIndicator={false}>
          <View className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
            <View className="flex-row items-center mb-6">
              <View className="bg-sky-100 p-3 rounded-2xl mr-4">
                <Scale size={20} color="#0ea5e9" />
              </View>
              <View className="flex-1">
                <Text className="text-sky-950 font-bold">Body Weight</Text>
                <Text className="text-sky-500 text-xs">
                  Used to calculate base hydration needs
                </Text>
              </View>
            </View>

            <View className="flex-row items-center bg-sky-50 p-2 rounded-2xl border border-sky-100">
              <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                className="flex-1 text-sky-950 font-black text-2xl"
                placeholder="70"
              />
              <Text className="text-sky-400 font-bold ml-2">kg</Text>
            </View>
          </View>

          <View className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm mt-6">
            <View className="flex-row items-center mb-6">
              <View className="bg-sky-100 p-3 rounded-2xl mr-4">
                <Activity size={20} color="#0ea5e9" />
              </View>
              <View className="flex-1">
                <Text className="text-sky-950 font-bold">Activity Level</Text>
                <Text className="text-sky-500 text-xs">
                  Boosts your goal based on energy output
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              {[
                { label: "Sedentary", value: 1 },
                { label: "Active", value: 1.2 },
                { label: "Athletic", value: 1.5 },
              ].map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setActivity(opt.value as any)}
                  className={`flex-1 p-3 rounded-2xl border items-center ${
                    activity === opt.value
                      ? "bg-sky-500 border-sky-500"
                      : "bg-white border-sky-100"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold ${
                      activity === opt.value ? "text-white" : "text-sky-900"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm mt-6">
            <View className="flex-row items-center mb-6">
              <View className="bg-sky-100 p-3 rounded-2xl mr-4">
                <Thermometer size={20} color="#0ea5e9" />
              </View>
              <View className="flex-1">
                <Text className="text-sky-950 font-bold">Temperature Unit</Text>
                <Text className="text-sky-500 text-xs">
                  Used for environmental tracking
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              {[
                { label: "Celsius (°C)", value: "C" },
                { label: "Fahrenheit (°F)", value: "F" },
              ].map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setTempUnit(opt.value as any)}
                  className={`flex-1 p-3 rounded-2xl border items-center ${
                    tempUnit === opt.value
                      ? "bg-sky-500 border-sky-500"
                      : "bg-white border-sky-100"
                  }`}
                >
                  <Text
                    className={`text-[12px] font-bold ${
                      tempUnit === opt.value ? "text-white" : "text-sky-900"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm mt-6">
            <View className="flex-row items-center mb-6">
              <View className="bg-sky-100 p-3 rounded-2xl mr-4">
                <Clock size={20} color="#0ea5e9" />
              </View>
              <View className="flex-1">
                <Text className="text-sky-950 font-bold">Reminder Frequency</Text>
                <Text className="text-sky-500 text-xs">
                  How often you want to be reminded to drink water
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              {[
                { label: "30 Mins", value: 30 },
                { label: "1 Hour", value: 60 },
                { label: "2 Hours", value: 120 },
                { label: "3 Hours", value: 180 },
              ].map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setIntervalState(opt.value)}
                  className={`flex-1 p-3 rounded-2xl border items-center ${
                    interval === opt.value
                      ? "bg-sky-500 border-sky-500"
                      : "bg-white border-sky-100"
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      interval === opt.value ? "text-white" : "text-sky-900"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm mt-6">
            <View className="flex-row items-center mb-6">
              <View className="bg-orange-100 p-3 rounded-2xl mr-4">
                <Award size={20} color="#f97316" />
              </View>
              <View className="flex-1">
                <Text className="text-sky-950 font-bold">Achievements</Text>
                <Text className="text-sky-500 text-xs">
                  Tap badges to view details
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap justify-between">
              {ACHIEVEMENTS_DATA.map((ach) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                const Icon = ach.icon;
                return (
                  <Pressable
                    key={ach.id}
                    onPress={() => {
                      setSelectedAch(ach);
                      setModalVisible(true);
                    }}
                    style={({ pressed }) => [
                      { transform: [{ scale: pressed ? 0.95 : 1 }] },
                    ]}
                    className="w-[31%] bg-sky-50/50 p-3 rounded-2xl border border-sky-100/70 mb-3 items-center justify-center"
                  >
                    {isUnlocked ? (
                      ach.image ? (
                        <Image
                          source={ach.image}
                          style={{ width: 36, height: 36 }}
                          resizeMode="contain"
                        />
                      ) : (
                        <View className="p-2 rounded-full bg-orange-100">
                          <Icon size={18} color="#f97316" />
                        </View>
                      )
                    ) : (
                      <View className="p-2 rounded-full bg-slate-200">
                        <Lock size={18} color="#94a3b8" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm mt-6">
            <View className="flex-row items-center mb-6">
              <View className="bg-sky-100 p-3 rounded-2xl mr-4">
                <Smartphone size={20} color="#0ea5e9" />
              </View>
              <View className="flex-1">
                <Text className="text-sky-950 font-bold">System & Care</Text>
                <Text className="text-sky-500 text-xs">
                  Manage app preferences and local storage
                </Text>
              </View>
            </View>

            {/* Haptic Feedback Toggle */}
            <View className="flex-row items-center justify-between py-3 border-b border-sky-50">
              <Text className="text-sky-900 font-bold text-sm">Haptic Feedback</Text>
              <Pressable
                onPress={() => setHaptics(!haptics)}
                className={`w-12 h-7 rounded-full p-1 ${
                  haptics ? "bg-sky-500 items-end" : "bg-slate-200 items-start"
                }`}
              >
                <View className="w-5 h-5 bg-white rounded-full shadow-sm" />
              </Pressable>
            </View>

            {/* Test Notification Button */}
            <Pressable
              onPress={async () => {
                await sendTestNotificationWithActions();
                Alert.alert(
                  "Notification Sent! 🔔",
                  "Pull down your phone's notification bar to see the reminder with interactive action buttons (+250ml, +500ml, Custom)."
                );
              }}
              className="flex-row items-center justify-between py-4 border-b border-sky-50 active:opacity-60"
            >
              <View className="flex-row items-center">
                <Bell size={16} color="#0ea5e9" />
                <Text className="text-sky-900 font-bold text-sm ml-3">Test Action Notification</Text>
              </View>
              <Text className="text-sky-500 text-xs font-bold">Send now</Text>
            </Pressable>


            {/* Share App Button */}
            <Pressable
              onPress={async () => {
                try {
                  await Share.share({
                    message: "Stay hydrated with AquaFlow! The premium water tracking app. 💧",
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
              className="flex-row items-center justify-between py-4 border-b border-sky-50 active:opacity-60"
            >
              <View className="flex-row items-center">
                <Share2 size={16} color="#0ea5e9" />
                <Text className="text-sky-900 font-bold text-sm ml-3">Share AquaFlow</Text>
              </View>
              <Text className="text-sky-300 text-xs font-bold">Invite friends</Text>
            </Pressable>

            {/* Reset/Delete Data Button */}
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Delete All Local Data?",
                  "This will permanently erase all your hydration logs, daily streak history, settings, and achievements. This cannot be undone.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete Everything",
                      style: "destructive",
                      onPress: () => {
                        clearAllData();
                        Alert.alert("Data Wiped", "All local data has been successfully cleared.", [
                          { text: "OK", onPress: () => router.replace("/") },
                        ]);
                      },
                    },
                  ]
                );
              }}
              className="flex-row items-center justify-between py-4 active:opacity-60"
            >
              <View className="flex-row items-center">
                <Trash2 size={16} color="#ef4444" />
                <Text className="text-red-500 font-bold text-sm ml-3">Delete All Data</Text>
              </View>
              <Text className="text-red-300 text-xs font-bold">Wipe storage</Text>
            </Pressable>
          </View>

          <View className="mt-10 p-4 bg-sky-100/30 rounded-2xl border border-dashed border-sky-200">
            <Text className="text-sky-900/60 text-center text-xs leading-5">
              AquaFlow uses the{" "}
              <Text className="font-bold text-sky-900">33ml per kg</Text>{" "}
              standard formula, adjusted for your activity level and
              environmental conditions.
            </Text>
          </View>

          <Text className="text-sky-950/20 text-center text-[10px] font-bold mt-6 mb-4 uppercase tracking-widest">
            AquaFlow v1.0.0 (Build 1)
          </Text>
          <View className="h-10" />
        </ScrollView>
      </View>

      <View className="p-6">
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="bg-sky-500 p-5 rounded-3xl flex-row items-center justify-center shadow-lg"
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Save color="white" size={20} />
              <Text className="text-white font-black text-lg ml-2">
                Save Profile
              </Text>
            </>
          )}
        </Pressable>
      </View>

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
                const Icon = selectedAch.icon;

                return (
                  <>
                    <View className="my-4 items-center">
                      {isUnlocked ? (
                        selectedAch.image ? (
                          <Image
                            source={selectedAch.image}
                            style={{ width: 90, height: 90 }}
                            resizeMode="contain"
                          />
                        ) : (
                          <View className="p-5 rounded-full bg-orange-100">
                            <Icon size={40} color="#f97316" />
                          </View>
                        )
                      ) : (
                        <View className="p-5 rounded-full bg-slate-200">
                          <Lock size={40} color="#94a3b8" />
                        </View>
                      )}
                    </View>

                    <Text className="text-lg font-black text-sky-950 mt-2 text-center">
                      {selectedAch.title}
                    </Text>

                    <Text className="text-xs text-center text-sky-900/60 mt-2 px-4 leading-5">
                      {selectedAch.description}
                    </Text>

                    <View className="mt-6 w-full">
                      <View
                        className={`flex-row items-center justify-center p-3 rounded-2xl border ${
                          isUnlocked
                            ? "bg-teal-50 border-teal-200"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <Text
                          className={`font-bold text-xs ${
                            isUnlocked ? "text-teal-700" : "text-slate-500"
                          }`}
                        >
                          {isUnlocked ? "Unlocked 🏅" : "Locked 🔒"}
                        </Text>
                      </View>
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
