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

// Use the correct new hook
import { useDoctor } from "~/lib/hooks/useDoctor";
import { ScrollView } from "react-native-actions-sheet";
import SlotSkeletonGrid from "~/components/skeletons/slot-skeleton";
import Slot from "./slot";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48 - 16) / 3; // 3 columns

const DoctorAvailability: React.FC<{
  doctorId: number | string;
  onSelectSlot: (slot: any) => void;
  selectedSlot?: any;
}> = ({ doctorId, onSelectSlot, selectedSlot }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // New hook that handles date + slots correctly
  const {
    doctor,
    slots, // ← already filtered available (not booked) slots for selected date
    loading,
    error,
    selectedDate,
    setSelectedDate,
  } = useDoctor(doctorId);

  const formatTime = (dateString?: string | null) =>
    dateString ? format(new Date(dateString), "hh:mm a") : "";

  const formatDate = (dateString?: string | null) =>
    dateString ? format(new Date(dateString), "EEE, MMM dd") : "";

  const formatFullDate = (date: Date) => format(date, "EEEE, MMMM dd, yyyy");

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  if (loading) {
    return (
      <View className="">
        <SlotSkeletonGrid />
      </View>
    );
  }


  const renderSlotItem = ({ item }: { item: any }) => (
    <Slot item={item} selectedSlot={selectedSlot} onSelectSlot={onSelectSlot} />
  );

  return (
    <View className="gap-2">
      {/* Date Picker - exactly same UI */}
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
      {/* Available Slots Header - same style */}
      {slots.length !== 0 && (
        <View className="bg-card rounded-2xl p-6 border border-gray-200">
          <View className="flex-row items-center gap-3 mb-2">
            <Ionicons name="time-outline" size={24} color="rgb(14, 103, 126)" />
            <Text className="text-xl font-bold text-foreground">
              Available Slots
            </Text>
          </View>
          <Text className="text-muted-foreground">
            {slots.length} slot{slots.length !== 1 ? "s" : ""} available on this
            date
          </Text>
        </View>
      )}
      {/* Selected Slot Summary - unchanged */}
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

      {error ? (
        <View className="flex-1 justify-center items-center py-12 px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="mt-4 text-destructive text-center font-semibold">
            Failed to load availabilities
          </Text>
          <Text className="text-sm text-muted-foreground text-center mt-2">
            {error.message || "Unknown error occurred"}
          </Text>
        </View>
      ) : slots.length === 0 ? (
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
        <ScrollView className="px-1 h-[300px]">
          <FlashList
            data={slots}
            renderItem={renderSlotItem}
            numColumns={3}
            keyExtractor={(item) => `${item?.id}-${item?.startTime}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 1 }}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default DoctorAvailability;
