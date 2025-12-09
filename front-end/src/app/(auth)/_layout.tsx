import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import ThemeStatusBar from "~/components/core/status-bar";
import View from "~/components/ui/view";

export default function AuthLayout() {
  return (
    <>
     <ThemeStatusBar/>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
    </>
  );
}
