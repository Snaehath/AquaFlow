import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Check, X, Info } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BeverageType } from "@/types";
import { BEVERAGES, BEVERAGE_TYPES } from "@/constants";
import { calculateEffectiveAmount } from "@/utils/hydration";
import { hapticLight, hapticHeavy } from "@/utils/haptics";
import { BEVERAGE_ICONS } from "../QuickAdd";

interface CustomLogModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number, type: BeverageType) => void;
}

const PRESETS = [150, 250, 350, 500, 750];

const BEVERAGE_COLORS: Record<BeverageType, { color: string; bg: string }> = {
  water: { color: "#0ea5e9", bg: "bg-sky-50" },
  coffee: { color: "#d97706", bg: "bg-amber-50" },
  tea: { color: "#059669", bg: "bg-emerald-50" },
  juice: { color: "#ea580c", bg: "bg-orange-50" },
  electrolyte: { color: "#0891b2", bg: "bg-cyan-50" },
};

const CustomLogModal: React.FC<CustomLogModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const insets = useSafeAreaInsets();
  const [raw, setRaw] = useState("");
  const [selectedType, setSelectedType] = useState<BeverageType>("water");

  const parsedAmount = parseInt(raw, 10);
  const effectiveBaseAmount =
    !isNaN(parsedAmount) && parsedAmount > 0 ? parsedAmount : 250;
  const isValid =
    isNaN(parsedAmount) || (parsedAmount > 0 && parsedAmount <= 3000);

  const effectiveVolume = calculateEffectiveAmount(
    effectiveBaseAmount,
    selectedType,
  );

  const handleConfirm = () => {
    if (parsedAmount > 3000) return;
    hapticHeavy();
    onConfirm(effectiveBaseAmount, selectedType);
    setRaw("");
    onClose();
  };

  const handleClose = () => {
    setRaw("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end"
      >
        {/* Backdrop overlay */}
        <Pressable className="flex-1 bg-black/35" onPress={handleClose} />

        <View
          style={{ paddingBottom: Math.max(insets.bottom + 16, 24) }}
          className="bg-white rounded-t-[36px] px-6 pt-6 border-t border-sky-100 shadow-2xl"
        >
          {/* Drag Handle */}
          <View className="w-12 h-1.5 bg-sky-200 rounded-full self-center mb-5" />

          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-sky-950 text-2xl font-black">
                Log Drink
              </Text>
              <Text className="text-sky-400 text-xs font-semibold">
                Select beverage & container volume
              </Text>
            </View>
            <Pressable
              onPress={handleClose}
              className="w-8 h-8 rounded-full bg-sky-50 items-center justify-center border border-sky-100"
            >
              <X size={16} color="#0284c7" />
            </Pressable>
          </View>

          {/* Beverage Type Selection */}
          <Text className="text-sky-900/60 text-[11px] font-bold uppercase tracking-wider mb-2">
            Beverage Type
          </Text>
          <View className="flex-row gap-2 mb-4">
            {BEVERAGE_TYPES.map((type) => {
              const Icon = BEVERAGE_ICONS[type];
              const isSelected = selectedType === type;
              const config = BEVERAGES[type];
              const styling = BEVERAGE_COLORS[type];

              return (
                <Pressable
                  key={type}
                  onPress={() => {
                    hapticLight();
                    setSelectedType(type);
                  }}
                  style={{
                    backgroundColor: isSelected ? "#0ea5e9" : "#f0f9ff",
                    borderColor: isSelected ? "#0ea5e9" : "#e0f2fe",
                  }}
                  className="flex-1 py-2.5 rounded-2xl items-center border shadow-xs"
                >
                  <Icon
                    size={20}
                    color={isSelected ? "#ffffff" : styling.color}
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

          {/* Quick Amount Chips */}
          <Text className="text-sky-900/60 text-[11px] font-bold uppercase tracking-wider mb-2">
            Quick Volumes
          </Text>
          <View className="flex-row gap-2 mb-4">
            {PRESETS.map((preset) => {
              const isSelected = raw === preset.toString();
              return (
                <Pressable
                  key={preset}
                  onPress={() => {
                    hapticLight();
                    setRaw(preset.toString());
                  }}
                  style={{
                    backgroundColor: isSelected ? "#0ea5e9" : "#f0f9ff",
                    borderColor: isSelected ? "#0ea5e9" : "#e0f2fe",
                  }}
                  className="flex-1 py-2.5 rounded-xl items-center border"
                >
                  <Text
                    style={{ color: isSelected ? "#ffffff" : "#075985" }}
                    className="text-xs font-black"
                  >
                    +{preset}ml
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Input Box */}
          <View className="flex-row items-center bg-sky-50/80 px-5 py-3.5 rounded-2xl border border-sky-100 mb-3">
            <TextInput
              className="flex-1 text-sky-950 font-black text-3xl p-0"
              placeholder="250"
              placeholderTextColor="#93c5fd"
              keyboardType="number-pad"
              value={raw}
              onChangeText={setRaw}
              maxLength={4}
            />
            <Text className="text-sky-400 font-black text-lg ml-2">ml</Text>
          </View>

          {/* Hydration Contribution Pill */}
          <View className="flex-row items-center bg-sky-50/60 px-3.5 py-2 rounded-xl border border-sky-100/60 mb-5">
            <Info size={14} color="#0284c7" />
            <Text className="text-sky-700 text-xs font-medium ml-2 flex-1">
              {"Counts as "}
              <Text className="font-bold text-sky-950">
                {effectiveVolume} ml
              </Text>
              {" toward today's hydration"}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              className="flex-1 bg-sky-50 py-4 rounded-2xl items-center border border-sky-100 active:bg-sky-100"
            >
              <Text className="text-sky-700 font-bold text-base">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              disabled={!isValid}
              className={`flex-[2] py-4 rounded-2xl items-center shadow-md flex-row justify-center ${
                isValid ? "bg-sky-500 active:bg-sky-600" : "bg-sky-200"
              }`}
            >
              <Check size={18} color="#ffffff" strokeWidth={3} />
              <Text className="text-white font-black text-base ml-2">
                Log {effectiveBaseAmount}ml {BEVERAGES[selectedType].label}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomLogModal;

