import { BeverageConfig, BeverageType, UserProfile } from "./types";

// User Defaults
export const DEFAULT_PROFILE: UserProfile = {
  weight: 70,
  activityLevel: 1,
  gender: "other",
  tempUnit: "C",
};

// Notification Bounds & Messages
export const WAKING_START_HOUR = 8; // 8:00 AM
export const WAKING_END_HOUR = 22; // 10:00 PM

export interface ReminderMessage {
  title: string;
  body: string;
}

export const REMINDER_MESSAGES: ReminderMessage[] = [
  { title: "💧 A little hydration break", body: "Have some water when you're ready." },
  { title: "💧 How about a sip?", body: "Your bottle might be waiting." },
  { title: "💧 Take a moment", body: "A little water sounds nice." },
  { title: "💧 Gentle pause", body: "Take your time and stay refreshed." },
  { title: "💧 Just a reminder", body: "Have a drink when you feel like it." },
  { title: "💧 Quiet refresh", body: "A small sip whenever you'd like." },
];

export const BEVERAGE_TYPES: BeverageType[] = [
  "water",
  "coffee",
  "tea",
  "juice",
  "electrolyte",
];

// Beverage Categories & Palette
export const BEVERAGES: Record<BeverageType, BeverageConfig> = {
  water: {
    type: "water",
    label: "Water",
    color: "#38bdf8",
    container: "bottle",
  },
  coffee: {
    type: "coffee",
    label: "Coffee",
    color: "#78350f",
    container: "cup",
  },
  tea: {
    type: "tea",
    label: "Tea",
    color: "#4ade80",
    container: "glass",
  },
  juice: {
    type: "juice",
    label: "Juice",
    color: "#fb923c",
    container: "glass",
  },
  electrolyte: {
    type: "electrolyte",
    label: "Electrolytes",
    color: "#22d3ee",
    container: "flask",
  },
};

