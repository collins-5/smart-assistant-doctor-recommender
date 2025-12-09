import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function ProtectedLayout() {
  return (
    <>
    <StatusBar backgroundColor={'teal'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(profiles)" />
      </Stack>
    </>
  );
}
