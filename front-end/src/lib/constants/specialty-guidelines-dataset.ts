export const SPECIALTY_GUIDELINES = {
    "General Practitioner": {
        description: "For most common, vague or first-time symptoms",
        typicalSymptoms: [
            "headache",
            "fatigue",
            "fever",
            "mild cough",
            "stomach upset",
            "general check-up",
            "minor infection",
            "cold",
            "flu symptoms",
            "body aches",
            "tiredness",
            "not feeling well",
        ],
        priority: 1, // default / fallback
    },

    "Ent": {
        description: "Ear, nose, throat related problems",
        typicalSymptoms: [
            "ear pain",
            "ear infection",
            "hearing problem",
            "ringing in ears",
            "sore throat",
            "tonsillitis",
            "sinus pain",
            "nasal congestion",
            "runny nose",
            "hoarse voice",
            "swollen glands in neck",
        ],
        priority: 2,
    },

    "physiotherapy": {
        description: "Muscle, joint, bone, movement and rehabilitation issues",
        typicalSymptoms: [
            "back pain",
            "neck pain",
            "knee pain",
            "shoulder pain",
            "joint swelling",
            "sports injury",
            "muscle strain",
            "post fracture recovery",
            "mobility problem",
            "arthritis pain",
            "stiffness",
        ],
        priority: 3,
    },

    "neurosergion": {
        description: "Only for very serious-sounding neurological concerns (almost always refer to hospital first)",
        typicalSymptoms: [
            "severe sudden headache",
            "stroke symptoms",
            "seizure",
            "loss of consciousness",
            "numbness one side",
            "confusion sudden",
            "vision loss sudden",
            "very bad dizziness",
        ],
        priority: 4,
        alwaysUrgent: true,
    },
} as const;

export type SpecialtyName = keyof typeof SPECIALTY_GUIDELINES;