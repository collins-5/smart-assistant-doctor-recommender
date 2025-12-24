import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FlashList } from "@shopify/flash-list";
import { useDoctor } from "~/lib/hooks/useDoctor";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48 - 16) / 3; // 3 columns

const DoctorAvailability: React.FC<{
  doctorId: number | string;
  onSelectSlot: (slot: any) => void;
  selectedSlot?: any;
}> = ({ doctorId, onSelectSlot, selectedSlot }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const numericDoctorId =
    typeof doctorId === "string" ? parseInt(doctorId) : doctorId;
  const { doctor, loading, error } = useDoctor(numericDoctorId);

  const formatTime = (dateString: string) =>
    format(new Date(dateString), "hh:mm a");
  const formatDate = (dateString: string) =>
    format(new Date(dateString), "EEE, MMM dd");
  const formatFullDate = (date: Date) => format(date, "EEEE, MMMM dd, yyyy");

  const filterSlotsByDate = (slots: any[]) => {
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
    return slots.filter(
      (slot) =>
        format(new Date(slot.startTime), "yyyy-MM-dd") === selectedDateStr
    );
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
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
      <View className="flex-1 justify-center items-center py-12 px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="mt-4 text-destructive text-center font-semibold">
          Failed to load availabilities
        </Text>
        <Text className="text-sm text-muted-foreground text-center mt-2">
          {error.message || "Unknown error occurred"}
        </Text>
      </View>
    );
  }

  const availabilities = doctor?.availabilities || [];
  const availableSlots = availabilities.filter((slot: any) => !slot.isBooked);
  const filteredSlots = filterSlotsByDate(availableSlots);

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

  const renderSlotItem = ({ item }: { item: any }) => {
    const isSelected = selectedSlot?.id === item.id;

    return (
      <TouchableOpacity
        onPress={() => onSelectSlot(item)}
        className={`m-1 items-center justify-center flex-row rounded-2xl border border-primary p-1 ${
          isSelected
            ? "border-primary bg-primary/10"
            : "border-gray-200 bg-card"
        }`}
        style={{ width: ITEM_WIDTH }}
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

  return (
    <View className="gap-2">
      {/* Date Picker */}
      <View className="bg-card rounded-2xl p-6 border border-gray-200">
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="calendar" size={24} color="rgb(14, 103, 126)" />
          <Text className="text-lg font-bold text-foreground">Select Date</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="bg-primary/10 p-4 rounded-xl border-2 border-primary/20"
        >
          <Text className="text-primary font-semibold text-center text-base">
            {formatFullDate(selectedDate)}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>
      {/* Available Slots Header */}
      {filteredSlots.length !== 0 && (
        <View className="bg-card rounded-2xl p-6 border border-gray-200">
          <View className="flex-row items-center gap-3 mb-2">
            <Ionicons name="time-outline" size={24} color="rgb(14, 103, 126)" />
            <Text className="text-xl font-bold text-foreground">
              Available Slots
            </Text>
          </View>
          <Text className="text-muted-foreground">
            {filteredSlots.length} slot{filteredSlots.length !== 1 ? "s" : ""}{" "}
            available on this date
          </Text>
        </View>
      )}
      {/* Selected Slot Summary - MOVED TO TOP */}
      {selectedSlot && (
        <View className="bg-primary rounded-2xl p-6 mx-4 shadow-lg">
          <View className="flex-row items-center gap-3 mb-3">
            <Ionicons name="checkmark-circle" size={28} color="white" />
            <Text className="text-xl font-bold text-primary-foreground">
              Selected Time Slot
            </Text>
          </View>
          <Text className="text-3xl font-bold text-primary-foreground mb-2">
            {formatTime(selectedSlot.startTime)} -{" "}
            {formatTime(selectedSlot.endTime)}
          </Text>
          <Text className="text-lg text-primary-foreground/80">
            {formatDate(selectedSlot.startTime)}
          </Text>
        </View>
      )}
      {/* 3-Column Grid */}
      {filteredSlots.length === 0 ? (
        <View className="bg-card rounded-2xl p-8 border border-gray-200 items-center">
          <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
          <Text className="mt-4 text-muted-foreground text-center">
            No slots available on this date
          </Text>
          <Text className="text-sm text-muted-foreground text-center mt-2">
            Try selecting a different date
          </Text>
        </View>
      ) : (
        <View className="px-1">
          <FlashList
            data={filteredSlots}
            renderItem={renderSlotItem}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 1 }}
          />
        </View>
      )}
    </View>
  );
};

export default DoctorAvailability;
