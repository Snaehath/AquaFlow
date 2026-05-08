import React from "react";
import { View, Text, Pressable } from "react-native";
import { Coffee, GlassWater, Droplets, Zap } from "lucide-react-native";

import { BeverageType } from "../constants/beverages";

type Props = {
  onAdd: (amount: number, type: BeverageType) => void;
};

type SizeOption = {
  label: string;
  amount: number;
  icon: React.ElementType;
  bgClass: string;
  iconColor: string;
  type: BeverageType;
};

const SIZES: SizeOption[] = [
  { label: "Glass",  amount: 250, icon: GlassWater, bgClass: "bg-blue-50",   iconColor: "#2563eb", type: "water" },
  { label: "Coffee", amount: 350, icon: Coffee,     bgClass: "bg-amber-50",  iconColor: "#d97706", type: "coffee" },
  { label: "Bottle", amount: 500, icon: Droplets,   bgClass: "bg-sky-50",    iconColor: "#0ea5e9", type: "water" },
  { label: "Power",  amount: 500, icon: Zap,        bgClass: "bg-indigo-50", iconColor: "#4f46e5", type: "electrolyte" },
];

const QuickAdd = ({ onAdd }: Props) => {
  return (
    <View className="my-2">
      <Text className="text-sky-950/40 text-xs font-bold uppercase tracking-widest mb-4 ml-1">
        Quick Log
      </Text>
      <View className="flex-row justify-between">
        {SIZES.map((size, idx) => (
          <Pressable
            key={`${size.type}-${idx}`}
            onPress={() => onAdd(size.amount, size.type)}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.92 : 1 }],
              },
            ]}
            className="items-center flex-1"
          >
            <View className={`w-16 h-16 rounded-3xl items-center justify-center mb-2 shadow-sm border border-white/50 ${size.bgClass}`}>
              <size.icon
                size={24}
                color={size.iconColor}
                strokeWidth={2.5}
              />
            </View>
            <Text className="text-sky-900 text-xs font-black uppercase tracking-tight">{size.label}</Text>
            <Text className="text-sky-900/40 text-[10px] font-bold">{size.amount}ml</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default QuickAdd;
