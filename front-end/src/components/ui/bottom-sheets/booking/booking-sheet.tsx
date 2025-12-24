import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet from "react-native-actions-sheet";
import { Button } from "~/components/ui/button";
import { useBookAppointment } from "~/lib/hooks/useBookAppointment";
import { SheetDefinition, SheetManager } from "react-native-actions-sheet";

import StepContent from "./components/step-content";
import { BookingStep } from "./types"; 
import { Ionicons } from "@expo/vector-icons";

type BookingSheetProps = {
  payload?: { doctor?: any };
};

const BookingSheet: React.FC<BookingSheetProps> = ({ payload }) => {
  const insets = useSafeAreaInsets();
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const {
    step,
    selectedDoctor,
    selectedMode,
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
      goToStep(BookingStep.SelectMode); // ← Clear: step 2
    } else {
      reset();
      goToStep(BookingStep.SelectDoctor); // ← Clear: step 1
    }
  }, [payload?.doctor]);

  const handleClose = () => {
    reset();
    setSelectedSlot(null);
    SheetManager.hide("booking");
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    const date = new Date(slot.startTime);
    selectDateTime(date);
  };

  const handleConfirm = async () => {
    const result = await simulatePayment();
    if (result?.success) {
      setSelectedSlot(null);
      SheetManager.hide("booking");
    }
  };

  const handleBack = () => {
    if (step === BookingStep.ConfirmPayment) {
      setSelectedSlot(null);
    }
    goToStep((step - 1) as BookingStep); // Safe because step is never <1 when back is shown
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
        backgroundColor: "rgb(247, 253, 254)",
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
          {/* Modern Step Progress Indicator with Correct Line Logic */}
          <View className="flex-row items-center justify-between mt-8 px-6">
            {[1, 2, 3, 4].map((num, index) => (
              <View key={num} className="flex-row items-center flex-1">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center border-4 relative z-10 ${
                    step >= num
                      ? "bg-primary border-primary"
                      : "bg-white border-muted-foreground/30"
                  }`}
                >
                  {step > num ? (
                    <Ionicons name="checkmark" size={28} color="white" />
                  ) : (
                    <Text
                      className={`text-xl font-bold ${
                        step === num ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {num}
                    </Text>
                  )}
                </View>

                {index < 3 && (
                  <View className="flex-1 h-1 mx-3 -z-0">
                    <View
                      className={`h-full rounded-full ${
                        step > num ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Step Content */}
        <StepContent
          step={step}
          selectedDoctor={selectedDoctor}
          selectedMode={selectedMode}
          selectedSlot={selectedSlot}
          doctorId={selectedDoctor?.id}
          onSelectMode={selectMode}
          onSelectSlot={handleSlotSelect}
          onGoToPayment={() => goToStep(BookingStep.ConfirmPayment)}
          onConfirm={handleConfirm}
          loading={loading}
          error={error}
        />

        {/* Back Button */}
        {step >
          (payload?.doctor
            ? BookingStep.SelectMode
            : BookingStep.SelectDoctor) && (
          <View className="mb-10 mt-2">
            <Button variant="outline" text="Back" onPress={handleBack} />
          </View>
        )}
      </ScrollView>
    </ActionSheet>
  );
};

export type BookingSheetDefinition = SheetDefinition<{
  payload?: { doctor?: any };
}>;

export default BookingSheet;
