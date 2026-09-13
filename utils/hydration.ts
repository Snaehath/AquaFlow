// types
import { UserProfile } from "@/types";

// Repeating reference bottle calculations
export const calculateProgress = (intake: number, dailyReference: number): number => {
  if (dailyReference <= 0) return 0;
  const roundedIntake = Math.round(intake);
  const remainder = roundedIntake % dailyReference;
  return roundedIntake > 0 && remainder === 0
    ? 1.0
    : remainder / dailyReference;
};

export const calculateCompletedBottles = (intake: number, dailyReference: number): number => {
  if (dailyReference <= 0) return 0;
  return Math.floor(Math.round(intake) / dailyReference);
};

export const calculateDailyReference = (profile: UserProfile): number => {
  // General baseline formula: 33ml per kg of body weight, scaled by activity
  const baseIntake = profile.weight * 33;
  return Math.round(baseIntake * profile.activityLevel);
};
