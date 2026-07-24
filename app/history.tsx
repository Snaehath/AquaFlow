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
import { DimensionValue, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BEVERAGES } from "../constants/beverages";
import { useHydration } from "../hooks/useHydration";
import { HydrationLog } from "../types";

// Helper to calculate days from Monday to Sunday of the current week
const getWeeklyDays = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sun, 1 is Mon...
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const days = [];
  const labels = ["M", "T", "W", "T", "F", "S", "S"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    days.push({
      dateStr,
      label: labels[i],
      isToday: dateStr === today.toISOString().split("T")[0],
    });
  }
  return days;
};

const History = () => {
  const router = useRouter();
  const { logs, removeLog, weeklyHistory, actualIntake, effectiveGoal, weeklyVolume } = useHydration();
  const [isExpanded, setIsExpanded] = useState(false);
  const weeklyDays = getWeeklyDays();

  // Map intake history for the current week
  const chartData = weeklyDays.map((day) => {
    let volume = 0;
    if (day.isToday) {
      volume = actualIntake;
    } else {
      const historyEntry = weeklyHistory?.find((h) => h.date === day.dateStr);
      volume = historyEntry ? historyEntry.volume : 0;
    }
    return {
      ...day,
      volume,
    };
  });

  const maxVolume = Math.max(...chartData.map((d) => d.volume), effectiveGoal, 2000);

  const renderLogItem = ({ item }: { item: HydrationLog }) => {
    const beverage = BEVERAGES[item.type] || BEVERAGES.water;
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View className="bg-white p-4 rounded-3xl border border-sky-100 shadow-sm mb-3 flex-row items-center justify-between mx-6">
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

  const renderHeader = () => (
    <View>
      {/* Daily/Weekly Volume Summary Card */}
      <View className="px-6 py-4">
        <View className="bg-sky-500 p-6 rounded-4xl shadow-xl overflow-hidden">
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
                  {weeklyVolume}
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

      {/* Weekly Activity Bar Chart */}
      <View className="px-6 mb-6">
        <View className="bg-white p-5 rounded-4xl border border-sky-100 shadow-sm">
          <Text className="text-sky-950/40 text-[10px] font-black uppercase tracking-widest mb-4 ml-1">
            Weekly Activity
          </Text>
          
          <View className="h-28 flex-row justify-between items-end relative px-2 mt-2">
            {/* Target Goal Line */}
            <View 
              style={{ bottom: `${(effectiveGoal / maxVolume) * 100}%` as DimensionValue }}
              className="absolute left-0 right-0 h-px border-b border-dashed border-sky-200 z-10 flex-row justify-end"
            >
              <Text className="text-[8px] font-black text-sky-400/60 -mt-3.5 bg-white px-1 mr-2 uppercase tracking-tighter">
                Goal
              </Text>
            </View>

            {chartData.map((day, idx) => {
              const heightPercent = `${Math.max(6, Math.min(100, (day.volume / maxVolume) * 100))}%` as DimensionValue;
              const isMet = day.volume >= effectiveGoal;
              
              return (
                <View key={idx} className="items-center flex-1">
                  <View className="h-20 w-full items-center justify-end">
                    <View className="w-2.5 h-full bg-sky-50 rounded-full justify-end overflow-hidden">
                      <View 
                        style={{ height: heightPercent }}
                        className={`w-full rounded-full ${
                          day.isToday 
                            ? isMet ? "bg-sky-500 shadow-md" : "bg-sky-400"
                            : isMet ? "bg-sky-500/80" : "bg-sky-200"
                        }`}
                      />
                    </View>
                  </View>
                  <Text className={`text-[9px] font-bold mt-2 ${day.isToday ? "text-sky-500 font-black" : "text-sky-900/40"}`}>
                    {day.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Timeline Section Title */}
      <View className="flex-row items-center mb-4 ml-7">
        <Calendar size={14} color="#0ea5e9" />
        <Text className="text-sky-900/40 text-xs font-black uppercase tracking-widest ml-2">
          Timeline
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-sky-50">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft color="#082f49" size={24} />
        </Pressable>
        <Text className="text-sky-950 text-xl font-black">History</Text>
        <View className="w-10" />
      </View>

      {logs.length > 0 ? (
        <FlatList
          data={isExpanded ? logs : logs.slice(0, 3)}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={() =>
            logs.length > 3 ? (
              <Pressable
                onPress={() => setIsExpanded(!isExpanded)}
                className="bg-white p-4 rounded-3xl border border-sky-100 items-center justify-center mt-2 shadow-sm mb-10 mx-6"
              >
                <Text className="text-sky-600 font-black text-xs uppercase tracking-widest">
                  {isExpanded ? "Collapse List" : "Show All"}
                </Text>
              </Pressable>
            ) : (
              <View className="h-10" />
            )
          }
        />
      ) : (
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={() => (
            <>
              {renderHeader()}
              <View className="items-center justify-center py-10">
                <View className="bg-white p-8 rounded-full border border-sky-100 shadow-sm mb-4">
                  <HistoryIcon size={40} color="#bae6fd" />
                </View>
                <Text className="text-sky-950 font-black text-lg">No logs yet</Text>
                <Text className="text-sky-400 text-sm text-center px-10 mt-2">
                  Start drinking water to see your progress here!
                </Text>
              </View>
            </>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default History;
