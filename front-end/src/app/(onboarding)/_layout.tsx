import { Stack } from "expo-router"
import ThemeStatusBar from "~/components/core/status-bar";

export default function OnboardingLayout() {
  return (
    <>
      <ThemeStatusBar />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="create-profile" />
      </Stack>
    </>
  );
}
