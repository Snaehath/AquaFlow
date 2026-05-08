import "@/global.css";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

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
    const requestPermissions = async () => {
      // Notification Permissions
      const { status: notifStatus } = await Notifications.getPermissionsAsync();
      if (notifStatus !== "granted") {
        await Notifications.requestPermissionsAsync();
      }

      // Location Permissions
      const { status: locStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (locStatus !== "granted") {
        console.log("Location permission denied—weather features disabled.");
      }
    };

    requestPermissions();
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
    </>
  );
}
