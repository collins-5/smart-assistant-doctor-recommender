import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48 - 16) / 3; 

interface SlotProps {
  item: any;
  selectedSlot?: any;
  onSelectSlot: (slot: any) => void;
}

const formatTime = (dateString?: string | null) =>
  dateString ? format(new Date(dateString), "hh:mm a") : "";

const Slot: React.FC<SlotProps> = ({ item, selectedSlot, onSelectSlot }) => {
  const isSelected = selectedSlot?.id === item.id;

  return (
    <TouchableOpacity
      onPress={() => onSelectSlot(item)}
      className={`m-1 items-center justify-center flex-row rounded-2xl border p-1 ${
        isSelected ? "border-primary bg-primary/10" : "border-gray-200 bg-card"
      }`}
      style={{ width: ITEM_WIDTH }}
      activeOpacity={0.8}
    >
      <Ionicons
        name="time-outline"
        size={28}
        color={isSelected ? "rgb(14, 103, 126)" : "#6B7280"}
      />
      <View>
        <Text
          className={`text-base font-bold mt-2 ${
            isSelected ? "text-primary" : "text-foreground"
          }`}
        >
          {formatTime(item.startTime)}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            isSelected ? "text-primary" : "text-muted-foreground"
          }`}
        >
          to {formatTime(item.endTime)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Slot;
