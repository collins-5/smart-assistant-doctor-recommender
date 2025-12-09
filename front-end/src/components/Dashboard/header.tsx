// src/components/Header.tsx
import React from "react";
import { Image, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../ui/text";
import View from "../ui/view";
import { useProfile } from "~/lib/hooks/useProfile";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
};

export default function Header() {
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const greeting = getGreeting();
  const firstName = profile?.firstName || "there";

  return (
    <View
      className="bg-primary px-5 pb-5"
      style={{ paddingTop: insets.top + 8 }} // extra breathing room on iOS
    >
      <View className="flex-row items-center gap-4">
        {/* Avatar with subtle shadow & glow */}
        <View className="relative">
          {profile?.profilePictureUrl ? (
            <Image
              source={{ uri: profile.profilePictureUrl }}
              className="w-14 h-14 rounded-full border-4 border-white shadow-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-14 h-14 rounded-full bg-white/20 border-4 border-white shadow-lg justify-center items-center backdrop-blur-md">
              <Text className="text-white text-3xl font-bold">
                {firstName[0]?.toUpperCase()}
              </Text>
            </View>
          )}
          {/* Optional: tiny online dot */}
          <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-primary" />
        </View>

        {/* Greeting Text */}
        <View className="flex-1 justify-center">
          <Text className="text-primary-foreground text-sm font-medium">
            Good {greeting}
          </Text>
          <Text className="text-primary-foreground text-xl font-bold mt-0.5">
            {firstName}!
          </Text>
        </View>
      </View>
    </View>
  );
}
