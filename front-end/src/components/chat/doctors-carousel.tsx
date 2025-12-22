// src/components/ai/DoctorsCarousel.tsx

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDoctors } from "~/lib/hooks/useDoctors";

const DoctorsCarousel = () => {
  const { doctors, loading } = useDoctors();
  const navigation = useNavigation<any>();

  if (loading) {
    return (
      <View className="py-4">
        <Text className="text-gray-600 text-center">Loading doctors...</Text>
      </View>
    );
  }

  if (doctors.length === 0) {
    return (
      <View className="py-4">
        <Text className="text-gray-600 text-center">
          No doctors available at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4 -mx-4">
      <Text className="px-4 text-sm font-semibold text-cyan-900 mb-3">
        Available Doctors
      </Text>
      <View className="flex-row px-4 gap-4 overflow-none pb-2">
        {doctors.slice(0, 10).map((doctor: any) => (
          <TouchableOpacity
            key={doctor.id}
            onPress={() =>
              navigation.navigate("DoctorProfile", { doctorId: doctor.id })
            }
            className="w-full flex-shrink-0"
          >
            <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {doctor.profilePictureUrl ? (
                <Image
                  source={{ uri: doctor.profilePictureUrl }}
                  className="w-full h-32"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-32 bg-gray-200 items-center justify-center">
                  <Text className="text-gray-500 text-4xl">👤</Text>
                </View>
              )}
              <View className="p-3">
                <Text
                  className="font-semibold text-sm text-gray-900"
                  numberOfLines={1}
                >
                  {doctor.fullName}
                </Text>
                <Text className="text-xs text-gray-600 mt-1" numberOfLines={2}>
                  {doctor.primarySpecialty?.name || "General Practitioner"}
                </Text>
                <Text className="text-xs text-primary font-medium mt-2">
                  KES {doctor.teleconsultPrice || "2,500"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {doctors.length > 10 && (
        <Text className="text-center text-primary text-sm mt-3">
          +{doctors.length - 10} more doctors
        </Text>
      )}
    </View>
  );
};

export default DoctorsCarousel;
