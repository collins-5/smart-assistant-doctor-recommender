// src/lib/hooks/useDoctors.ts

import { useQuery } from '@apollo/client';
import { useState, useMemo } from 'react';
import {
    GetDoctorsDocument,
    GetSpecialtiesDocument,
} from '~/lib/graphql/generated/graphql';
import type { GetDoctorsQuery } from '~/lib/graphql/generated/graphql';

export type Doctor = NonNullable<GetDoctorsQuery['doctors']>[number];

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

export const useDoctors = () => {
    const { data, loading, error, refetch } = useQuery(GetDoctorsDocument, {
        fetchPolicy: 'cache-and-network',
    });

    const allDoctors: Doctor[] = data?.doctors || [];

    const [searchQuery, setSearchQuery] = useState('');

    const doctors = useMemo(() => {
        if (!searchQuery.trim()) return allDoctors;

        const queryWords = searchQuery
            .toLowerCase()
            .trim()
            .replace(/[,]/g, '') // Remove commas: "siaya, kenya" → "siaya kenya"
            .split(/\s+/)
            .filter(word => word.length > 0);

        if (queryWords.length === 0) return allDoctors;

        return allDoctors.filter((doctor) => {
            if (!doctor) return false;

            const nameParts = [
                doctor.firstName,
                doctor.lastName,
                doctor.fullName,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            const specialty = doctor.primarySpecialty?.name?.toLowerCase() || '';
            const county = doctor.county?.name?.toLowerCase() || '';
            const country = doctor.county?.country?.name?.toLowerCase() || '';

            // Combine all searchable text for this doctor
            const doctorText = `${nameParts} ${specialty} ${county} ${country}`;

            // EVERY query word must appear somewhere in the doctor's text
            return queryWords.every(word => doctorText.includes(word));
        });
    }, [allDoctors, searchQuery]);

    return {
        doctors, // filtered by name, specialty, county, country
        loading,
        error,
        refetch,
        searchQuery,
        setSearchQuery,
    };
};