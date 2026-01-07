// src/components/dashboard/SpecialtySkeleton.tsx

import React from "react";
import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";

const SpecialtySkeleton = () => (
  <View className="mr-4 w-32 bg-white rounded-3xl shadow-lg overflow-hidden">
    <View className="p-6 items-center">
      <Skeleton className="w-16 h-16 rounded-2xl" />
      <Skeleton className="h-4 w-24 mt-3 rounded-full" />
    </View>
  </View>
);

export default SpecialtySkeleton;
