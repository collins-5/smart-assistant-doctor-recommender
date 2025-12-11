// src/hooks/useUnbookmarkDoctor.ts
import { useMutation } from '@apollo/client';
import {
    UnbookmarkDoctorDocument,
    GetBookmarkedDoctorsDocument,
} from '../graphql/generated/graphql';

export const useUnbookmarkDoctor = () => {
    const [mutate, { loading, error }] = useMutation(UnbookmarkDoctorDocument, {
        // THIS IS EXACTLY WHAT MAKES BOOKMARK WORK → DO THE SAME FOR UNBOOKMARK
        refetchQueries: [{ query: GetBookmarkedDoctorsDocument }],
        awaitRefetchQueries: true, // ← keeps UI perfectly in sync

        // Optional but nice: instant optimistic UI
        optimisticResponse: {
            __typename: 'Mutation',
            unbookmarkDoctor: {
                __typename: 'UnbookmarkDoctor',
                success: true,
                // we don't need the doctor object, just success
            },
        },
    });

    const unbookmark = (doctorId: number | string) => {
        const id = parseInt(String(doctorId), 10);

        return mutate({
            variables: { doctorId: id },
        });
    };

    return { unbookmark, loading, error };
};