import {
  scheduleSmartReminder,
  sendAchievementUnlocked,
  sendGoalCelebration,
} from "@/services/NotificationService";
import { mmkvStorage } from "@/services/storage";
import { HydrationLog } from "@/types";
import * as Haptics from "expo-haptics";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BEVERAGES, BeverageType } from "../constants/beverages";

interface HydrationStore {
  intake: number;
  logs: HydrationLog[];
  lastDate: string;
  streak: number;
  lastGoalMetDate: string | null;
  unlockedAchievements: string[];
  weeklyVolume: number;
  lastWeekReset: string;
  alwaysNotify: boolean;

  // Actions
  addIntake: (
    amount: number,
    type?: BeverageType,
    effectiveGoal?: number,
    weatherMultiplier?: number,
  ) => Promise<void>;
  removeLog: (id: string) => void;
  resetIntake: () => void;
  checkDayReset: () => void;
  unlockAchievement: (id: string) => void;
  setAlwaysNotify: (enabled: boolean) => void;
}

const getTodayString = () => new Date().toISOString().split("T")[0];
const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

const getWeekStart = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split("T")[0];
};

export const useHydrationStore = create<HydrationStore>()(
  persist(
    (set, get) => ({
      intake: 0,
      logs: [],
      lastDate: getTodayString(),
      streak: 0,
      lastGoalMetDate: null,
      unlockedAchievements: [],
      weeklyVolume: 0,
      lastWeekReset: getWeekStart(),
      alwaysNotify: false,

      setAlwaysNotify: (enabled: boolean) => set({ alwaysNotify: enabled }),

      unlockAchievement: (id: string) => {
        const { unlockedAchievements } = get();
        if (!unlockedAchievements.includes(id)) {
          set({ unlockedAchievements: [...unlockedAchievements, id] });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          let title = "";
          let body = "";
          switch (id) {
            case "first_step":
              title = "Taking First Step";
              body = "Logged your first drink";
              break;
            case "hydrated_human":
              title = "Hydrated Human";
              body = "Hit your daily goal for the first time";
              break;
            case "camel":
              title = "Be a Camel";
              body = "Completed more than 1 bottle in a day";
              break;
            case "consistency":
              title = "Water Consistence";
              body = "Achieved a 2-day streak";
              break;
          }
          if (title) sendAchievementUnlocked(title, body);
        }
      },

      checkDayReset: () => {
        const today = getTodayString();
        const currentWeek = getWeekStart();
        const state = get();

        const updates: Partial<HydrationStore> = {};

        if (state.lastDate !== today) {
          const yesterday = getYesterdayString();
          let newStreak = state.streak;

          if (
            state.lastGoalMetDate !== yesterday &&
            state.lastGoalMetDate !== state.lastDate
          ) {
            newStreak = 0;
          }

          updates.intake = 0;
          updates.logs = [];
          updates.lastDate = today;
          updates.streak = newStreak;
        }

        if (state.lastWeekReset !== currentWeek) {
          updates.weeklyVolume = 0;
          updates.lastWeekReset = currentWeek;
        } else if (state.weeklyVolume === 0 && state.intake > 0) {
          // Sync weekly volume with current daily intake if it was just initialized
          updates.weeklyVolume = state.intake;
        }

        if (Object.keys(updates).length > 0) {
          set(updates);
        }
      },

      addIntake: async (
        amount,
        type = "water",
        effectiveGoal = 2000,
        weatherMultiplier = 1.0,
      ) => {
        const config = BEVERAGES[type] || BEVERAGES.water;
        const effectiveAmount = amount * config.multiplier;

        const newLog: HydrationLog = {
          id: Math.random().toString(36).substring(7),
          amount,
          effectiveAmount,
          type,
          timestamp: Date.now(),
        };

        const currentIntake = get().intake;
        const newIntake = currentIntake + effectiveAmount;
        const today = getTodayString();

        set((state) => ({
          intake: state.intake + effectiveAmount,
          weeklyVolume: state.weeklyVolume + effectiveAmount,
          logs: [newLog, ...state.logs],
        }));

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const oldBottleCount = Math.floor(currentIntake / effectiveGoal);
        const newBottleCount = Math.floor(newIntake / effectiveGoal);
        const crossedGoal = newBottleCount > oldBottleCount;

        if (crossedGoal) {
          const state = get();
          if (state.lastGoalMetDate !== today) {
            set((s) => ({
              streak: s.streak + 1,
              lastGoalMetDate: today,
            }));
          }

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          await sendGoalCelebration();
        }

        // --- Achievement Checks ---
        const { unlockedAchievements, unlockAchievement, streak } = get();

        if (!unlockedAchievements.includes("first_step")) {
          unlockAchievement("first_step");
        }

        if (
          newBottleCount >= 1 &&
          !unlockedAchievements.includes("hydrated_human")
        ) {
          unlockAchievement("hydrated_human");
        }

        if (newBottleCount >= 9 && !unlockedAchievements.includes("camel")) {
          unlockAchievement("camel");
        }

        if (streak >= 2 && !unlockedAchievements.includes("consistency")) {
          unlockAchievement("consistency");
        }

        await scheduleSmartReminder(
          newIntake,
          effectiveGoal,
          amount,
          weatherMultiplier,
          get().alwaysNotify
        );
      },

      removeLog: (id) => {
        set((state) => {
          const logToRemove = state.logs.find((l) => l.id === id);
          if (!logToRemove) return state;

          return {
            intake: Math.max(0, state.intake - logToRemove.effectiveAmount),
            weeklyVolume: Math.max(0, state.weeklyVolume - logToRemove.effectiveAmount),
            logs: state.logs.filter((l) => l.id !== id),
          };
        });
      },

      resetIntake: () => {
        set({ intake: 0, logs: [] });
      },
    }),
    {
      name: "hydration-storage",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
