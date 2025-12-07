// src/lib/hooks/useSignIn.ts
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useSessionStore } from '../store/auth';
import { SignInDocument } from '../graphql/generated/graphql';

export const useSignIn = () => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const setSession = useSessionStore(s => s.setSession);

    const [signIn, { loading, error, data }] = useMutation(SignInDocument);

    const submit = async () => {
        console.log('SIGN IN ATTEMPT STARTED');
        console.log('Email/Phone:', emailOrPhone);
        console.log('Password:', password ? '••••••••' : '');

        if (!emailOrPhone || !password) {
            console.log('VALIDATION FAILED: Missing fields');
            throw new Error("Please enter email/phone and password");
        }

        try {
            console.log('CALLING GraphQL signIn mutation...');
            const result = await signIn({
                variables: {
                    emailOrPhoneNumber: emailOrPhone,
                    password,
                },
            });

            console.log('RESPONSE RECEIVED:', result);

            const response = result.data?.signIn;

            if (!response?.jwtToken || !response.user) {
                console.log('LOGIN FAILED: Invalid credentials');
                throw new Error("Invalid credentials");
            }

            const { jwtToken, user } = response;

            console.log('LOGIN SUCCESS!');
            console.log('JWT Token:', jwtToken.substring(0, 20) + '...');
            console.log('User ID:', user.id);
            console.log('Email:', user.email);
            console.log('Phone:', user.phoneNumber);
            console.log('Patient ID:', user.patient?.id);

            // Save to store
            setSession({
                jwt: jwtToken,
                userId: Number(user.id),
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                profileId: user.patient?.id ? Number(user.patient.id) : null,
                isPhoneNumberVerified: false,
                isEmailVerified: false,
            });

            console.log('SESSION SAVED TO ZUSTAND STORE');

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