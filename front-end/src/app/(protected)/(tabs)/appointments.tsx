// src/app/(protected)/(tabs)/appointments.tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useMyAppointments, Appointment } from "~/lib/hooks/useMyAppointments";
import SkeletonList from "~/components/core/SkeletonList";
import AppointmentCardSkeleton from "~/components/skeletons/appointment-card-skeleton";
import AppointmentCard from "~/components/appointment/appointment-card";
import AppointmentTabs from "~/components/appointment/appointment-tabs";

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<
    "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"
  >("UPCOMING");

  const { appointments, loading, refetch } = useMyAppointments(activeTab);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary py-6">
        <Text className="text-3xl font-bold text-center text-primary-foreground">
          My Appointments
        </Text>
      </View>

      <AppointmentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* List Content */}
      <View className="flex-1">
        {loading ? (
          <SkeletonList skeletonComponent={AppointmentCardSkeleton} count={5} />
        ) : (
          <FlashList
            data={appointments}
            renderItem={({ item }: { item: Appointment }) => (
              <AppointmentCard appointment={item} />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingTop: 12,
              paddingBottom: 40,
            }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center px-8">
                <Text className="text-center text-xl font-medium">
                  No {activeTab.toLowerCase()} appointments
                </Text>
                <Text className="text-center mt-3 text-base">
                  {activeTab === "UPCOMING"
                    ? "Book your first appointment to see it here!"
                    : "Your appointments in this category will appear here."}
                </Text>
              </View>
            }
            refreshing={loading}
            onRefresh={refetch}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
