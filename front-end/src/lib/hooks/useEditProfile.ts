// src/lib/hooks/useEditProfile.ts
import { useMutation } from '@apollo/client';
import { EditProfileDocument } from '../graphql/generated/graphql';

type EditProfileInput = {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: string;
    gender?: string;
    email?: string;
    phoneNumber?: string;
    countryId?: string | number | null;  // Accept string from form
    countyId?: string | number | null;    // Accept string from form
    
};

export const useEditProfile = () => {
    const [editProfile, { loading, error, data }] = useMutation(EditProfileDocument);

    const submit = async (input: EditProfileInput) => {
        // Convert string IDs to number before sending to backend
        const variables = {
            input: {
                ...input,
                countryId: input.countryId ? Number(input.countryId) : undefined,
                countyId: input.countyId ? Number(input.countyId) : undefined,
            },
        };

        const result = await editProfile({ variables });
        const response = result.data?.editProfile;

        if (!response?.success) {
            throw new Error(response?.error || 'Failed to update profile');
        }

        return response;
    };

    return {
        submit,
        loading,
        error: error?.message || data?.editProfile?.error,
        success: data?.editProfile?.success || false,
        user: data?.editProfile?.user,
        patient: data?.editProfile?.patient,
    };
};