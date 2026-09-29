import "@/global.css";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Toast } from "../components/ui/Toast";
import {
  setupNotificationChannel,
  rescheduleAllReminders,
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

      // 2. Setup Notification Channel
      await setupNotificationChannel();

      // 3. Reschedule Reminders once on app start
      const reminderInterval = useHydrationStore.getState().reminderInterval;
      await rescheduleAllReminders(reminderInterval || 60);

      // 4. Location Permissions
      const { status: locStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (locStatus !== "granted") {
        console.log("Location permission denied—weather features disabled.");
      }
    };

    initNotificationsAndPermissions();
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

