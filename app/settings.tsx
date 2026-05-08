import { useRouter } from "expo-router";
import {
  Activity,
  Award,
  ChevronLeft,
  Lock,
  Save,
  Scale,
  Star,
  Target,
  Thermometer,
  Trophy,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getProfile,
  saveProfile,
  UserProfile,
} from "../services/ProfileService";
import { useHydrationStore } from "../store/hydrationStore";

const ACHIEVEMENTS = [
  {
    id: "first_step",
    title: "Taking First Step",
    description: "Log your first drink",
    icon: Star,
    image: require("../assets/badges/first_step.png"),
  },
  {
    id: "hydrated_human",
    title: "Hydrated Human",
    description: "Hit your daily goal",
    icon: Target,
    image: require("../assets/badges/hydrated_human.png"),
  },
  {
    id: "camel",
    title: "Be a Camel",
    description: "Complete >1 bottle in a day",
    icon: Trophy,
    image: require("../assets/badges/camel.png"),
  },
  {
    id: "consistency",
    title: "Water Consistence",
    description: "Achieve a 2-day streak",
    icon: Award,
    image: require("../assets/badges/consistency.png"),
  },
];

const Settings = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<1 | 1.2 | 1.5>(1);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("F");
  const [isSaving, setIsSaving] = useState(false);
  const unlockedAchievements = useHydrationStore((s) => s.unlockedAchievements);

  useEffect(() => {
    const load = async () => {
      const p = await getProfile();
      setProfile(p);
      setWeight(p.weight.toString());
      setActivity(p.activityLevel);
      setTempUnit(p.tempUnit || "F");
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    const newProfile: UserProfile = {
      ...profile,
      weight: parseFloat(weight) || 70,
      activityLevel: activity,
      tempUnit,
    };
    await saveProfile(newProfile);
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
            <View className="bg-orange-100 p-3 rounded-2xl mr-4">
              <Award size={20} color="#f97316" />
            </View>
            <View className="flex-1">
              <Text className="text-sky-950 font-bold">Achievements</Text>
              <Text className="text-sky-500 text-xs">
                Unlock badges by staying hydrated
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = unlockedAchievements.includes(ach.id);
              const Icon = ach.icon;
              return (
                <View
                  key={ach.id}
                  className="w-[48%] bg-sky-50 p-4 rounded-2xl border border-sky-100 mb-3 items-center"
                >
                  {isUnlocked ? (
                    ach.image ? (
                      <Image
                        source={ach.image}
                        style={{ width: 54, height: 54, marginBottom: 8 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <View className="p-3 rounded-full mb-2 bg-orange-100">
                        <Icon size={24} color="#f97316" />
                      </View>
                    )
                  ) : (
                    <View className="p-3 rounded-full mb-2 bg-slate-200">
                      <Lock size={24} color="#94a3b8" />
                    </View>
                  )}
                  <Text
                    className={`text-center font-bold text-xs ${isUnlocked ? "text-sky-950" : "text-slate-400"}`}
                  >
                    {ach.title}
                  </Text>
                  <Text className="text-[9px] text-center text-slate-500 mt-1">
                    {ach.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="mt-10 p-4 bg-sky-100/30 rounded-2xl border border-dashed border-sky-200">
          <Text className="text-sky-900/60 text-center text-xs leading-5">
            AquaFlow uses the{" "}
            <Text className="font-bold text-sky-900">33ml per kg</Text> standard
            formula, adjusted for your activity level and environmental
            conditions.
          </Text>
        </View>
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
    </SafeAreaView>
  );
};

export default Settings;
