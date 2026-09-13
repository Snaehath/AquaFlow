export type BeverageType = "water" | "coffee" | "tea" | "juice" | "electrolyte";
export type ContainerType = "bottle" | "cup" | "glass" | "flask";

export interface BeverageConfig {
  type: BeverageType;
  label: string;
  color: string;
  container: ContainerType;
}

export type HydrationLog = {
  id: string;
  amount: number;
  type: BeverageType;
  timestamp: number;
};

export type WeatherState = {
  temp: number;
  city: string;
  condition: string;
};

export type UserProfile = {
  weight: number;
  activityLevel: 1 | 1.2 | 1.5;
  gender: "male" | "female" | "other";
  tempUnit: "C" | "F";
};

export interface QuickPreset {
  id: string;
  label: string;
  amount: number;
  type: BeverageType;
}

export interface DailyHistoryEntry {
  date: string;
  volume: number;
}

