import { BeverageType } from "./constants/beverages";

export type HydrationLog = {
  id: string;
  amount: number; // Nominal amount (ml)
  effectiveAmount: number; // After multiplier
  type: BeverageType;
  timestamp: number;
};

export type WeatherState = {
  temp: number;
  city: string;
  condition: string;
  multiplier: number;
};

export type UserProfile = {
  weight: number;
  activityLevel: 1 | 1.2 | 1.5;
  gender: "male" | "female" | "other";
  tempUnit: "C" | "F";
};

export const DEFAULT_PROFILE: UserProfile = {
  weight: 70,
  activityLevel: 1,
  gender: "other",
  tempUnit: "F",
};
