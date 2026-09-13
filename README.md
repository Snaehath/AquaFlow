# AquaFlow 💧

**AquaFlow** is a calm, pure-awareness hydration companion built with React Native and Expo. Engineered with dual-wave liquid physics, tactile haptic signatures, ambient weather awareness, and respectful waking-hour reminders, AquaFlow transforms hydration into an effortless, pressure-free daily practice.

> *"AquaFlow doesn't manage your hydration. It helps you remember it, record it, and stay aware of it."*

---

## ✨ Philosophy & Key Features

### 💧 Pure Awareness, Zero Pressure
- **No Finish Lines, No Failures**: No arbitrary targets, no streaks to break, no badges to unlock, and no guilt.
- **Estimated Daily Reference**: Offers a gentle reference guideline (e.g. `~2.7 L / day`) based on body baseline and daily energy, rather than an enforced quota.
- **Repeating Reference Bottles**: Bottles represent intuitive volume milestones (`💧 2 reference bottles · +200 ml`) without capping or resetting.
- **Subtle Water Droplet Delight**: Completing a reference bottle volume triggers a soft ~800ms water droplet particle burst and gentle haptic tap.

### 🌊 Dual-Wave Liquid Physics
- **Dual-Layer Fluid Dynamics**: Interactive 3000ms primary front wave coupled with a 4600ms secondary depth wave.
- **Dynamic Liquid Color Morphing**: 400ms smooth RGB liquid transitions matching the active beverage color (Water, Coffee, Tea, Juice, Electrolytes).
- **Etched Measurement Ticks**: 25%, 50%, and 75% graduation marks with dual specular gloss reflections.

### ⚡ Frictionless 1-Tap Logging
- **1:1 Fluid Tracking**: Every milliliter counts as 1 ml fluid volume without physiological multipliers or confusing conversions.
- **Centralized Tactile Engine**: Beverage-specific haptic signatures (crisp pulse for Water, warm pulse for Coffee, energetic surge for Electrolytes).
- **Hold-to-Customize Quick Presets**: 4 store-persisted customizable preset buttons (`Glass 250ml`, `Coffee 350ml`, `Bottle 500ml`, `Electrolyte 500ml`).
- **Inline Custom Logger**: Integrated `+ Custom` action allowing arbitrary volume and beverage selection.

### 🌤️ Ambient Weather Context
- **Environmental Awareness**: Displays local temperature and weather conditions (e.g. `Warm day outside · 30°C`) purely as ambient awareness—without artificial goal multipliers or prescriptive demands.

### ⏱️ Respectful Reminders & Quiet Hours
- **Gentle Scheduling**: Choose between `Every 90m`, `Every 2h`, `Every 3h`, or `Off`.
- **Built-in Quiet Hours**: Reminders are strictly confined to waking hours (8:00 AM → 10:00 PM), never disturbing your sleep.

### 📊 Fluid Diversity & Weekly Intake
- **Daily Fluid Diversity Bar**: Color-coded distribution breakdown of daily liquid intake across beverage types.
- **Weekly Intake Chart**: 7-day volume visualization with average intake and subtle reference guideline.

### ⚙️ Streamlined 3-Card Settings
- **Hydration Profile**: Weight stepper and activity level selector with live estimated daily reference preview.
- **Preferences & Reminders**: Interval selector, temperature unit toggle (°C / °F), and tactile haptics switch.
- **Data & Privacy**: 100% offline, stored locally on-device with single-tap data reset.

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
| **[Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)** | Tactile feedback for logging and bottle fills |
| **[Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)** | Deterministic waking-hours reminder scheduler |
| **[Lucide React Native](https://lucide.dev/)** | Clean, modern iconography |

---

## 📁 Project Architecture

```
aquaFlow/
├── app/
│   ├── _layout.tsx           # Global app layout & notification initialization
│   ├── index.tsx             # Main dashboard (Bottle, Pacer, QuickAdd)
│   ├── history.tsx           # History, Fluid Diversity & weekly intake
│   └── settings.tsx          # Profile, Reminders & Data Privacy
├── components/
│   ├── WaterBottle.tsx       # Dual-wave physics & liquid morphing bottle
│   ├── QuickAdd.tsx          # 1-tap quick log & customizable preset modal
│   ├── ui/
│   │   ├── Confetti.tsx      # Subtle water droplet burst animation
│   │   └── Toast.tsx         # Contextual toast notifications
│   └── hydration/
│       ├── HydrationHeader.tsx   # Header (Date & navigation)
│       ├── ProgressSection.tsx   # Intake volume, reference bottles & pacer
│       ├── WeatherCard.tsx       # Ambient weather context
│       └── CustomLogModal.tsx    # Multi-beverage volume selector
├── constants.ts              # Beverage palette, default profile & pacing suggestions
├── services/
│   ├── NotificationService.ts # Mutex-locked waking-hours reminder scheduler
│   ├── ProfileService.ts      # Profile persistence
│   ├── WeatherService.ts      # Ambient OpenWeather service
│   └── storage.ts            # MMKV sync storage adapter
├── store/
│   ├── hydrationStore.ts     # Core hydration state & preset actions
│   └── toastStore.ts         # In-app toast notifications
└── utils/
    ├── haptics.ts            # Centralized tactile feedback engine
    ├── hydration.ts          # Daily reference & repeating bottle calculations
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

AquaFlow is built with strict privacy principles:
- **100% Local Storage**: All hydration logs, history, and personal metrics stay on your device via MMKV.
- **Waking-Hours Protected**: Notifications are scheduled deterministically strictly between 8:00 AM and 10:00 PM without external push servers.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

