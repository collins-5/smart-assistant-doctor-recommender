// src/hooks/useGoogleSignIn.ts
import { useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

// Import your generated mutation and types
import {
  GoogleSignInDocument,
  GoogleSignInMutation,
  GoogleSignInMutationVariables,
} from "@/lib/graphql/generated/graphql";

WebBrowser.maybeCompleteAuthSession();

/**
 * Custom hook for handling Google Sign-In flow
 * - Triggers Google Sign-In
 * - Sends ID token to backend
 * - Stores JWT securely
 * - Returns loading/error states
 */
export const useGoogleSignIn = () => {
  const [googleSignInMutation, { loading, error, data }] = useMutation<
    GoogleSignInMutation,
    GoogleSignInMutationVariables
  >(GoogleSignInDocument);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const signInWithGoogle = useCallback(async () => {
    try {
      if (!request) throw new Error("Google sign-in is not configured.");

      const result = await promptAsync();
      if (result.type !== "success") {
        return { success: false, error: "Google sign-in was cancelled." };
      }

      const idToken = result.params?.id_token;
      if (!idToken) throw new Error("No ID token received from Google.");

      const response = await googleSignInMutation({
        variables: { idTokenStr: idToken },
      });

      const serverResult = response.data?.googleSignIn;
      if (!serverResult?.success || !serverResult.token) {
        throw new Error(serverResult?.error || "Google sign-in failed on server");
      }

      await SecureStore.setItemAsync("jwt_token", serverResult.token);
      if (serverResult.user?.email) {
        await SecureStore.setItemAsync("user_email", serverResult.user.email);
      }

      Alert.alert("Welcome!", `Signed in as ${serverResult.user?.firstName || serverResult.user?.email || "User"}`, [
        { text: "OK" },
      ]);

      return { success: true, token: serverResult.token, user: serverResult.user ?? null };
    } catch (err: any) {
      const message = err?.message || "Something went wrong during Google Sign-In";
      Alert.alert("Sign In Failed", message);
      return { success: false, error: message };
    }
  }, [googleSignInMutation, promptAsync, request]);

  return {
    signInWithGoogle,
    loading,
    error: error?.message || null,
    data: data?.googleSignIn ?? null,
    googleRequestReady: !!request,
    lastAuthResponse: response,
  };
};