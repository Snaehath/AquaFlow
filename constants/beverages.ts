export type BeverageType = "water" | "coffee" | "tea" | "juice" | "electrolyte";
export type ContainerType = "bottle" | "cup" | "glass" | "flask";

export interface BeverageConfig {
  type: BeverageType;
  multiplier: number;
  label: string;
  color: string;      // Premium Tint (Desaturated)
  container: ContainerType;
}

export const BEVERAGES: Record<BeverageType, BeverageConfig> = {
  water: {
    type: "water",
    multiplier: 1.0,
    label: "Water",
    color: "#38bdf8", // Sky Blue
    container: "bottle"
  },
  coffee: {
    type: "coffee",
    multiplier: 0.9,
    label: "Coffee",
    color: "#78350f", // Frosted Amber
    container: "cup"
  },
  tea: {
    type: "tea",
    multiplier: 0.92,
    label: "Tea",
    color: "#4ade80", // Soft Green
    container: "glass"
  },
  juice: {
    type: "juice",
    multiplier: 0.95,
    label: "Juice",
    color: "#fb923c", // Muted Orange
    container: "glass"
  },
  electrolyte: {
    type: "electrolyte",
    multiplier: 1.15,
    label: "Electrolytes",
    color: "#22d3ee", // Electric Cyan
    container: "flask"
  },
};
