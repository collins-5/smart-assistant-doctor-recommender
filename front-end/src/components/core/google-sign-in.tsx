import React, { useEffect } from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";

import {
  GoogleSignInDocument,
  GoogleSignInMutation,
  GoogleSignInMutationVariables,
} from "@/lib/graphql/generated/graphql";

WebBrowser.maybeCompleteAuthSession();

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  style?: object;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess, onError, style }) => {
  const [googleSignInMutation, { loading: backendLoading }] = useMutation<
    GoogleSignInMutation,
    GoogleSignInMutationVariables
  >(GoogleSignInDocument);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    (async () => {
      if (response?.type !== "success") return;

      const idToken = response.params?.id_token;
      if (!idToken) {
        const msg = "No ID token received from Google.";
        Alert.alert("Error", msg);
        onError?.(msg);
        return;
      }

      try {
        const { data } = await googleSignInMutation({
          variables: { idTokenStr: idToken },
        });

        const result = data?.googleSignIn;
        if (!result?.success || !result.token) {
          throw new Error(result?.error || "Google sign-in failed on server.");
        }

        await SecureStore.setItemAsync("jwt_token", result.token);
        if (result.user?.email) {
          await SecureStore.setItemAsync("user_email", result.user.email);
        }

        Alert.alert("Success", `Welcome${result.user?.firstName ? `, ${result.user.firstName}` : ""}!`);
        onSuccess?.();
      } catch (e: any) {
        const msg = e?.message || "Google sign-in failed.";
        Alert.alert("Error", msg);
        onError?.(msg);
      }
    })();
  }, [response, googleSignInMutation, onError, onSuccess]);

  const loading = backendLoading;

  return (
    <TouchableOpacity
      style={[styles.button, (loading || !request) && styles.buttonDisabled, style]}
      onPress={() => promptAsync()}
      disabled={loading || !request}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text style={styles.buttonText}>Continue with Google</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#7ca9f5",
    opacity: 0.8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GoogleSignInButton;
