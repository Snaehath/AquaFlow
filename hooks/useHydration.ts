import { getCurrentLocation } from "@/services/LocationService";
import { getWeatherData } from "@/services/WeatherService";
import { useHydrationStore } from "@/store/hydrationStore";
import { WeatherState } from "@/types";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BeverageType } from "../constants/beverages";
import {
    calculateBaseGoal,
    getProfile,
    UserProfile,
} from "../services/ProfileService";

const useHydration = () => {
  const navigation = useNavigation();

  // Use selectors to avoid infinite loops
  const intake = useHydrationStore((s) => s.intake);
  const logs = useHydrationStore((s) => s.logs);

  const streak = useHydrationStore((s) => s.streak);
  const weeklyVolume = useHydrationStore((s) => s.weeklyVolume);
  const addIntakeAction = useHydrationStore((s) => s.addIntake);
  const removeLogAction = useHydrationStore((s) => s.removeLog);
  const resetIntakeAction = useHydrationStore((s) => s.resetIntake);
  const checkDayReset = useHydrationStore((s) => s.checkDayReset);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const baseGoal = profile ? calculateBaseGoal(profile) : 2000;
  const weatherMultiplier = weather?.multiplier || 1.0;
  const effectiveGoal = Math.round(baseGoal * weatherMultiplier);

  const initializeApp = useCallback(async () => {
    try {
      // These actions are stable references from the store
      checkDayReset();
      const userProfile = await getProfile();
      setProfile(userProfile);

      const location = await getCurrentLocation();
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
    } catch (e) {
      console.error("Initialization error:", e);
    } finally {
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
    completedBottles: Math.floor(intake / effectiveGoal),
    progress:
      intake > 0 && intake % effectiveGoal === 0
        ? 1.0
        : (intake % effectiveGoal) / effectiveGoal,
    isGoalReached: intake >= effectiveGoal,
    lastBeverageType:
      logs.length > 0 ? logs[0].type : ("water" as BeverageType),
    unlockedAchievements: useHydrationStore((s) => s.unlockedAchievements),
  };
};

export { useHydration };

