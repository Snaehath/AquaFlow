export type BeverageType = "water" | "coffee" | "tea" | "juice" | "electrolyte";
export type ContainerType = "bottle" | "cup" | "glass" | "flask";

export interface BeverageConfig {
  type: BeverageType;
  multiplier: number;
  label: string;
  color: string;
  container: ContainerType;
}

export type HydrationLog = {
  id: string;
  amount: number;
  effectiveAmount: number;
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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  image?: any;
}

export interface DailyHistoryEntry {
  date: string;
  volume: number;
}

export { DEFAULT_PROFILE } from "./constants";
