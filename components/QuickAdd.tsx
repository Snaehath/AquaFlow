import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Coffee,
  GlassWater,
  Droplets,
  Zap,
  Sparkles,
  X,
  Check,
  Plus,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BeverageType, QuickPreset } from "../types";
import { BEVERAGES, BEVERAGE_TYPES } from "../constants";
import { useHydrationStore } from "../store/hydrationStore";
import { hapticLight, hapticMedium } from "../utils/haptics";

type Props = {
  onAdd: (amount: number, type: BeverageType) => void;
  onOpenCustom?: () => void;
};

export const BEVERAGE_ICONS: Record<BeverageType, React.ElementType> = {
  water: Droplets,
  coffee: Coffee,
  tea: GlassWater,
  juice: Sparkles,
  electrolyte: Zap,
};

const BEVERAGE_BG: Record<BeverageType, { bg: string; iconColor: string; border: string }> = {
  water: { bg: "bg-sky-50", iconColor: "#0ea5e9", border: "border-sky-200/60" },
  coffee: { bg: "bg-amber-50", iconColor: "#d97706", border: "border-amber-200/60" },
  tea: { bg: "bg-emerald-50", iconColor: "#059669", border: "border-emerald-200/60" },
  juice: { bg: "bg-orange-50", iconColor: "#ea580c", border: "border-orange-200/60" },
  electrolyte: { bg: "bg-cyan-50", iconColor: "#0891b2", border: "border-cyan-200/60" },
};

const PRESET_AMOUNTS = [150, 250, 330, 500, 750, 1000];
const BEVERAGE_OPTIONS = BEVERAGE_TYPES;

