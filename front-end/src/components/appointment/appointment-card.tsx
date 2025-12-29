// src/components/appointment/AppointmentCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Appointment } from "~/lib/hooks/useMyAppointments"; // Import the real type

type AppointmentCardProps = {
  appointment: Appointment;
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const { doctor, startTime, encounterMode, cost, paymentCompleted } =
    appointment;

  const formatMode = () => {
    switch (encounterMode) {
      case "TELE":
        return "Teleconsult";
      case "CLINIC":
        return "Clinic Visit";
      case "HOME":
        return "Homecare";
      default:
        return encounterMode;
    }
  };

  return (
    <View className="p-4 mx-4 mb-4 bg-white rounded-2xl shadow-lg border border-gray-100">
      <Text className="text-lg font-bold text-teal-600">
        {doctor.title} {doctor.fullName}
      </Text>

      <Text className="text-gray-600 text-base mt-1">
        {doctor.primarySpecialty?.name || "General Practice"}
      </Text>

      <Text className="mt-3 text-foreground font-medium">
        {new Date(startTime).toLocaleDateString("en-KE", {
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
          <Text className="font-semibold text-foreground">{formatMode()}</Text>
        </Text>
        <Text className="text-sm text-gray-500">
          Cost:{" "}
          <Text className="font-semibold text-foreground">KES {cost}</Text>
        </Text>
      </View>

      <Text
        className={`mt-4 font-bold text-lg ${
          paymentCompleted ? "text-green-600" : "text-red-600"
        }`}
      >
        {paymentCompleted ? "✓ Paid" : "⚠ Pending Payment"}
      </Text>
    </View>
  );
};

export default AppointmentCard;
