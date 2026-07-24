import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  WAKING_START_HOUR,
  WAKING_END_HOUR,
  REMINDER_MESSAGES,
  HEAT_MESSAGES,
} from "../constants";

export const rescheduleAllReminders = async (intervalMinutes: number) => {
  if (Platform.OS === "web") return;

  // 1. Clear previous scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 2. Schedule daily repeating reminders for waking hours (WAKING_START_HOUR to WAKING_END_HOUR)
  let currentOffsetMinutes = 0;
  const totalMinutes = (WAKING_END_HOUR - WAKING_START_HOUR) * 60;
  const promises: Promise<string>[] = [];

  while (currentOffsetMinutes <= totalMinutes) {
    const totalMinutesFromStart = WAKING_START_HOUR * 60 + currentOffsetMinutes;
    const hour = Math.floor(totalMinutesFromStart / 60);
    const minute = totalMinutesFromStart % 60;

    const message =
      REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];

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

export const sendHeatAlertNotification = async () => {
  if (Platform.OS === "web") return;
  const heatMessage =
    HEAT_MESSAGES[Math.floor(Math.random() * HEAT_MESSAGES.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Heatwave Alert 🌡️",
      body: heatMessage,
      sound: true,
    },
    trigger: null,
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
