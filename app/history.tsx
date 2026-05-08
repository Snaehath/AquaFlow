import { useRouter } from "expo-router";
import {
  Calendar,
  ChevronLeft,
  Coffee,
  Droplets,
  History as HistoryIcon,
  Trash2,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BEVERAGES } from "../constants/beverages";
import { useHydration } from "../hooks/useHydration";
import { HydrationLog } from "../types";

const History = () => {
  const router = useRouter();
  const { logs, removeLog } = useHydration();
  const [isExpanded, setIsExpanded] = useState(false);

  const renderLogItem = ({ item }: { item: HydrationLog }) => {
    const beverage = BEVERAGES[item.type] || BEVERAGES.water;
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View className="bg-white p-4 rounded-3xl border border-sky-100 shadow-sm mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            style={{ backgroundColor: `${beverage.color}20` }}
            className="p-3 rounded-2xl mr-4"
          >
            {item.type === "water" && (
              <Droplets size={22} color={beverage.color} />
            )}
            {item.type === "coffee" && (
              <Coffee size={22} color={beverage.color} />
            )}
            {item.type === "electrolyte" && (
              <Zap size={22} color={beverage.color} />
            )}
          </View>
          <View>
            <Text className="text-sky-950 font-black">
              {item.amount}ml {beverage.label}
            </Text>
            <Text className="text-sky-400 text-[10px] font-bold uppercase tracking-tight">
              {time}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => removeLog(item.id)}
          className="p-2 bg-red-50 rounded-full"
        >
          <Trash2 size={16} color="#ef4444" />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-sky-50">
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft color="#082f49" size={24} />
        </Pressable>
        <Text className="text-sky-950 text-xl font-black">History</Text>
        <View className="w-10" />
      </View>

      <View className="px-6 py-4">
        <View className="bg-sky-500 p-6 rounded-4xl shadow-xl overflow-hidden">
          {/* Background Decorative Circles */}
          <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
          <View className="absolute -left-10 -bottom-10 w-24 h-24 bg-white/5 rounded-full" />

          <View className="flex-row items-center mb-6">
            <View className="flex-1">
              <Text className="text-sky-100 text-[10px] font-black uppercase tracking-widest mb-1">
                Daily Volume
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-white text-4xl font-black">
                  {Math.round(
                    logs.reduce((acc, log) => acc + log.effectiveAmount, 0),
                  )}
                </Text>
                <Text className="text-sky-100 text-lg font-bold ml-1">ml</Text>
              </View>
            </View>
            <View className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30">
              <HistoryIcon size={24} color="white" />
            </View>
          </View>

          <View className="h-px bg-white/20 w-full mb-6" />

          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sky-100 text-[10px] font-black uppercase tracking-widest mb-1">
                Weekly Total
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-white text-2xl font-black">
                  {useHydration().weeklyVolume}
                </Text>
                <Text className="text-sky-100 text-sm font-bold ml-1">ml</Text>
              </View>
            </View>
            <View className="bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <Text className="text-white text-[10px] font-bold">
                Resets Monday
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1 px-6">
        <View className="flex-row items-center mb-4 ml-1">
          <Calendar size={14} color="#0ea5e9" />
          <Text className="text-sky-900/40 text-xs font-black uppercase tracking-widest ml-2">
            Timeline
          </Text>
        </View>

        {logs.length > 0 ? (
          <>
            <FlatList
              data={isExpanded ? logs : logs.slice(0, 3)}
              renderItem={renderLogItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
              scrollEnabled={isExpanded}
            />
            {logs.length > 3 && (
              <Pressable
                onPress={() => setIsExpanded(!isExpanded)}
                className="bg-white p-4 rounded-2xl border border-sky-100 items-center justify-center mt-2 shadow-sm mb-10"
              >
                <Text className="text-sky-600 font-black text-xs uppercase tracking-widest">
                  {isExpanded ? "Collapse List" : `Show All`}
                </Text>
              </Pressable>
            )}
          </>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-white p-8 rounded-full border border-sky-100 shadow-sm mb-4">
              <HistoryIcon size={40} color="#bae6fd" />
            </View>
            <Text className="text-sky-950 font-black text-lg">No logs yet</Text>
            <Text className="text-sky-400 text-sm text-center px-10 mt-2">
              Start drinking water to see your progress here!
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default History;
