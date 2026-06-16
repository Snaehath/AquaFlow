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

interface CustomLogModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const CustomLogModal: React.FC<CustomLogModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [raw, setRaw] = useState("");

  const amount = parseInt(raw, 10);
  const isValid = !isNaN(amount) && amount > 0 && amount <= 3000;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(amount);
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end"
      >
        <Pressable className="flex-1" onPress={handleClose} />
        <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10 border-t border-sky-100">
          <View className="w-10 h-1 bg-sky-100 rounded-full self-center mb-6" />
          <Text className="text-sky-950 text-xl font-black mb-1">
            Custom Log
          </Text>
          <Text className="text-sky-400 text-xs font-medium mb-6">
            Enter the amount in ml (max 3000ml)
          </Text>

          <View className="flex-row items-center bg-sky-50 px-5 py-4 rounded-2xl border border-sky-100 mb-6">
            <TextInput
              className="flex-1 text-sky-950 font-black text-4xl"
              placeholder="250"
              placeholderTextColor="#bae6fd"
              keyboardType="number-pad"
              value={raw}
              onChangeText={setRaw}
              autoFocus
              maxLength={4}
            />
            <Text className="text-sky-400 font-bold text-lg ml-2">ml</Text>
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              className="flex-1 bg-sky-50 p-4 rounded-2xl items-center border border-sky-100"
            >
              <Text className="text-sky-700 font-bold">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              disabled={!isValid}
              className={`flex-[2] p-4 rounded-2xl items-center ${isValid ? "bg-sky-500" : "bg-sky-200"}`}
            >
              <Text
                className={`font-black text-lg ${isValid ? "text-white" : "text-sky-300"}`}
              >
                Log {isValid ? `${amount}ml` : ""}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomLogModal;
