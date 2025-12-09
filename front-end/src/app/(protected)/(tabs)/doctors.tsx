// src/app/(tabs)/doctors.tsx
import { View, Text, FlatList } from "react-native";
import { useDoctors } from "~/lib/hooks/useDoctors";
import type { GetDoctorsQuery } from "~/lib/graphql/generated/graphql";
import { DoctorCard } from "~/components/core/doctor-card";

export default function DoctorsScreen() {
  const { doctors, loading, error, refetch } = useDoctors();

  const doctorList = doctors ?? [];

  console.log(error);

  if (!loading && error)
    return (
      <Text className="text-red-500 text-center mt-10">
        Error: {error?.message}
      </Text>
    );

  type Doctor = NonNullable<GetDoctorsQuery["doctors"]>[number];

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
        onPress={() => {
          // Navigate to doctor details or booking screen
          console.log("Doctor pressed:", item.id);
        }}
      />
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Text className="text-2xl font-bold text-center my-6 text-teal-700">
        Available Doctors
      </Text>

      <FlatList
        data={doctorList}
        renderItem={renderDoctor}
        keyExtractor={(item) => item?.id.toString() ?? Math.random().toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshing={loading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No doctors available
          </Text>
        }
      />
    </View>
  );
}
