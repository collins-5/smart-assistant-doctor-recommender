// src/hooks/useDoctors.ts
import { useQuery } from '@apollo/client';
import { GetDoctorsDocument, GetSpecialtiesDocument } from '../graphql/generated/graphql';

export const useDoctors = () => {
    const { data, loading, error, refetch } = useQuery(GetDoctorsDocument, {
        fetchPolicy: 'cache-and-network', // Recommended: gets from cache + fresh data
    });


    return {
        doctors: data?.doctors || [],
        loading,
        error,
        refetch, // ← Now you can manually refresh doctors anytime
    };
};

export const useSpecialties = () => {
    const { data, loading, error, refetch } = useQuery(GetSpecialtiesDocument, {
        fetchPolicy: 'cache-first',
    });

    return {
        specialties: data?.specialties || [],
        loading,
        error,
        refetch,
    };
};