import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";

const PaymentSummary: React.FC<{
  doctor: any;
  mode: "TELE" | "CLINIC" | "HOME";
  slot: any;
}> = ({ doctor, mode, slot }) => {
  const modeLabel = {
    TELE: "Video Consultation",
    CLINIC: "In-Clinic Visit",
    HOME: "Home Visit",
  }[mode];

  const price =
    mode === "TELE"
      ? doctor?.teleconsultPrice
      : mode === "CLINIC"
        ? doctor?.clinicVisitPrice
        : doctor?.homecarePrice;

  const formatTime = (dateString: string) =>
    format(new Date(dateString), "hh:mm a");
  const formatDate = (dateString: string) =>
    format(new Date(dateString), "dd MMM yyyy");

  return (
    <View className="bg-card rounded-2xl p-6 space-y-4 border border-gray-200">
      <View className="flex-row justify-between">
        <Text className="text-muted-foreground">Doctor</Text>
        <Text className="font-medium text-foreground text-right max-w-[60%]">
          {doctor?.fullName || `${doctor?.firstName} ${doctor?.lastName}`}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-muted-foreground">Type</Text>
        <Text className="font-medium text-foreground">{modeLabel}</Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-muted-foreground">Date</Text>
        <Text className="font-medium text-foreground">
          {slot ? formatDate(slot.startTime) : "-"}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-muted-foreground">Time</Text>
        <Text className="font-medium text-foreground">
          {slot
            ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
            : "-"}
        </Text>
      </View>

      <View className="border-t border-gray-300 pt-4 flex-row justify-between">
        <Text className="text-lg font-bold text-foreground">Total</Text>
        <Text className="text-2xl font-bold text-primary">
          Kshs {price || "N/A"}
        </Text>
      </View>
    </View>
  );
};

export default PaymentSummary;
