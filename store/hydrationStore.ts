// types & storage
import {
  BeverageType,
  DailyHistoryEntry,
  HydrationLog,
  QuickPreset,
} from "@/types";

// libraries
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// utils & services
import { rescheduleAllReminders } from "@/services/NotificationService";
import { mmkvStorage } from "@/services/storage";
import { getTodayString, getWeekStart } from "@/utils/date";
import { hapticBeverage, setGlobalHapticsEnabled } from "@/utils/haptics";

export const DEFAULT_QUICK_PRESETS: QuickPreset[] = [
  { id: "preset_1", label: "Glass", amount: 250, type: "water" },
  { id: "preset_2", label: "Coffee", amount: 350, type: "coffee" },
  { id: "preset_3", label: "Bottle", amount: 500, type: "water" },
  { id: "preset_4", label: "Electrolytes", amount: 500, type: "electrolyte" },
];

// store interface
interface HydrationStore {
  intake: number;
  logs: HydrationLog[];
  lastDate: string;
  weeklyVolume: number;
  lastWeekReset: string;
  alwaysNotify: boolean;
  reminderInterval: number;
  hapticsEnabled: boolean;
  weeklyHistory: DailyHistoryEntry[];
  quickPresets: QuickPreset[];

  // actions
  addIntake: (amount: number, type?: BeverageType) => Promise<void>;
  removeLog: (id: string) => void;
  resetIntake: () => void;
  checkDayReset: () => void;
  setAlwaysNotify: (enabled: boolean) => void;
  setReminderInterval: (minutes: number) => Promise<void>;
  setHapticsEnabled: (enabled: boolean) => void;
  updateQuickPreset: (index: number, preset: QuickPreset) => void;
  resetQuickPresets: () => void;
  clearAllData: () => void;
}

export const useHydrationStore = create<HydrationStore>()(
  persist(
    (set, get) => ({
      intake: 0,
      logs: [],
      lastDate: getTodayString(),
      weeklyVolume: 0,
      lastWeekReset: getWeekStart(),
      alwaysNotify: false,
      reminderInterval: 90,
      hapticsEnabled: true,
      weeklyHistory: [],
      quickPresets: DEFAULT_QUICK_PRESETS,

      setAlwaysNotify: (enabled: boolean) => set({ alwaysNotify: enabled }),

      setReminderInterval: async (minutes: number) => {
        set({ reminderInterval: minutes });
        await rescheduleAllReminders(minutes);
      },

      setHapticsEnabled: (enabled: boolean) => {
        setGlobalHapticsEnabled(enabled);
        set({ hapticsEnabled: enabled });
      },

      updateQuickPreset: (index: number, preset: QuickPreset) => {
        const presets = [...(get().quickPresets || DEFAULT_QUICK_PRESETS)];
        if (index >= 0 && index < presets.length) {
          presets[index] = preset;
          set({ quickPresets: presets });
        }
      },

      resetQuickPresets: () => set({ quickPresets: DEFAULT_QUICK_PRESETS }),

      clearAllData: () =>
        set({
          intake: 0,
          logs: [],
          lastDate: getTodayString(),
          weeklyVolume: 0,
          lastWeekReset: getWeekStart(),
          alwaysNotify: false,
          reminderInterval: 90,
          hapticsEnabled: true,
          weeklyHistory: [],
          quickPresets: DEFAULT_QUICK_PRESETS,
        }),

      checkDayReset: () => {
        const today = getTodayString();
        const currentWeek = getWeekStart();
        const state = get();

        const updates: Partial<HydrationStore> = {};

        if (state.lastDate !== today) {
          // Save yesterday's entry to weeklyHistory
          const yesterdayEntry: DailyHistoryEntry = {
            date: state.lastDate,
            volume: state.intake,
          };
          const cleanHistory = (state.weeklyHistory || []).filter(
            (h) => h.date !== state.lastDate,
          );
          const newHistory = [...cleanHistory, yesterdayEntry].slice(-7);

          updates.intake = 0;
          updates.logs = [];
          updates.lastDate = today;
          updates.weeklyHistory = newHistory;
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

      addIntake: async (amount, type = "water") => {
        const newLog: HydrationLog = {
          id: Math.random().toString(36).substring(7),
          amount,
          type,
          timestamp: Date.now(),
        };

        set((state) => ({
          intake: state.intake + amount,
          weeklyVolume: state.weeklyVolume + amount,
          logs: [newLog, ...state.logs],
        }));

        await hapticBeverage(type);
      },

      removeLog: (id) => {
        set((state) => {
          const logToRemove = state.logs.find((l) => l.id === id);
          if (!logToRemove) return state;

          return {
            intake: Math.max(0, state.intake - logToRemove.amount),
            weeklyVolume: Math.max(0, state.weeklyVolume - logToRemove.amount),
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
