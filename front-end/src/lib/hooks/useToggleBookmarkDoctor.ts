// ~/lib/hooks/useToggleBookmarkDoctor.ts
import { useMutation } from '@apollo/client';
import {
    BookmarkDoctorDocument,
    UnbookmarkDoctorDocument,
} from '../graphql/generated/graphql';
import { GetBookmarkedDoctorsDocument } from '../graphql/generated/graphql';

export const useToggleBookmarkDoctor = () => {
    const [bookmark] = useMutation(BookmarkDoctorDocument, {
        refetchQueries: [{ query: GetBookmarkedDoctorsDocument }],
    });

    const [unbookmark] = useMutation(UnbookmarkDoctorDocument, {
        refetchQueries: [{ query: GetBookmarkedDoctorsDocument }],
    });

    const toggle = async (doctorId: number, isCurrentlyBookmarked: boolean) => {
        if (isCurrentlyBookmarked) {
            await unbookmark({ variables: { doctorId } });
        } else {
            await bookmark({ variables: { doctorId } });
        }
    };

    return { toggle };
};