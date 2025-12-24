// src/components/ai/BookAppointmentButton.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BookAppointmentButton = () => {
  const navigation = useNavigation<any>();

  return (
    <View className="mt-4">
      <TouchableOpacity
        onPress={() => navigation.navigate("BookAppointment")}
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
