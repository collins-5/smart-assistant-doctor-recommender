// src/app/(tabs)/doctors.tsx
import { View, Text, FlatList } from "react-native";
import { useDoctors } from "~/lib/hooks/useDoctors";
import type { GetDoctorsQuery } from "~/lib/graphql/generated/graphql";
import { DoctorCard } from "~/components/core/doctor-card";
import { DoctorCardSkeleton } from "~/components/skeletons/doctor-card-skeleton";
import SkeletonList from "~/components/core/SkeletonList";
import { SheetManager } from "react-native-actions-sheet";
import { useRouter } from "expo-router";

export default function DoctorsScreen() {
  const { doctors, loading, refetch } = useDoctors();
  const doctorList = doctors ?? [];
  const router = useRouter();

  type Doctor = NonNullable<GetDoctorsQuery["doctors"]>[number];

  const openBookingSheet = (doctor: Doctor) => {
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

  const renderDoctor = ({ item }: { item: Doctor }) => {
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
      <View className="bg-primary py-6">
        <Text className="text-3xl font-bold text-center text-primary-foreground">
          Available Doctors
        </Text>
      </View>

      <FlatList
        data={doctorList}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
        refreshing={loading}
        onRefresh={refetch}
        ListHeaderComponent={
          loading ? (
            <SkeletonList skeletonComponent={DoctorCardSkeleton} count={6} />
          ) : null
        }
        ListEmptyComponent={
          loading ? null : ( 
            <View className="flex-1 items-center justify-center mt-32">
              <Text className="text-muted-foreground text-lg text-center px-8">
                No doctors available at the moment
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
