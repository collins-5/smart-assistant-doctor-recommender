// src/lib/context/DoctorsFilterContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type DoctorFilter = {
  specialtyId?: string | null;
  priceRange: [number, number];
  availability?: "online" | "clinic" | "home" | null;
  countryName?: string | null; // ← Added
  countyName?: string | null; // ← Added
};

type DoctorsFilterContextType = {
  filters: DoctorFilter;
  updateFilters: (updates: Partial<DoctorFilter>) => void;
  resetFilters: () => void;
};

const DoctorsFilterContext = createContext<
  DoctorsFilterContextType | undefined
>(undefined);

export const DoctorsFilterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filters, setFilters] = useState<DoctorFilter>({
    specialtyId: null,
    priceRange: [0, 10000],
    availability: null,
    countryName: null,
    countyName: null,
  });

  const updateFilters = (updates: Partial<DoctorFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      priceRange:
        "priceRange" in updates
          ? (updates.priceRange ?? prev.priceRange)
          : prev.priceRange,
    }));
  };

  const resetFilters = () => {
    setFilters({
      specialtyId: null,
      priceRange: [0, 10000],
      availability: null,
      countryName: null,
      countyName: null,
    });
  };

  return (
    <DoctorsFilterContext.Provider
      value={{ filters, updateFilters, resetFilters }}
    >
      {children}
    </DoctorsFilterContext.Provider>
  );
};

export const useDoctorsFilter = () => {
  const context = useContext(DoctorsFilterContext);
  if (!context) {
    throw new Error(
      "useDoctorsFilter must be used within DoctorsFilterProvider"
    );
  }
  return context;
};
