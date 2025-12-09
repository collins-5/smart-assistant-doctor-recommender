// app/(protected)/bookmarks.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useBookmarkedDoctors } from "~/lib/hooks/useBookmarkedDoctors";

export default function BookmarksScreen() {
  const { doctors, error, loading, refetch } = useBookmarkedDoctors();

  if (loading && doctors.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Loading your doctors...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-8">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-red-600 text-center text-lg mt-4">
          {error.message || "Something went wrong"}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-6 bg-blue-600 py-3 px-6 rounded-full"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pt-6 pb-10"
        refreshing={loading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20 px-10">
            <Ionicons name="bookmark-outline" size={80} color="#94a3b8" />
            <Text className="text-gray-500 text-xl font-medium mt-6 text-center">
              No bookmarked doctors yet
            </Text>
            <Text  className="text-gray-400 text-center mt-2">
              Tap the bookmark icon on any doctor's profile to save them here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(protected)/doctor/[id]",
                params: { id: item.id },
              })
            }
            activeOpacity={0.8}
            className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100"
          >
            <View className="flex-row items-center gap-4">
              {/* Avatar */}
              {item.profilePictureUrl ? (
                <Image
                  source={{ uri: item.profilePictureUrl }}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-blue-100 justify-center items-center">
                  <Text className="text-blue-600 text-2xl font-bold">
                    {item.firstName[0]}
                  </Text>
                </View>
              )}

              {/* Details */}
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {item.title && `${item.title} `}
                  {item.fullName}
                </Text>
                <Text className="text-gray-600 mt-1">
                  {item.primarySpecialty?.name || "General Practitioner"}
                </Text>

                {/* Prices */}
                <View className="flex-row gap-4 mt-3">
                  {item.teleconsultPrice && (
                    <Text className="text-sm text-gray-500">
                      Teleconsult: KSh {item.teleconsultPrice}
                    </Text>
                  )}
                  {item.clinicVisitPrice && (
                    <Text className="text-sm text-gray-500">
                      Clinic: KSh {item.clinicVisitPrice}
                    </Text>
                  )}
                </View>
              </View>

              {/* Bookmark Icon (filled since it's bookmarked) */}
              <Ionicons name="bookmark" size={24} color="#2563eb" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
