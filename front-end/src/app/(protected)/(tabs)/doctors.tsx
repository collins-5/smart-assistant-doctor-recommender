// src/app/(tabs)/doctors.tsx
import { View, Text, FlatList } from "react-native";
import { useDoctors } from "~/lib/hooks/useDoctors";
import type { GetDoctorsQuery } from "~/lib/graphql/generated/graphql";
import { DoctorCard } from "~/components/core/doctor-card";
import { SheetManager } from "react-native-actions-sheet";
import { useRouter } from "expo-router"; // or your navigation method

export default function DoctorsScreen() {
  const { doctors, loading, refetch } = useDoctors();
  const doctorList = doctors ?? [];
  const router = useRouter(); // adjust if using different navigation

  type Doctor = NonNullable<GetDoctorsQuery["doctors"]>[number];

  const openBookingSheet = (doctor: Doctor) => {
    SheetManager.show("booking", {
      payload: { doctor },
    });
  };

  const goToDoctorProfile = (doctorId: number) => {
    // Change this to match your navigation setup
    router.push(`/doctor/${doctorId}`);
    // or: navigation.navigate("DoctorProfile", { id: doctorId })
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
      <Text className="text-3xl font-bold text-center my-8 text-primary">
        Available Doctors
      </Text>

      <FlatList
        data={doctorList}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshing={loading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-muted-foreground text-lg">
              No doctors available at the moment
            </Text>
          </View>
        }
      />
    </View>
  );
}
