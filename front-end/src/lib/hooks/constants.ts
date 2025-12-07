import { useMemo } from 'react';

import {
  useGetConsultationModesQuery,
  useGetHealthCareProviderSpecialtiesQuery,
  useGetMaritalStatusesQuery,
  useGetSexesQuery,
  useRetrieveCountiesQuery,
  useRetrieveCountriesQuery,
} from '~/lib/graphql/generated/graphql';

import { convertFromSnakeToTitleCase } from '../utils';
import { useHealthCareProviders } from './health-care-providers-listing';

type HasIdAndName = {
  id?: number | null;
  name?: string | null;
};

function isValid<T extends HasIdAndName>(value: T): value is T & { id: number; name: string } {
  return !!value.id && !!value.name;
}

export const useCountries = () => {
  const { data, loading, error } = useRetrieveCountriesQuery({
    fetchPolicy: 'cache-first',
  });

  const cleanedData = useMemo(
    () =>
      data?.retrieveApplicationConstants.countries.filter(isValid).map((country) => ({
        label: country.name,
        value: country.id.toString(),
      })),
    [data]
  );

  return {
    countries: cleanedData ?? [],
    loading,
    error,
  };
};

export const useCounties = () => {
  const { data, loading, error } = useRetrieveCountiesQuery({
    fetchPolicy: 'cache-first',
  });

  const cleanedData = useMemo(
    () =>
      data?.retrieveApplicationConstants.counties.filter(isValid).map((county) => ({
        label: county.name,
        value: county.id.toString(),
      })),
    [data]
  );

  return {
    counties: cleanedData ?? [],
    loading,
    error,
  };
};

export const useConsultationModes = () => {
  const { data, loading, error } = useGetConsultationModesQuery();

  const cleanedData = useMemo(
    () =>
      data?.retrieveApplicationConstants.encounterModes.map((mode) => ({
        value: mode[1],
        label: convertFromSnakeToTitleCase(mode[1]),
      })),
    [data]
  );

  return {
    consultationModes: cleanedData ?? [],
    loading,
    error,
  };
};

export const useHealthCareProviderSpecialties = () => {
  const { workerRole } = useHealthCareProviders();

  const { data, loading, error } = useGetHealthCareProviderSpecialtiesQuery({
    variables: { healthCareProviderRoleId: parseInt(workerRole?.value!) ?? null },
  });

  const cleanedData = useMemo(
    () =>
      data?.retrieveHealthWorkerSpecialties.items.map(({ id, name }) => ({
        value: id.toString(),
        label: name,
      })),
    [data]
  );

  return {
    healthCareProviderSpecialties: cleanedData ?? [],
    loading,
    error,
  };
};

export const useSexes = () => {
  const { data, loading, error } = useGetSexesQuery();

  const cleanedData = useMemo(
    () =>
      data?.retrieveApplicationConstants.sexes.map((sex) => ({
        value: sex[1],
        label: convertFromSnakeToTitleCase(sex[1]),
      })),
    [data]
  );

  return {
    sexes: cleanedData ?? [],
    loading,
    error,
  };
};

export const useMaritalStatuses = () => {
  const { data, loading, error } = useGetMaritalStatusesQuery();

  const cleanedData = useMemo(
    () =>
      data?.retrieveApplicationConstants.maritalStatuses.map((maritalStatus) => ({
        value: maritalStatus[1],
        label: convertFromSnakeToTitleCase(maritalStatus[1]),
      })),
    [data]
  );

  return {
    maritalStatuses: cleanedData ?? [],
    loading,
    error,
  };
};

export const EXTRA_BOTTOM_SPACING = 30;
