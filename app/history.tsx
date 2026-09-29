import { useRouter } from "expo-router";
import {
  Calendar,
  ChevronLeft,
  Droplets,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import { DimensionValue, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BEVERAGES, BEVERAGE_TYPES } from "../constants";
import { useHydration } from "../hooks/useHydration";
import { HydrationLog } from "../types";
import { hapticLight } from "../utils/haptics";
import { BEVERAGE_ICONS } from "../components/QuickAdd";

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
  const { logs, removeLog, weeklyHistory, actualIntake, weeklyVolume } = useHydration();
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

  const maxVolume = Math.max(...chartData.map((d) => d.volume), 2000);
  const todayTotal = logs.reduce((acc, log) => acc + log.amount, 0);

  const renderLogItem = ({ item }: { item: HydrationLog }) => {
    const beverage = BEVERAGES[item.type] || BEVERAGES.water;
    const IconComponent = BEVERAGE_ICONS[item.type] || Droplets;
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View className="bg-white p-4 rounded-3xl border border-sky-100/80 shadow-xs mb-2.5 flex-row items-center justify-between mx-6">
        <View className="flex-row items-center flex-1 pr-2">
          <View
            style={{ backgroundColor: `${beverage.color}18` }}
            className="p-2.5 rounded-2xl mr-3"
          >
            <IconComponent size={20} color={beverage.color} strokeWidth={2.4} />
          </View>
          <View className="flex-1">
            <Text className="text-sky-950 font-bold text-sm">
              {item.amount} ml {beverage.label}
            </Text>
            <Text className="text-sky-400 text-[11px] font-medium mt-0.5">
              {time}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            hapticLight();
            removeLog(item.id);
          }}
          className="p-2 bg-red-50/80 active:bg-red-100 rounded-full"
        >
          <Trash2 size={14} color="#ef4444" />
        </Pressable>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Quiet Observational Summary Row */}
      <View className="px-6 py-2">
        <View className="bg-white p-5 rounded-3xl border border-sky-100/80 shadow-xs flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-sky-900/40 text-[11px] font-bold uppercase tracking-wider mb-1">
              Today
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-sky-950 text-2xl font-black">
                {Math.round(todayTotal)}
              </Text>
              <Text className="text-sky-400 text-xs font-bold ml-1">ml</Text>
            </View>
          </View>

          <View className="w-px h-10 bg-sky-100 mx-4" />

          <View className="flex-1">
            <Text className="text-sky-900/40 text-[11px] font-bold uppercase tracking-wider mb-1">
              This Week
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-sky-950 text-2xl font-black">
                {weeklyVolume}
              </Text>
              <Text className="text-sky-400 text-xs font-bold ml-1">ml</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Weekly Rhythm Visualization */}
      <View className="px-6 my-3">
        <View className="bg-white p-5 rounded-3xl border border-sky-100/80 shadow-xs">
          <View className="flex-row justify-between items-center mb-3 px-1">
            <Text className="text-sky-900/40 text-[11px] font-bold uppercase tracking-wider">
              This Week
            </Text>
            <Text className="text-sky-600/70 text-xs font-semibold">
              Daily average ~{Math.round(weeklyVolume / 7)} ml
            </Text>
          </View>

          <View className="h-24 flex-row justify-between items-end px-2 mt-3">
            {chartData.map((day, idx) => {
              const heightPercent = `${Math.max(6, Math.min(100, (day.volume / maxVolume) * 100))}%` as DimensionValue;

              return (
                <View key={idx} className="items-center flex-1">
                  <View className="h-16 w-full items-center justify-end">
                    <View className="w-2.5 h-full bg-sky-50 rounded-full justify-end overflow-hidden">
                      <View
                        style={{ height: heightPercent }}
                        className={`w-full rounded-full ${
                          day.isToday ? "bg-sky-500" : "bg-sky-200"
                        }`}
                      />
                    </View>
                  </View>
                  <Text
                    className={`text-[10px] mt-2 ${
                      day.isToday
                        ? "text-sky-700 font-black"
                        : "text-sky-900/40 font-semibold"
                    }`}
                  >
                    {day.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Beverage Fluid Distribution Breakdown */}
      {logs.length > 0 && (
        <View className="px-6 mb-4">
          <View className="bg-white p-5 rounded-3xl border border-sky-100/80 shadow-xs">
            <Text className="text-sky-900/40 text-[11px] font-bold uppercase tracking-wider mb-3 px-1">
              Drinks today
            </Text>

            {/* Distribution Stacked Bar */}
            <View className="h-2.5 w-full bg-sky-50 rounded-full flex-row overflow-hidden mb-3">
              {BEVERAGE_TYPES.map((bev) => {
                const totalRaw = logs.reduce((acc, l) => acc + l.amount, 0);
                const bVol = logs
                  .filter((l) => l.type === bev)
                  .reduce((acc, l) => acc + l.amount, 0);
                const pct = totalRaw > 0 ? (bVol / totalRaw) * 100 : 0;
                if (pct <= 0) return null;

                return (
                  <View
                    key={bev}
                    style={{
                      width: `${pct}%` as DimensionValue,
                      backgroundColor: BEVERAGES[bev].color,
                    }}
                    className="h-full"
                  />
                );
              })}
            </View>

            {/* Legend Chips */}
            <View className="flex-row flex-wrap gap-2">
              {BEVERAGE_TYPES.map((bev) => {
                const totalRaw = logs.reduce((acc, l) => acc + l.amount, 0);
                const bVol = logs
                  .filter((l) => l.type === bev)
                  .reduce((acc, l) => acc + l.amount, 0);
                const pct = totalRaw > 0 ? Math.round((bVol / totalRaw) * 100) : 0;
                if (bVol <= 0) return null;

                const config = BEVERAGES[bev];

                return (
                  <View
                    key={bev}
                    className="flex-row items-center bg-sky-50/70 px-2.5 py-1 rounded-xl border border-sky-100/60"
                  >
                    <View
                      style={{ backgroundColor: config.color }}
                      className="w-2 h-2 rounded-full mr-1.5"
                    />
                    <Text className="text-sky-950 font-semibold text-xs">
                      {config.label}{" "}
                      <Text className="text-sky-400 text-[10px]">({pct}%)</Text>
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* Timeline Section Title */}
      <View className="flex-row items-center mt-2 mb-3 ml-7">
        <Calendar size={13} color="#0284c7" />
        <Text className="text-sky-900/40 text-[11px] font-bold uppercase tracking-wider ml-1.5">
          Timeline
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-sky-50">
      {/* Top Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
          <ChevronLeft color="#082f49" size={24} />
        </Pressable>
        <Text className="text-sky-950 text-xl font-black">History</Text>
        <View className="w-10" />
      </View>

      {logs.length > 0 ? (
        <FlatList
          data={isExpanded ? logs : logs.slice(0, 4)}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={() =>
            logs.length > 4 ? (
              <Pressable
                onPress={() => setIsExpanded(!isExpanded)}
                className="bg-white p-3.5 rounded-2xl border border-sky-100/80 items-center justify-center mt-1 shadow-xs mb-10 mx-6"
              >
                <Text className="text-sky-600 font-bold text-xs">
                  {isExpanded ? "Show Less" : `Show All (${logs.length} drinks)`}
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
              <View className="items-center justify-center py-12 px-8">
                <Text className="text-sky-950 font-bold text-base">
                  No logs recorded today
                </Text>
                <Text className="text-sky-900/50 text-xs text-center mt-1.5 leading-5">
                  Have a sip when you're ready. Your drinks will be logged here.
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
