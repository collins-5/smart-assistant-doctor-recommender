// Example: src/screens/AppointmentsScreen.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import { useMyAppointments } from "~/lib/hooks/useMyAppointments";

export default function AppointmentsScreen() {
  const { appointments, loading } = useMyAppointments();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={appointments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View className="p-4 m-3 bg-white rounded-lg shadow">
          <Text className="text-lg font-bold text-teal-600">
            {item.doctor.title} {item.doctor.fullName}
          </Text>
          <Text className="text-gray-600">
            {item.doctor.primarySpecialty?.name || "General Practice"}
          </Text>
          <Text className="mt-2">
            {new Date(item.startTime).toLocaleDateString("en-KE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text className="text-sm text-gray-500">
            Mode: {item.encounterMode} | Cost: KES {item.cost}
          </Text>
          <Text
            className={`font-bold ${item.paymentCompleted ? "text-green-600" : "text-red-600"}`}
          >
            {item.paymentCompleted ? "Paid" : "Pending Payment"}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-gray-500">No appointments yet</Text>
        </View>
      }
    />
  );
}
