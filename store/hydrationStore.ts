// services & storage
import {
  scheduleSmartReminder,
  sendGoalCelebration,
} from "@/services/NotificationService";
import { mmkvStorage } from "@/services/storage";
import { HydrationLog } from "@/types";

// libraries
import * as Haptics from "expo-haptics";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// constants & utils
import { BeverageType } from "../constants/beverages";
import { checkAchievements } from "@/services/AchievementService";
import { getTodayString, getYesterdayString, getWeekStart } from "@/utils/date";
import { 
  calculateEffectiveAmount, 
  calculateCompletedBottles, 
  hasCrossedGoal 
} from "@/utils/hydration";

// store interface
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

  // actions
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

// store implementation
export const useHydrationStore = create<HydrationStore>()(
  persist(
    (set, get) => ({
      intake: 0,
      logs: [],
      lastDate: getTodayString(),
      streak: 1,
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

          // Activity-based streak: increment if last session was yesterday and had logs
          if (state.lastDate === yesterday && state.logs.length > 0) {
            newStreak += 1;
          } else {
            // Missed a day or no logs last session, reset to Day 1
            newStreak = 1;
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
        const effectiveAmount = calculateEffectiveAmount(amount, type);
        const today = getTodayString();
        
        const newLog: HydrationLog = {
          id: Math.random().toString(36).substring(7),
          amount,
          effectiveAmount,
          type,
          timestamp: Date.now(),
        };

        const currentIntake = get().intake;
        const newIntake = currentIntake + effectiveAmount;

        set((state) => ({
          intake: state.intake + effectiveAmount,
          weeklyVolume: state.weeklyVolume + effectiveAmount,
          logs: [newLog, ...state.logs],
        }));

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (hasCrossedGoal(currentIntake, newIntake, effectiveGoal)) {
          if (get().lastGoalMetDate !== today) {
            set({ lastGoalMetDate: today });
          }
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          await sendGoalCelebration();
        }

        // --- Achievement Checks ---
        const state = get();
        checkAchievements(
          state.unlockedAchievements,
          {
            newIntake,
            newBottleCount: calculateCompletedBottles(newIntake, effectiveGoal),
            streak: state.streak,
            logsCount: state.logs.length,
          },
          state.unlockAchievement
        );

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

