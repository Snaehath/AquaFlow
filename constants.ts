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
  "Time for a quick sip! Keep your flow going. 💧",
  "Stay sharp, stay hydrated! 🌊",
  "Your body will thank you for this water break. ✨",
  "Hydration is the secret to focus. Take a drink! 🧠",
  "Is your water bottle empty? Time for a refill! 🍼",
  "Fuel your energy! A glass of water works wonders. ⚡",
  "Beat tiredness with a fresh sip of water. 🧊",
  "Keep that hydration streak alive! 🏆",
  "Hydrate now, feel amazing all day! 🌟",
  "Pure water, pure health. Take a quick hydration break! 💎",
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
    id: "camel",
    title: "Desert Camel",
    description: "Complete 3 full bottles in one day.",
    icon: Trophy,
    image: require("./assets/badges/camel.png"),
  },
];

