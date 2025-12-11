// ~/lib/hooks/useRemoveProfilePicture.ts
import { useMutation } from '@apollo/client';
import { RemoveProfilePictureDocument } from '~/lib/graphql/generated/graphql';

export const useRemoveProfilePicture = () => {
    const [removeProfilePicture, { loading, error, data }] = useMutation(
        RemoveProfilePictureDocument
    );

    const remove = async (): Promise<{
        success: boolean;
        error?: string;
        patient?: {
            id: string;
            profilePictureUrl?: string | null;
        };
    }> => {
        try {
            const result = await removeProfilePicture();

            const response = result.data?.removeProfilePicture;

            if (!response?.success) {
                throw new Error(response?.error || 'Failed to remove profile picture');
            }

            return {
                success: response.success,
                error: response.error || undefined,
                patient: response.patient || undefined,
            };
        } catch (err: any) {
            throw new Error(err.message || 'An error occurred');
        }
    };

    return {
        remove,
        loading,
        error: error?.message || data?.removeProfilePicture?.error,
        success: data?.removeProfilePicture?.success || false,
        patient: data?.removeProfilePicture?.patient,
    };
};