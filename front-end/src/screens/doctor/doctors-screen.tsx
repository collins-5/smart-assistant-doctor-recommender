// src/app/(tabs)/doctors.tsx
import { View, Text, FlatList } from "react-native";
import { useDoctors } from "~/lib/hooks/useDoctors";
import { useCurrentLocation } from "~/lib/hooks/useCurrentLocation"; // ← New hook
import { DoctorCardSkeleton } from "~/components/skeletons/doctor-card-skeleton";
import SkeletonList from "~/components/core/SkeletonList";
import { SheetManager } from "react-native-actions-sheet";
import { useRouter } from "expo-router";
import { DoctorCard } from "~/components/doctors/doctor-card";
import { SearchBar } from "~/components/doctors/search-input";

export default function DoctorsScreen() {
  const { doctors, loading, refetch, searchQuery, setSearchQuery } =
    useDoctors();

  const { getLocation, isLoading: locationLoading } = useCurrentLocation();
  const router = useRouter();

  const handleLocationPress = async () => {
    const locationText = await getLocation();
    if (locationText) {
      setSearchQuery(locationText);
    }
  };

  const openBookingSheet = (doctor: any) => {
    SheetManager.show("booking", {
      payload: { doctor },
    });
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

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary py-6">
        <Text className="text-3xl font-bold text-center text-primary-foreground">
          Available Doctors
        </Text>
      </View>

      {/* Separated Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLocationPress={handleLocationPress}
        locationLoading={locationLoading}
      />

      {/* Doctors List */}
      <FlatList
        data={doctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
        refreshing={loading}
        onRefresh={refetch}
        ListHeaderComponent={
          loading && searchQuery === "" ? (
            <SkeletonList skeletonComponent={DoctorCardSkeleton} count={6} />
          ) : null
        }
        ListEmptyComponent={
          loading ? null : (
            <View className="flex-1 items-center justify-center mt-32 px-8">
              <Text className="text-muted-foreground text-lg text-center">
                {searchQuery
                  ? `No doctors found matching "${searchQuery}"`
                  : "No doctors available at the moment"}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
