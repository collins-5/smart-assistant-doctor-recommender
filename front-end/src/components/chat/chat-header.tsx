// src/components/chat/ChatHeader.tsx (or wherever it lives)

import React from "react";
import { View } from "react-native";
import Icon from "../ui/icon";
import { Text } from "../ui/text";
import { TouchableOpacity } from "react-native";

const ChatHeader = () => {
  return (
    <View className="h-20 flex-row items-center bg-primary px-5 shadow-lg border-b border-primary/20">
      {/* Subtle gradient overlay for depth */}
      <View className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

      {/* Main Content */}
      <View className="flex-1 flex-row items-center gap-8">
        {/* AI Icon with glow effect */}
        <View className="relative">
          <View className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150" />
          <View className="w-12 h-12 bg-white/15 rounded-2xl items-center justify-center shadow-2xl border border-white/20">
            <Icon name="robot" color="white" size={28} />
          </View>
        </View>

        {/* Title + Subtitle */}
        <View>
          <Text className="text-2xl font-bold text-primary-foreground tracking-tight">
            SDR-ai
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            <View className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
            <Text className="text-sm text-primary-foreground font-medium">
              Online • Ready to help
            </Text>
          </View>
        </View>
      </View>

      {/* Optional: Add action buttons on the right later */}
      <TouchableOpacity className="p-2">
        <Icon name="dots-vertical" color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;
