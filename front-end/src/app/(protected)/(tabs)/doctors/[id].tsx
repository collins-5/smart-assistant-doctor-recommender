// app/(protected)/doctor/[id].tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";
import { useDoctor } from "~/lib/hooks/useDoctor";
import { DoctorCard } from "~/components/core/doctor-card";
import { Button } from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import DoctorDetailsSkeletons from "~/components/skeletons/doctor-details-skeletons";

export default function DoctorProfileScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const doctorId = parseInt(idParam, 10);

  const { doctor: rawDoctor, loading, error, refetch } = useDoctor(doctorId);

  // Normalize the doctor object to fix backend typo: "insuarance" → "insurances"
  const doctor = rawDoctor
    ? {
        ...rawDoctor,
        insurances: rawDoctor.insuarance || rawDoctor.insurances || [],
      }
    : null;

  // Loading state
  if (loading) {
    return (
      <DoctorDetailsSkeletons/>
    );
  }

  // Error or doctor not found
  if (error || !doctor) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-8">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-red-600 text-center text-lg mt-4">
          {error ? "Something went wrong" : "Doctor not found"}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-6 bg-blue-600 py-3 px-6 rounded-full"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-600 font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const openBookingSheet = () => {
    SheetManager.show("booking", {
      payload: { doctor },
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-10"
    >
      <View className="bg-primary py-2 flex-row  justify-between mb-2">
        <View>
          <Button
            leftIcon={<Icon name="arrow-left" />}
            onPress={() =>
              router.replace("/(protected)/(tabs)/doctors/doctors")
            }
          />
        </View>
        <Text className="text-3xl font-bold text-center my-1 text-primary-foreground">
          {doctor.fullName}
        </Text>
        <View></View>
      </View>
      <DoctorCard
        id={doctor.id}
        title={doctor.title}
        firstName={doctor.firstName}
        lastName={doctor.lastName}
        fullName={doctor.fullName}
        bio={doctor.bio}
        profilePictureUrl={doctor.profilePictureUrl}
        primarySpecialty={doctor.primarySpecialty}
      />

      <View className="mx-5 mt-2 space-y-2">
        {doctor.subSpecialties && doctor.subSpecialties.length > 0 && (
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-lg italic font-bold text-gray-900 mb-3">
              Sub-specialties
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {doctor.subSpecialties.map((sub: any) => (
                <View
                  key={sub.id}
                  className="bg-blue-100 px-4 py-2 rounded-full"
                >
                  <Text className="text-primary font-medium text-sm">
                    {sub.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Accepted Insurances – now works despite backend typo */}
        {doctor.insurances && doctor.insurances.length > 0 && (
          <View className="bg-white rounded-2xl p-5 my-1 shadow-sm border border-gray-100">
            <Text className="text-lg italic font-bold text-gray-900 mb-3">
              Insurances
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {doctor.insurances.map((ins: any) => (
                <View
                  key={ins.id}
                  className="bg-blue-200 px px-4 py-2 rounded-full"
                >
                  <Text className="text-primary font-medium text-sm">
                    {ins.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Consultation Options & Pricing */}
        <View className="bg-white rounded-2xl p-5 mt-1 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold italic text-gray-900 mb-4">
            Consultation Options
          </Text>

          <View className="space-y-4">
            {doctor.teleconsultPrice != null && (
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="videocam" size={24} color="#0E677E" />
                  <Text className="text-gray-700 font-medium">
                    Video Consultation
                  </Text>
                </View>
                <Text className="text-lg font-semibold text-gray-900">
                  KSh {doctor.teleconsultPrice}
                </Text>
              </View>
            )}

            {doctor.clinicVisitPrice != null && (
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="business" size={24} color="#0E677E" />
                  <Text className="text-gray-700 font-medium">
                    In-Clinic Visit
                  </Text>
                </View>
                <Text className="text-lg font-semibold text-gray-900">
                  KSh {doctor.clinicVisitPrice}
                </Text>
              </View>
            )}

            {doctor.homecarePrice != null && (
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="home" size={24} color="#0E677E" />
                  <Text className="text-gray-700 font-medium">Home Visit</Text>
                </View>
                <Text className="text-lg font-semibold text-gray-900">
                  KSh {doctor.homecarePrice}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="flex my-2 p-4">
          <Button
            onPress={openBookingSheet}
            text=" Book Appointment Now"
            className="scale-125 w-8/12 self-center"
          />
        </View>
      </View>
    </ScrollView>
  );
}
