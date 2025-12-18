// src/components/doctor-availability.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useDoctor } from "~/lib/hooks/useDoctor";

interface DoctorAvailabilityProps {
  doctorId: number;
  onSelectSlot?: (slot: any) => void;
}

export const DoctorAvailability: React.FC<DoctorAvailabilityProps> = ({
  doctorId,
  onSelectSlot,
}) => {
  const { doctor, loading, error } = useDoctor(doctorId);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "hh:mm a");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEE, MMM dd");
  };

  const handleSlotPress = (slot: any) => {
    setSelectedSlot(slot.id);
    onSelectSlot?.(slot);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <ActivityIndicator size="large" color="rgb(14, 103, 126)" />
        <Text className="mt-4 text-muted-foreground">
          Loading availabilities...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="mt-4 text-destructive text-center">
          Failed to load availabilities
        </Text>
        <Text className="text-sm text-muted-foreground text-center mt-2">
          {error.message}
        </Text>
      </View>
    );
  }

  const availabilities = doctor?.availabilities || [];
  const availableSlots = availabilities.filter((slot: any) => !slot.isBooked);

  if (availableSlots.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
        <Text className="mt-4 text-muted-foreground text-center">
          No available slots at the moment
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-6">
      {/* Header */}
      <View className="bg-card rounded-2xl p-6 border border-gray-200">
        <View className="flex-row items-center gap-3 mb-2">
          <Ionicons
            name="calendar-outline"
            size={24}
            color="rgb(14, 103, 126)"
          />
          <Text className="text-xl font-bold text-foreground">
            Available Times
          </Text>
        </View>
        <Text className="text-muted-foreground">
          {availableSlots.length} slot{availableSlots.length !== 1 ? "s" : ""}{" "}
          available
        </Text>
      </View>

      {/* Time Slots */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          {availableSlots.map((slot: any) => {
            const isSelected = selectedSlot === slot.id;

            return (
              <TouchableOpacity
                key={slot.id}
                onPress={() => handleSlotPress(slot)}
                className={`p-5 rounded-2xl border-2 ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 bg-card"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  {/* Time Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={isSelected ? "rgb(14, 103, 126)" : "#6B7280"}
                      />
                      <Text
                        className={`text-lg font-bold ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {formatTime(slot.startTime)}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      to {formatTime(slot.endTime)}
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {formatDate(slot.startTime)}
                    </Text>
                  </View>

                  {/* Status Badge */}
                  <View
                    className={`px-4 py-2 rounded-full ${
                      isSelected ? "bg-primary" : "bg-green-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected
                          ? "text-primary-foreground"
                          : "text-green-700"
                      }`}
                    >
                      {slot.isRecurring ? "Recurring" : "Available"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Selected Slot Summary */}
      {selectedSlot && (
        <View className="bg-primary rounded-2xl p-6 mt-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text className="text-lg font-bold text-primary-foreground">
              Selected Time
            </Text>
          </View>
          <Text className="text-2xl font-bold text-primary-foreground mb-2">
            {formatTime(
              availableSlots.find((s: any) => s.id === selectedSlot)
                ?.startTime || ""
            )}
          </Text>
          <Text className="text-primary-foreground/80">
            {formatDate(
              availableSlots.find((s: any) => s.id === selectedSlot)
                ?.startTime || ""
            )}
          </Text>
        </View>
      )}
    </View>
  );
};
