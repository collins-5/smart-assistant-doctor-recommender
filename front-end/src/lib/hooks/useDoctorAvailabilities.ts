// src/lib/hooks/useDoctorAvailabilities.ts
import { useQuery } from '@apollo/client';
import {
    GetDoctorAvailabilitiesDocument,
    DoctorAvailabilityType,
} from '../graphql/generated/graphql'; // Adjust path if needed

export type DoctorAvailability = {
    id: string | number;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    isBooked: boolean;
};

export const useDoctorAvailabilities = (
    doctorId: number | undefined
) => {
    const { data, loading, error, refetch } = useQuery(
        GetDoctorAvailabilitiesDocument,
        {
            variables: { doctorId }, // ← Note: variable name is doctorId, not id
            fetchPolicy: 'cache-and-network',
            skip: !doctorId || isNaN(doctorId),
        }
    );

    const availabilities: DoctorAvailability[] =
        data?.doctorAvailabilities?.map((avail: DoctorAvailabilityType) => ({
            id: avail.id,
            startTime: avail.startTime,
            endTime: avail.endTime,
            isRecurring: avail.isRecurring,
            isBooked: !!avail.isBooked, // isBooked can be null → convert to boolean
        })) || [];

    return {
        availabilities,
        loading,
        error,
        refetch,
    };
};