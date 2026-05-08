import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const SLEEP_START_HOUR = 22; // 10 PM
const SLEEP_END_HOUR = 8;    // 8 AM

const REMINDER_MESSAGES = [
  "Time for a quick sip! Keep your flow going. 💧",
  "Stay sharp, stay hydrated! 🌊",
  "Your body will thank you for this water break. ✨",
  "Hydration is the secret to focus. Take a drink! 🧠",
  "Is your water bottle empty? Time for a refill! 🍼",
];

const HEAT_MESSAGES = [
  "It's hot outside! ☀️ Extra hydration needed today.",
  "Heatwave alert! 🌡️ Stay cool with some fresh water.",
  "Don't let the heat get to you. Keep sipping! 🧊",
  "High temperatures today. Your goal is adjusted for safety. 💧",
];

export const scheduleSmartReminder = async (
  currentIntake?: number,
  goal?: number,
  lastLogAmount?: number,
  weatherMultiplier: number = 1.0,
  alwaysNotify: boolean = false
) => {
  if (Platform.OS === "web") return;

  // 1. Clear previous
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 2. Goal Check - If goal is met, don't schedule a new reminder unless alwaysNotify is on
  if (!alwaysNotify && currentIntake !== undefined && goal !== undefined && currentIntake >= goal) {
    console.log("Goal met, silencing reminders.");
    return;
  }

  // 3. Adaptive Delay Logic
  let delayMinutes = 120; // Default 2 hours
  if (lastLogAmount) {
    if (lastLogAmount < 200) delayMinutes = 60;        // 1 hour for small sips
    else if (lastLogAmount > 450) delayMinutes = 180;  // 3 hours for large bottles
  }

  // If it's hot, remind 25% sooner
  if (weatherMultiplier > 1.1) {
    delayMinutes = Math.round(delayMinutes * 0.75);
  }

  const now = new Date();
  const scheduledTime = new Date(now.getTime() + delayMinutes * 60 * 1000);
  const scheduledHour = scheduledTime.getHours();

  // 4. Sleep Check Logic
  let finalTriggerDate = scheduledTime;

  if (scheduledHour >= SLEEP_START_HOUR || scheduledHour < SLEEP_END_HOUR) {
    // Move it to morning
    finalTriggerDate = new Date();
    if (scheduledHour >= SLEEP_START_HOUR) {
      finalTriggerDate.setDate(finalTriggerDate.getDate() + 1);
    }
    finalTriggerDate.setHours(SLEEP_END_HOUR, Math.floor(Math.random() * 15) + 5, 0, 0);
  }

  // 5. Select Message
  const isHot = weatherMultiplier > 1.1;
  const pool = isHot ? [...HEAT_MESSAGES, ...REMINDER_MESSAGES] : REMINDER_MESSAGES;
  const message = pool[Math.floor(Math.random() * pool.length)];

  // 6. Schedule via Date trigger
  await Notifications.scheduleNotificationAsync({
    content: {
      title: isHot ? "Heat Alert ☀️" : "AquaFlow 💧",
      body: message,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: finalTriggerDate,
    },
  });
};

export const cancelAllPending = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const sendGoalCelebration = async () => {
  if (Platform.OS === "web") return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Wow! Bottle Completed! 🏆",
      body: "You've reached your milestone. Keep that flow going!",
      sound: true,
    },
    trigger: null,
  });
};

export const sendAchievementUnlocked = async (title: string, body: string) => {
  if (Platform.OS === "web") return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Achievement Unlocked! 🏅`,
      body: `You earned the "${title}" badge: ${body}`,
      sound: true,
    },
    trigger: null,
  });
};
