// src/hooks/useDoctor.ts
import { useQuery } from '@apollo/client';
import { GetDoctorDocument } from '../graphql/generated/graphql';

export const useDoctor = (id: number) => {
    const { data, loading, error, refetch } = useQuery(GetDoctorDocument, {
        variables: { id },
        fetchPolicy: 'cache-and-network', // Get cached version instantly + fetch fresh
        skip: !id || isNaN(id), // Don't run query if no valid id
    });

    console.log('Availabilities:', JSON.stringify(data?.doctor?.availabilities, null, 2));

    return {
        doctor: data?.doctor || null,
        loading,
        error,
        refetch,
    };
};