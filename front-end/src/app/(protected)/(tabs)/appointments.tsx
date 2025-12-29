// src/screens/AppointmentsScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useMyAppointments, Appointment } from "~/lib/hooks/useMyAppointments"; // ← Import the type!
import { Skeleton } from "~/components/ui/skeleton";
import SkeletonList from "~/components/core/SkeletonList";
import AppointmentCardSkeleton from "~/components/skeletons/appointment-card-skeleton";
import AppointmentCard from "~/components/appointment/appointment-card";

export default function AppointmentsScreen() {
  const { appointments, loading } = useMyAppointments();


  return (
    <>
      <View className="bg-primary py-6">
        <Text className="text-3xl font-bold text-center text-primary-foreground">
          Appointments
        </Text>
      </View>
      {loading ? (
        <SkeletonList skeletonComponent={AppointmentCardSkeleton} count={5} />
      ) : (
        <FlashList
          data={appointments}
          renderItem={({ item }: { item: Appointment }) => (
            <AppointmentCard appointment={item} />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-32 px-8">
              <Text className="text-gray-500 text-center text-xl font-medium">
                No appointments yet
              </Text>
              <Text className="text-gray-400 text-center mt-3 text-base">
                Your booked appointments will appear here once you schedule them
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </>
  );
}
