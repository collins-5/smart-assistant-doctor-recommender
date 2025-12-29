// src/components/ui/bottom-sheets/doctors-filter-sheet.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet from "react-native-actions-sheet";
import { SheetManager } from "react-native-actions-sheet";
import { Button } from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import { useSpecialties } from "~/lib/hooks/useSpecialties";
import { useCountries } from "~/lib/hooks/useCountries";
import { useDoctorsFilter } from "~/lib/context/DoctorsFilterContext";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";

const PRICE_RANGES = [
  { label: "Any Price", range: [0, 10000] },
  { label: "Under KSh 1,000", range: [0, 1000] },
  { label: "KSh 1,000 – 2,000", range: [1000, 2000] },
  { label: "KSh 2,000 – 5,000", range: [2000, 5000] },
  { label: "Over KSh 5,000", range: [5000, 10000] },
];

const DoctorsFilterSheet = () => {
  const insets = useSafeAreaInsets();
  const { specialties } = useSpecialties();
  const { countries, getCountiesByCountryName } = useCountries();
  const { filters, updateFilters, resetFilters } = useDoctorsFilter();

  const handleApply = () => SheetManager.hide("doctor-filters-sheet");
  const handleClear = () => resetFilters();
  const handleClose = () => SheetManager.hide("doctor-filters-sheet");

  const selectedSpecialty = filters.specialtyId
    ? specialties.find((s) => s.id.toString() === filters.specialtyId)?.name
    : null;

  const selectedPriceLabel =
    PRICE_RANGES.find(
      (p) =>
        p.range[0] === filters.priceRange[0] &&
        p.range[1] === filters.priceRange[1]
    )?.label || null;

  const availabilityLabel = filters.availability
    ? filters.availability === "online"
      ? "Online Only"
      : "In-Clinic"
    : null;

  const countiesInSelectedCountry = filters.countryName
    ? getCountiesByCountryName(filters.countryName)
    : [];

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
        backgroundColor: "#ffffff",
      }}
      indicatorStyle={{ width: 50, height: 5, backgroundColor: "#e5e7eb" }}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="py-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-foreground">
            Filter Doctors
          </Text>
          <Button
            leftIcon={<Icon name="close" size={28} color="#374151" />}
            variant="ghost"
            onPress={handleClose}
            size="icon"
          />
        </View>

        {/* Active Filters Chips */}
        {(selectedSpecialty ||
          selectedPriceLabel ||
          availabilityLabel ||
          filters.countryName ||
          filters.countyName) && (
          <View className="mb-8 px-2">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Active Filters
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {selectedSpecialty && (
                <View className="bg-primary/10 px-4 py-2.5 rounded-full flex-row items-center gap-2">
                  <Text className="text-primary font-medium">
                    {selectedSpecialty}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateFilters({ specialtyId: null })}
                  >
                    <Icon name="close" size={18} color="#0d9488" />
                  </TouchableOpacity>
                </View>
              )}
              {selectedPriceLabel && selectedPriceLabel !== "Any Price" && (
                <View className="bg-primary/10 px-4 py-2.5 rounded-full flex-row items-center gap-2">
                  <Text className="text-primary font-medium">
                    {selectedPriceLabel}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateFilters({ priceRange: [0, 10000] })}
                  >
                    <Icon name="close" size={18} color="#0d9488" />
                  </TouchableOpacity>
                </View>
              )}
              {availabilityLabel && (
                <View className="bg-primary/10 px-4 py-2.5 rounded-full flex-row items-center gap-2">
                  <Text className="text-primary font-medium">
                    {availabilityLabel}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateFilters({ availability: null })}
                  >
                    <Icon name="close" size={18} color="#0d9488" />
                  </TouchableOpacity>
                </View>
              )}
              {filters.countryName && (
                <View className="bg-primary/10 px-4 py-2.5 rounded-full flex-row items-center gap-2">
                  <Text className="text-primary font-medium">
                    {filters.countryName}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      updateFilters({ countryName: null, countyName: null })
                    }
                  >
                    <Icon name="close" size={18} color="#0d9488" />
                  </TouchableOpacity>
                </View>
              )}
              {filters.countyName && (
                <View className="bg-primary/10 px-4 py-2.5 rounded-full flex-row items-center gap-2">
                  <Text className="text-primary font-medium">
                    {filters.countyName}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateFilters({ countyName: null })}
                  >
                    <Icon name="close" size={18} color="#0d9488" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Location */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-foreground mb-4">
            Location
          </Text>

          {/* Country */}
          <View className="mb-5">
            <Text className="text-base font-medium text-foreground mb-2">
              Country
            </Text>
            <Select
              value={filters.countryName ?? null}
              onValueChange={(v) =>
                updateFilters({ countryName: v || null, countyName: null })
              }
              placeholder="Select Country"
            >
              <SelectTrigger className="">
                <Text
                  className={
                    filters.countryName
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {filters.countryName || "Select Country"}
                </Text>
              </SelectTrigger>
              <SelectContent>
                <SelectItem label="All Countries" value="" />
                {countries.map((c) => (
                  <SelectItem key={c.id} label={c.name} value={c.name} />
                ))}
              </SelectContent>
            </Select>
          </View>

          {/* County */}
          {filters.countryName && (
            <View>
              <Text className="text-base font-medium text-foreground mb-2">
                County
              </Text>
              <Select
                value={filters.countyName ?? null}
                onValueChange={(v) => updateFilters({ countyName: v || null })}
                placeholder="Select County"
              >
                <SelectTrigger className="">
                  <Text
                    className={
                      filters.countyName
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {filters.countyName || "Select County"}
                  </Text>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem label="All Counties" value="" />
                  {countiesInSelectedCountry.map((c) => (
                    <SelectItem key={c.id} label={c.name} value={c.name} />
                  ))}
                </SelectContent>
              </Select>
            </View>
          )}
        </View>

        {/* Specialty */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-foreground mb-4">
            Specialty
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              onPress={() => updateFilters({ specialtyId: null })}
              className={`px-5 py-3.5 rounded-full border ${
                !filters.specialtyId
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`font-medium ${!filters.specialtyId ? "text-white" : "text-foreground"}`}
              >
                All Specialties
              </Text>
            </TouchableOpacity>
            {specialties.slice(0, 10).map((s) => (
              <TouchableOpacity
                key={s.id}
                onPress={() =>
                  updateFilters({
                    specialtyId:
                      filters.specialtyId === s.id.toString()
                        ? null
                        : s.id.toString(),
                  })
                }
                className={`px-5 py-3.5 rounded-full border ${
                  filters.specialtyId === s.id.toString()
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`font-medium ${
                    filters.specialtyId === s.id.toString()
                      ? "text-white"
                      : "text-foreground"
                  }`}
                >
                  {s.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-foreground mb-4">
            Consultation Price
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {PRICE_RANGES.map(({ label, range }) => {
              const active =
                filters.priceRange[0] === range[0] &&
                filters.priceRange[1] === range[1];
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() =>
                    updateFilters({ priceRange: range as [number, number] })
                  }
                  className={`px-5 py-3.5 rounded-full border ${
                    active
                      ? "bg-primary border-primary"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-medium ${active ? "text-white" : "text-foreground"}`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Availability */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-foreground mb-4">
            Availability
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => updateFilters({ availability: null })}
              className={`flex-1 py-4 rounded-xl border ${
                !filters.availability
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`text-center font-medium ${!filters.availability ? "text-white" : "text-foreground"}`}
              >
                All Modes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updateFilters({ availability: "online" })}
              className={`flex-1 py-4 rounded-xl border ${
                filters.availability === "online"
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`text-center font-medium ${filters.availability === "online" ? "text-white" : "text-foreground"}`}
              >
                Online Only
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updateFilters({ availability: "clinic" })}
              className={`flex-1 py-4 rounded-xl border ${
                filters.availability === "clinic"
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`text-center font-medium ${filters.availability === "clinic" ? "text-white" : "text-foreground"}`}
              >
                In-Clinic
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="border-t flex-row justify-between border-gray-200 pt-4 px-4 pb-6 gap-3">
        <Button text="Apply Filters" onPress={handleApply} size="lg"></Button>
        <Button
          text="Clear All Filter"
          variant="outline"
          onPress={handleClear}
        ></Button>
      </View>
    </ActionSheet>
  );
};

export default DoctorsFilterSheet;
