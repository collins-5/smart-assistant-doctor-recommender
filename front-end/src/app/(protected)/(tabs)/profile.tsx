// app/(protected)/(tabs)/profile.tsx
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useProfile } from "~/lib/hooks/useProfile";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";

export default function ProfileScreen() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  if (!profile || error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-destructive">
          {error?.message || "Failed to load profile"}
        </Text>
      </View>
    );
  }

  // This is the correct way — your hook returns patientId: number | null
  const hasPatientProfile = profile.patientId !== null;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-16 pb-8 items-center">
        {profile.profilePictureUrl ? (
          <Image
            source={{ uri: profile.profilePictureUrl }}
            className="w-32 h-32 rounded-full border-4 border-white"
            resizeMode="cover"
          />
        ) : (
          <View className="w-32 h-32 rounded-full bg-blue-500 border-4 border-white justify-center items-center">
            <Text className="text-white text-5xl font-bold">
              {profile.firstName[0]?.toUpperCase() || "U"}
            </Text>
          </View>
        )}
        <Text className="text-white text-2xl font-bold mt-4">
          {profile.fullName || "User"}
        </Text>
        <Text className="text-blue-100 text-lg mt-1">{profile.email}</Text>
      </View>

      {/* Profile Info */}
      <View className="px-6 py-6 space-y-4">
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <Text className="text-gray-500 text-sm font-medium mb-3">
            Personal Information
          </Text>
          <View className="space-y-3">
            {profile.fullName && (
              <InfoRow
                icon="person-outline"
                label="Full Name"
                value={profile.fullName}
              />
            )}
            <InfoRow icon="mail-outline" label="Email" value={profile.email} />
            <InfoRow
              icon="call-outline"
              label="Phone"
              value={profile.phoneNumber || "Not set"}
            />
            {profile.dateOfBirth && (
              <InfoRow
                icon="calendar-outline"
                label="Date of Birth"
                value={new Date(profile.dateOfBirth).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              />
            )}
            {profile.gender && (
              <InfoRow
                icon="male-female-outline"
                label="Gender"
                value={
                  profile.gender === "M"
                    ? "Male"
                    : profile.gender === "F"
                      ? "Female"
                      : "Other"
                }
              />
            )}
            {profile.countryName && (
              <InfoRow
                icon="earth-outline"
                label="Country"
                value={profile.countryName}
              />
            )}
            {profile.countyName && (
              <InfoRow
                icon="location-outline"
                label="County"
                value={profile.countyName}
              />
            )}
          </View>
        </View>

        {/* Account Actions */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <Text className="text-gray-500 text-sm font-medium mb-3">
            Account
          </Text>

          {/* Dynamic Button */}
          <TouchableOpacity
            onPress={() => {
              router.push(
                hasPatientProfile
                  ? "/(protected)/(profiles)/edit-profile"
                  : "/(protected)/(profiles)/create-profile"
              );
            }}
            className="flex-row items-center py-4 border-b border-gray-200"
          >
            <Ionicons
              name={hasPatientProfile ? "create-outline" : "person-add-outline"}
              size={24}
              color="#007AFF"
            />
            <Text className="ml-4 text-base text-foreground flex-1">
              {hasPatientProfile ? "Edit Profile" : "Complete Your Profile"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={() => {
              SheetManager.show("logout-confirmation");
            }}
            className="flex-row items-center py-4"
          >
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text className="ml-4 text-base text-red-600 flex-1">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="items-center mt-8 pb-10">
          <Text className="text-gray-400 text-sm">
            Smart Doctor Recommender
          </Text>
          <Text className="text-gray-400 text-xs mt-1">Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Reusable row
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center py-3 border-b border-gray-50 last:border-0">
    <Ionicons name={icon} size={20} color="#666" />
    <Text className="ml-4 text-gray-500 text-sm w-32">{label}</Text>
    <Text className="text-gray-800 text-base flex-1 text-right">
      {value || "Not set"}
    </Text>
  </View>
);
