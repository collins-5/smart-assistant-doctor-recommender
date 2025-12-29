// src/lib/hooks/useDoctors.ts
import { useQuery } from '@apollo/client';
import { useState, useMemo } from 'react';
import { useDoctorsFilter } from "~/lib/context/DoctorsFilterContext";
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
    const { filters } = useDoctorsFilter();

    const doctors = useMemo(() => {
        let result = allDoctors;

        // Text Search
        if (searchQuery.trim()) {
            const queryWords = searchQuery
                .toLowerCase()
                .trim()
                .replace(/[,]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 0);

            result = result.filter(doctor => {
                if (!doctor) return false;

                const text = [
                    doctor.firstName,
                    doctor.lastName,
                    doctor.fullName,
                    doctor.primarySpecialty?.name,
                    doctor.county?.name,
                    doctor.county?.country?.name,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                return queryWords.every(word => text.includes(word));
            });
        }

        // Advanced Filters (including new location filters)
        result = result.filter(doctor => {
            if (!doctor) return false;

            // Specialty
            if (filters.specialtyId && doctor.primarySpecialty?.id !== filters.specialtyId)
                return false;

            // Price
            const price = doctor.teleconsultPrice ?? doctor.clinicVisitPrice ?? doctor.homecarePrice ?? 0;
            if (price < filters.priceRange[0] || price > filters.priceRange[1])
                return false;

            // Availability
            if (filters.availability) {
                if (filters.availability === "online" && doctor.teleconsultPrice === null) return false;
                if (filters.availability === "clinic" && doctor.clinicVisitPrice === null) return false;
                if (filters.availability === "home" && doctor.homecarePrice === null) return false;
            }

            // Country
            if (filters.countryName && doctor.county?.country?.name !== filters.countryName)
                return false;

            // County
            if (filters.countyName && doctor.county?.name !== filters.countyName)
                return false;

            return true;
        });

        return result;
    }, [allDoctors, searchQuery, filters]);

    return {
        doctors,
        loading,
        error,
        refetch,
        searchQuery,
        setSearchQuery,
        filters, 
    };
};