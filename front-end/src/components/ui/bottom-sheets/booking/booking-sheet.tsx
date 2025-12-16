// src/components/sheets/booking-sheet.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet, {
  SheetDefinition,
  SheetManager,
} from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

import { useBookAppointment } from "~/lib/hooks/useBookAppointment";
import { Button } from "~/components/ui/button";

// ──────────────────────────────────────────────────────────────
// Consultation Mode Card (using your colors)
// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// Date + Time Picker
// ──────────────────────────────────────────────────────────────
const DateTimePicker: React.FC<{
  value: Date | null;
  onChange: (date: Date) => void;
}> = ({ value, onChange }) => {
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  return (
    <View className="gap-8">
      {/* Date */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Select Date
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {dates.map((date) => {
              const isSelected =
                value &&
                format(value, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  onPress={() => {
                    const newDate = new Date(date);
                    if (value) {
                      newDate.setHours(value.getHours(), value.getMinutes());
                    }
                    onChange(newDate);
                  }}
                  className={`p-4 rounded-2xl items-center min-w-20 ${
                    isSelected ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <Text
                    className={`font-medium ${isSelected ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {format(date, "EEE")}
                  </Text>
                  <Text
                    className={`text-2xl font-bold ${isSelected ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {format(date, "dd")}
                  </Text>
                  <Text
                    className={`text-sm ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                  >
                    {format(date, "MMM")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Time */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Select Time
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {timeSlots.map((slot) => {
            const [time, period] = slot.split(" ");
            const [hours, minutes] = time.split(":").map(Number);
            const slotHours =
              period === "PM" && hours !== 12
                ? hours + 12
                : hours === 12 && period === "AM"
                  ? 0
                  : hours;

            const isSelected =
              value &&
              value.getHours() === slotHours &&
              value.getMinutes() === minutes;

            return (
              <TouchableOpacity
                key={slot}
                onPress={() => {
                  const newDate = value ? new Date(value) : new Date();
                  newDate.setHours(slotHours);
                  newDate.setMinutes(minutes);
                  newDate.setSeconds(0);
                  onChange(newDate);
                }}
                className={`px-5 py-3 rounded-xl ${
                  isSelected ? "bg-primary" : "bg-muted"
                }`}
              >
                <Text
                  className={
                    isSelected
                      ? "text-primary-foreground font-medium"
                      : "text-foreground"
                  }
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────────────────────
// Payment Summary
// ──────────────────────────────────────────────────────────────
const PaymentSummary: React.FC<{
  doctor: any;
  mode: "TELE" | "CLINIC" | "HOME";
  dateTime: Date | null;
}> = ({ doctor, mode, dateTime }) => {
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
        <Text className="text-muted-foreground">Date & Time</Text>
        <Text className="font-medium text-foreground">
          {dateTime ? format(dateTime, "dd MMM yyyy, hh:mm a") : "-"}
        </Text>
      </View>
      <View className="border-t border-gray-300 pt-4 flex-row justify-between">
        <Text className="text-lg font-bold text-foreground">Total</Text>
        <Text className="text-2xl font-bold text-primary">
          ${price || "N/A"}
        </Text>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────────────────────
// Main Booking Sheet
// ──────────────────────────────────────────────────────────────
type BookingSheetProps = {
  payload?: { doctor?: any };
};

const BookingSheet: React.FC<BookingSheetProps> = ({ payload }) => {
  const insets = useSafeAreaInsets();

  const {
    step,
    selectedDoctor,
    selectedMode,
    selectedDateTime,
    loading,
    error,
    selectDoctor,
    selectMode,
    selectDateTime,
    simulatePayment,
    reset,
    goToStep,
  } = useBookAppointment(payload?.doctor || null);

  useEffect(() => {
    if (payload?.doctor) {
      reset();
      selectDoctor(payload.doctor);
      goToStep(2);
    } else {
      reset();
      goToStep(1);
    }
  }, [payload?.doctor]);

  const handleClose = () => {
    reset();
    SheetManager.hide("booking");
  };

  const handleConfirm = async () => {
    const result = await simulatePayment();
    if (result?.success) {
      SheetManager.hide("booking");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View className="gap-6 items-center">
            <Text className="text-2xl font-bold text-foreground text-center">
              Choose a Doctor
            </Text>
            <View className="bg-primary/10 p-8 rounded-2xl items-center">
              <Text className="text-center text-primary font-medium text-lg">
                Tap any doctor from the list to start booking
              </Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View className="gap-8">
            <Text className="text-2xl font-bold text-foreground text-center">
              Select Consultation Mode
            </Text>
            <View className="flex-row gap-4">
              <ConsultationModeCard
                mode="TELE"
                selected={selectedMode === "TELE"}
                onPress={() => selectMode("TELE")}
              />
              <ConsultationModeCard
                mode="CLINIC"
                selected={selectedMode === "CLINIC"}
                onPress={() => selectMode("CLINIC")}
              />
              <ConsultationModeCard
                mode="HOME"
                selected={selectedMode === "HOME"}
                onPress={() => selectMode("HOME")}
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View className="gap-8">
            <Text className="text-2xl font-bold text-foreground text-center">
              Choose Date & Time
            </Text>
            <DateTimePicker
              value={selectedDateTime}
              onChange={selectDateTime}
            />
            {selectedDateTime && (
              <Button
                text="Continue to Payment"
                onPress={() => goToStep(4)}
                
              />
            )}
          </View>
        );

      case 4:
        return (
          <View className="gap-8">
            <Text className="text-2xl font-bold text-foreground text-center">
              Review & Confirm
            </Text>

            <PaymentSummary
              doctor={selectedDoctor}
              mode={selectedMode!}
              dateTime={selectedDateTime}
            />

            {error && (
              <Text className="text-destructive text-center font-medium">
                {error.message}
              </Text>
            )}

            <Button
              text={loading ? "Processing..." : "Confirm & Pay"}
              onPress={handleConfirm}
              disabled={loading}
              leftIcon={
                loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Ionicons name="card-outline" size={22} color="white" />
                )
              }
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ActionSheet
      id="booking"
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      onClose={handleClose}
      containerStyle={{
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: "rgb(247, 253, 254)", // bg-card
        maxHeight: "95%",
      }}
      indicatorStyle={{ width: 50, height: 5, backgroundColor: "#d1d5db" }}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="py-8">
        {/* Header */}
        <View className="items-center mb-10">
          <Text className="text-3xl font-bold text-foreground">
            Book Appointment
          </Text>
          <View className="flex-row mt-6 gap-2 w-full">
            {[1, 2, 3, 4].map((s) => (
              <View
                key={s}
                className={`h-2 rounded-full flex-1 ${
                  step >= s ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        {renderStep()}

        {/* Back Button */}
        {step > (payload?.doctor ? 2 : 1) && (
          <Button
            variant="outline"
            text="Back"
            onPress={() => goToStep((step - 1) as any)}
            className="mt-8 border-primary text-primary"
          />
        )}
      </ScrollView>
    </ActionSheet>
  );
};

export type BookingSheetDefinition = SheetDefinition<{
  payload?: { doctor?: any };
}>;

export default BookingSheet;
