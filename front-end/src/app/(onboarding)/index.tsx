import { Redirect } from "expo-router";
import { View, Image } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Text } from "~/components/ui/text";
import { useSessionInit } from "~/components/core/session-initializer";

export default function OnboardingIndex() {
  const { loading } = useSessionInit();

  if (!loading) {
    return (
      <View className="flex-1">
        <Image
          className="flex-1 w-full"
          resizeMode="cover"
          source={require("assets/splash-icon.png")}
        />
        <View className="absolute top-0 left-0 right-0 h-1/2 items-center justify-center">
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

        <View className="absolute bottom-5 self-center flex-row items-center gap-2">
          <Text className="font-bold text-base italic text-primary-foreground">
            powered by
          </Text>
          <ExpoImage
            source={require("assets/gemini-color.svg")}
            style={{ width: 20, height: 20 }}
            contentFit="contain"
          />
          <Text className="font-bold text-base italic text-primary-foreground">
            Gemini
          </Text>
        </View>
      </View>
    );
  }

  return <Redirect href="/(onboarding)/welcome" />;
}