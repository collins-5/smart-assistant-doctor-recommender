// src/hooks/useBookmarkDoctor.ts — CLEANEST & RECOMMENDED VERSION
import { useMutation } from '@apollo/client';
import { BookmarkDoctorDocument, GetBookmarkedDoctorsDocument } from '../graphql/generated/graphql';

export const useBookmarkDoctor = () => {
    const [mutate, { loading, error }] = useMutation(BookmarkDoctorDocument, {
        // Let Apollo handle cache automatically — it's smarter than us
        refetchQueries: [{ query: GetBookmarkedDoctorsDocument }],
        awaitRefetchQueries: true,
    });

    const bookmark = (doctorId: number | string) => {
        const id = parseInt(String(doctorId), 10);

        return mutate({
            variables: { doctorId: id },
            optimisticResponse: {
                __typename: 'Mutation',
                bookmarkDoctor: {
                    __typename: 'BookmarkDoctor',
                    success: true,
                    doctor: {
                        __typename: 'DoctorType',
                        id,
                        fullName: 'Dr. Loading...',
                    },
                },
            },
        });
    };

    return { bookmark, loading, error };
};