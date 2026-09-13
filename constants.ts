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

export const REMINDER_MESSAGES: string[] = [
  "A small sip might feel good right now. 💧",
  "Take your time and stay refreshed. 🌊",
  "A gentle pause for a glass of water. ✨",
  "A little refresh whenever you're ready. 🌿",
  "Water break whenever you'd like. 💎",
  "A quiet moment to hydrate. 🧊",
  "Enjoying your day? Here's a gentle reminder to sip. 💧",
  "Keep your natural flow going. 🌟",
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

