import * as Location from "expo-location";

export type LocationData = {
  latitude: number;
  longitude: number;
  city: string;
};

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    // 1. Request Permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Location permission not granted.");
      return null;
    }

    // 2. Get current position (Coarse is enough for weather)
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;

    // 2. Reverse geocode to get the city name
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    const address = addresses && addresses.length > 0 ? addresses[0] : null;
    const city = address?.city || address?.region || address?.district || "your area";

    return {
      latitude,
      longitude,
      city,
    };
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};
