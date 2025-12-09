// src/lib/hooks/useSignUp.ts
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SignUpDocument } from '../graphql/generated/graphql';
import { useSessionStore } from '~/lib/store/auth';

export const useSignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const setSession = useSessionStore((state) => state.setSession);

  const [signUp, { loading, error, data }] = useMutation(SignUpDocument);

  const submit = async () => {
    if (!username.trim() || !email.trim() || !phoneNumber.trim() || !password) {
      throw new Error('Please fill all fields');
    }

    const result = await signUp({
      variables: {
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        password,
      },
    });

    const response = result.data?.signUp;

    if (!response?.success) {
      throw new Error(response?.error || 'Sign up failed');
    }

    // AUTO LOGIN — Save session immediately
    setSession({
      jwt: response.jwtToken!,
      userId: Number(response.user.id),
      // username: response.user.username,
      email: response.user.email,
      phoneNumber: response.user.phoneNumber,
      // These will be filled in create-profile step
      firstName: '',
      lastName: '',
      profileId: null,
      isPhoneNumberVerified: false,
      isEmailVerified: false,
    });

    return response;
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    submit,
    loading,
    error: error?.message,
    success: data?.signUp?.success,
    user: data?.signUp?.user,
    jwtToken: data?.signUp?.jwtToken,
  };
};