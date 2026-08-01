import "@/global.css";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Toast } from "../components/ui/Toast";
import {
  setupNotificationCategories,
  ACTION_LOG_250,
  ACTION_LOG_500,
  ACTION_LOG_CUSTOM,
  sendQuickLogConfirmation,
} from "@/services/NotificationService";
import { useHydrationStore } from "@/store/hydrationStore";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* Prevent crash on web/unsupported platforms */
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    const initNotificationsAndPermissions = async () => {
      // 1. Notification Permissions
      const { status: notifStatus } = await Notifications.getPermissionsAsync();
      if (notifStatus !== "granted") {
        await Notifications.requestPermissionsAsync();
      }

      // 2. Setup Notification Actions Categories
      await setupNotificationCategories();

      // 3. Location Permissions
      const { status: locStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (locStatus !== "granted") {
        console.log("Location permission denied—weather features disabled.");
      }
    };

    initNotificationsAndPermissions();

    // Listen to notification action responses (e.g. quick logging without opening app)
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(async (response) => {
        const actionId = response.actionIdentifier;

        if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          return;
        }

        // Dismiss the reminder notification immediately so user cannot tap a 2nd time
        try {
          await Notifications.dismissNotificationAsync(
            response.notification.request.identifier,
          );
        } catch {
          /* Ignore if already dismissed by system */
        }

        let amountToLog = 0;

        if (actionId === ACTION_LOG_250) {
          amountToLog = 250;
        } else if (actionId === ACTION_LOG_500) {
          amountToLog = 500;
        } else if (actionId === ACTION_LOG_CUSTOM) {
          const userTyped = response.userText;
          const parsed = parseInt(userTyped || "", 10);
          if (!isNaN(parsed) && parsed > 0 && parsed <= 5000) {
            amountToLog = parsed;
          } else {
            amountToLog = 250;
          }
        }

        if (amountToLog > 0) {
          await useHydrationStore.getState().addIntake(amountToLog, "water");
          await sendQuickLogConfirmation(amountToLog);
        }
      });



    return () => {
      responseSubscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="dark" translucent />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f0f9ff" },
        }}
      />
      <Toast />
    </>
  );
}

