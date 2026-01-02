import { IconNames } from "~/components/ui/icon";

// Mapping specialty names to specific, meaningful icons from your allowed list
export const specialtyIconMap: Record<string, IconNames> = {
  Cardiology: "heart-outline",
  General: "doctor",
  Dermatology: "arm-flex",
  Neurology: "brain",
  Pediatrics: "mother-nurse",
  Orthopedics: "account-injury",
  Psychiatry: "brain",
  Gynecology: "gender-male-female",
  "General Practitioner": "doctor",
  "Family Medicine": "home-heart",
  Dentistry: "food-apple", // closest available
  Ophthalmology: "eye-outline",
  ENT: "account-question", // fallback
  Nutrition: "nutrition",
  Physiotherapy: "human-wheelchair",
  "Occupational Therapy": "wheelchair-accessibility",
  Radiology: "medical-bag",
  Surgery: "stethoscope",
  neurosergion: "stethoscope"
  // Add more as needed
};