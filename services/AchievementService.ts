// constants & services
import { ACHIEVEMENTS_DATA } from "@/constants";
import { hapticSuccess } from "@/utils/haptics";
import { useToastStore } from "@/store/toastStore";

// achievement logic
export const checkAchievements = (
  unlockedIds: string[],
  stats: {
    newBottleCount: number;
    streak: number;
    logsCount: number;
  },
  onUnlock: (id: string) => void,
) => {
  const { streak, logsCount, newBottleCount } = stats;

  const potentialUnlocks: string[] = [];

  if (!unlockedIds.includes("first_step") && logsCount > 0) {
    potentialUnlocks.push("first_step");
  }

  if (!unlockedIds.includes("hydrated_human") && newBottleCount >= 1) {
    potentialUnlocks.push("hydrated_human");
  }

  if (!unlockedIds.includes("streak_3") && streak >= 3) {
    potentialUnlocks.push("streak_3");
  }

  if (!unlockedIds.includes("consistent_flow") && streak >= 7) {
    potentialUnlocks.push("consistent_flow");
  }

  potentialUnlocks.forEach((id) => {
    const achievement = ACHIEVEMENTS_DATA.find((a) => a.id === id);
    if (achievement) {
      onUnlock(id);
      hapticSuccess();
      
      // Differentiated in-app celebration without double-banner OS push notification
      const isSevenDay = id === "consistent_flow";
      const isFirstStep = id === "first_step";

      useToastStore.getState().showToast({
        title: isSevenDay ? "7-Day Rhythm Reached! 🌿" : isFirstStep ? "First Drink Logged 💧" : "Milestone Reached ✨",
        description: `"${achievement.title}" — ${achievement.description}`,
        variant: "success",
        image: achievement.image,
        icon: achievement.icon,
        duration: isSevenDay ? 5500 : isFirstStep ? 3500 : 4500,
      });
    }
  });
};
