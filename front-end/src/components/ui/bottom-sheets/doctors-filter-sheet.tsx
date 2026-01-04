// src/components/ui/bottom-sheets/doctors-filter-sheet.tsx

import React from "react";
import { ScrollView, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet from "react-native-actions-sheet";
import { SheetManager } from "react-native-actions-sheet";

import { Button } from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

// Your custom searchable Select

import { useSpecialties } from "~/lib/hooks/useSpecialties";
import { useCountries } from "~/lib/hooks/useCountries";
import { useDoctorsFilter } from "~/lib/context/DoctorsFilterContext";
import { Select } from "./select";

const DoctorsFilterSheet = () => {
  const insets = useSafeAreaInsets();
  const { specialties } = useSpecialties();
  const { countries, getCountiesByCountryName } = useCountries();
  const { filters, updateFilters, resetFilters } = useDoctorsFilter();

  const countiesInSelectedCountry = filters.countryName
    ? getCountiesByCountryName(filters.countryName)
    : [];

  const countryOptions = [
    { value: "", label: "All Countries" },
    ...countries.map((c) => ({ value: c.name, label: c.name })),
  ];

  const countyOptions = [
    { value: "", label: "All Counties" },
    ...countiesInSelectedCountry.map((c) => ({ value: c.name, label: c.name })),
  ];

  const specialtyOptions = [
    { value: "", label: "All Specialties" },
    ...specialties.map((s) => ({ value: s.id.toString(), label: s.name })),
  ];

  const availabilityOptions = [
    { value: "", label: "All Modes" },
    { value: "online", label: "Online Only" },
    { value: "clinic", label: "In-Clinic Only" },
  ];

  // Active filter chips
  type ActiveFilter = { label: string; clear: () => void };
  const activeFilters: ActiveFilter[] = [
    filters.specialtyId && {
      label:
        specialties.find((s) => s.id.toString() === filters.specialtyId)
          ?.name || "Unknown",
      clear: () => updateFilters({ specialtyId: null }),
    },
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && {
      label: `KSh ${filters.priceRange[0]} – ${filters.priceRange[1]}`,
      clear: () => updateFilters({ priceRange: [0, 10000] }),
    },
    filters.availability && {
      label:
        filters.availability === "online" ? "Online Only" : "In-Clinic Only",
      clear: () => updateFilters({ availability: null }),
    },
    filters.countryName && {
      label: filters.countryName,
      clear: () => updateFilters({ countryName: null, countyName: null }),
    },
    filters.countyName && {
      label: filters.countyName,
      clear: () => updateFilters({ countyName: null }),
    },
  ].filter(Boolean) as ActiveFilter[];

  return (
    <ActionSheet
      id="doctor-filters-sheet"
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      containerStyle={{
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      }}
      indicatorStyle={{ width: 50, height: 5, backgroundColor: "#e5e7eb" }}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="py-6">
        <View className="gap-y-6">
          {/* Header */}
          <View>
            <Text className="text-2xl font-bold text-primary">
              Filter Doctors
            </Text>
            <Text className="text-base text-muted-foreground mt-1">
              Find the right doctor for your needs
            </Text>
          </View>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {activeFilters.map((filter, index) => (
                <Pressable key={index} onPress={filter.clear}>
                  <View className="flex-row items-center mx-1 gap-x-1 p-2 rounded-xl border border-primary/10 bg-primary/10">
                    <Text className="text-sm font-semibold text-primary">
                      {filter.label}
                    </Text>
                    <Icon
                      name="close-circle-outline"
                      size={16}
                      className="text-primary"
                    />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Location */}
          <View>
            <Text className="text-xl font-semibold mb-4">Location</Text>

            <Select
              label="Country"
              description="Select preferred country"
              placeholder="All Countries"
              data={countryOptions}
              value={filters.countryName || ""}
              onChange={(val: string) =>
                updateFilters({
                  countryName: val || null,
                  countyName: null,
                })
              }
            />

            {filters.countryName && (
              <View className="mt-4">
                <Select
                  label="County"
                  description="Select preferred county"
                  placeholder="All Counties"
                  data={countyOptions}
                  value={filters.countyName || ""}
                  onChange={(val: string) =>
                    updateFilters({ countyName: val || null })
                  }
                />
              </View>
            )}
          </View>

          {/* Specialty */}
          <View>
            <Text className="text-xl font-semibold mb-4">Specialty</Text>
            <Select
              label="Specialty"
              description="Choose a medical specialty"
              placeholder="All Specialties"
              data={specialtyOptions}
              value={filters.specialtyId || ""}
              onChange={(val: string) =>
                updateFilters({ specialtyId: val || null })
              }
            />
          </View>

          {/* Price Range */}
          <View>
            <Text className="text-xl font-semibold mb-4">
              Consultation Price
            </Text>
            <Text className="text-sm text-muted-foreground mb-4">
              Set your preferred price range (KES)
            </Text>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="mb-1 text-sm font-medium">From (KES)</Text>
                <Input
                  keyboardType="number-pad"
                  placeholder="0"
                  value={
                    filters.priceRange[0] > 0
                      ? filters.priceRange[0].toString()
                      : ""
                  }
                  onChangeText={(text) => {
                    const val = text ? parseInt(text, 10) || 0 : 0;
                    updateFilters({ priceRange: [val, filters.priceRange[1]] });
                  }}
                  className="bg-background"
                />
              </View>

              <View className="items-center justify-center pt-6">
                <Text className="font-medium text-gray-400">to</Text>
              </View>

              <View className="flex-1">
                <Text className="mb-1 text-sm font-medium">To (KES)</Text>
                <Input
                  keyboardType="number-pad"
                  placeholder="10000"
                  value={
                    filters.priceRange[1] < 10000
                      ? filters.priceRange[1].toString()
                      : ""
                  }
                  onChangeText={(text) => {
                    const val = text ? parseInt(text, 10) || 10000 : 10000;
                    updateFilters({ priceRange: [filters.priceRange[0], val] });
                  }}
                  className="bg-background"
                />
              </View>
            </View>
          </View>

          {/* Availability */}
          <View>
            <Text className="text-xl font-semibold mb-4">Availability</Text>
            <Select
              label="Consultation Mode"
              description="How would you like to consult?"
              placeholder="All Modes"
              data={availabilityOptions}
              value={filters.availability || ""}
              onChange={(val: string) =>
                updateFilters({ availability: (val as "online" | "clinic" | "home") || null })
              }
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mt-6">
            <Button
              text="Clear All Filters"
              variant="secondary"
              onPress={() => {
                resetFilters();
                SheetManager.hide("doctor-filters-sheet");
              }}
              className="flex-1"
            />
            <Button
              text="Apply Filters"
              onPress={() => SheetManager.hide("doctor-filters-sheet")}
              className="flex-1"
            />
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default DoctorsFilterSheet;
