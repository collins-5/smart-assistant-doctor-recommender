// src/screens/AppointmentsScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useMyAppointments } from "~/lib/hooks/useMyAppointments";

export default function AppointmentsScreen() {
  const { appointments, loading } = useMyAppointments();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Loading appointments...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View className="p-4 m-1 mx-4 bg-white rounded-2xl shadow-lg border border-gray-100">
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
          Mode: <Text className="font-semibold">{item.encounterMode}</Text>
        </Text>
        <Text className="text-sm text-gray-500">
          Cost: <Text className="font-semibold">KES {item.cost}</Text>
        </Text>
      </View>

      <Text
        className={`mt-3 font-bold text-lg ${
          item.paymentCompleted ? "text-green-600" : "text-red-600"
        }`}
      >
        {item.paymentCompleted ? "✓ Paid" : "⚠ Pending Payment"}
      </Text>
    </View>
  );

  return (
    <FlashList
      data={appointments}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center mt-20 px-8">
          <Text className="text-gray-500 text-center text-lg">
            No appointments yet
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Your booked appointments will appear here
          </Text>
        </View>
      }
      contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
