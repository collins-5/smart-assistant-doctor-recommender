import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import ThemeStatusBar from "~/components/core/status-bar";

export default function ProtectedLayout() {
  return (
    <>
    <ThemeStatusBar/>
      <HeaderSafeAreaView />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="edit-profile" />
      </Stack>
    </>
  );
}
