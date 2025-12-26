// src/app/(protected)/notifications.tsx
// or src/screens/NotificationsScreen.tsx

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDistanceToNow } from "date-fns";
import Icon from "@/components/ui/icon";
import { useProfile } from "~/lib/hooks/useProfile";
import { useNotifications } from "~/lib/hooks/useNotifications";
import { useState } from "react";

export default function NotificationsScreen() {
  const { profile, loading: loadingProfile } = useProfile();
  const patientId = profile?.patientId ?? null;

  const {
    notifications,
    unreadCount,
    loading: loadingNotifs,
  } = useNotifications(patientId);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // The subscription is live, but you can force a quick visual refresh
    setTimeout(() => setRefreshing(false), 800);
  };

  // Loading state
  if (loadingProfile || (loadingNotifs && notifications.length === 0)) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500 text-lg">Loading notifications...</Text>
      </SafeAreaView>
    );
  }

  // No patient profile yet (shouldn't happen if protected route)
  if (!patientId) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-8">
        <Icon name="alert-outline" size={64} color="#f59e0b" />
        <Text className="text-lg font-semibold text-gray-800 mt-4">
          Profile not ready
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Please complete your profile to receive notifications.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-teal-700">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View className="bg-red-500 px-3 py-1.5 rounded-full">
              <Text className="text-white text-sm font-bold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Empty State */}
      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Icon name="bell-outline" size={80} color="#94a3b8" />
          <Text className="text-xl font-semibold text-gray-700 mt-6">
            All clear!
          </Text>
          <Text className="text-gray-500 text-center mt-3 leading-6">
            You have no notifications at the moment. We'll notify you when you
            book an appointment or get important updates.
          </Text>
        </View>
      ) : (
        /* Notifications List */
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerClassName="pt-4 pb-8"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.75}
              className={`
                mx-4 mb-3 p-4 rounded-2xl shadow-sm
                ${item.isRead ? "bg-white" : "bg-teal-50 border border-teal-200"}
              `}
            >
              <View className="flex-row items-start">
                {/* Icon */}
                <View className="mr-4 mt-1">
                  <View className="bg-teal-100 p-3 rounded-full">
                    <Icon
                      name={
                        item.title.toLowerCase().includes("appointment")
                          ? "calendar"
                          : "bell"
                      }
                      size={26}
                      color="#0d9488"
                    />
                  </View>
                </View>

                {/* Content */}
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">
                    {item.title}
                  </Text>
                  <Text className="text-gray-700 mt-1.5 leading-5">
                    {item.description}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-3">
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </Text>
                </View>

                {/* Unread indicator */}
                {!item.isRead && (
                  <View className="w-3 h-3 bg-teal-600 rounded-full mt-1.5" />
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
