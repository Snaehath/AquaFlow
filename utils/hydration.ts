// types
import { UserProfile } from "@/types";

/**
 * Reference Bottle Mental Model:
 * 
 * Bottles represent intuitive mental units of volume, not a finish line or chore.
 * 
 * Formula:
 *   referenceUnits = floor(intake / dailyReference)
 *   remainder = intake - (referenceUnits * dailyReference)
 * 
 * Example:
 *   intake = 5200 ml, dailyReference = 2500 ml
 *   5200 / 2500 -> 2 complete reference volumes (completedBottles = 2)
 *   remainder = 200 ml
 * 
 * IMPORTANT SEMANTICS:
 *   "💧 2 reference bottles · +200 ml"
 *   The "+200 ml" strictly indicates fluid consumed BEYOND the completed 
 *   reference volumes — it is NOT remaining volume left to drink.
 */

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

