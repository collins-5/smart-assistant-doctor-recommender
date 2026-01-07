import { Animated } from "react-native";
import { useRef } from "react";
import View from "~/components/ui/view";
import Header from "~/components/Dashboard/header";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { useDoctors } from "~/lib/hooks/useDoctors";
import { useSpecialties } from "~/lib/hooks/useSpecialties";
import { FlashList } from "@shopify/flash-list";
import DashboardAppointments from "~/components/Dashboard/dashboard-appointments";
import DoctorCard from "./dashboard-doctor-card";
import DoctorSkeleton from "./doctor-skeleton";
import SpecialtyCard from "./specialty-card";
import SpecialtySkeleton from "./specialty-skeleton";
import DashbordChatButton from "./dashbord-chat-button";

export default function Dashboard() {
  const { allDoctors: doctors, loading: loadingDoctors } = useDoctors();
  const { specialties, loading: loadingSpecialties } = useSpecialties();

  const goToDoctorProfile = (doctorId: number) => {
    router.push({
      pathname: "/(protected)/doctors/[id]",
      params: { id: doctorId.toString() },
    });
  };

  return (
    <>
      <Header unreadCount={7} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="mt-2 px-6">
          <Text className="text-xl font-bold text-foreground mb-1">
            Popular Specialties
          </Text>
          <FlashList
            data={loadingSpecialties ? Array(6).fill({}) : specialties}
            renderItem={
              loadingSpecialties
                ? () => <SpecialtySkeleton />
                : ({ item }) => <SpecialtyCard specialty={item} />
            }
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View className="mt-10 px-6">
          <Text className="text-xl font-bold text-foreground mb-1">
            Recent Doctors
          </Text>
          <FlashList
            data={loadingDoctors ? Array(4).fill({}) : doctors.slice(0, 8)}
            renderItem={
              loadingDoctors
                ? () => <DoctorSkeleton />
                : ({ item }) => (
                    <DoctorCard doctor={item} onPress={goToDoctorProfile} />
                  )
            }
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <DashboardAppointments />
      </Animated.ScrollView>
      <DashbordChatButton />
    </>
  );
}
