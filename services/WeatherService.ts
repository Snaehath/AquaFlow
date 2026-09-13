export type WeatherData = {
  temp: number; // in Fahrenheit
  condition: string;
};

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  if (!API_KEY || API_KEY === "your_openweather_api_key_here") {
    console.warn("Weather API Key missing. Using mock fallback.");
    return {
      temp: 72,
      condition: "Perfect 🌿",
    };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Weather API Error:", errorData.message || response.statusText);
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.main || !data.weather) {
      throw new Error("Invalid weather data structure received");
    }

    const temp = data.main.temp;
    const condition = data.weather[0].main;

    return {
      temp,
      condition,
    };
  } catch (error) {
    console.error("Weather fetch failed:", error);
    return {
      temp: 70,
      condition: "Unknown ☁️",
    };
  }
};
