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

  const renderItem = ({ item }: { item: Appointment }) => (
    <View className="p-4 mx-4 mb-4 bg-white rounded-2xl shadow-lg border border-gray-100">
      <Text className="text-lg font-bold text-teal-600">
        {item.doctor.title} {item.doctor.fullName}
      </Text>
      <Text className="text-gray-600 text-base mt-1">
        {item.doctor.primarySpecialty?.name || "General Practice"}
      </Text>

      <Text className="mt-3 text-foreground font-medium">
        {new Date(item.startTime).toLocaleDateString("en-KE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      <View className="flex-row justify-between mt-3">
        <Text className="text-sm text-gray-500">
          Mode:{" "}
          <Text className="font-semibold text-foreground">
            {item.encounterMode === "TELE"
              ? "Teleconsult"
              : item.encounterMode === "CLINIC"
                ? "Clinic Visit"
                : "Homecare"}
          </Text>
        </Text>
        <Text className="text-sm text-gray-500">
          Cost:{" "}
          <Text className="font-semibold text-foreground">KES {item.cost}</Text>
        </Text>
      </View>

      <Text
        className={`mt-4 font-bold text-lg ${
          item.paymentCompleted ? "text-green-600" : "text-red-600"
        }`}
      >
        {item.paymentCompleted ? "✓ Paid" : "⚠ Pending Payment"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SkeletonList skeletonComponent={AppointmentCardSkeleton} count={5}/>
    );
  }

  return (
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
  );
}
