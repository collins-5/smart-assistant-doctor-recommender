// Dashboard.tsx
import { Animated } from "react-native";
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
import { TouchableOpacity } from "react-native";

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
      <Header />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="bg-background"
      >

        {/* Specialties Section */}
        <View className="mt-5 px-5">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-xs font-semibold text-primary uppercase tracking-widest">
                Browse
              </Text>
              <Text className="text-xl font-bold text-foreground">
                Popular Specialties
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(protected)/doctors/doctors")}
              className="bg-primary/10 px-3 py-1.5 rounded-full"
            >
              <Text className="text-primary text-xs font-semibold">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <FlashList
            data={loadingSpecialties ? Array(6).fill({}) : specialties}
            renderItem={
              loadingSpecialties
                ? () => <SpecialtySkeleton />
                : ({ item }) => (
                    <View className="mr-3">
                      <SpecialtyCard specialty={item} />
                    </View>
                  )
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 4 }}
          />
        </View>

        {/* Divider */}
        <View className="mx-5 mt-6 mb-1 h-px bg-border/50" />

        {/* Doctors Section */}
        <View className="mt-5 px-5">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-xs font-semibold text-primary uppercase tracking-widest">
                Discover
              </Text>
              <Text className="text-xl font-bold text-foreground">
                Top Doctors
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(protected)/doctors/doctors")}
              className="bg-primary/10 px-3 py-1.5 rounded-full"
            >
              <Text className="text-primary text-xs font-semibold">
                See All
              </Text>
            </TouchableOpacity>
          </View>

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
            contentContainerStyle={{ paddingVertical: 4 }}
          />
        </View>

        <View className="mx-5 mt-6 mb-1 h-px bg-border/50" />

        <DashboardAppointments />

      </Animated.ScrollView>

      <DashbordChatButton />
    </>
  );
}