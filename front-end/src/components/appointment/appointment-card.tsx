// src/components/appointment/AppointmentCard.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { Appointment } from "~/lib/hooks/useMyAppointments";
import { formatDistanceToNow } from "date-fns";

type AppointmentCardProps = {
  appointment: Appointment;
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const {
    doctor,
    startTime,
    endTime,
    encounterMode,
    cost,
    paymentCompleted,
    status,
  } = appointment;

  const [timeLeft, setTimeLeft] = useState<string>("");

  // Live countdown with seconds for ONGOING appointments
  useEffect(() => {
    if (status !== "ONGOING") {
      setTimeLeft("");
      return;
    }

    const updateCountdown = () => {
      const end = new Date(endTime);
      const now = new Date();

      if (now >= end) {
        setTimeLeft("Ended");
      } else {
        setTimeLeft(
          formatDistanceToNow(end, {
            addSuffix: false,
            includeSeconds: true,
          })
        );
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [status, endTime]);

  const handleCancelPress = () => {
    SheetManager.show("cancel-appointment-sheet", {
      payload: {
        appointmentId: appointment.id,
        doctorName: `${doctor.title || ""} ${doctor.fullName}`.trim(),
        appointmentDate: new Date(startTime).toLocaleDateString("en-KE", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    });
  };

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

  const getStatusColor = () => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-800";
      case "ONGOING":
        return "bg-orange-100 text-orange-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <View className="p-5 mx-4 mb-4 bg-white rounded-2xl shadow-md border border-gray-100">
      {/* Status Badge */}
      <View className="self-start mb-3">
        <Text
          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor()}`}
        >
          {status === "ONGOING"
            ? `Ongoing • Ends in ${timeLeft}`
            : status.charAt(0) + status.slice(1).toLowerCase()}
        </Text>
      </View>

      <Text className="text-xl font-bold text-teal-600">
        {doctor.title} {doctor.fullName}
      </Text>
      <Text className="text-gray-600 text-base mt-1">
        {doctor.primarySpecialty?.name || "General Practice"}
      </Text>

      <Text className="mt-4 text-foreground font-medium">
        {new Date(startTime).toLocaleDateString("en-KE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      <View className="flex-row justify-between mt-4">
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
        className={`mt-4 font-bold text-lg ${paymentCompleted ? "text-green-600" : "text-red-600"}`}
      >
        {paymentCompleted ? "✓ Paid" : "⚠ Pending Payment"}
      </Text>

      {/* Cancel Button - Only for UPCOMING */}
      {status === "UPCOMING" && (
        <TouchableOpacity
          onPress={handleCancelPress}
          className="mt-4 bg-red-500 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-bold">
            Cancel Appointment
          </Text>
        </TouchableOpacity>
      )}

      {/* Clean countdown box with minutes & seconds */}
      {status === "ONGOING" && timeLeft && timeLeft !== "Ended" && (
        <View className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
          <Text className="text-center text-orange-800 font-bold text-lg">
            Time remaining: {timeLeft}
          </Text>
        </View>
      )}
    </View>
  );
};

export default AppointmentCard;
