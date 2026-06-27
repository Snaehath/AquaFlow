import { Star, Target, Trophy } from "lucide-react-native";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  image?: any;
}

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: "first_step",
    title: "First Sip",
    description: "Log your first drink.",
    icon: Star,
    image: require("../assets/badges/first_step.png"),
  },
  {
    id: "hydrated_human",
    title: "Hydrated Human",
    description: "Hit your daily goal once.",
    icon: Target,
    image: require("../assets/badges/hydrated_human.png"),
  },
  {
    id: "camel",
    title: "Be a Camel",
    description: "Hit your daily goal 3 times.",
    icon: Trophy,
    image: require("../assets/badges/camel.png"),
  },
];
