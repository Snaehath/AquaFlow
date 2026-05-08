# AquaFlow 💧

AquaFlow is a premium, high-performance hydration tracking application built with React Native and Expo. It features a stunning glassmorphism design, smart adaptive notifications, and a comprehensive achievement system to help users maintain healthy hydration habits.

## ✨ Features

- **Smart Hydration Tracking**: Real-time logging of multiple beverage types (Water, Coffee, Electrolytes) with specific hydration multipliers.
- **Weather-Adaptive Goals**: Automatically adjusts your daily water goal based on local temperature and humidity using the OpenWeather API.
- **Premium Aesthetics**: Sophisticated UI featuring glassmorphism effects, smooth animations (Reanimated), and custom 3D achievement badges.
- **History & Timeline**: Collapsible daily timeline with cumulative weekly volume tracking.
- **Smart Notifications**: Intelligent reminders that adapt to your intake speed, weather conditions, and sleep schedule.
- **Achievement System**: Earn unique badges for consistency, volume milestones, and variety.
- **Privacy First**: All data is stored locally on-device using high-performance MMKV storage.

## 🚀 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 52)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Storage**: [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) (Synchronous, ultra-fast)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Icons**: [Lucide React Native](https://lucide.dev/guide/react-native)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or newer)
- Expo Go or a Development Build environment
- Android Studio / Xcode for local emulation

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Snaehath/AquaFlow.git
   cd AquaFlow
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your OpenWeather API key:
   ```env
   EXPO_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```

### Running Locally

Since this project uses native modules (MMKV, Reanimated), you must run it as a **Development Build**:

```bash
# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

## 🏗️ Project Structure

- `app/`: Expo Router file-based navigation.
- `components/`: Reusable UI components (WaterBottle, QuickAdd, etc.).
- `hooks/`: Custom React hooks for hydration logic and weather integration.
- `services/`: External integrations (Weather, Notifications, Location).
- `store/`: Zustand state management with MMKV persistence.
- `assets/`: Custom badges, icons, and fonts.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [Snaehath](https://github.com/Snaehath)
