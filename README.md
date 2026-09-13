# AquaFlow 💧

**AquaFlow** is a premium, offline-first hydration tracking app built with React Native and Expo. Engineered with dual-wave liquid physics, tactile haptic signatures, weather-adaptive hydration targets, and intelligent waking-hour reminders, AquaFlow transforms daily water tracking into an effortless, friction-free experience.

---

## ✨ Key Features

### 🌊 Dual-Wave Physics & Realistic Visuals
- **Dual-Layer Fluid Dynamics**: Interactive 3000ms primary front wave coupled with a 4600ms secondary depth wave.
- **Dynamic Liquid Color Morphing**: 400ms smooth RGB liquid transitions matching the active beverage color (Water, Coffee, Tea, Juice, Electrolytes).
- **Etched Measurement Ticks**: 25%, 50%, and 75% graduation marks with dual specular gloss reflections.

### ⚡ 1-Tap Customizable Quick Presets & Tactile Feedback
- **Centralized Tactile Engine**: Beverage-specific haptic signatures (crisp single pulse for Water, warm double-pulse for Coffee, energetic heavy surge for Electrolytes, and confetti victory bursts).
- **Hold-to-Customize Quick Presets**: 4 store-persisted customizable preset buttons (`Glass 250ml`, `Coffee 350ml`, `Bottle 500ml`, `Electrolyte 500ml`).
- **Inline Custom Logger**: Integrated `+ Custom` action allowing arbitrary volume and beverage selection with real-time hydration efficiency calculations.

### 🔬 Hydration Science & Multi-Beverage Efficiency
Hydration coefficients modeled after physiological osmolarity:
- **Water (100%)**: Baseline clean hydration with zero loss.
- **Electrolytes (115%)**: Enhanced mineral osmolarity & cellular fluid retention.
- **Fruit Juice (95%)**: High water volume with natural carbohydrates.
- **Herbal / Tea (92%)**: Gentle hydration with antioxidant benefits.
- **Coffee (90%)**: Net hydrating with mild caffeine diuretic offset.

### ☀️ Weather-Adaptive Goals & Heatwave Protection
- **Environmental Adaptation**: Automatically increases daily hydration targets during high heat via OpenWeather API integration.
- **Dynamic Heatwave Boost Badge**: Visual `+% Heat Boost` indicator informing users of weather adjustments.

### ⏱️ Smart Intraday Pacer & Dismissible Celebrations
- **Contextual Real-Time Pacing**: Dynamic timeline advice pill beneath the bottle (Morning Pace, Afternoon Boost, Evening Flow, Goal Met).
- **Dismissible Goal Celebration**: Confetti bursts with a dismissible daily milestone card allowing seamless tracking of subsequent bottles.

### 📊 Fluid Diversity Analytics & Streak Health
- **Daily Fluid Diversity Bar**: Stacked color-coded distribution breakdown of daily liquid intake.
- **Weekly Activity Chart**: 7-day bar chart with daily averages and target baseline lines.
- **Streak Health Modal**: Interactive flame indicator tracking current streaks, personal best records, and habit motivation.

### 🏅 Core 4 Milestone System & Social Sharing
- 💧 **First Sip**: First drink logged.
- 🎯 **Hydrated Human**: Hit daily goal once.
- 🔥 **3-Day Flow**: Maintain a 3-day hydration streak.
- 🐫 **Desert Camel**: Complete 3 full bottles in a single day.
- **1-Tap Social Share**: Generates celebratory milestone cards for social sharing.

### ⚙️ Unified Modern Settings UI
- **Consolidated Hydration Profile**: Interactive `[-]` / `[+]` weight stepper + segmented activity level controls with real-time calculated goal previews.
- **Preferences & Schedules**: Waking-hours notification frequency (`30m`, `1h`, `2h`, `3h`), temperature unit (`°C` / `°F`), and tactile toggle.
- **Balanced 2×2 Badge Grid**: Symmetrical, uncluttered milestone matrix.

---

## 🚀 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Expo](https://expo.dev/) (SDK 54)** | Cross-platform React Native runtime & toolchain |
| **[Expo Router](https://docs.expo.dev/router/introduction/)** | File-based navigation and nested layouts |
| **[NativeWind](https://www.nativewind.dev/) (Tailwind CSS)** | Declarative, performant UI styling |
| **[Zustand](https://github.com/pmndrs/zustand)** | Centralized state management |
| **[react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)** | Ultra-fast synchronous persistent storage |
| **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** | 60 FPS smooth wave physics and UI transitions |
| **[Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)** | Tactile container & celebration feedback |
| **[Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)** | Deterministic, waking-hours reminder scheduling |
| **[Lucide React Native](https://lucide.dev/)** | Clean, modern iconography |

---

## 📁 Project Architecture

```
aquaFlow/
├── app/
│   ├── _layout.tsx           # Global app layout & notification initialization
│   ├── index.tsx             # Main dashboard (Bottle, Pacer, QuickAdd)
│   ├── history.tsx           # History, Fluid Diversity & weekly analytics
│   └── settings.tsx          # Profile, Preferences, Science Guide & 2x2 Badges
├── components/
│   ├── WaterBottle.tsx       # Dual-wave physics & liquid morphing bottle
│   ├── QuickAdd.tsx          # 1-tap quick log & customizable preset modal
│   └── hydration/
│       ├── HydrationHeader.tsx   # Header & interactive Streak Health modal
│       ├── ProgressSection.tsx   # Intake stats & Intraday Pacer pill
│       ├── WeatherCard.tsx       # Heatwave boost indicator
│       ├── GoalReachedBanner.tsx # Dismissible daily victory banner
│       └── CustomLogModal.tsx    # Multi-beverage volume selector
├── constants.ts              # Beverage matrix, defaults & Core 4 badge specs
├── services/
│   ├── NotificationService.ts # Mutex-locked waking-hours reminder scheduler
│   ├── AchievementService.ts  # Milestone unlock detection & toasts
│   ├── ProfileService.ts      # Profile persistence
│   ├── WeatherService.ts      # OpenWeather environmental adjustments
│   └── storage.ts            # MMKV sync storage adapter
├── store/
│   ├── hydrationStore.ts     # Core hydration state & preset actions
│   └── toastStore.ts         # In-app banner notifications
└── utils/
    ├── haptics.ts            # Centralized tactile feedback engine
    ├── hydration.ts          # Base goal & effective volume math
    └── date.ts               # Date & weekly reset helpers
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or newer)
- Android Studio / Xcode for running Development Builds

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

3. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
   ```

### Running Locally

AquaFlow utilizes native modules (MMKV, Reanimated, Haptics). Run using a **Development Build**:

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

---

## 🔒 Privacy & Offline First

AquaFlow is designed with strict privacy principles:
- **100% Local Storage**: All hydration logs, history, streaks, and personal metrics stay on your device via MMKV.
- **Waking-Hours Protected**: Notifications are scheduled deterministically strictly between 8:00 AM and 10:00 PM without external push servers.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
