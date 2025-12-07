import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import { ScreenWrapper } from "~/components/core/screen-wrapper";

export default function OnboardingLayout() {
  return (
    <>
    <StatusBar backgroundColor={'teal'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="create-profile" />
      </Stack>
    </>
  );
}
