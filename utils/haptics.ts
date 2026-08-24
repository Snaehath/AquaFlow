import * as Haptics from "expo-haptics";
import { BeverageType } from "../types";

let globalHapticsEnabled = true;

export const setGlobalHapticsEnabled = (enabled: boolean) => {
  globalHapticsEnabled = enabled;
};

const isHapticsEnabled = (): boolean => {
  return globalHapticsEnabled;
};

/**
 * Trigger subtle UI interaction feedback (button press, tab change, chip select)
 */
export const hapticLight = async () => {
  if (!isHapticsEnabled()) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    /* Ignore on platforms without haptic engines */
  }
};

/**
 * Trigger medium UI interaction feedback (quick log, toggle switch)
 */
export const hapticMedium = async () => {
  if (!isHapticsEnabled()) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    /* Ignore */
  }
};

/**
 * Trigger heavy impact feedback (custom confirm, large container log)
 */
export const hapticHeavy = async () => {
  if (!isHapticsEnabled()) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {
    /* Ignore */
  }
};

/**
 * Container & Beverage specific tactile signature
 * - Water: Crisp, clean light pulse
 * - Coffee: Warm caffeine double-pulse
 * - Tea: Gentle soft pulse
 * - Juice: Crisp medium bounce
 * - Electrolyte: Energetic heavy surge
 */
export const hapticBeverage = async (type: BeverageType = "water") => {
  if (!isHapticsEnabled()) return;
  try {
    switch (type) {
      case "coffee":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTimeout(() => {
          if (isHapticsEnabled()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }, 75);
        break;

      case "electrolyte":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => {
          if (isHapticsEnabled()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }, 90);
        break;

      case "juice":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;

      case "tea":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;

      case "water":
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  } catch {
    /* Ignore */
  }
};

/**
 * Milestone or Goal celebration burst
 */
export const hapticCelebration = async () => {
  if (!isHapticsEnabled()) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      if (isHapticsEnabled()) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    }, 120);
    setTimeout(() => {
      if (isHapticsEnabled()) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }, 240);
  } catch {
    /* Ignore */
  }
};
