// src/lib/schemas/auth.ts
import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscore allowed")
      .transform((val) => val.toLowerCase()),

    email: z.string().email("Invalid email address"),

    phoneNumber: z
      .string()
      .min(10, "Phone number too short")
      .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),

    password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),

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