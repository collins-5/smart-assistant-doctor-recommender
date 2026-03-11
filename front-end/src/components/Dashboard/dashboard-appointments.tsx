import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { useMyAppointments } from "~/lib/hooks/useMyAppointments";
import SkeletonList from "~/components/core/SkeletonList";
import AppointmentCardSkeleton from "~/components/skeletons/appointment-card-skeleton";
import AppointmentTabs, { DashboardTabType } from "./dashboard-appointment-tabs";
import AppointmentCard from "../appointment/appointment-card";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

const DashboardAppointments = () => {
  const [activeTab, setActiveTab] = useState<DashboardTabType>("UPCOMING");
  const { appointments, loading: loadingAppointments } = useMyAppointments();

  const filteredAppointments = appointments.filter((a: any) =>
    activeTab === "UPCOMING"
      ? a.status === "UPCOMING" || a.status === "ONGOING"
      : a.status === "COMPLETED"
  );

  const sortedAppointments = [...filteredAppointments].sort(
    (a: any, b: any) =>
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <View className="mt-5 px-5 mb-8">

      {/* Section header */}
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-xs font-semibold text-primary uppercase tracking-widest">
            Schedule
          </Text>
          <Text className="text-xl font-bold text-foreground">
            My Appointments
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(tabs)/appointments")}
          className="bg-primary/10 px-3 py-1.5 rounded-full"
        >
          <Text className="text-primary text-xs font-semibold">See All</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <AppointmentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <View className="flex-1 min-h-96 mt-1">
        {loadingAppointments ? (
          <SkeletonList skeletonComponent={AppointmentCardSkeleton} count={2} />
        ) : sortedAppointments.length > 0 ? (
          <FlashList
            data={sortedAppointments.slice(0, 5)}
            renderItem={({ item }) => <AppointmentCard appointment={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-3" />}
            contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
          />
        ) : (
          /* Empty state */
          <View className="flex-1 justify-center items-center py-10">
            <View className="bg-primary/5 rounded-3xl p-8 items-center border border-primary/10 w-full">
              <View className="bg-primary/10 rounded-full p-4 mb-4">
                <Text className="text-3xl">📅</Text>
              </View>
              <Text className="text-foreground text-center text-base font-semibold">
                No {activeTab.toLowerCase()} appointments
              </Text>
              <Text className="text-muted-foreground text-center text-sm mt-1 leading-relaxed">
                {activeTab === "UPCOMING"
                  ? "Use the chat below to book one!"
                  : "Your past appointments will appear here."}
              </Text>
              {activeTab === "UPCOMING" && (
                <TouchableOpacity
                  className="mt-4 bg-primary px-6 py-2.5 rounded-full"
                  onPress={() => router.push("/(protected)/(tabs)/chat")}
                >
                  <Text className="text-white font-semibold text-sm">
                    Book Now
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default DashboardAppointments;