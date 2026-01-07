// src/screens/doctor/doctors-screen.tsx

import React from "react";
import { View, Text, FlatList } from "react-native";
import { useDoctors } from "~/lib/hooks/useDoctors";
import { useCurrentLocation } from "~/lib/hooks/useCurrentLocation";
import { useDoctorsFilter } from "~/lib/context/DoctorsFilterContext"; // ← Critical
import { DoctorCardSkeleton } from "~/components/skeletons/doctor-card-skeleton";
import SkeletonList from "~/components/core/SkeletonList";
import { SheetManager } from "react-native-actions-sheet";
import { useRouter } from "expo-router";
import { DoctorCard } from "~/components/doctors/doctor-card";
import { SearchBar } from "~/components/doctors/search-input";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import DoctorSpecialtyTabs from "~/components/doctors/doctor-sepecialty-tabs";

export default function DoctorsScreen() {
  const { doctors, loading, refetch, searchQuery, setSearchQuery } =
    useDoctors();

  const { filters } = useDoctorsFilter();

  const { getLocation, isLoading: locationLoading } = useCurrentLocation();
  const router = useRouter();

  const handleLocationPress = async () => {
    const locationText = await getLocation();
    if (locationText) {
      setSearchQuery(locationText);
    }
  };

  const openBookingSheet = (doctor: any) => {
    SheetManager.show("booking", { payload: { doctor } });
  };

  const goToDoctorProfile = (doctorId: number) => {
    router.push({
      pathname: "/(protected)/doctors/[id]",
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
        county={item.county}
        insuarance={item.insuarance}
        primaryAction={{
          text: "Book Appointment",
          onPress: () => openBookingSheet(item),
        }}
        secondaryAction={{
          text: "View Profile",
          variant: "outline",
          onPress: () => goToDoctorProfile(item.id),
        }}
      />
    );
  };

  const hasActiveFilters =
    filters.specialtyId !== null ||
    filters.priceRange[1] < 10000 ||
    filters.availability !== null ||
    filters.countryName !== null ||
    filters.countyName !== null;

    console.log("Active Filters:", filters);
    console.log("Has Active Filters:", hasActiveFilters);

  return (
    <View className="flex-1 bg-background">
      <View className="bg-primary py-6">
        <Text className="text-3xl font-bold text-center text-primary-foreground">
          Available Doctors
        </Text>
      </View>

      <View className="flex-row items-center px-4 py-3">
        <View className="flex-1 mr-3">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onLocationPress={handleLocationPress}
            locationLoading={locationLoading}
          />
        </View>

        {/* Filter Button with Visible Green Dot */}
        <View className="relative">
          <Button
            variant="ghost"
            onPress={() => SheetManager.show("doctor-filters-sheet")}
            className="p-3"
            leftIcon={<Ionicons name="filter" size={24} color="#0d9488" />}
          />

          {filters && (
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white shadow-lg z-10" />
          )}
        </View>
      </View>

      {/* Specialty Tabs */}
      <DoctorSpecialtyTabs />

      {/* Doctors List */}
      <FlatList
        data={doctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshing={loading}
        onRefresh={refetch}
        ListHeaderComponent={
          loading && doctors.length === 0 ? (
            <SkeletonList skeletonComponent={DoctorCardSkeleton} count={6} />
          ) : null
        }
        ListEmptyComponent={
          loading ? null : (
            <View className="flex-1 items-center justify-center mt-32 px-8">
              <Text className="text-muted-foreground text-lg text-center">
                {doctors.length === 0
                  ? "No doctors match your search or filters"
                  : "No doctors available at the moment"}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
