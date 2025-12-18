import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ConsultationModeCard: React.FC<{
  mode: "TELE" | "CLINIC" | "HOME";
  selected: boolean;
  onPress: () => void;
}> = ({ mode, selected, onPress }) => {
  const icons = {
    TELE: "videocam-outline",
    CLINIC: "business-outline",
    HOME: "home-outline",
  } as const;

  const labels = {
    TELE: "Video Call",
    CLINIC: "In-Clinic",
    HOME: "Home Visit",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 p-6 rounded-2xl border-2 items-center justify-center ${
        selected ? "border-primary bg-primary/10" : "border-gray-300 bg-white"
      }`}
    >
      <Ionicons
        name={icons[mode]}
        size={48}
        color={selected ? "rgb(14, 103, 126)" : "#6B7280"}
      />
      <Text
        className={`mt-4 font-semibold text-center ${
          selected ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {labels[mode]}
      </Text>
    </TouchableOpacity>
  );
};

export default ConsultationModeCard;
