/**
 * AquaFlow Design System Tokens
 * Calm utility, physical feedback, zero judgment.
 */

export const THEME = {
  colors: {
    // Canvas & Surfaces
    canvas: "#f0f9ff", // Sky 50 - very pale serene blue
    surface: "#ffffff", // Pure white for cards/sheets
    surfaceSubtle: "#f8fafc", // Slate 50 for nested containers
    surfaceElevated: "#ffffff",

    // Brand & Water Tones
    primary: "#0ea5e9", // Sky 500
    primaryLight: "#e0f2fe", // Sky 100
    primaryMuted: "#38bdf8", // Sky 400
    primaryDeep: "#0284c7", // Sky 600

    // Typography
    textPrimary: "#082f49", // Sky 950 - deep navy ink
    textSecondary: "#0369a1", // Sky 700 - medium navy
    textMuted: "#64748b", // Slate 500 - quiet neutral
    textSubtle: "#94a3b8", // Slate 400 - ultra quiet

    // Borders & Dividers
    border: "#e0f2fe", // Sky 100
    borderSubtle: "rgba(224, 242, 254, 0.7)",
    divider: "#f1f5f9", // Slate 100

    // Beverage Accents
    beverages: {
      water: { fill: "#38bdf8", bg: "#f0f9ff", border: "#bae6fd" },
      coffee: { fill: "#78350f", bg: "#fef3c7", border: "#fde68a" },
      tea: { fill: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
      juice: { fill: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
      electrolyte: { fill: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  radii: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
} as const;

export default THEME;
