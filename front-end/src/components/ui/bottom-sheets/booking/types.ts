// src/components/ui/bottom-sheets/booking/types.ts

/**
 * The steps in the booking flow
 */

/**
 * Alternative: Use an enum for better readability (recommended)
 */
export enum BookingStep {
  SelectDoctor = 1,
  SelectMode = 2,
  SelectTime = 3,
  ConfirmPayment = 4,
}

/**
 * Available consultation modes
 */
export type ConsultationMode = "TELE" | "CLINIC" | "HOME";

/**
 * Shape of a time slot returned from the backend
 */
export type AvailabilitySlot = {
    id: number;
    startTime: string; // ISO string
    endTime: string;   // ISO string
    isBooked: boolean;
};

/**
 * Minimal doctor shape needed for booking
 */
export type BookingDoctor = {
    id: number | string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    teleconsultPrice?: number;
    clinicVisitPrice?: number;
    homecarePrice?: number;
};