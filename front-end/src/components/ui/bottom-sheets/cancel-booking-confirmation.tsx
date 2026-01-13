// src/components/sheets/cancel-booking-confirmation.tsx
import React from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";

const CancelBookingConfirmationSheet = () => {
  const insets = useSafeAreaInsets();

  const handleConfirm = () => {
    SheetManager.hide("cancel-booking-confirmation");
    SheetManager.hide("booking"); // Closes the main booking sheet
    router.replace("/(protected)/(tabs)/doctors/doctors");
  };

  const handleCancel = () => {
    SheetManager.hide("cancel-booking-confirmation");
  };

  return (
    <ActionSheet
      id="cancel-booking-confirmation"
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
          <View className="w-28 h-28 rounded-3xl bg-orange-50 justify-center items-center shadow-lg mb-8">
            <View className="w-20 h-20 rounded-2xl bg-orange-100 justify-center items-center">
              <Ionicons name="close-circle-outline" size={48} color="#F97316" />
            </View>
          </View>
          <Text className="text-3xl font-bold text-gray-900 text-center">
            Cancel Booking?
          </Text>
          <Text className="text-gray-500 text-center text-base leading-6 mt-4 px-8">
            Your current progress will be lost. Are you sure you want to cancel?
          </Text>
        </View>

        <View className="gap-4 mt-6">
          <Button
            variant="destructive"
            onPress={handleConfirm}
            text="Yes, Cancel"
            leftIcon={<Ionicons name="close" size={22} color="white" />}
          />
          <Button
            variant="outline"
            onPress={handleCancel}
            text="Continue Booking"
          />
        </View>
      </View>
    </ActionSheet>
  );
};

export type CancelBookingConfirmationSheetDefinition = React.ComponentProps<
  typeof ActionSheet
>;

export default CancelBookingConfirmationSheet;
