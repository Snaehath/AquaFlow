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
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CustomLogModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const PRESETS = [150, 250, 500, 750];

const CustomLogModal: React.FC<CustomLogModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const insets = useSafeAreaInsets();
  const [raw, setRaw] = useState("");

  const parsedAmount = parseInt(raw, 10);
  const effectiveAmount = !isNaN(parsedAmount) && parsedAmount > 0 ? parsedAmount : 250;
  const isValid = isNaN(parsedAmount) || (parsedAmount > 0 && parsedAmount <= 3000);

  const handleConfirm = () => {
    if (parsedAmount > 3000) return;
    onConfirm(effectiveAmount);
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
        <Pressable 
          className="flex-1 bg-black/30" 
          onPress={handleClose} 
        />

        <View 
          style={{ paddingBottom: Math.max(insets.bottom + 16, 24) }}
          className="bg-white rounded-t-[36px] px-6 pt-6 border-t border-sky-100 shadow-2xl"
        >
          {/* Drag Handle */}
          <View className="w-12 h-1.5 bg-sky-200 rounded-full self-center mb-6" />

          <Text className="text-sky-950 text-2xl font-black mb-1">
            Custom Log
          </Text>
          <Text className="text-sky-400 text-xs font-semibold mb-6">
            Enter amount in ml (max 3000ml)
          </Text>

          {/* Quick Amount Chips */}
          <View className="flex-row gap-2 mb-4">
            {PRESETS.map((preset) => (
              <Pressable
                key={preset}
                onPress={() => setRaw(preset.toString())}
                className={`flex-1 py-2 rounded-xl items-center border ${
                  raw === preset.toString()
                    ? "bg-sky-500 border-sky-500"
                    : "bg-sky-50 border-sky-100"
                }`}
              >
                <Text
                  className={`text-xs font-black ${
                    raw === preset.toString() ? "text-white" : "text-sky-700"
                  }`}
                >
                  +{preset}ml
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Input Box */}
          <View className="flex-row items-center bg-sky-50/80 px-5 py-3.5 rounded-2xl border border-sky-100 mb-6">
            <TextInput
              className="flex-1 text-sky-950 font-black text-3xl p-0"
              placeholder="250"
              placeholderTextColor="#93c5fd"
              keyboardType="number-pad"
              value={raw}
              onChangeText={setRaw}
              autoFocus
              maxLength={4}
            />
            <Text className="text-sky-400 font-black text-lg ml-2">ml</Text>
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
              className={`flex-[2] py-4 rounded-2xl items-center shadow-md ${
                isValid ? "bg-sky-500 active:bg-sky-600" : "bg-sky-200"
              }`}
            >
              <Text className="text-white font-black text-base">
                Log {effectiveAmount}ml
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomLogModal;
