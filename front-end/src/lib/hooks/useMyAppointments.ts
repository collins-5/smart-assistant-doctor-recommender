// src/lib/hooks/useMyAppointments.ts
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
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    statusDisplay: string;
    doctor: {
        id: number;
        fullName: string;
        title?: string | null;
        primarySpecialty?: {
            name: string;
        } | null;
    };
};

export const useMyAppointments = (status?: string) => {
    const { data, loading, error, refetch } = useQuery(GetMyAppointmentsDocument, {
        variables: { status: status || null },
        fetchPolicy: 'cache-and-network',
    });

    const appointments: Appointment[] = data?.appointments || [];

    return {
        appointments,
        loading,
        error,
        refetch,
    };
};