// src/components/Header.tsx

import React, { useState } from "react";
import { Image, TouchableOpacity} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import View from "@/components/ui/view";
import { useProfile } from "~/lib/hooks/useProfile";
import Icon from "../ui/icon";
import { router } from "expo-router";
import ProfileDrawer from "../drawer/drawer";
import { Skeleton } from "../ui/skeleton";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
};

interface HeaderProps {
  unreadCount?: number;
}

export default function Header({ unreadCount = 0 }: HeaderProps = {}) {
  const insets = useSafeAreaInsets();
  const { profile , loading } = useProfile();
  const greeting = getGreeting();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const hasProfile = !!profile;
  const firstName = profile?.firstName;

  return (
    <>
      <View
        className="bg-primary px-5 pb-6 relative"
        style={{ paddingTop: 10 }}
      >
        {/* Gradient overlay */}
        <View className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

        <View className="flex-row items-center justify-between">
          {/* Left: Avatar + Greeting */}
          <View className="flex-row items-center gap-4 flex-1">
            {/* Clickable Avatar */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsDrawerOpen(true)}
              className="relative"
            >
              {profile?.profilePictureUrl ? (
                <Image
                  source={{ uri: profile.profilePictureUrl }}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-2xl"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-white/30 border-4 border-white shadow-2xl justify-center items-center backdrop-blur-xl">
                  <Text className="text-white text-3xl font-bold">
                    {profile?.firstName
                      ? `${profile?.firstName?.[0]?.toUpperCase() || ""}${profile?.lastName?.[0]?.toUpperCase() || ""}`
                      : "U"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Greeting Text */}
            <View className="justify-center flex-1">
              <Text className="text-primary-foreground text-base font-medium">
                Good {greeting},
              </Text>

              {loading ? (
               <Skeleton className="h-6 w-32 rounded-full mt-1" />
              ) : (
                <>
                  {profile?.firstName ? (
                    <Text className="text-primary-foreground text-2xl font-bold mt-0.5">
                      {profile.firstName}!
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        router.push("/(protected)/(profiles)/create-profile")
                      }
                      activeOpacity={0.8}
                    >
                      <Text className="text-primary-foreground text-2xl font-bold mt-0.5 underline">
                        complete your profile!
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Right: Notifications */}
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              activeOpacity={0.7}
              className="p-3 bg-white/20 rounded-full backdrop-blur-md shadow-lg border border-white/10 relative"
              onPress={() => router.push("/notifications")}
            >
              <Icon name="bell" size={24} color="white" />

              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-6 h-6 justify-center items-center shadow-md">
                  <Text className="text-white text-xs font-bold">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
