// types
import { UserProfile } from "@/types";

// Progress within current bottle cycle (0 to 1)
export const calculateProgress = (intake: number, dailyReference: number): number => {
  if (dailyReference <= 0) return 0;
  const roundedIntake = Math.round(intake);
  const remainder = roundedIntake % dailyReference;
  return roundedIntake > 0 && remainder === 0
    ? 1.0
    : remainder / dailyReference;
};

// Completed bottle count: floor(intake / dailyReference)
export const calculateCompletedBottles = (intake: number, dailyReference: number): number => {
  if (dailyReference <= 0) return 0;
  return Math.floor(Math.round(intake) / dailyReference);
};

// Estimated baseline reference: 33ml/kg scaled by daily activity
export const calculateDailyReference = (profile: UserProfile): number => {
  const baseIntake = profile.weight * 33;
  return Math.round(baseIntake * profile.activityLevel);
};


