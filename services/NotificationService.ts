import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  WAKING_START_HOUR,
  WAKING_END_HOUR,
  REMINDER_MESSAGES,
  HEAT_MESSAGES,
} from "../constants";

export const WATER_REMINDER_CATEGORY = "water-reminder";

export const ACTION_LOG_250 = "LOG_WATER_250";
export const ACTION_LOG_500 = "LOG_WATER_500";
export const ACTION_LOG_CUSTOM = "LOG_WATER_CUSTOM";

export const setupNotificationCategories = async () => {
  if (Platform.OS === "web") return;

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Hydration Reminders",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#0ea5e9",
        sound: "default",
      });
    }

    await Notifications.setNotificationCategoryAsync(WATER_REMINDER_CATEGORY, [
      {
        identifier: ACTION_LOG_250,
        buttonTitle: "+250ml 💧",
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: ACTION_LOG_500,
        buttonTitle: "+500ml 💧",
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: ACTION_LOG_CUSTOM,
        buttonTitle: "Custom ml",
        textInput: {
          submitButtonTitle: "Log",
          placeholder: "Enter ml (e.g. 350)",
        },
        options: {
          opensAppToForeground: true,
        },
      },
    ]);
  } catch (error) {
    console.error("Failed to setup notification categories:", error);
  }
};


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
          sound: "default",
          categoryIdentifier: WATER_REMINDER_CATEGORY,
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
};

export const sendTestNotificationWithActions = async () => {
  if (Platform.OS === "web") return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time for Water! 💧",
      body: "Tap an action button below (+250ml, +500ml, or Custom) to log your intake!",
      sound: "default",
      categoryIdentifier: WATER_REMINDER_CATEGORY,
    },
    trigger: null,
  });
};

export const sendHeatAlertNotification = async () => {
  if (Platform.OS === "web") return;
  const heatMessage =
    HEAT_MESSAGES[Math.floor(Math.random() * HEAT_MESSAGES.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Heatwave Alert 🌡️",
      body: heatMessage,
      sound: "default",
      categoryIdentifier: WATER_REMINDER_CATEGORY,
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

export const sendQuickLogConfirmation = async (amount: number) => {
  if (Platform.OS === "web") return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Water Logged! 💧",
      body: `Successfully added ${amount}ml of water.`,
      sound: "default",
    },
    trigger: null,
  });
};



