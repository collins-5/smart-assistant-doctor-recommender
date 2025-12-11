// src/lib/hooks/useUploadProfilePicture.ts
import { useMutation } from '@apollo/client';
import { UploadProfilePictureDocument } from '../graphql/generated/graphql';

export type UploadProfilePictureResult = {
    success: boolean;
    error: string | null;
    patient: { id: string; profilePictureUrl: string | null } | null;
};

export const useUploadProfilePicture = () => {
    const [mutate, { loading, error, data }] = useMutation(UploadProfilePictureDocument);

    const upload = async (asset: any): Promise<UploadProfilePictureResult> => {
        console.log('RAW ASSET →', asset);

        if (!asset?.uri) throw new Error('No file selected');

        // Build the exact shape Django expects
        const fileForBackend = {
            uri: asset.uri,
            name: asset.fileName ?? `photo-${Date.now()}.jpg`, // <-- THIS IS CRITICAL
            type: asset.mimeType ?? 'image/jpeg',
        };

        console.log('SENDING TO BACKEND →', fileForBackend);

        const result = await mutate({ variables: { file: fileForBackend } });
        console.log('BACKEND RESPONSE →', result);

        const response = result.data?.uploadProfilePicture;
        if (!response?.success) {
            const msg = response?.error || 'Upload failed';
            console.error('SERVER ERROR →', msg);
            throw new Error(msg);
        }

        console.log('SUCCESS! New URL →', response.patient?.profilePictureUrl);
        return response;
    };

    return {
        upload,
        loading,
        error: error?.message || data?.uploadProfilePicture?.error || null,
        success: data?.uploadProfilePicture?.success ?? false,
        patient: data?.uploadProfilePicture?.patient ?? null,
        profilePictureUrl: data?.uploadProfilePicture?.patient?.profilePictureUrl ?? null,
    };
};