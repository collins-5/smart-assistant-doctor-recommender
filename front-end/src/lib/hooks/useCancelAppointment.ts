// src/lib/hooks/useCancelAppointment.ts
import { useMutation } from '@apollo/client';
import { CancelAppointmentDocument } from '../graphql/generated/graphql';
import { GetMyAppointmentsDocument } from '../graphql/generated/graphql';

export const useCancelAppointment = () => {
    const [mutate, { loading, error, data }] = useMutation(CancelAppointmentDocument, {
        refetchQueries: [{ query: GetMyAppointmentsDocument }],
        awaitRefetchQueries: true,
    });

    const cancelAppointment = async (appointmentId: number | string, reason?: string) => {
        // CRITICAL: Convert to number — GraphQL Int! cannot accept string
        const id = Number(appointmentId);

        if (isNaN(id)) {
            return { success: false, error: "Invalid appointment ID" };
        }

        try {
            const result = await mutate({
                variables: {
                    appointmentId: id,  // ← Ensure it's a number
                    reason: reason || "",
                },
            });


            if (result.data?.cancelAppointment?.success) {
                return { success: true, appointment: result.data.cancelAppointment.appointment };
            } else {
                const msg = result.data?.cancelAppointment?.error || "Unknown error";
                return { success: false, error: msg };
            }
        } catch (err: any) {
            return { success: false, error: err.message || "Network error" };
        }
    };

    return {
        cancelAppointment,
        loading,
        error: error?.message || data?.cancelAppointment?.error,
        data: data?.cancelAppointment,
    };
};