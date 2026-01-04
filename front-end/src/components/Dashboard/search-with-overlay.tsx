// src/components/search/SearchWithOverlay.tsx

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Text } from "../ui/text";
import Icon from "../ui/icon";
import List from "~/components/ui/list";


import { useDoctors } from "~/lib/hooks/useDoctors";
import View from "../ui/view";
import { DoctorCard } from "../doctors/doctor-card";
import { DoctorCardSkeleton } from "../skeletons/doctor-card-skeleton";

const SearchWithOverlay = () => {
  const { doctors, loading, error, searchQuery, setSearchQuery } = useDoctors();

  const [inputValue, setInputValue] = useState(searchQuery);
  const [showOverlay, setShowOverlay] = useState(false);
  const [debouncedInputValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    setSearchQuery(debouncedInputValue.trim());
  }, [debouncedInputValue, setSearchQuery]);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearchInputChange = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  // Replace these with your actual implementations
  const openBookingSheet = (doctor: any) => {
    console.log("Book appointment:", doctor.fullName);
    // e.g., open bottom sheet
  };

  const goToDoctorProfile = (doctorId: number) => {
    console.log("Go to profile:", doctorId);
    // e.g., navigation.navigate('DoctorProfile', { doctorId });
  };

  const noResults = !loading && searchQuery.trim() && doctors.length === 0;

  return (
    <View>
      <Input
        iconComponent={<Icon name="magnify" size={20} />}
        onChangeText={handleSearchInputChange}
        placeholder="Find healthcare providers by name or specialty..."
        value={inputValue}
        onFocus={() => setShowOverlay(true)}
        onBlur={() => setShowOverlay(false)}
      />

      {searchQuery.trim() && showOverlay && (
        <Card className="absolute top-14 z-20 w-full rounded-lg px-5 shadow-2xl mr-10">
          {error && (
            <Text className="text-destructive p-4 text-center">
              {error.message || "Something went wrong."}
            </Text>
          )}

          <View className="h-300">
            <List
              data={doctors}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                // Build profile picture URL safely without any external constant
                const profilePictureUrl =
                  item.profilePicture?.url ?? // if your API returns direct URL
                  item.profilePictureUrl ?? // if it's already a string field
                  (item.profilePicture?.storageKey
                    ? `https://your-storage-domain.com/${item.profilePicture.storageKey}`
                    : null) ??
                  null;

                return (
                  <DoctorCard
                    id={item.id}
                    title={item.title}
                    firstName={item.firstName}
                    lastName={item.lastName}
                    fullName={item.fullName}
                    profilePictureUrl={profilePictureUrl}
                    primarySpecialty={item.primarySpecialty}
                    subSpecialties={item.subSpecialties}
                    teleconsultPrice={item.teleconsultPrice}
                    clinicVisitPrice={item.clinicVisitPrice}
                    homecarePrice={item.homecarePrice}
                    county={item.county}
                    primaryAction={{
                      text: "Book Appointment",
                      onPress: () => openBookingSheet(item),
                    }}
                    secondaryAction={{
                      text: "View Profile",
                      variant: "outline",
                      onPress: () => goToDoctorProfile(item.id),
                    }}
                  />
                );
              }}
              ListEmptyComponent={
                noResults ? (
                  <Card className="m-4 items-center justify-center p-8">
                    <Text className="text-lg font-bold">No doctors found</Text>
                    <Text className="mt-2 text-center text-sm text-muted-foreground">
                      Try adjusting your search terms or filters.
                    </Text>
                  </Card>
                ) : null
              }
              ListFooterComponent={
                loading ? (
                  <>
                    <DoctorCardSkeleton />
                    <DoctorCardSkeleton />
                    <DoctorCardSkeleton />
                    <DoctorCardSkeleton />
                  </>
                ) : null
              }
            />
          </View>
        </Card>
      )}
    </View>
  );
};

export default SearchWithOverlay;
