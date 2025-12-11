// src/lib/hooks/useProfile.ts
import { useEffect } from 'react';
import { useProfileQuery } from '~/lib/graphql/generated/graphql';
import { useSessionStore } from '~/lib/store/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';

export const useProfile = () => {
    const jwt = useSessionStore((s) => s.session?.jwt);
    const { refetch: refetchTrigger } = useLocalSearchParams(); // ← Detects our trigger
    const router = useRouter();

    const { data, loading, error, refetch } = useProfileQuery({
        fetchPolicy: 'cache-and-network', // ← Critical: always check server
        skip: !jwt,
        context: {
            headers: {
                Authorization: jwt ? `Bearer ${jwt}` : '',
            },
        },
    });

    // THIS IS THE KEY: Force refetch when we navigate with ?refetch=...
    useEffect(() => {
        if (refetchTrigger) {
            console.log('useProfile: Refetch triggered by navigation param');
            refetch(); // Pull fresh data from server

            // Clean URL after 1 second (optional, keeps URL clean)
            const timer = setTimeout(() => {
                router.setParams({ refetch: undefined });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [refetchTrigger, refetch, router]);

    useEffect(() => {
        if (data) {
            console.log('useProfile: SUCCESS →', data.me);
        }
        if (error) {
            console.log('useProfile: ERROR →', error.message);
        }
    }, [data, error]);

    // Early returns
    if (!jwt) {
        return { profile: null, loading: true, refetch, error: null };
    }

    if (loading && !data) {
        return { profile: null, loading: true, refetch, error: null };
    }

    if (error || !data?.me) {
        return { profile: null, loading: false, refetch, error };
    }

    const user = data.me;
    const patient = user.patient;

    const profile = {
        userId: Number(user.id),
        email: user.email || patient?.email || '',
        phoneNumber: user.phoneNumber || patient?.phoneNumber || '',
        firstName: patient?.firstName || user.firstName || '',
        lastName: patient?.lastName || user.lastName || '',
        middleName: patient?.middleName || null,
        fullName: `${patient?.firstName || user.firstName || ''} ${patient?.lastName || user.lastName || ''}`.trim(),

        profilePictureUrl: patient?.profilePictureUrl || null,
        patientId: patient?.id ? Number(patient.id) : null,

        gender: patient?.gender || null,
        dateOfBirth: patient?.dateOfBirth || null,

        countryId: patient?.country?.id ? Number(patient.country.id) : null,
        countryName: patient?.country?.name || null,

        countyId: patient?.county?.id ? Number(patient.county.id) : null,
        countyName: patient?.county?.name || null,
    };

    return { profile, loading: false, refetch, error: null };
};