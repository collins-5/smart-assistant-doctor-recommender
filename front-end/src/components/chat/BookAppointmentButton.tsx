// src/components/ai/BookAppointmentButton.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SheetManager } from "react-native-actions-sheet";
import { Doctor } from "~/app/(protected)/(tabs)/doctors/doctors";

const BookAppointmentButton = () => {

  const openBookingSheet = (doctor: Doctor) => {
    
    SheetManager.show("booking", {
      payload: { doctor },
    });
  };

  return (
    <View className="mt-4">
      <TouchableOpacity
        onPress={() => openBookingSheet}
        className="bg-primary rounded-full py-4 px-8 self-center shadow-lg"
      >
        <Text className="text-white font-bold text-lg text-center">
          Book Appointment Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookAppointmentButton;
