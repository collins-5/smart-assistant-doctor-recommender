// app/(protected)/(tabs)/profile.tsx
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useProfile } from "~/lib/hooks/useProfile";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { Image } from "expo-image";

export default function ProfileScreen() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-muted-foreground text-lg">
          Loading profile...
        </Text>
      </View>
    );
  }

  if (!profile || error) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-destructive text-lg">
          {error?.message  || "Failed to load profile"}
        </Text>
      </View>
    );
  }

  const hasPatientProfile = profile.patientId !== null;

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    >
      {/* Header - Now using bg-primary */}
      <View className="bg-primary pt-16 pb-10 items-center">
        {profile.profilePictureUrl ? (
          <Image
            source={{ uri: profile.profilePictureUrl }}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/40 justify-center items-center shadow-lg">
            <Text className="text-primary-foreground text-5xl font-bold">
              {profile.firstName[0]?.toUpperCase() || "U"}
              {profile.lastName[0]?.toUpperCase() || ""}
            </Text>
          </View>
        )}

        <Text className="text-primary-foreground text-3xl font-bold mt-5">
          {profile.fullName || "User"}
        </Text>
        <Text className="text-primary-foreground/80 text-lg mt-1">
          {profile.email}
        </Text>
      </View>

      {/* Profile Info */}
      <View className="px-6 -mt-6">
        <View className="bg-card rounded-3xl shadow-xl p-6 border border-gray-200">
          <Text className="text-foreground text-lg font-bold mb-5">
            Personal Information
          </Text>

          <View className="space-y-1">
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
        <View className="bg-card rounded-3xl shadow-xl p-6 mt-6 border border-gray-200">
          <Text className="text-foreground text-lg font-bold mb-5">
            Account
          </Text>

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
              color="rgb(14, 103, 126)"
            />
            <Text className="ml-4 text-base text-foreground flex-1 font-medium">
              {hasPatientProfile ? "Edit Profile" : "Complete Your Profile"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => SheetManager.show("logout-confirmation")}
            className="flex-row items-center py-4"
          >
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text className="ml-4 text-base text-destructive flex-1 font-medium">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="items-center mt-10 pb-10">
          <Text className="text-muted-foreground text-sm font-medium">
            Smart Doctor Recommender
          </Text>
          <Text className="text-muted-foreground text-xs mt-1">
            Version 1.0.0
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Reusable Info Row
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center py-3 border-b border-gray-100 last:border-0">
    <Ionicons name={icon} size={22} color="rgb(14, 103, 126)" />
    <Text className="ml-4 text-muted-foreground text-sm w-32 font-medium">
      {label}
    </Text>
    <Text className="text-foreground text-base flex-1 text-right font-medium">
      {value}
    </Text>
  </View>
);
