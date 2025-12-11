// src/lib/hooks/useCountries.ts
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_LOCATIONS = gql`
  query GetLocations {
    countries {
      id
      name
    }
    counties {
      id
      name
      country {
        id
        name   # ← make sure this is selected if you want to use name-based lookup without extra filtering
      }
    }
  }
`;

export interface Country {
  id: number;
  name: string;
}

export interface County {
  id: number;
  name: string;
  country: {
    id: number;
    name: string;   // added for convenience
  };
}

export const useCountries = () => {
  const { data, loading, error } = useQuery(GET_LOCATIONS, {
    fetchPolicy: "cache-first",
  });

  const countries: Country[] = data?.countries || [];
  const counties: County[] = data?.counties || [];

  // Existing: by country ID
  const getCountiesByCountryId = (countryId: number | undefined): County[] => {
    if (!countryId) return [];
    return counties.filter((c) => c.country.id === countryId);
  };

  // NEW: by country name (case-insensitive, trims whitespace)
  const getCountiesByCountryName = (countryName: string | undefined): County[] => {
    if (!countryName) return [];
    const normalized = countryName.trim().toLowerCase();

    return counties.filter((county) =>
      county.country.name.trim().toLowerCase() === normalized
    );
  };

  // Optional: a combined helper if you ever get both id and name
  const getCountiesByCountry = (
    countryId?: number,
    countryName?: string
  ): County[] => {
    if (countryId !== undefined) {
      return getCountiesByCountryId(countryId);
    }
    if (countryName !== undefined) {
      return getCountiesByCountryName(countryName);
    }
    return [];
  };

  return {
    countries,
    counties,
    getCountiesByCountryId,      // renamed for clarity
    getCountiesByCountryName,    // ← this is what you asked for
    getCountiesByCountry,        // flexible overload
    loading,
    error,
  };
};