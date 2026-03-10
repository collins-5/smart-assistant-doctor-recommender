import React from "react";
import { View, Text } from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { useDoctors } from "~/lib/hooks/useDoctors";
import { DoctorCard } from "~/components/doctors/doctor-card";
import { DoctorCardSkeleton } from "~/components/skeletons/doctor-card-skeleton";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import SkeletonList from "../core/SkeletonList";
import { SheetManager } from "react-native-actions-sheet";

interface Doctor {
  id: string;   // ← Changed to string to match GraphQL
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
  primarySpecialty?: { id: string | number; name: string } | null;
  subSpecialties?: { id: string | number; name: string }[] | null;
  teleconsultPrice?: string | number | null;
  clinicVisitPrice?: string | number | null;
  homecarePrice?: string | number | null;
  bio?: string | null;
}

interface DoctorsCarouselProps {
  specialtyName?: string | null;
}

const DoctorsCarousel: React.FC<DoctorsCarouselProps> = ({ specialtyName }) => {
  const { allDoctors: allDoctorsFromHook, loading } = useDoctors();
  const navigation = useNavigation<any>();

  const filteredDoctors = React.useMemo(() => {
    if (!allDoctorsFromHook) return [];

    return allDoctorsFromHook
      .filter((doc): doc is NonNullable<typeof doc> => doc !== null && doc !== undefined)
      .filter((doc) =>
        specialtyName
          ? doc.primarySpecialty?.name?.toLowerCase() === specialtyName.toLowerCase() ||
          doc.subSpecialties?.some(
            (sub) => sub?.name?.toLowerCase() === specialtyName.toLowerCase()
          )
          : true
      );
  }, [allDoctorsFromHook, specialtyName]);

  const doctors: Doctor[] = filteredDoctors;

  const goToDoctorProfile = (doctorId: string) => {
    router.push({
      pathname: "/(protected)/doctors/[id]",
      params: { id: doctorId },
    });
  };

  const openBookingSheet = (doctor: Doctor) => {
    SheetManager.show("booking", {
      payload: { doctor },
    });
  };

  const handleViewAll = () => {
    router.push("(protected)/(tabs)/doctors/doctors");
  };

  const renderItem: ListRenderItem<Doctor> = ({ item }) => (
    <View className="mb-2">
      <DoctorCard
        id={item.id}
        fullName={item.fullName}
        firstName={item.firstName}
        lastName={item.lastName}
        profilePictureUrl={item.profilePictureUrl}
        primarySpecialty={item.primarySpecialty}
        subSpecialties={item.subSpecialties}
        teleconsultPrice={item.teleconsultPrice}
        clinicVisitPrice={item.clinicVisitPrice}
        homecarePrice={item.homecarePrice}
        bio={item.bio}
        onPressCard={() => goToDoctorProfile(item.id)}
        primaryAction={{
          text: "Book Appointment",
          onPress: () => openBookingSheet(item),
        }}
      />
    </View>
  );

  if (loading) {
    return (
      <View className="w-full -mx-4">
        <Text className="px-4 text-xl font-bold text-primary mb-5">
          {specialtyName ? `${specialtyName} Specialists` : "Available Doctors"}
        </Text>
        <SkeletonList skeletonComponent={DoctorCardSkeleton} count={3} />
      </View>
    );
  }

  if (doctors.length === 0) {
    return (
      <View className="w-full -mx-4">
        <Text className="px-4 text-xl font-bold text-cyan-900 mb-5">
          {specialtyName ? `${specialtyName} Specialists` : "Available Doctors"}
        </Text>
        <View className="py-10 px-4">
          <Text className="text-gray-600 text-center">
            No doctors available{specialtyName ? ` for ${specialtyName}` : ""} at the moment.
          </Text>
        </View>
      </View>
    );
  }

  const visibleDoctors = doctors.slice(0, 10);
  const hasMore = doctors.length > 10;
  const title = specialtyName ? `${specialtyName} Specialists` : "Available Doctors";

  return (
    <View className="w-full">
      <View className="bg-accent ml-4 rounded-2xl mb-2 border-1 border-primary">
        <Text className="py-2 text-xl self-center font-bold text-primary">
          {title}
        </Text>
      </View>

      <FlashList
        data={visibleDoctors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />

      {hasMore && (
        <Text
          onPress={handleViewAll}
          className="text-center text-cyan-600 font-semibold text-base mt-4 pb-6 px-4"
        >
          +{doctors.length - 10} more {specialtyName ? specialtyName : ""} doctors
        </Text>
      )}
    </View>
  );
};

export default DoctorsCarousel;