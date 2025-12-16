// src/hooks/useBookAppointment.ts
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
    BookAppointmentDocument,
    GetMyAppointmentsDocument,
} from "../graphql/generated/graphql";

export type BookingStep = 1 | 2 | 3 | 4; // 1=Doctor, 2=Mode, 3=Time, 4=Payment
export type ConsultationMode = "TELE" | "CLINIC" | "HOME";

// Accept optional initial doctor
export const useBookAppointment = (initialDoctor?: any) => {
    const [step, setStep] = useState<BookingStep>(initialDoctor ? 2 : 1);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(initialDoctor || null);
    const [selectedMode, setSelectedMode] = useState<ConsultationMode | null>(null);
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

    const [bookAppointment, { loading, error }] = useMutation(BookAppointmentDocument, {
        refetchQueries: [{ query: GetMyAppointmentsDocument }],
    });

    // Ensure state is correct when initialDoctor changes (e.g. when sheet re-opens)
    useEffect(() => {
        if (initialDoctor) {
            setSelectedDoctor(initialDoctor);
            setStep(2);
        } else {
            setSelectedDoctor(null);
            setStep(1);
        }
    }, [initialDoctor]);

    const goToStep = (newStep: BookingStep) => setStep(newStep);

    const selectDoctor = (doctor: any) => {
        setSelectedDoctor(doctor);
        goToStep(2);
    };

    const selectMode = (mode: ConsultationMode) => {
        setSelectedMode(mode);
        goToStep(3);
    };

    const selectDateTime = (date: Date) => {
        setSelectedDateTime(date);
        goToStep(4);
    };

    const simulatePayment = async () => {
        if (!selectedDoctor || !selectedMode || !selectedDateTime) {
            return { success: false };
        }

        // Simulate payment delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const result = await bookAppointment({
            variables: {
                bookingArgs: {
                    doctorId: Number(selectedDoctor.id),
                    startTime: selectedDateTime.toISOString(),
                    encounterMode: selectedMode,
                },
            },
        });

        if (result.data?.bookAppointment?.appointment) {
            // Success → reset everything
            reset();
            return {
                success: true,
                appointment: result.data.bookAppointment.appointment,
            };
        }

        return { success: false };
    };

    const reset = () => {
        setStep(1);
        setSelectedDoctor(null);
        setSelectedMode(null);
        setSelectedDateTime(null);
    };

    return {
        // Current state
        step,
        selectedDoctor,
        selectedMode,
        selectedDateTime,

        // Actions
        selectDoctor,
        selectMode,
        selectDateTime,
        simulatePayment,
        reset,
        goToStep,

        // Mutation state
        loading,
        error,
    };
};