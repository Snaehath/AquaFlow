import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "AQUAFLOW_USER_PROFILE";

export type UserProfile = {
  weight: number;      // in kg
  activityLevel: 1 | 1.2 | 1.5; // sedentary, active, athletic
  gender: "male" | "female" | "other";
  tempUnit?: "C" | "F";
};

export const DEFAULT_PROFILE: UserProfile = {
  weight: 70,
  activityLevel: 1,
  gender: "other",
  tempUnit: "F",
};

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const stored = await AsyncStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  } catch (e) {
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const calculateBaseGoal = (profile: UserProfile): number => {
  // Basic health formula: 33ml per kg of body weight
  // Adjusted by activity level
  const baseIntake = profile.weight * 33;
  return Math.round(baseIntake * profile.activityLevel);
};
