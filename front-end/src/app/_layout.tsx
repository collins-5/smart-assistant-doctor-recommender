// app/_layout.tsx

import "../../global.css";
import "~/components/ui/bottom-sheets";

import { ApolloProvider } from "@apollo/client";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SheetProvider } from "react-native-actions-sheet";
import { useEffect } from "react";

import client from "~/lib/graphql/apolloClient";
import SessionInitializer, {
  useSessionInit,
} from "~/components/core/session-initializer";
import Constants from "expo-constants"; 
import { useOnboardingStore } from "~/lib/store/onboarding";
import { useSessionStore } from "~/lib/store/auth";
import { DoctorsFilterProvider } from "~/lib/context/DoctorsFilterContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";


useEffect(() => {
  GoogleSignin.configure({
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
    // Optional: if you need server auth code / refresh token later
    // offlineAccess: true,
    // forceCodeForRefreshToken: true,
  });
}, []); // runs only once on mount



// This component controls navigation based on auth state
const AuthNavigator = () => {
  const router = useRouter();
  const segments = useSegments();

  const { loading } = useSessionInit();
  const { isAuthenticated } = useSessionStore();
  const { isOnboarded } = useOnboardingStore();

  useEffect(() => {
    if (loading) return; // Wait for session verification

    const currentGroup = segments[0]; // "(protected)", "(auth)", "(onboarding)"

    if (isAuthenticated) {
      // Must be in protected area
      if (currentGroup !== "(protected)") {
        router.replace("/(protected)/(tabs)/dashboard");
      }
    } else {
      // Not authenticated → go to onboarding or auth
      if (!isOnboarded) {
        if (currentGroup !== "(onboarding)") {
          router.replace("/(onboarding)/welcome");
        }
      } else {
        if (currentGroup !== "(auth)") {
          router.replace("/(auth)/sign-in");
        }
      }
    }
  }, [loading, isAuthenticated, isOnboarded, segments, router]);

  // Render nothing — we control navigation via router.replace
  return null;
};

// Root Layout — clean, simple, just defines the routes
export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DoctorsFilterProvider>
          <SheetProvider>
            <SessionInitializer>
              {/* Define all route groups */}
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(onboarding)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(protected)" />
                {/* Add any other top-level routes here */}
              </Stack>

              {/* This controls the actual navigation */}
              <AuthNavigator />
            </SessionInitializer>
          </SheetProvider>
        </DoctorsFilterProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}
