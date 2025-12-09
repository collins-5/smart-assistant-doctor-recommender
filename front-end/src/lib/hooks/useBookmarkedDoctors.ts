// src/hooks/useBookmarkedDoctors.ts

import { useQuery } from '@apollo/client';
import { GetBookmarkedDoctorsDocument } from '../graphql/generated/graphql';

export const useBookmarkedDoctors = () => {
    const { data, loading, error, refetch } = useQuery(GetBookmarkedDoctorsDocument, {
        fetchPolicy: 'cache-and-network', // same as useDoctors
    });

    return {
        doctors: data?.bookmarkedDoctors || [],
        loading,
        error,
        refetch,
    };
};