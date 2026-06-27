// services
import { getCurrentLocation } from "@/services/LocationService";
import { getWeatherData } from "@/services/WeatherService";
import { getProfile } from "../services/ProfileService";
import { rescheduleAllReminders } from "@/services/NotificationService";

// state & types
import { useHydrationStore } from "@/store/hydrationStore";
import { WeatherState, UserProfile } from "@/types";

// hooks & router
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";

// constants & utils
import { BeverageType } from "../constants/beverages";
import { 
  calculateProgress, 
  calculateCompletedBottles, 
  calculateBaseGoal 
} from "@/utils/hydration";

const useHydration = () => {
  // hooks
  const navigation = useNavigation();

  // store state & actions
  const intake = useHydrationStore((s) => s.intake);
  const logs = useHydrationStore((s) => s.logs);
  const streak = useHydrationStore((s) => s.streak);
  const weeklyVolume = useHydrationStore((s) => s.weeklyVolume);
  const addIntakeAction = useHydrationStore((s) => s.addIntake);
  const removeLogAction = useHydrationStore((s) => s.removeLog);
  const resetIntakeAction = useHydrationStore((s) => s.resetIntake);
  const checkDayReset = useHydrationStore((s) => s.checkDayReset);

  // local state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const baseGoal = profile ? calculateBaseGoal(profile) : 2000;
  const weatherMultiplier = weather?.multiplier || 1.0;
  const effectiveGoal = Math.round(baseGoal * weatherMultiplier);

  const initializeApp = useCallback(async () => {
    try {
      checkDayReset();
      const userProfile = await getProfile();
      setProfile(userProfile);

      // Let UI load immediately
      setIsLoading(false);

      // Run background tasks without awaiting them
      const reminderInterval = useHydrationStore.getState().reminderInterval;
      rescheduleAllReminders(reminderInterval || 60).catch((err) => {
        console.error("Failed to reschedule reminders:", err);
      });

      getCurrentLocation()
        .then(async (location) => {
          if (location) {
            const weatherData = await getWeatherData(
              location.latitude,
              location.longitude,
            );
            setWeather({
              ...weatherData,
              city: location.city,
            });
          }
        })
        .catch((err) => {
          console.error("Failed to fetch location or weather:", err);
        });
    } catch (e) {
      console.error("Initialization error:", e);
      setIsLoading(false);
    }
  }, [checkDayReset]);

  useEffect(() => {
    initializeApp();

    const unsubscribe = navigation.addListener("focus", () => {
      getProfile().then(setProfile);
    });

    return unsubscribe;
  }, [navigation, initializeApp]);

  return {
    totalIntake: Math.round(intake),
    intake: Math.min(Math.round(intake), effectiveGoal),
    actualIntake: Math.round(intake),
    logs,
    addIntake: (amount: number, type: BeverageType = "water") =>
      addIntakeAction(amount, type, effectiveGoal, weatherMultiplier),
    removeLog: removeLogAction,
    resetIntake: resetIntakeAction,
    profile,
    setProfile,
    isLoading,
    weather,
    effectiveGoal,

    streak,
    weeklyVolume: Math.round(weeklyVolume),
    completedBottles: calculateCompletedBottles(intake, effectiveGoal),
    progress: calculateProgress(intake, effectiveGoal),
    isGoalReached: intake >= effectiveGoal,
    lastBeverageType:
      logs.length > 0 ? logs[0].type : ("water" as BeverageType),
    unlockedAchievements: useHydrationStore((s) => s.unlockedAchievements),
  };
};

export { useHydration };

