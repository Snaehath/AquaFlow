import { Award, Droplets, Star, Target, Trophy } from "lucide-react-native";

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
    id: "hydro_homie",
    title: "Hydro Homie",
    description: "Log 2 drinks in a single session.",
    icon: Droplets,
    image: require("../assets/badges/hydro_homie.png"),
  },
  {
    id: "consistency",
    title: "Water Consistency",
    description: "Log 4 drinks in a single session.",
    icon: Award,
    image: require("../assets/badges/consistency.png"),
  },
  {
    id: "camel",
    title: "Be a Camel",
    description: "Hit your daily goal 3 times.",
    icon: Trophy,
    image: require("../assets/badges/camel.png"),
  },
  {
    id: "aquaman",
    title: "Aquaman Status",
    description: "Log 1000ml+ in a single session.",
    icon: Trophy,
    image: require("../assets/badges/aquaman.png"),
  },
];
