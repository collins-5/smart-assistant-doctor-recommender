import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useBookmarkedDoctors } from "~/lib/hooks/useBookmarkedDoctors";
import { DoctorCard } from "~/components/doctors/doctor-card";
import SkeletonList from "~/components/core/SkeletonList";
import { DoctorCardSkeleton } from "~/components/skeletons/doctor-card-skeleton";
import { Button } from "~/components/ui/button";
import Icon from "~/components/ui/icon";

export default function BookmarksScreen() {
  const { doctors, error, loading, refetch } = useBookmarkedDoctors();

  if (loading && doctors.length === 0) {
    return <SkeletonList skeletonComponent={DoctorCardSkeleton} count={6} />;
  }

  const goToDoctorProfile = (doctorId: number) => {
    router.push({
      pathname: "/(protected)/doctor/[id]",
      params: { id: doctorId.toString() },
    });
  };

  const renderDoctor = ({ item }: { item: any }) => {
    if (!item) return null;

    return (
      <DoctorCard
        id={item.id}
        title={item.title}
        firstName={item.firstName}
        lastName={item.lastName}
        fullName={item.fullName}
        profilePictureUrl={item.profilePictureUrl}
        primarySpecialty={item.primarySpecialty}
        subSpecialties={item.subSpecialties}
        teleconsultPrice={item.teleconsultPrice}
        clinicVisitPrice={item.clinicVisitPrice}
        homecarePrice={item.homecarePrice}
        onPressCard={() => goToDoctorProfile(item.id)}
      />
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-primary py-3">
        <View className="flex-row justify-between">
          <Button
            onPress={() => router.back()}
            variant="ghost"
            size="icon"
            className="rounded-full"
            leftIcon={<Icon name="arrow-left" size={28} color="white" />}
          />
          <Text className="text-3xl font-bold text-center text-primary-foreground">
            Bookmarks
          </Text>
          <View />
        </View>
      </View>
      {error ? (
        <View className="flex-1 justify-center items-center mt-20 px-10">
          <Ionicons name="bookmark-outline" size={80} color="#94a3b8" />
          <Text className="text-red-600 text-center text-lg mt-4">
            {error.message || "Something went wrong"}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-1 bg-blue-600 py-1 px-6 rounded-full"
          >
            <Text className="text-destructive font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <SkeletonList skeletonComponent={DoctorCardSkeleton} count={6} />
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="pt-4 pb-10"
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={refetch}
          renderItem={renderDoctor}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20 px-10">
              <Ionicons name="bookmark-outline" size={80} color="#94a3b8" />
              <Text className="text-gray-500 text-xl font-medium mt-6 text-center">
                No bookmarked doctors yet
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Tap the bookmark icon on any doctor's profile to save them here.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
