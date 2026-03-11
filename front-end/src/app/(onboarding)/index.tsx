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