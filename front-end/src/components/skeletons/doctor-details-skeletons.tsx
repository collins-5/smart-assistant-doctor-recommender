import React from 'react';
import { ScrollView, View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

const DoctorDetailsSkeletons = () => {
    return (
      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        {/* Header Bar Skeleton */}
        <View className="bg-primary py-2 flex-row justify-between items-center px-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-lg" />
          <View className="w-10" />
        </View>

        {/* DoctorCard Skeleton */}
        <View className="mx-4 mt-4">
          <View className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <View className="p-5 flex-row">
              <Skeleton className="w-20 h-20 rounded-2xl mr-4" />

              <View className="flex-1">
                <Skeleton className="h-6 w-48 rounded-lg mb-2" />
                <Skeleton className="h-5 w-32 rounded-lg mb-4" />

                {/* Sub-specialties pills */}
                <View className="flex-row gap-2 mb-4">
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </View>

                {/* Bio (4 lines) */}
                <Skeleton className="h-4 w-full rounded-lg mb-1" />
                <Skeleton className="h-4 w-full rounded-lg mb-1" />
                <Skeleton className="h-4 w-full rounded-lg mb-1" />
                <Skeleton className="h-4 w-11/12 rounded-lg mb-3" />

                {/* Price tags */}
                <View className="flex-row gap-3">
                  <Skeleton className="h-8 w-28 rounded-2xl" />
                  <Skeleton className="h-8 w-28 rounded-2xl" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Sections Skeleton */}
        <View className="mx-5 mt-6 space-y-5">
          {/* Sub-specialties Section */}
          <View className="bg-white rounded-2xl p-5">
            <Skeleton className="h-6 w-40 rounded-lg mb-4" />
            <View className="flex-row flex-wrap gap-3">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-36 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </View>
          </View>

          {/* Insurances Section */}
          <View className="bg-white rounded-2xl p-5">
            <Skeleton className="h-6 w-32 rounded-lg mb-4" />
            <View className="flex-row flex-wrap gap-3">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </View>
          </View>

          {/* Consultation Options */}
          <View className="bg-white rounded-2xl p-5">
            <Skeleton className="h-6 w-48 rounded-lg mb-5" />
            <View className="space-y-5">
              <View className="flex-row justify-between">
                <Skeleton className="h-6 w-44 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
              </View>
              <View className="flex-row justify-between">
                <Skeleton className="h-6 w-36 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
              </View>
              <View className="flex-row justify-between">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
              </View>
            </View>
          </View>

          {/* Book Button */}
          <View className="my-4 items-center">
            <Skeleton className="h-12 w-80 rounded-2xl" />
          </View>
        </View>
      </ScrollView>
    );
}


export default DoctorDetailsSkeletons;
