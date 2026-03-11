import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useMyAppointments } from "~/lib/hooks/useMyAppointments";
import SkeletonList from "~/components/core/SkeletonList";
import AppointmentCardSkeleton from "~/components/skeletons/appointment-card-skeleton";
import AppointmentTabs, {
  DashboardTabType,
} from "./dashboard-appointment-tabs";
import AppointmentCard from "../appointment/appointment-card";
import { FlashList } from "@shopify/flash-list";

const DashboardAppointments = () => {
  const [activeTab, setActiveTab] = useState<DashboardTabType>("UPCOMING");
  const { appointments, loading: loadingAppointments } = useMyAppointments();

  const filteredAppointments = appointments.filter((a: any) =>
    activeTab === "UPCOMING"
      ? a.status === "UPCOMING" || a.status === "ONGOING"
      : a.status === "COMPLETED"
  );

  const sortedAppointments = [...filteredAppointments].sort(
    (a: any, b: any) => {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    }
  );

  return (
    <View className="mt-2 px-4 mb-8">
      <Text className="text-xl font-bold text-foreground ml-2 mb-2">
        My Appointments
      </Text>

      {/* Tabs */}
      <AppointmentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* FlashList needs height — wrap in flex-1 container */}
      <View className="flex-1 min-h-96">
        {loadingAppointments ? (
          <SkeletonList skeletonComponent={AppointmentCardSkeleton} count={2} />
        ) : sortedAppointments.length > 0 ? (
          <FlashList
            data={sortedAppointments.slice(0, 5)}
            renderItem={({ item }) => <AppointmentCard appointment={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-4" />}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 justify-center items-center py-10">
            <View className="bg-teal-50/70 rounded-3xl p-10 items-center border border-teal-100">
              <Text className="text-foreground text-center text-lg font-medium">
                No {activeTab.toLowerCase()} appointments
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                {activeTab === "UPCOMING"
                  ? "Use the chat below to book one!"
                  : "Your past appointments will appear here."}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default DashboardAppointments;
