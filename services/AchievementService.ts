// constants & services
import { ACHIEVEMENTS_DATA } from "@/constants";
import { sendAchievementUnlocked } from "./NotificationService";
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

  if (!unlockedIds.includes("camel") && newBottleCount >= 3) {
    potentialUnlocks.push("camel");
  }

  potentialUnlocks.forEach((id) => {
    const achievement = ACHIEVEMENTS_DATA.find((a) => a.id === id);
    if (achievement) {
      onUnlock(id);
      hapticSuccess();
      sendAchievementUnlocked(achievement.title, achievement.description);
      
      // Trigger in-app toast notification
      useToastStore.getState().showToast({
        title: "Achievement Unlocked! 🏅",
        description: `"${achievement.title}" - ${achievement.description}`,
        variant: "success",
        image: achievement.image,
        icon: achievement.icon,
        duration: 5000,
      });
    }
  });
};
