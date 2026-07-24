# AquaFlow 💧

AquaFlow is a premium, high-performance hydration tracking application built with React Native and Expo. It features a modern design, smart adaptive notifications, and a comprehensive achievement system to help users maintain healthy hydration habits.

## ✨ Features

- **Smart Hydration Tracking**: Real-time logging of multiple beverage types (Water, Coffee, Electrolytes) with specific hydration multipliers.
- **Weather-Adaptive Goals**: Automatically adjusts daily water goals based on local temperature using the OpenWeather API.
- **Fluid Visuals & Physics**: Custom vector bottle rendering with smooth fill transitions and achievement badges.
- **History & Analytics**: Collapsible daily log timeline with weekly volume tracking and bar charts.
- **Smart Notifications**: Reminders constrained strictly to active waking hours (8:00 AM to 10:00 PM).
- **Achievement System**: Earn unique badges for consistency, volume milestones, and variety.
- **Privacy First**: All data is stored locally on-device using high-performance MMKV storage.

## 🚀 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54)
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

Since this project uses native modules (MMKV, Reanimated), run it as a **Development Build**:

```bash
# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

## 🏗️ Project Structure

- `app/`: Expo Router file-based navigation.
- `components/`: Reusable UI components (WaterBottle, QuickAdd, etc.).
- `constants.ts`: Application configuration, beverage multipliers, and notification messages.
- `hooks/`: Custom React hooks for hydration logic and weather integration.
- `services/`: External integrations (Weather, Notifications, Storage).
- `store/`: Zustand state management with MMKV persistence.
- `types.ts`: Centralized TypeScript interfaces.

---
