// src/hooks/useGoogleSignIn.ts
import { useMutation } from '@apollo/client';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store'; // or use your preferred secure storage
import { Alert } from 'react-native';
import { useCallback } from 'react';

// Import your generated mutation and types
import {
    GoogleSignInDocument,
    GoogleSignInMutation,
    GoogleSignInMutationVariables,
} from '@/lib/graphql/generated/graphql'; // adjust path according to your codegen output

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

    const signInWithGoogle = useCallback(async () => {
        try {
            // 1. Ensure Google Play Services are available
            await GoogleSignin.hasPlayServices();

            // 2. Trigger native Google Sign-In
            const userInfo = await GoogleSignin.signIn();

            if (!userInfo.idToken) {
                throw new Error('No ID token received from Google Sign-In');
            }

            // 3. Send ID token to your GraphQL backend
            const response = await googleSignInMutation({
                variables: {
                    idTokenStr: userInfo.idToken,
                },
            });

            const result = response.data?.googleSignIn;

            if (!result?.success) {
                throw new Error(result?.error || 'Google sign in failed on server');
            }

            const { token, user } = result;

            if (!token) {
                throw new Error('No authentication token received from server');
            }

            // 4. Store JWT securely
            await SecureStore.setItemAsync('jwt_token', token);

            // Optional: store basic user info if needed
            if (user?.email) {
                await SecureStore.setItemAsync('user_email', user.email);
            }

            // Success feedback
            Alert.alert(
                'Welcome!',
                `Signed in as ${user?.firstName || user?.email || 'User'}`,
                [{ text: 'OK' }]
            );

            return {
                success: true,
                token,
                user: user ?? null,
            };
        } catch (err: any) {
            console.error('[Google Sign-In Error]:', err);

            let message = 'Something went wrong during Google Sign-In';

            if (err.code === GoogleSignin.statusCodes.SIGN_IN_CANCELLED) {
                message = 'Sign in was cancelled';
            } else if (err.code === GoogleSignin.statusCodes.IN_PROGRESS) {
                message = 'Sign in already in progress';
            } else if (err.code === GoogleSignin.statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                message = 'Google Play Services not available on this device';
            } else {
                message = err.message || message;
            }

            Alert.alert('Sign In Failed', message);

            return {
                success: false,
                error: message,
            };
        }
    }, [googleSignInMutation]);

    return {
        signInWithGoogle,
        loading,
        error: error?.message || null,
        data: data?.googleSignIn ?? null,
    };
};