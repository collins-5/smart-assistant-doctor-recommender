// src/components/drawer/ProfileDrawer.tsx

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

import Icon from "~/components/ui/icon";
import { useProfile } from "~/lib/hooks/useProfile";

const { width, height } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.6;

const cn = (...inputs: (string | undefined | null | false)[]) => {
  return twMerge(clsx(inputs));
};

const Separator = ({ className }: { className?: string }) => (
  <View className={cn("h-px bg-gray-200 dark:bg-gray-700", className)} />
);

type MenuIconName =
  | "account-outline"
  | "cog-outline"
  | "account-cog-outline"
  | "newspaper-variant-multiple"
  | "home-outline"
  | "close";

interface MenuItemProps {
  title: string;
  onPress: () => void;
  iconName: MenuIconName;
  isActive?: boolean;
}

const MenuItem = ({
  title,
  onPress,
  iconName,
  isActive = false,
}: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      "flex-row items-center space-x-4 py-4 px-4 rounded-2xl",
      isActive
        ? "bg-muted dark:bg-green-900/20 border-l-4 border-primary"
        : "active:bg-gray-100 dark:active:bg-gray-800"
    )}
    activeOpacity={0.7}
  >
    <Icon
      name={iconName}
      size={22}
      className={isActive ? "text-primary" : "text-primary"}
    />
    <Text
      className={cn(
        "text-lg font-medium flex-1",
        isActive
          ? "text-primary dark:text-green-400 font-semibold"
          : "text-gray-800 dark:text-gray-100"
      )}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useProfile();

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const currentDate = new Date();
  const time = format(currentDate, "h:mm a");
  const date = format(currentDate, "EEEE, MMMM d, yyyy");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -DRAWER_WIDTH,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  const navigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const isPathActive = (path: string) => {
    if (path === "/(tabs)/dashboard") {
      return pathname === "/" || pathname.includes("/dashboard");
    }
    return pathname.includes(path.replace("/(tabs)/", "").replace("/", ""));
  };

  const hasProfile = !!profile;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={{ opacity: backdropOpacity }}
        className="absolute inset-0 bg-black/60 z-40"
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[
          { transform: [{ translateX }] },
          { width: DRAWER_WIDTH, height },
        ]}
        className="absolute left-0 top-0 z-50"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-white shadow-2xl border-r border-gray-100">
            {/* Header */}
            <View className="flex-row items-center justify-between p-6 pt-safe pb-4">
              <Text className="text-2xl font-bold text-gray-900">Menu</Text>
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-100 rounded-full p-2.5 shadow-md"
                activeOpacity={0.8}
              >
                <Icon name="close" size={24} className="text-gray-700" />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View className="px-6 pt-3 pb-6 items-center">
              <TouchableOpacity
                onPress={() => navigate("/profiles")}
                className="relative"
              >
                {profile?.profilePictureUrl ? (
                  <Image
                    source={{ uri: profile.profilePictureUrl }}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-2xl"
                  />
                ) : (
                  <View className="w-32 h-32 rounded-full bg-primary flex items-center justify-center shadow-2xl">
                    <Text className="text-white text-5xl font-bold">
                      {profile?.firstName?.[0]?.toUpperCase() || "U"}
                      {profile?.lastName?.[0]?.toUpperCase() || ""}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <Text className="text-center text-xl font-semibold text-gray-800 mt-4">
                {profile?.firstName} {profile?.lastName}
              </Text>

              <View className="flex-row items-center justify-center mt-6 space-x-6">
                <View className="flex-row items-center">
                  <Icon
                    name="map-marker-radius-outline"
                    size={18}
                    className="text-primary"
                  />
                  <Text className="text-sm text-gray-700 ml-2">Kenya</Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm font-medium text-gray-800">
                    {time}
                  </Text>
                  <Text className="text-xs text-gray-500">{date}</Text>
                </View>
              </View>
            </View>

            <Separator className="mx-6" />

            {/* Menu Items */}
            <View className="flex-1 px-6 py-4 space-y-1">
              <MenuItem
                title="Home"
                onPress={() => navigate("/(tabs)/dashboard")}
                iconName="home-outline"
                isActive={isPathActive("/(tabs)/dashboard")}
              />

              {/* Only show "My Bookmarked Doctors" if user has a profile */}
              {profile?.firstName && (
                <MenuItem
                  title="My Bookmarked Doctors"
                  onPress={() => navigate("/(tabs)/bookmarked")}
                  iconName="newspaper-variant-multiple"
                  isActive={isPathActive("/(tabs)/bookmarked")}
                />
              )}

              <MenuItem
                title="Profile"
                onPress={() => navigate("/(tabs)/profile")}
                iconName="account-outline"
                isActive={isPathActive("/(tabs)/profile")}
              />

              <Separator className="my-2" />

              <MenuItem
                title="Account Settings"
                onPress={() => navigate("/settings")}
                iconName="cog-outline"
                isActive={isPathActive("/settings")}
              />

              <MenuItem
                title="Manage Account"
                onPress={() => navigate("/account")}
                iconName="account-cog-outline"
                isActive={isPathActive("/account")}
              />

              <Separator className="my-2" />
            </View>

            <View className="p-5 border-t border-gray-100">
              <Text className="text-xs text-center text-gray-500">
                © 2025 TaskSync. All rights reserved.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </>
  );
}
