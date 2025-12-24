// src/components/ai/SpecialtiesGrid.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
// import { useSpecialties } from "~/hooks/useSpecialties";
import { useNavigation } from "@react-navigation/native";

const SpecialtiesGrid = () => {
//   const { specialties, loading } = useSpecialties();
  const navigation = useNavigation<any>();

//   if (loading) {
//     return (
//       <View className="py-4">
//         <Text className="text-gray-600 text-center">
//           Loading specialties...
//         </Text>
//       </View>
//     );
//   }

//   if (specialties.length === 0) {
//     return null;
//   }

  return (
    <View className="mt-4">
      <Text className="text-sm font-semibold text-cyan-900 mb-3 px-1">
        Choose a Specialty
      </Text>
      <View className="flex-row flex-wrap -mx-1">
        {/* {specialties.slice(0, 12).map((specialty) => (
          <TouchableOpacity
            key={specialty.id}
            onPress={() =>
              navigation.navigate("DoctorsList", { specialtyId: specialty.id })
            }
            className="m-1 px-4 py-3 bg-white border border-gray-300 rounded-full"
          >
            <Text className="text-sm text-gray-800 font-medium">
              {specialty.name}
            </Text>
          </TouchableOpacity>
        ))} */}
      </View>
    </View>
  );
};

export default SpecialtiesGrid;
