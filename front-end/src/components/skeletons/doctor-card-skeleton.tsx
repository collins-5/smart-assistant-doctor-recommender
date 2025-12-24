// src/components/core/DoctorCardSkeleton.tsx
// or src/components/ui/DoctorCardSkeleton.tsx

import * as React from "react";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

export const DoctorCardSkeleton: React.FC = () => {
  return (
    <View className="bg-card rounded-2xl overflow-hidden shadow-lg mx-4 mb-6 border border-gray-200">
      <View className="p-5 flex-row">
        {/* Profile Picture Skeleton */}
        <Skeleton className="w-20 h-20 rounded-2xl mr-4" />

        {/* Text & Details Skeleton */}
        <View className="flex-1">
          {/* Name */}
          <Skeleton className="h-7 w-56 rounded-lg mb-2" />

          {/* Primary Specialty */}
          <Skeleton className="h-5 w-40 rounded-lg mb-4" />

          {/* Sub-specialties (tags) */}
          <View className="flex-row gap-2 mb-4">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </View>

          {/* Bio lines */}
          <View className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-11/12 rounded-lg" />
            <Skeleton className="h-4 w-9/12 rounded-lg" />
          </View>

          {/* Price tags */}
          <View className="flex-row gap-2">
            <Skeleton className="h-8 w-28 rounded-2xl" />
            <Skeleton className="h-8 w-28 rounded-2xl" />
            <Skeleton className="h-8 w-28 rounded-2xl" />
          </View>
        </View>

        {/* Bookmark button placeholder */}
        <View className="absolute top-4 right-4">
          <Skeleton className="w-9 h-9 rounded-full" />
        </View>
      </View>
    </View>
  );
};
