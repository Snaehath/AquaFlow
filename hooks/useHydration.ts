// services
import { getCurrentLocation } from "@/services/LocationService";
import { getWeatherData } from "@/services/WeatherService";
import { getProfile } from "../services/ProfileService";

// state & types
import { useHydrationStore } from "@/store/hydrationStore";
import { WeatherState, UserProfile, BeverageType } from "@/types";

// hooks & router
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";

// utils
import { 
  calculateProgress, 
  calculateCompletedBottles, 
  calculateDailyReference 
} from "@/utils/hydration";

const useHydration = () => {
  // hooks
  const navigation = useNavigation();

  // store state & actions
  const intake = useHydrationStore((s) => s.intake);
  const logs = useHydrationStore((s) => s.logs);
  const weeklyVolume = useHydrationStore((s) => s.weeklyVolume);
  const weeklyHistory = useHydrationStore((s) => s.weeklyHistory);
  const addIntakeAction = useHydrationStore((s) => s.addIntake);
  const removeLogAction = useHydrationStore((s) => s.removeLog);
  const resetIntakeAction = useHydrationStore((s) => s.resetIntake);
  const checkDayReset = useHydrationStore((s) => s.checkDayReset);

  // local state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Daily reference: general guide based on weight and activity
  const dailyReference = profile ? calculateDailyReference(profile) : 2300;

  const initializeApp = useCallback(async () => {
    try {
      checkDayReset();
      const userProfile = await getProfile();
      setProfile(userProfile);

      // Let UI load immediately
      setIsLoading(false);

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
    intake: Math.round(intake),
    actualIntake: Math.round(intake),
    logs,
    addIntake: (amount: number, type: BeverageType = "water") =>
      addIntakeAction(amount, type),
    removeLog: removeLogAction,
    resetIntake: resetIntakeAction,
    profile,
    setProfile,
    isLoading,
    weather,
    dailyReference,
    effectiveGoal: dailyReference, // keep backwards alias for any subcomponents transitioning

    weeklyVolume: Math.round(weeklyVolume),
    weeklyHistory,
    completedBottles: calculateCompletedBottles(Math.round(intake), dailyReference),
    progress: calculateProgress(Math.round(intake), dailyReference),
    lastBeverageType:
      logs.length > 0 ? logs[0].type : ("water" as BeverageType),
  };
};

export { useHydration };