const QuickAdd = ({ onAdd, onOpenCustom }: Props) => {
  const insets = useSafeAreaInsets();
  const presets = useHydrationStore((s) => s.quickPresets);
  const updateQuickPreset = useHydrationStore((s) => s.updateQuickPreset);

  // Edit Modal State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editAmount, setEditAmount] = useState<number>(250);
  const [editType, setEditType] = useState<BeverageType>("water");

  const openEditor = (index: number, preset: QuickPreset) => {
    hapticMedium();
    setEditingIndex(index);
    setEditLabel(preset.label);
    setEditAmount(preset.amount);
    setEditType(preset.type);
  };

  const handleSavePreset = () => {
    if (editingIndex !== null) {
      hapticLight();
      const current = presets[editingIndex];
      updateQuickPreset(editingIndex, {
        id: current?.id || `preset_${editingIndex + 1}`,
        label: editLabel.trim() || BEVERAGES[editType].label,
        amount: editAmount > 0 ? editAmount : 250,
        type: editType,
      });
      setEditingIndex(null);
    }
  };

  return (
    <View className="my-2">
      <View className="flex-row justify-between items-center mb-3.5 px-1">
        <Text className="text-sky-950/40 text-[11px] font-black uppercase tracking-widest">
          Quick Log
        </Text>
        <View className="flex-row items-center gap-2.5">
          <Text className="text-sky-400/80 text-[10px] font-semibold">
            Hold to edit ⚙️
          </Text>
          {onOpenCustom && (
            <Pressable
              onPress={() => {
                hapticLight();
                onOpenCustom();
              }}
              style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
              className="bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20 flex-row items-center active:bg-sky-500/20"
            >
              <Plus size={11} color="#0284c7" strokeWidth={3} />
              <Text className="text-sky-700 text-[10px] font-black ml-1">
                Custom
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Preset Chips */}
      <View className="flex-row justify-between gap-2.5">
        {presets.map((preset, idx) => {
          const styleConfig = BEVERAGE_BG[preset.type] || BEVERAGE_BG.water;
          const IconComponent = BEVERAGE_ICONS[preset.type] || Droplets;

          return (
            <Pressable
              key={preset.id || idx}
              onPress={() => onAdd(preset.amount, preset.type)}
              onLongPress={() => openEditor(idx, preset)}
              delayLongPress={400}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.92 : 1 }],
                },
              ]}
              className="items-center flex-1"
            >
              <View
                className={`w-full aspect-square rounded-[26px] items-center justify-center mb-1.5 shadow-sm border ${styleConfig.bg} ${styleConfig.border}`}
              >
                <IconComponent
                  size={24}
                  color={styleConfig.iconColor}
                  strokeWidth={2.4}
                />
              </View>
              <Text
                numberOfLines={1}
                className="text-sky-950 text-xs font-black tracking-tight"
              >
                {preset.label}
              </Text>
              <Text className="text-sky-900/40 text-[10px] font-bold">
                {preset.amount}ml
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Preset Customizer Modal */}
      <Modal
        visible={editingIndex !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingIndex(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-end"
        >
          <Pressable
            className="flex-1 bg-black/35"
            onPress={() => setEditingIndex(null)}
          />

          <View
            style={{ paddingBottom: Math.max(insets.bottom + 16, 24) }}
            className="bg-white rounded-t-[36px] px-6 pt-6 border-t border-sky-100 shadow-2xl"
          >
            {/* Drag Handle */}
            <View className="w-12 h-1.5 bg-sky-200 rounded-full self-center mb-5" />

            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-sky-950 text-xl font-black">
                  Customize Preset
                </Text>
                <Text className="text-sky-400 text-xs font-semibold">
                  Personalize your 1-tap quick action
                </Text>
              </View>
              <Pressable
                onPress={() => setEditingIndex(null)}
                className="w-8 h-8 rounded-full bg-sky-50 items-center justify-center border border-sky-100"
              >
                <X size={16} color="#0284c7" />
              </Pressable>
            </View>

            {/* Label Input */}
            <Text className="text-sky-900/60 text-[11px] font-bold uppercase tracking-wider mb-2">
              Preset Name
            </Text>
            <View className="bg-sky-50/80 px-4 py-3 rounded-2xl border border-sky-100 mb-4">
              <TextInput
                value={editLabel}
                onChangeText={setEditLabel}
                placeholder="e.g. My Mug, Water Bottle"
                placeholderTextColor="#93c5fd"
                className="text-sky-950 font-bold text-base p-0"
                maxLength={16}
              />
            </View>

            {/* Beverage Type Selection */}
            <Text className="text-sky-900/60 text-[11px] font-bold uppercase tracking-wider mb-2">
              Beverage Type
            </Text>
            <View className="flex-row gap-2 mb-4">
              {BEVERAGE_OPTIONS.map((bev) => {
                const Icon = BEVERAGE_ICONS[bev];
                const isSelected = editType === bev;
                const config = BEVERAGES[bev];

                return (
                  <Pressable
                    key={bev}
                    onPress={() => {
                      hapticLight();
                      setEditType(bev);
                    }}
                    style={{
                      backgroundColor: isSelected ? "#0ea5e9" : "#f0f9ff",
                      borderColor: isSelected ? "#0ea5e9" : "#e0f2fe",
                    }}
                    className="flex-1 py-2.5 rounded-2xl items-center border shadow-xs"
                  >
                    <Icon
                      size={18}
                      color={isSelected ? "#ffffff" : BEVERAGE_BG[bev].iconColor}
                      strokeWidth={2.4}
                    />
                    <Text
                      style={{ color: isSelected ? "#ffffff" : "#075985" }}
                      className="text-[10px] font-black mt-1"
                    >
                      {config.label}
                    </Text>
                    <Text
                      style={{ color: isSelected ? "#e0f2fe" : "#38bdf8" }}
                      className="text-[8px] font-bold"
                    >
                      {Math.round(config.multiplier * 100)}%
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Volume Selection */}
            <Text className="text-sky-900/60 text-[11px] font-bold uppercase tracking-wider mb-2">
              Container Size (ml)
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = editAmount === amt;
                return (
                  <Pressable
                    key={amt}
                    onPress={() => {
                      hapticLight();
                      setEditAmount(amt);
                    }}
                    style={{
                      backgroundColor: isSelected ? "#0ea5e9" : "#f0f9ff",
                      borderColor: isSelected ? "#0ea5e9" : "#e0f2fe",
                    }}
                    className="flex-1 min-w-[28%] py-3 rounded-2xl items-center border"
                  >
                    <Text
                      style={{ color: isSelected ? "#ffffff" : "#075985" }}
                      className="text-sm font-black"
                    >
                      {amt} ml
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSavePreset}
              className="bg-sky-500 active:bg-sky-600 py-4 rounded-2xl items-center shadow-md flex-row justify-center"
            >
              <Check size={18} color="#ffffff" strokeWidth={3} />
              <Text className="text-white font-black text-base ml-2">
                Save Preset
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default React.memo(QuickAdd);


