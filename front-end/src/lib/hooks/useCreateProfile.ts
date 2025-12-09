// src/lib/hooks/useCreateProfile.ts
import { useMutation } from '@apollo/client';
import { CreatePatientProfileDocument } from '../graphql/generated/graphql';

type CreateProfileInput = {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    gender: string;
    email?: string;
    phoneNumber?: string;
    countryId?: string | number | null;
    countyId?: string | number | null;
};

export const useCreateProfile = () => {
    const [createProfile, { loading, error, data }] = useMutation(CreatePatientProfileDocument);

    const submit = async (input: CreateProfileInput) => {
        const variables = {
            input: {
                firstName: input.firstName,
                lastName: input.lastName,
                middleName: input.middleName || undefined,
                dateOfBirth: input.dateOfBirth,
                gender: input.gender,
                email: input.email || undefined,
                phoneNumber: input.phoneNumber || undefined,
                countryId: input.countryId ? Number(input.countryId) : undefined,
                countyId: input.countyId ? Number(input.countyId) : undefined,
            },
        };

        const result = await createProfile({ variables });
        const response = result.data?.createPatientProfile;

        if (!response?.success) {
            throw new Error(response?.error || 'Failed to create profile');
        }
        return response;
    };

    return {
        submit,
        loading,
        error: error?.message || data?.createPatientProfile?.error,
        success: data?.createPatientProfile?.success || false,
        user: data?.createPatientProfile?.user,
        patient: data?.createPatientProfile?.patient,
    };
};