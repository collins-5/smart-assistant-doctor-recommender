// src/lib/hooks/useSignIn.ts
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useSessionStore } from '../store/auth';
import { SignInDocument } from '../graphql/generated/graphql';

export const useSignIn = () => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const setSession = useSessionStore(s => s.setSession);
    const setLoadingSession = useSessionStore(s => s.setLoadingSession); // ← ADD THIS

    const [signIn, { loading, error, data }] = useMutation(SignInDocument);

    const submit = async () => {
        
        if (!emailOrPhone || !password) {
            throw new Error("Please enter email/phone and password");
        }

        try {
            const result = await signIn({
                variables: { emailOrPhoneNumber: emailOrPhone, password },
            });

            const response = result.data?.signIn;
            if (!response?.jwtToken || !response.user) {
                throw new Error("Invalid credentials");
            }

            const { jwtToken, user } = response;

            // Save session
            setSession({
                jwt: jwtToken,
                userId: Number(user.id),
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                profileId: user.patient?.id ? Number(user.patient.id) : null,
                isPhoneNumberVerified: false,
                isEmailVerified: false,
                firstName: user.patient?.firstName || '',
                lastName: user.patient?.lastName || '',
            });

            setLoadingSession?.(true);

            return { jwtToken, user };
        } catch (err: any) {
            console.log('SIGN IN ERROR:', err.message);
            throw err;
        }
    };

    return {
        emailOrPhone,
        setEmailOrPhone,
        password,
        setPassword,
        submit,
        loading,
        error: error?.message,
        jwtToken: data?.signIn?.jwtToken,
        user: data?.signIn?.user,
    };
};