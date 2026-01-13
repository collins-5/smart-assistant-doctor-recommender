// src/hooks/useDoctorWithSlots.ts   ← better name than useDoctor
import { useQuery } from '@apollo/client';
import { format, startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';

import {
    GetDoctorWithAvailableSlotsDocument,
    GetDoctorWithAvailableSlotsQuery,
    GetDoctorWithAvailableSlotsQueryVariables,
} from '~/lib/graphql/generated/graphql';

export const useDoctor = (doctorId: number | string) => {
    const numericId = typeof doctorId === 'string' ? parseInt(doctorId, 10) : doctorId;

    const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()));

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    const { data, loading, error, refetch } = useQuery<
        GetDoctorWithAvailableSlotsQuery,
        GetDoctorWithAvailableSlotsQueryVariables
    >(GetDoctorWithAvailableSlotsDocument, {
        variables: {
            id: numericId,
            date: dateStr,
        },
        skip: !numericId || isNaN(numericId),
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    // Optional: auto-refetch when selected date changes (alternative to passing refetch down)
    useEffect(() => {
        if (!loading && !error) {
            refetch({ id: numericId, date: dateStr });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateStr]);

    const slots = data?.doctor?.availableSlots?.filter((s) => s && !s.isBooked) ?? [];

    return {
        doctor: data?.doctor ?? null,
        slots,                      // ← only available (not booked) slots for selected date
        loading,
        error,
        selectedDate,
        setSelectedDate,
        refetch,
    };
};