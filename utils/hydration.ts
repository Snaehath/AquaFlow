// types & constants
import { BeverageType, BEVERAGES } from "../constants/beverages";
import { UserProfile } from "@/types";

// hydration calculations
export const calculateEffectiveAmount = (amount: number, type: BeverageType): number => {
  const config = BEVERAGES[type] || BEVERAGES.water;
  return amount * config.multiplier;
};

export const calculateProgress = (intake: number, effectiveGoal: number): number => {
  if (effectiveGoal <= 0) return 0;
  return intake > 0 && intake % effectiveGoal === 0
    ? 1.0
    : (intake % effectiveGoal) / effectiveGoal;
};

export const calculateCompletedBottles = (intake: number, effectiveGoal: number): number => {
  if (effectiveGoal <= 0) return 0;
  return Math.floor(intake / effectiveGoal);
};

export const hasCrossedGoal = (
  currentIntake: number,
  newIntake: number,
  goal: number
): boolean => {
  const oldBottleCount = Math.floor(currentIntake / goal);
  const newBottleCount = Math.floor(newIntake / goal);
  return newBottleCount > oldBottleCount;
};

export const calculateBaseGoal = (profile: UserProfile): number => {
  // Basic health formula: 33ml per kg of body weight
  // Adjusted by activity level
  const baseIntake = profile.weight * 33;
  return Math.round(baseIntake * profile.activityLevel);
};
