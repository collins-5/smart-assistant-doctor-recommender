import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import ConsultationModeCard from "./consultation-mode";
import DoctorAvailability from "./doctor-availability";
import PaymentSummary from "./payment-summary";

type StepContentProps = {
  step: number;
  selectedDoctor: any;
  selectedMode: "TELE" | "CLINIC" | "HOME" | null;
  selectedSlot: any;
  doctorId?: number | string;
  onSelectMode: (mode: "TELE" | "CLINIC" | "HOME") => void;
  onSelectSlot: (slot: any) => void;
  onGoToPayment: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: any;
};

const StepContent: React.FC<StepContentProps> = ({
  step,
  selectedDoctor,
  selectedMode,
  selectedSlot,
  doctorId,
  onSelectMode,
  onSelectSlot,
  onGoToPayment,
  onConfirm,
  loading,
  error,
}) => {
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
              onPress={() => onSelectMode("TELE")}
            />
            <ConsultationModeCard
              mode="CLINIC"
              selected={selectedMode === "CLINIC"}
              onPress={() => onSelectMode("CLINIC")}
            />
            <ConsultationModeCard
              mode="HOME"
              selected={selectedMode === "HOME"}
              onPress={() => onSelectMode("HOME")}
            />
          </View>
        </View>
      );

    case 3:
      return (
        <View className="gap-8">
          <Text className="text-2xl font-bold text-foreground text-center">
            Choose Available Time
          </Text>
          <DoctorAvailability
            doctorId={doctorId!}
            onSelectSlot={onSelectSlot}
            selectedSlot={selectedSlot}
          />
          {selectedSlot && (
            <Button
              text="Continue to Payment"
              onPress={onGoToPayment}
              className="mt-4"
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
            slot={selectedSlot}
          />
          {error && (
            <Text className="text-destructive text-center font-medium">
              {error.message}
            </Text>
          )}
          <Button
            text={loading ? "Processing..." : "Confirm & Pay"}
            onPress={onConfirm}
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

export default StepContent;
