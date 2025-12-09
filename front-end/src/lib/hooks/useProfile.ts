// src/lib/hooks/useProfile.ts
import { useEffect } from 'react';
import { useProfileQuery } from '~/lib/graphql/generated/graphql';
import { useSessionStore } from '~/lib/store/auth';

export const useProfile = () => {
    const jwt = useSessionStore((s) => s.session?.jwt);

    console.log('useProfile: Sending JWT with query →', !!jwt);

    const { data, loading, error, refetch } = useProfileQuery({
        fetchPolicy: 'cache-first',
        skip: !jwt,
        context: {
            headers: {
                Authorization: jwt ? `Bearer ${jwt}` : '',
            },
        },
    });

    useEffect(() => {
        if (data) {
            console.log('useProfile: SUCCESS →', data.me);
        }
        if (error) {
            console.log('useProfile: ERROR →', error.message);
        }
    }, [data, error]);

    // Loading or no token
    if (loading || !jwt) {
        return { profile: null, loading: true, refetch, error: null };
    }

    // Error or no data
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
        fullName: `${patient?.firstName || user.firstName || ''} ${patient?.lastName || user.lastName || ''
            }`.trim(),

        profilePictureUrl: patient?.profilePictureUrl || null,
        patientId: patient?.id ? Number(patient.id) : null,

        gender: patient?.gender || null,
        dateOfBirth: patient?.dateOfBirth || null,

        // Newly added: country & county with id + name
        countryId: patient?.country?.id ? Number(patient.country.id) : null,
        countryName: patient?.country?.name || null,

        countyId: patient?.county?.id ? Number(patient.county.id) : null,
        countyName: patient?.county?.name || null,
    };

    return { profile, loading: false, refetch, error: null };
};