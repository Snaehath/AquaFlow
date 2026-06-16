import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile, DEFAULT_PROFILE } from "@/types";

const PROFILE_KEY = "AQUAFLOW_USER_PROFILE";

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
