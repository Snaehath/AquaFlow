import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  WAKING_START_HOUR,
  WAKING_END_HOUR,
  REMINDER_MESSAGES,
} from "../constants";


export const setupNotificationChannel = async () => {
  if (Platform.OS === "web") return;

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Hydration Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 150, 150, 150],
        lightColor: "#0ea5e9",
        sound: "default",
      });
    }
  } catch (error) {
    console.error("Failed to setup notification channel:", error);
  }
};

let isRescheduling = false;
let pendingInterval: number | null = null;

export const rescheduleAllReminders = async (intervalMinutes: number) => {
  if (Platform.OS === "web") return;

  if (isRescheduling) {
    pendingInterval = intervalMinutes;
    return;
  }

  isRescheduling = true;

  try {
    // 1. Clear previous scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // If notifications turned off (<= 0), stop here
    if (intervalMinutes <= 0) {
      return;
    }

    // 2. Schedule daily repeating reminders for waking hours (WAKING_START_HOUR to WAKING_END_HOUR)
    let currentOffsetMinutes = 0;
    const totalMinutes = (WAKING_END_HOUR - WAKING_START_HOUR) * 60;
    const promises: Promise<string>[] = [];
    let messageIndex = 0;

    while (currentOffsetMinutes <= totalMinutes) {
      const totalMinutesFromStart = WAKING_START_HOUR * 60 + currentOffsetMinutes;
      const hour = Math.floor(totalMinutesFromStart / 60);
      const minute = totalMinutesFromStart % 60;

      const reminder = REMINDER_MESSAGES[messageIndex % REMINDER_MESSAGES.length];
      messageIndex++;

      promises.push(
        Notifications.scheduleNotificationAsync({
          identifier: `aquaflow-daily-reminder-${hour}-${minute}`,
          content: {
            title: reminder.title,
            body: reminder.body,
            sound: "default",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
            channelId: "default",
          },
        })
      );

      currentOffsetMinutes += intervalMinutes;
    }

    await Promise.all(promises);
  } catch (error) {
    console.error("Failed to reschedule reminders:", error);
  } finally {
    isRescheduling = false;
    if (pendingInterval !== null) {
      const nextInterval = pendingInterval;
      pendingInterval = null;
      await rescheduleAllReminders(nextInterval);
    }
  }
};

export const sendQuickLogConfirmation = async (amount: number) => {
  if (Platform.OS === "web") return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Water logged",
      body: `Added ${amount}ml.`,
      sound: "default",
    },
    trigger: null,
  });
};




