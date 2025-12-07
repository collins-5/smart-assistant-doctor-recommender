// src/app/(tabs)/doctors.tsx
import { View, Text, FlatList } from "react-native";
import { useDoctors } from "~/lib/hooks/useDoctors";
import type { GetDoctorsQuery } from "~/lib/graphql/generated/graphql";

export default function DoctorsScreen() {
  const { doctors, loading, error, refetch } = useDoctors();

  const doctorList = doctors ?? [];

  if (!loading && error)
    return (
      <Text className="text-red-500 text-center mt-10">
        Error: {error.message}
      </Text>
    );

  type Doctor = NonNullable<GetDoctorsQuery["doctors"]>[number];

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <View className="p-4 bg-white m-2 rounded-lg shadow">
      <Text className="text-lg font-bold text-teal-600">{item?.fullName}</Text>
      <Text className="text-gray-600">
        {item?.primarySpecialty?.name || "General Practice"}
      </Text>
      {item?.subSpecialties && (
        <View className="mt-3">
          <Text className="text-sm font-semibold text-gray-600 mb-1">
            Sub-specialties:
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {item?.subSpecialties.map((sub) => (
              <View key={sub.id} className="bg-teal-100 px-3 py-1 rounded-full">
                <Text className="text-teal-800 text-xs font-medium">
                  {sub.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <View className="flex-row justify-between mt-2">
        <Text className="text-xs text-gray-500">
          Tele: KES {item?.teleconsultPrice}
        </Text>
        <Text className="text-xs text-gray-500">
          Clinic: KES {item?.clinicVisitPrice}
        </Text>
        <Text className="text-xs text-gray-500">
          Home: KES {item?.homecarePrice}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Text className="text-2xl font-bold text-center my-6 text-teal-700">
        Available Doctors
      </Text>

      <FlatList
        data={doctorList}
        renderItem={renderDoctor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        // THIS IS THE FIX — YOU WERE MISSING `refreshing={loading}`
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
