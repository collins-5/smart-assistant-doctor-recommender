// src/lib/hooks/useSpecialties.ts
import { useQuery } from "@apollo/client";
import { GetSpecialtiesDocument } from "../graphql/generated/graphql";

export type Specialty = {
    id: string | number;
    name: string;
};

// Optional: If you want to export the query for reuse elsewhere
export { GetSpecialtiesDocument };

export const useSpecialties = () => {
    const { data, loading, error, refetch } = useQuery(GetSpecialtiesDocument, {
        fetchPolicy: "cache-and-network", // Good default: show cached + fetch fresh
    });

    const specialties: Specialty[] = data?.specialties || [];

    return {
        specialties,
        loading,
        error,
        refetch,
    };
};