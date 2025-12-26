// src/components/consultation/ConsultationModeCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "~/components/ui/icon";

interface ConsultationModeCardProps {
  mode: "TELE" | "CLINIC" | "HOME";
  selected: boolean;
  onPress: () => void;
  price?: number | string | null;
}

const ConsultationModeCard: React.FC<ConsultationModeCardProps> = ({
  mode,
  selected,
  onPress,
  price,
}) => {
  const icons = {
    TELE: "videocam",
    CLINIC: "business",
    HOME: "home",
  } as const;

  const labels = {
    TELE: "Video Consultation",
    CLINIC: "In-Clinic Visit",
    HOME: "Home Visit",
  };

  const descriptions = {
    TELE: "Consult from anywhere",
    CLINIC: "Visit doctor's clinic",
    HOME: "Doctor comes to you",
  };

  const formatPrice = () => {
    if (price == null || price === 0) return "Price not available";
    return `KES ${Number(price).toLocaleString()}`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`
        flex-1 mx-2 rounded-3xl overflow-hidden border-2
        ${
          selected
            ? "border-primary shadow-xl shadow-primary/20"
            : "border-gray-200 shadow-md"
        }
        ${selected ? "bg-primary/5" : "bg-white"}
      `}
    >
      <View className="p-6 flex-row items-center">
        {/* Icon on Left */}
        <View
          className={`
            w-16 h-16 rounded-2xl items-center justify-center mr-4
            ${selected ? "bg-primary" : "bg-gray-100"}
          `}
        >
          <Ionicons
            name={icons[mode]}
            size={32}
            color={selected ? "white" : "#4B5563"}
          />
        </View>

        {/* Content on Right */}
        <View className="flex-1">
          {/* Title */}
          <Text
            className={`
              font-bold text-base
              ${selected ? "text-primary" : "text-foreground"}
            `}
          >
            {labels[mode]}
          </Text>

          {/* Description */}
          <Text className="text-sm text-muted-foreground mt-1">
            {descriptions[mode]}
          </Text>
        </View>
        <View>
          <Text
            className={`
              font-semibold text-lg mt-2
              ${selected ? "text-primary" : "text-foreground"}
            `}
          >
            {formatPrice()}
          </Text>
        </View>

        {/* Selected Checkmark on Right */}
        {selected && (
          <View className="ml-4">
            <Icon name="check-circle-outline" size={26} className="text-primary" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ConsultationModeCard;
