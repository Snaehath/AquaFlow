import { mmkvStorage } from "./storage";
import { UserProfile } from "@/types";
import { DEFAULT_PROFILE } from "@/constants";

const PROFILE_KEY = "AQUAFLOW_USER_PROFILE";

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const stored = mmkvStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  } catch (e) {
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  mmkvStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const calculateBaseGoal = (profile: UserProfile): number => {
  // Basic health formula: 33ml per kg of body weight
  // Adjusted by activity level
  const baseIntake = profile.weight * 33;
  return Math.round(baseIntake * profile.activityLevel);
};
