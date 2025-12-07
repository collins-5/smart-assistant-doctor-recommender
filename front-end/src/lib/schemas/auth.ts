// src/lib/schemas/auth.ts
import { z } from "zod";

export const signUpSchema = z
    .object({
        email: z.string().email("Invalid email").optional().or(z.literal("")),
        phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignUpForm = z.infer<typeof signUpSchema>;

export const profileSchema = z.object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    middleName: z.string().min(1, "Middle name required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phoneNumber: z.string().min(10, "Phone number required"),
    dateOfBirth: z.string().min(1, "Date of birth required"),
    gender: z.enum(["M", "F", "O"], { message: "Select gender" }),
    countryId: z.string({ required_error: "Select country" }).min(1, "Select country"),
    countyId: z.string({ required_error: "Select county" }).min(1, "Select county"),
});

export type ProfileForm = z.infer<typeof profileSchema>;