// src/components/doctors/DoctorSpecialtyTabs.tsx

import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Skeleton } from "~/components/ui/skeleton";
import { useSpecialties } from "~/lib/hooks/useSpecialties";
import { useDoctorsFilter } from "~/lib/context/DoctorsFilterContext";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

const DoctorSpecialtyTabs = () => {
  const { specialties, loading: loadingSpecialties } = useSpecialties();
  const { filters, updateFilters, resetFilters } = useDoctorsFilter();

  const selectedSpecialtyId = filters.specialtyId;

  const handleValueChange = (value: string) => {
    if (value === "all") {
      resetFilters();
    } else {
      updateFilters({ specialtyId: value });
    }
  };

  return (
    <View className="px-4 mb-1">
      <Tabs
        value={selectedSpecialtyId?.toString() ?? "all"}
        onValueChange={handleValueChange}
      >
        <TabsList variant="noPills" className="bg-transparent">
          {/* Scrollable container for tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{ paddingRight: 20 }} // Extra space at end
          >
            {/* All Doctors */}
            <TabsTrigger value="all" className="mr-3">
              <Text className="font-medium text-base">All Doctors</Text>
            </TabsTrigger>

            {/* Loading Skeletons */}
            {loadingSpecialties
              ? Array(8)
                  .fill(null)
                  .map((_, i) => (
                    <View key={i} className="mr-3">
                      <Skeleton className="h-9 w-32 rounded-full" />
                    </View>
                  ))
              : specialties.map((specialty) => (
                  <TabsTrigger
                    key={specialty.id}
                    value={specialty.id.toString()}
                    className="mr-3"
                  >
                    <Text className="font-medium text-base">
                      {specialty.name}
                    </Text>
                  </TabsTrigger>
                ))}
          </ScrollView>
        </TabsList>
      </Tabs>
    </View>
  );
};

export default DoctorSpecialtyTabs;
