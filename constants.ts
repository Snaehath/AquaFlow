import { Star, Target, Flame, Shield, Trophy } from "lucide-react-native";
import {
  Achievement,
  BeverageConfig,
  BeverageType,
  UserProfile,
} from "./types";

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

// Beverage Multipliers & Palette
export const BEVERAGES: Record<BeverageType, BeverageConfig> = {
  water: {
    type: "water",
    multiplier: 1.0,
    label: "Water",
    color: "#38bdf8",
    container: "bottle",
  },
  coffee: {
    type: "coffee",
    multiplier: 0.9,
    label: "Coffee",
    color: "#78350f",
    container: "cup",
  },
  tea: {
    type: "tea",
    multiplier: 0.92,
    label: "Tea",
    color: "#4ade80",
    container: "glass",
  },
  juice: {
    type: "juice",
    multiplier: 0.95,
    label: "Juice",
    color: "#fb923c",
    container: "glass",
  },
  electrolyte: {
    type: "electrolyte",
    multiplier: 1.15,
    label: "Electrolytes",
    color: "#22d3ee",
    container: "flask",
  },
};

// Achievement Badges (Core 4 Milestone System)
export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: "first_step",
    title: "First Sip",
    description: "Log your first drink.",
    icon: Star,
    image: require("./assets/badges/first_step.png"),
  },
  {
    id: "hydrated_human",
    title: "Hydrated Human",
    description: "Hit your daily goal once.",
    icon: Target,
    image: require("./assets/badges/hydrated_human.png"),
  },
  {
    id: "streak_3",
    title: "3-Day Flow",
    description: "Maintain a 3-day hydration streak.",
    icon: Flame,
    image: require("./assets/badges/consistency.png"),
  },
  {
    id: "consistent_flow",
    title: "Consistent Flow",
    description: "Reached your hydration target consistently across 7 days.",
    icon: Trophy,
    image: require("./assets/badges/camel.png"),
  },
];

