// src/components/sheets/cancel-appointment-sheet.tsx
import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet from "react-native-actions-sheet";
import { SheetManager } from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../button";
import { useCancelAppointment } from "~/lib/hooks/useCancelAppointment";

interface CancelAppointmentSheetProps {
  payload?: {
    appointmentId: number;
    doctorName?: string;
    appointmentDate?: string;
  };
}

const CancelAppointmentSheet: React.FC<CancelAppointmentSheetProps> = ({
  payload,
}) => {
  const insets = useSafeAreaInsets();
  const { cancelAppointment, loading: mutationLoading } =
    useCancelAppointment();

  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // ← Local state to prevent double-tap

  const appointmentId = payload?.appointmentId;
  const doctorName = payload?.doctorName || "this doctor";
  const appointmentDate = payload?.appointmentDate || "your appointment";

  const handleCancelAppointment = async () => {
    if (!appointmentId || isSubmitting) return;

    setIsSubmitting(true); // ← Prevent multiple calls

    const result = await cancelAppointment(
      appointmentId,
      reason.trim() || "No reason provided"
    );

    if (result.success) {
      SheetManager.hide("cancel-appointment-sheet");
    } else {
      // Optional: show error toast
      console.warn("Cancellation failed:", result.error);
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    SheetManager.hide("cancel-appointment-sheet");
  };

  if (!appointmentId) return null;

  return (
    <ActionSheet
      id="cancel-appointment-sheet"
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      containerStyle={{
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: "#ffffff",
      }}
      indicatorStyle={{ width: 50, height: 5, backgroundColor: "#e5e7eb" }}
    >
      <View className="py-8">
        <View className="items-center mb-10">
          <View className="w-28 h-28 rounded-3xl bg-red-50 justify-center items-center shadow-lg mb-8">
            <View className="w-20 h-20 rounded-2xl bg-red-100 justify-center items-center">
              <Ionicons name="calendar-outline" size={48} color="#EF4444" />
            </View>
          </View>

          <Text className="text-3xl font-bold text-gray-900 text-center">
            Cancel Appointment?
          </Text>

          <Text className="text-gray-500 text-center text-base leading-6 mt-4 px-8">
            Are you sure you want to cancel your appointment with{" "}
            <Text className="font-semibold">{doctorName}</Text> on{" "}
            <Text className="font-semibold">{appointmentDate}</Text>?
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-base font-medium text-gray-700 mb-2">
            Reason for cancellation (optional)
          </Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="e.g. Scheduling conflict, feeling better..."
            multiline
            numberOfLines={3}
            className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
            placeholderTextColor="#9ca3af"
            editable={!isSubmitting}
          />
        </View>

        <View className="gap-4">
          <Button
            variant="destructive"
            onPress={handleCancelAppointment}
            text="Cancel Appointment"
            disabled={isSubmitting || mutationLoading}
            loading={isSubmitting || mutationLoading}
            leftIcon={<Ionicons name="close-circle" size={22} color="white" />}
          />
          <Button
            variant="outline"
            onPress={handleClose}
            text="Keep Appointment"
            disabled={isSubmitting}
          />
        </View>
      </View>
    </ActionSheet>
  );
};

export default CancelAppointmentSheet;
