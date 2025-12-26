import React from "react";
import { Animated, TouchableOpacity, Image } from "react-native";
import { useRef } from "react";
import View from "~/components/ui/view";
import Header from "~/components/Dashboard/header";
import { TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useAIAssistant } from "~/lib/hooks/useAIAssistant";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { useDoctors } from "~/lib/hooks/useDoctors";
import { useSpecialties } from "~/lib/hooks/useSpecialties";
import { Skeleton } from "~/components/ui/skeleton";
import { FlashList } from "@shopify/flash-list";
import Icon from "~/components/ui/icon"; // ← Your custom Icon component
import type { IconNames } from "~/components/ui/icon";

type Doctor = {
  id: number | string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  primarySpecialty?: { name: string } | null;
};

type Specialty = {
  id: number | string;
  name: string;
};

// Mapping specialty names to specific, meaningful icons from your allowed list
const specialtyIconMap: Record<string, IconNames> = {
  Cardiology: "heart-outline",
  General: "doctor",
  Dermatology: "arm-flex",
  Neurology: "brain",
  Pediatrics: "mother-nurse",
  Orthopedics: "account-injury",
  Psychiatry: "brain",
  Gynecology: "gender-male-female",
  "General Practitioner": "doctor",
  "Family Medicine": "home-heart",
  Dentistry: "food-apple", // closest available
  Ophthalmology: "eye-outline",
  ENT: "account-question", // fallback
  Nutrition: "nutrition",
  Physiotherapy: "human-wheelchair",
  "Occupational Therapy": "wheelchair-accessibility",
  Radiology: "medical-bag",
  Surgery: "stethoscope",
  neurosergion: "stethoscope"
  // Add more as needed
};

export default function Dashboard() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { inputText, setInputText, isLoading: aiLoading } = useAIAssistant();
  const { doctors, loading: loadingDoctors } = useDoctors();
  const { specialties, loading: loadingSpecialties } = useSpecialties();

  const handleSend = () => {
    if (inputText.trim()) {
      router.push("(protected)/(tabs)/chat");
    }
  };

  const healthTips = [
    "Stay hydrated — drink at least 8 glasses of water daily",
    "Get 7–9 hours of sleep every night for better health",
    "Wash your hands frequently to prevent infections",
    "Take a 10-minute walk daily to boost your mood",
  ];

  // Compact Doctor Card — EXACTLY as it was originally (untouched)
  const renderDoctor = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      onPress={() => router.push("(protected)/(tabs)/doctors")}
      className="mr-5 p-4 w-60 flex-row bg-white rounded-3xl shadow-lg overflow-hidden"
      style={{ elevation: 8 }}
    >
      {item.profilePictureUrl ? (
        <Image
          source={{ uri: item.profilePictureUrl }}
          className="w-20 h-20 rounded-2xl"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-40 bg-gray-100 items-center justify-center">
          <Ionicons name="person" size={60} color="#aaa" />
        </View>
      )}
      <View className="p-4">
        <Text className="font-bold text-lg text-foreground text-center">
          {item.fullName ||
            `${item.firstName || ""} ${item.lastName || ""}`.trim()}
        </Text>
        <Text className="text-sm text-gray-600 text-center mt-1">
          {item.primarySpecialty?.name || "General Practitioner"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Specialty Card — now with custom meaningful icons and consistent styling
  const renderSpecialty = ({ item }: { item: Specialty }) => {
    const iconName = specialtyIconMap[item.name] || "medical-bag"; // fallback icon

    return (
      <TouchableOpacity
        onPress={() => router.push("(protected)/(tabs)/doctors")}
        className="mr-3 w-32 bg-white rounded-3xl shadow-lg overflow-hidden"
        style={{ elevation: 6 }}
        activeOpacity={0.8}
      >
        <View className="pb-4 items-center justify-center">
          <View className="w-16 h-16 bg-teal-100/60 rounded-2xl items-center justify-center">
            <Icon name={iconName} size={28} color="#0d9488" />
          </View>
          <Text className="mt-3 font-semibold text-foreground text-center text-sm">
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Skeletons
  const DoctorSkeleton = () => (
    <View className="mr-5 w-48 bg-white rounded-3xl shadow-lg overflow-hidden">
      <Skeleton className="w-full h-40" />
      <View className="p-4">
        <Skeleton className="h-6 w-36 mx-auto rounded-full mb-2" />
        <Skeleton className="h-4 w-28 mx-auto rounded-full" />
      </View>
    </View>
  );

  const SpecialtySkeleton = () => (
    <View className="mr-4 w-32 bg-white rounded-3xl shadow-lg overflow-hidden">
      <View className="p-6 items-center">
        <Skeleton className="w-16 h-16 rounded-2xl" />
        <Skeleton className="h-4 w-24 mt-3 rounded-full" />
      </View>
    </View>
  );

  return (
    <>
      <Header />
      <KeyboardAvoidingWrapper
        scrollEnabled={false}
        keyboardVerticalOffset={90}
        showsVerticalScrollIndicator={false}
      >
          {/* Popular Specialties – Horizontal scroll */}
          <View className="mt-8 px-6">
            <Text className="text-2xl font-bold text-foreground mb-5">
              Popular Specialties
            </Text>
            <FlashList
              data={loadingSpecialties ? Array(6).fill({}) : specialties}
              renderItem={
                loadingSpecialties
                  ? () => <SpecialtySkeleton />
                  : renderSpecialty
              }
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Recent Doctors – Horizontal scroll */}
          <View className="mt-10 px-6">
            <Text className="text-2xl font-bold text-foreground mb-5">
              Recent Doctors
            </Text>
            <FlashList
              data={loadingDoctors ? Array(4).fill({}) : doctors.slice(0, 8)}
              renderItem={
                loadingDoctors ? () => <DoctorSkeleton /> : renderDoctor
              }
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Daily Health Tips */}
          <View className="mt-10 px-6 mb-8">
            <Text className="text-2xl font-bold text-foreground mb-5">
              Daily Health Tips
            </Text>
            <View className="bg-teal-50/70 rounded-3xl p-6 border border-teal-100">
              {healthTips.map((tip, index) => (
                <View
                  key={index}
                  className="flex-row items-start py-3 border-b border-teal-200/30 last:border-0"
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#0d9488"
                    className="mr-4 mt-0.5"
                  />
                  <Text className="flex-1 text-foreground text-base leading-6">
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </View>

        {/* Clean Input Bar */}
        <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white/90 backdrop-blur-lg border-t border-gray-200 safe-area-bottom">
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-100 rounded-full px-6 py-4 text-base"
              placeholder="Describe your symptoms..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || aiLoading}
              className="ml-4 p-4 bg-teal-600 rounded-full shadow-lg"
            >
              <Ionicons
                name="arrow-forward"
                size={26}
                color="white"
                style={{ opacity: inputText.trim() && !aiLoading ? 1 : 0.5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
}
