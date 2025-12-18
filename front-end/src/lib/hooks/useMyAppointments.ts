// src/hooks/useMyAppointments.ts
import { useQuery } from '@apollo/client';
import { GetMyAppointmentsDocument } from '../graphql/generated/graphql';

export type Appointment = {
    id: number;
    startTime: string;
    endTime: string;
    encounterMode: string;
    cost: number;
    paymentCompleted: boolean;
    rastucId: string;
    doctor: {
        id: number;
        fullName: string;
        title?: string | null;
        primarySpecialty?: {
            name: string;
        } | null;
    };
};

export const useMyAppointments = () => {
    const { data, loading, error, refetch } = useQuery(GetMyAppointmentsDocument, {
        fetchPolicy: 'cache-and-network', // always get fresh data but show cached first
    });

    const appointments: Appointment[] = data?.appointments || [];

    return {
        appointments,
        loading,
        error,
        refetch,
    };
};