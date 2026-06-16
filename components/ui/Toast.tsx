import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { X, CheckCircle, AlertOctagon, Info } from "lucide-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useToastStore } from "@/store/toastStore";

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useToastStore();

  if (!toast) return null;

  const { title, description, variant = "default", action, icon: CustomIcon, image } = toast;

  // Color mapping based on variant
  let bgClass = "bg-white border-zinc-200";
  let titleClass = "text-zinc-900";
  let descClass = "text-zinc-500";
  let Icon = Info;
  let iconColor = "#71717a";

  if (variant === "success") {
    bgClass = "bg-white border-sky-200";
    titleClass = "text-sky-950";
    descClass = "text-sky-700";
    Icon = CheckCircle;
    iconColor = "#0ea5e9";
  } else if (variant === "destructive") {
    bgClass = "bg-red-50 border-red-200";
    titleClass = "text-red-950";
    descClass = "text-red-700";
    Icon = AlertOctagon;
    iconColor = "#ef4444";
  }

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      className="absolute top-14 left-6 right-6 z-50 shadow-xl rounded-xl"
    >
      <View
        className={`flex-row items-center justify-between p-4 rounded-xl border ${bgClass}`}
      >
        <View className="flex-row items-center flex-1 mr-3">
          {image ? (
            <Image
              source={image}
              style={{ width: 40, height: 40, marginRight: 12 }}
              resizeMode="contain"
            />
          ) : CustomIcon ? (
            <View className="mr-3">
              <CustomIcon size={20} color={iconColor} />
            </View>
          ) : (
            <View className="mt-0.5 mr-3">
              <Icon size={18} color={iconColor} />
            </View>
          )}
          <View className="flex-1">
            <Text className={`font-semibold text-sm ${titleClass}`}>{title}</Text>
            {description && (
              <Text className={`text-xs mt-1 ${descClass}`}>{description}</Text>
            )}
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {action && (
            <Pressable
              onPress={() => {
                action.onPress();
                dismissToast();
              }}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 active:bg-zinc-100"
            >
              <Text className="text-zinc-700 font-medium text-xs">
                {action.label}
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={dismissToast}
            className="p-1 rounded-full hover:bg-zinc-100 active:bg-zinc-200"
          >
            <X size={16} color="#a1a1aa" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default Toast;
