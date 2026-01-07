// src/components/dashboard/DoctorSkeleton.tsx

import React from "react";
import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";

const DoctorSkeleton = () => (
  <View className="mr-5 w-48 bg-white rounded-3xl shadow-lg overflow-hidden">
    <Skeleton className="w-full h-40" />
    <View className="p-4">
      <Skeleton className="h-6 w-36 mx-auto rounded-full mb-2" />
      <Skeleton className="h-4 w-28 mx-auto rounded-full" />
    </View>
  </View>
);

export default DoctorSkeleton;
