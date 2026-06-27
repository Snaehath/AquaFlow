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

export const rescheduleAllReminders = async (intervalMinutes: number) => {
  if (Platform.OS === "web") return;

  // 1. Clear previous
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 2. Schedule daily repeating reminders for waking hours (8 AM to 10 PM)
  const startHour = 8;
  const endHour = 22;
  
  let currentOffsetMinutes = 0;
  const totalMinutes = (endHour - startHour) * 60;
  const promises: Promise<string>[] = [];
  
  while (currentOffsetMinutes <= totalMinutes) {
    const totalMinutesFromStart = startHour * 60 + currentOffsetMinutes;
    const hour = Math.floor(totalMinutesFromStart / 60);
    const minute = totalMinutesFromStart % 60;

    const message = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];

    promises.push(
      Notifications.scheduleNotificationAsync({
        content: {
          title: "AquaFlow 💧",
          body: message,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      })
    );

    currentOffsetMinutes += intervalMinutes;
  }

  await Promise.all(promises);
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
