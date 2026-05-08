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
