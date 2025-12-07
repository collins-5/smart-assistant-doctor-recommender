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
    };
}

export const useCountries = () => {
    const { data, loading, error } = useQuery(GET_LOCATIONS, {
        fetchPolicy: "cache-first",
    });

    const countries: Country[] = data?.countries || [];
    const counties: County[] = data?.counties || [];

    const getCountiesByCountry = (countryId: number | undefined): County[] => {
        if (!countryId) return [];
        return counties.filter((c) => c.country.id === countryId);
    };

    return {
        countries,
        counties,
        getCountiesByCountry,
        loading,
        error,
    };
};