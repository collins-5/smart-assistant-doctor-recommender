import { Redirect } from "expo-router";
import { View, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { useSessionInit } from "~/components/core/session-initializer";

export default function OnboardingIndex() {
  const { loading } = useSessionInit();

  if (loading) {
    return (
      <View className="flex-1">
        <Image
          className="flex-1 w-full"
          resizeMode="cover"
          source={require("assets/splash-icon.png")}
        />
        <View className="absolute inset-0 items-center justify-center">
          <Image
            source={require("assets/sdr-logo.jpg")}
            className="w-24 h-24 rounded-2xl border-2 border-white/30"
            resizeMode="contain"
          />
          <Text className="font-bold text-2xl text-white mt-4 tracking-wide">
            SDR Health
          </Text>
          <Text className="text-white/70 text-xs mt-1 tracking-widest uppercase">
            Your Smart Doctor Assistant
          </Text>
        </View>

        <View className="absolute bottom-5 self-center">
          <Text className="font-bold text-xl italic text-primary-foreground">
            powered by Android
          </Text>
        </View>
      </View>
    );
  }

  return <Redirect href="/(onboarding)/welcome" />;
}