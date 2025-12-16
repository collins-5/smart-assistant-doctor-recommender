// src/components/booking/BookingModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "@/components/ui/icon"; // ← CHANGE THIS IF YOUR ICON PATH IS DIFFERENT
import { DoctorCard } from "@/components/core/doctor-card";
import { useBookAppointment } from "~/lib/hooks/useBookAppointment";

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  initialDoctor?: any;
}

const modes = [
  { key: "TELE" as const, label: "Video Call (Teleconsult)", icon: "video" },
  {
    key: "CLINIC" as const,
    label: "In-Clinic Visit",
    icon: "hospital-building",
  },
  { key: "HOME" as const, label: "Home Visit", icon: "home" },
];

export default function BookingModal({
  visible,
  onClose,
  initialDoctor,
}: BookingModalProps) {
  const {
    step,
    selectedDoctor,
    selectedMode,
    selectedDateTime,
    selectDoctor,
    selectMode,
    selectDateTime,
    simulatePayment,
    goToStep,
    reset,
    loading,
  } = useBookAppointment();

  const [showPicker, setShowPicker] = React.useState(false);

  React.useEffect(() => {
    if (visible && initialDoctor) {
      selectDoctor(initialDoctor);
    }
  }, [visible, initialDoctor, selectDoctor]);

  const handleClose = () => {
    reset();
    setShowPicker(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-teal-700">
            Book Appointment
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <Icon name="close" size={28} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {/* Step 1: Confirm Doctor */}
          {step === 1 && selectedDoctor && (
            <View className="p-6">
              <Text className="text-xl font-semibold mb-4 text-gray-700">
                Selected Doctor
              </Text>
              <DoctorCard {...selectedDoctor} onPress={() => {}} />
              <TouchableOpacity
                onPress={() => goToStep(2)}
                className="bg-teal-600 py-4 rounded-xl mt-6"
              >
                <Text className="text-white text-center text-lg font-bold">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Choose Mode */}
          {step === 2 && (
            <View className="p-6">
              <Text className="text-2xl font-bold mb-8 text-gray-800">
                Choose Consultation Mode
              </Text>
              {modes.map((mode) => (
                <TouchableOpacity
                  key={mode.key}
                  onPress={() => selectMode(mode.key)} // ← FIXED: now passes the mode
                  className="flex-row items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-4"
                >
                  <Icon
                    name={mode.icon as any}
                    size={36}
                    color="#0d9488"
                    className="mr-5"
                  />
                  <Text className="text-xl font-medium text-gray-800 flex-1">
                    {mode.label}
                  </Text>
                  <Icon name="chevron-right" size={28} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <View className="p-6">
              <Text className="text-2xl font-bold mb-6 text-gray-800">
                Select Date & Time
              </Text>

              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                className="bg-teal-100 border-2 border-teal-200 rounded-xl py-5 px-6"
              >
                <Text className="text-teal-700 text-center text-lg font-medium">
                  {selectedDateTime
                    ? selectedDateTime.toLocaleString("en-KE", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Tap to pick date & time"}
                </Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={selectedDateTime || new Date()}
                  mode="datetime"
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    setShowPicker(Platform.OS === "ios"); // Keep open on iOS
                    if (date) selectDateTime(date);
                  }}
                />
              )}

              {selectedDateTime && (
                <TouchableOpacity
                  onPress={() => goToStep(4)}
                  className="bg-teal-600 py-4 rounded-xl mt-8"
                >
                  <Text className="text-white text-center text-lg font-bold">
                    Continue to Payment
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Step 4: Confirm & Pay */}
          {step === 4 && selectedDoctor && selectedMode && selectedDateTime && (
            <View className="p-6">
              <Text className="text-3xl font-bold text-center text-teal-700 mb-8">
                Confirm Booking
              </Text>

              <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-8">
                <Text className="text-lg font-medium text-gray-700">
                  Doctor: {selectedDoctor.fullName}
                </Text>
                <Text className="text-lg mt-3 text-gray-600">
                  Mode:{" "}
                  {selectedMode === "TELE"
                    ? "Video Call"
                    : selectedMode === "CLINIC"
                      ? "In-Clinic Visit"
                      : "Home Visit"}
                </Text>
                <Text className="text-lg mt-3 text-gray-600">
                  Date & Time:{" "}
                  {selectedDateTime.toLocaleString("en-KE", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </Text>
                <View className="border-t border-gray-300 my-4" />
                <Text className="text-2xl font-bold text-teal-600">
                  KES 2,500
                </Text>
              </View>

              <TouchableOpacity
                onPress={async () => {
                  const res = await simulatePayment();
                  if (res?.success) {
                    Alert.alert(
                      "Success!",
                      "Your appointment has been booked!",
                      [{ text: "OK", onPress: handleClose }]
                    );
                  }
                }}
                disabled={loading}
                className="bg-green-600 py-5 rounded-xl flex-row justify-center items-center"
              >
                {loading ? (
                  <ActivityIndicator color="white" size="large" />
                ) : (
                  <>
                    <Icon
                      name="cash"
                      size={30}
                      color="white"
                      className="mr-3"
                    />
                    <Text className="text-white text-xl font-bold">
                      Pay KES 2,500
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
