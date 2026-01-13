// src/components/chat/specialties-grid.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSpecialties } from "~/lib/hooks/useSpecialties";
import SpecialtyCard from "~/screens/specialty-card";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import SkeletonList from "../core/SkeletonList";
import SpecialtySkeleton from "~/screens/specialty-skeleton";
import List from "../ui/list";

interface Specialty {
  id: string | number;
  name: string;
  // Add other fields as needed
}

const SpecialtiesGrid = () => {
  const { specialties, loading } = useSpecialties();

  const handleSpecialtyPress = (specialtyId: string | number) => {
    router.push({
      pathname: "/ (tabs)/doctors/doctors",
      params: { specialtyId: specialtyId.toString() },
    });
  };

  const handleViewAll = () => {
    router.push({
      pathname: "/ (tabs)/doctors/doctors",
      params: { viewAllSpecialties: "true" },
    });
  };

  if (loading) {
    return (
      <View className="mt-10 px-5">
        <Text className="text-2xl font-bold text-foreground text-center mb-8">
          Available Specialties
        </Text>

          <SkeletonList
            skeletonComponent={SpecialtySkeleton}
            count={3}
            direction="horizontal"
          />
      </View>
    );
  }

  if (!specialties || specialties.length === 0) {
    return null;
  }

  const visibleSpecialties = specialties.slice(0, 12);
  const hasMore = specialties.length > 12;

  return (
    <View className="mt-2 px-2">
      <Text className="text-2xl font-bold text-foreground text-center mb-2">
        Available Specialties
      </Text>

      <List
        data={visibleSpecialties}
        numColumns={2}
        keyExtractor={(item: Specialty) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: hasMore ? 20 : 40 }}
        renderItem={({ item }: { item: Specialty }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSpecialtyPress(item.id)}
            className="flex-1 m-2"
          >
            <SpecialtyCard specialty={item} />
          </TouchableOpacity>
        )}
      />

      {hasMore && (
        <View className="mt-10 items-center">
          <Button
            onPress={handleViewAll}
            variant="outline"
            className="border-primary/60 px-8 py-3 rounded-full"
          >
            <Text className="text-primary font-semibold text-base">
              View All Specialties ({specialties.length})
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default SpecialtiesGrid;
