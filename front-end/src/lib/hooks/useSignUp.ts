
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SignUpDocument } from '../graphql/generated/graphql';

export const useSignUp = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const [signUp, { loading, error, data }] = useMutation(SignUpDocument);

  const submit = async () => {
    console.log('SIGN UP STARTED');
    console.log('Email:', email);
    console.log('Phone:', phoneNumber);
    console.log('Password:', password ? '••••••••' : '');

    if (!email || !phoneNumber || !password) {
      console.log('VALIDATION FAILED: Missing fields');
      throw new Error("Please fill all fields");
    }

    try {
      const result = await signUp({
        variables: {
          email,
          phoneNumber,
          password,
          // These will be asked later in profile setup
          firstName: "Temp",     // temporary
          lastName: "User",
          dateOfBirth: "2000-01-01",
          gender: "O",
        },
      });

      const response = result.data?.signUp;

      if (!response?.success) {
        console.log('SIGN UP FAILED:', response?.error || 'Unknown error');
        throw new Error(response?.error || "Sign up failed");
      }

      console.log('SIGN UP SUCCESS!');
      console.log('User ID:', response.user.id);
      console.log('Email:', response.user.email);
      console.log('Phone:', response.user.phoneNumber);
      console.log('Patient ID (temp):', response.patient?.id);

      return response;
    } catch (err: any) {
      console.log('SIGN UP ERROR:', err.message);
      throw err;
    }
  };

  return {
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
  };
};