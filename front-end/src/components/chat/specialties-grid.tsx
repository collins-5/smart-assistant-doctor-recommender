// src/components/ai/SpecialtiesGrid.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSpecialties } from "~/lib/hooks/useSpecialties";
import { Skeleton } from "~/components/ui/skeleton";
import { router } from "expo-router";
import SpecialtyCard from "~/screens/specialty-card";

const SpecialtiesGrid = () => {
  const { specialties, loading } = useSpecialties();

  // Loading state
  if (loading) {
    return (
      <View className="mt-6 px-4">
        <View className="bg-muted rounded-2xl py-4 mb-5 border-2 border-primary">
          <Text className="text-xl font-bold text-primary text-center">
            Available Specialties
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <View key={i} className="mb-4 px-2">
                <Skeleton className="w-32 h-32 rounded-3xl" />
              </View>
            ))}
        </View>
      </View>
    );
  }

  // No specialties
  if (specialties.length === 0) {
    return null;
  }

  const handleSpecialtyPress = (specialtyId: number | string) => {
    // Navigate to doctors screen and filter by specialty
    router.push({
      pathname: "/(tabs)/doctors/doctors",
      params: { specialtyId: specialtyId.toString() },
    });
  };

  return (
    <View className="mt-6 px-4">
      <View className="bg-muted rounded-2xl py-4 mb-5 border-2 border-primary">
        <Text className="text-xl font-bold text-primary text-center">
          Available Specialties
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {specialties.slice(0, 12).map((specialty) => (
          <TouchableOpacity
            key={specialty.id}
            activeOpacity={0.85}
            onPress={() => handleSpecialtyPress(specialty.id)}
            className="mb-5 px-2"
          >
            <SpecialtyCard specialty={specialty} />
          </TouchableOpacity>
        ))}
      </View>

      {specialties.length > 12 && (
        <Text className="text-center text-primary text-base mt-3 font-semibold">
          and {specialties.length - 12} more specialties available...
        </Text>
      )}
    </View>
  );
};

export default SpecialtiesGrid;
