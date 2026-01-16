// src/components/auth/GoogleSignInButton.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";

import {
  GoogleSignInDocument,
  GoogleSignInMutation,
  GoogleSignInMutationVariables,
} from "@/lib/graphql/generated/graphql";

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  style?: object;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  style,
}) => {
  const [googleSignInMutation, { loading }] = useMutation<
    GoogleSignInMutation,
    GoogleSignInMutationVariables
  >(GoogleSignInDocument);

  const handleGoogleSignIn = async () => {
    try {
      // 1. Ensure Play Services are available
      await GoogleSignin.hasPlayServices();

      // 2. Trigger native Google Sign-In
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.idToken) {
        throw new Error("No ID token received from Google");
      }

      // 3. Send ID token to your backend
      const { data } = await googleSignInMutation({
        variables: { idTokenStr: userInfo.idToken },
      });

      const result = data?.googleSignIn;

      if (!result?.success) {
        throw new Error(result?.error || "Login failed on server");
      }

      const { token, user } = result;

      if (!token) {
        throw new Error("No authentication token received from server");
      }

      // 4. Store token securely
      await SecureStore.setItemAsync("jwt_token", token);

      // Optional: store basic user info
      if (user?.email) {
        await SecureStore.setItemAsync("user_email", user.email);
      }

      // Success feedback
      Alert.alert(
        "Success",
        `Welcome${user?.firstName ? `, ${user.firstName}` : ""}!`
      );

      onSuccess?.();
    } catch (error: any) {
      console.error("Google Sign-In failed:", error);

      let message = "Something went wrong during Google Sign-In";

      // Safely check error.code (prevents undefined crash)
      if (error?.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            message = "Sign in was cancelled";
            break;
          case statusCodes.IN_PROGRESS:
            message = "Sign in already in progress";
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            message = "Google Play Services not available on this device";
            break;
          default:
            message = error.message || "Unknown error";
        }
      } else {
        message = error.message || message;
      }

      Alert.alert("Error", message);
      onError?.(message);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled, style]}
      onPress={handleGoogleSignIn}
      disabled={loading}
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
