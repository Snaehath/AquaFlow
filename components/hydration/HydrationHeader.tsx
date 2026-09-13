import { formatDate } from "@/utils/date";
import { useRouter } from "expo-router";
import { History, Settings } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface HydrationHeaderProps {
  streak?: number;
}

const HydrationHeader: React.FC<HydrationHeaderProps> = () => {
  const router = useRouter();

  return (
    <View className="py-4 flex-row justify-between items-center">
      <View>
        <Text className="text-sky-950 text-2xl font-black">AquaFlow</Text>
        <Text className="text-sky-600 text-xs font-bold uppercase tracking-wider mt-0.5">
          {formatDate(new Date())}
        </Text>
      </View>
      <View className="flex-row">
        <Pressable
          onPress={() => router.push("/history")}
          className="p-2.5 bg-white rounded-2xl border border-sky-100 shadow-xs active:bg-sky-50"
        >
          <History size={18} color="#0ea5e9" />
        </Pressable>
        <Pressable
          onPress={() => router.push("/settings")}
          className="ml-2 p-2.5 bg-white rounded-2xl border border-sky-100 shadow-xs active:bg-sky-50"
        >
          <Settings size={18} color="#0ea5e9" />
        </Pressable>
      </View>
    </View>
  );
};

export default React.memo(HydrationHeader);
