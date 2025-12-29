// src/components/ai/SpecialtiesGrid.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {  useSpecialties } from "~/lib/hooks/useSpecialties"; // ← Re-enable this
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "~/components/ui/skeleton"; // Optional: for loading state
import Icon from "../ui/icon";



const SpecialtiesGrid = () => {
  const { specialties, loading } = useSpecialties();
  const navigation = useNavigation<any>();

  // Loading state
  if (loading) {
    return (
      <View className="mt-4">
        <Text className="text-sm font-semibold text-cyan-900 mb-3 px-1">
          Available Specialties
        </Text>
        <View className="flex-row flex-wrap justify-start -mx-1">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <View key={i} className="m-1">
                <Skeleton className="h-10 w-28 rounded-full" />
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

  
  

  return (
    <View className="mt-4">
      <Text className="text-base font-bold text-cyan-900 mb-4 px-1">
        Available Specialties
      </Text>

      <View className="flex-row flex-wrap justify-start -mx-2">
        {specialties.slice(0, 12).map((specialty) => (
          <TouchableOpacity
            key={specialty.id}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("DoctorsList", { specialtyId: specialty.id })
            }
            className="
              m-2 px-5 py-3.5  h-20
              rounded-2xl 
              border border-teal-200
              min-w-32
            "
          > 
          <View>
            <Icon name="doctor"  size={24} className="self-center text-primary"/>
          </View>
            
            <Text className="text-primary text-sm font-semibold text-center">
              {specialty.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {specialties.length > 12 && (
        <Text className="text-center text-cyan-700 text-sm mt-4 font-medium">
          and {specialties.length - 3} more...
        </Text>
      )}
    </View>
  );
};

export default SpecialtiesGrid;
