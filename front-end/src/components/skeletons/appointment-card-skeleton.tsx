import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

const AppointmentCardSkeleton = () => {
    return (
      <View className="p-4 mx-4 mt-2 mb-1 bg-white rounded-2xl shadow-lg border border-gray-100">
        <View className="space-y-3">
          <Skeleton className="h-6 w-64 rounded-full" />
          <Skeleton className="h-4 w-48 rounded-full" />

          <View className="mt-4">
            <Skeleton className="h-5 w-56 rounded-full" />
          </View>

          <View className="flex-row justify-between mt-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-4 w-28 rounded-full" />
          </View>

          <View className="mt-4">
            <Skeleton className="h-7 w-36 rounded-full" />
          </View>
        </View>
      </View>
    );
}


export default AppointmentCardSkeleton;
