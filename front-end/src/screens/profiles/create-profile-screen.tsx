// front-end/src/app/(protected)/(profiles)/create-profile.tsx

import {
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";

import { useCreateProfile } from "~/lib/hooks/useCreateProfile";
import { useCountries } from "~/lib/hooks/useCountries";
import Icon from "~/components/ui/icon";
import { Select } from "~/components/ui/bottom-sheets/select";

const createProfileSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  middleName: z.string().optional(),
  email: z.string().email("Invalid email").or(z.literal("")),
  phoneNumber: z.string().min(9, "Phone too short").or(z.literal("")),
  dateOfBirth: z.string().min(1, "Date of birth required"),
  gender: z.enum(["M", "F", "O"], { message: "Select gender" }),
  countryId: z.string().nullable(),
  countyId: z.string().nullable(),
});

type FormData = z.infer<typeof createProfileSchema>;

export default function CreateProfileScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const { submit, loading } = useCreateProfile();
  const {
    countries,
    getCountiesByCountryName,
    loading: locationsLoading,
  } = useCountries();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "O",
      countryId: null,
      countyId: null,
    },
  });

  const watchedCountryId = watch("countryId");
  const selectedCountryName = watchedCountryId
    ? countries.find((c) => c.id.toString() === watchedCountryId)?.name
    : null;

  const countiesInSelectedCountry = selectedCountryName
    ? getCountiesByCountryName(selectedCountryName)
    : [];

  useEffect(() => {
    setValue("countyId", null);
  }, [watchedCountryId, setValue]);

  // Select options
  const countryOptions = countries.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }));

  const countyOptions = countiesInSelectedCountry.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }));

  const genderOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
    { value: "O", label: "Other" },
  ];

  const onSubmit = async (data: FormData) => {
    try {
      await submit({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName || undefined,
        email: data.email || undefined,
        phoneNumber: data.phoneNumber || undefined,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        countryId: data.countryId || undefined,
        countyId: data.countyId || undefined,
      });
      Alert.alert("Success", "Profile created successfully!", [
        {
          text: "OK",
          onPress: () => {
            router.replace({
              pathname: "/(tabs)/profile",
              params: { refetch: Date.now().toString() },
            });
          },
        },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to create profile");
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
    setValue("dateOfBirth", currentDate.toISOString().split("T")[0], {
      shouldDirty: true,
    });
  };

  if (locationsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground text-lg">Loading locations...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView className="flex-1 bg-background">
        {/* Header with Placeholder Avatar */}
        <View className="bg-primary pt-12 pb-8 px-6">
          <View className="flex-row items-center justify-between">
            <Button
              onPress={() => router.back()}
              variant="ghost"
              size="icon"
              className="rounded-full"
              leftIcon={<Icon name="arrow-left" size={28} color="white" />}
            />
            <Text className="text-white text-2xl font-bold">
              Create Profile
            </Text>
            <View className="w-10" />
          </View>

          <View className="items-center mt-8">
            {/* Placeholder Avatar */}
            <View className="w-32 h-32 rounded-full bg-white/20 items-center justify-center border-4 border-white shadow-2xl">
              <Text className="text-white text-5xl font-bold">?</Text>
            </View>

            <Text className="text-white text-2xl font-bold mt-4">
              Welcome! Let's get started
            </Text>
            <Text className="text-white/80 text-base mt-2">
              Fill in your details below
            </Text>
          </View>
        </View>

        {/* Step Indicator */}
        <View className="flex-row justify-center my-8 gap-8">
          {[1, 2].map((i) => (
            <View key={i} className="items-center">
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  step >= i ? "bg-primary" : "bg-muted"
                }`}
              >
                <Text
                  className={`font-bold text-lg ${step >= i ? "text-white" : "text-muted-foreground"}`}
                >
                  {i}
                </Text>
              </View>
              <Text className="text-sm text-muted-foreground mt-2">
                {i === 1 ? "Personal Info" : "Location"}
              </Text>
            </View>
          ))}
          <View className="absolute top-6 left-20 right-20 h-0.5 bg-muted -z-10" />
          <View className="absolute top-6 left-20 w-32 h-0.5 bg-primary -z-10" />
        </View>

        {/* Form Content */}
        <View className="px-6 pb-10">
          {step === 1 && (
            <View className="space-y-6">
              <Text className="text-lg font-semibold text-foreground mb-4">
                Personal Information
              </Text>

              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.firstName?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <Input
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.lastName?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="middleName"
                render={({ field }) => (
                  <Input
                    label="Middle Name (Optional)"
                    placeholder="Enter middle name"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="dateOfBirth"
                render={() => (
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">
                      Date of Birth
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      className="border border-border rounded-xl px-4 py-4 bg-card"
                    >
                      <Text
                        className={
                          watch("dateOfBirth")
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {watch("dateOfBirth")
                          ? format(new Date(watch("dateOfBirth")), "PPP")
                          : "Select your date of birth"}
                      </Text>
                    </TouchableOpacity>
                    {errors.dateOfBirth && (
                      <Text className="text-destructive text-sm mt-1">
                        {errors.dateOfBirth.message}
                      </Text>
                    )}
                    {showDatePicker && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        maximumDate={new Date()}
                        onChange={onDateChange}
                      />
                    )}
                  </View>
                )}
              />

              {/* Gender using Select */}
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    label="Gender"
                    placeholder="Select your gender"
                    data={genderOptions}
                    value={field.value}
                    onChange={(val: string) =>
                      field.onChange(val as "M" | "F" | "O")
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    label="Email Address"
                    placeholder="you@example.com"
                    value={field.value}
                    onChangeText={field.onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <Input
                    label="Phone Number"
                    placeholder="+254 712 345 678"
                    value={field.value}
                    onChangeText={field.onChange}
                    keyboardType="phone-pad"
                    error={errors.phoneNumber?.message}
                  />
                )}
              />
              <View className="mt-4">
                <Button
                  text="Continue to Location"
                  onPress={() => setStep(2)}
                  size="lg"
                  rightIcon={
                    <Icon name="arrow-right" size={20} color="white" />
                  }
                />
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="space-y-6">
              <Text className="text-lg font-semibold text-foreground">
                Your Location
              </Text>

              <Controller
                control={control}
                name="countryId"
                render={({ field }) => (
                  <Select
                    label="Country"
                    placeholder="Select your country"
                    data={countryOptions}
                    value={field.value || ""}
                    onChange={(val: string) => field.onChange(val || null)}
                  />
                )}
              />

              <Controller
                control={control}
                name="countyId"
                render={({ field }) => (
                  <Select
                    label="County"
                    placeholder={
                      selectedCountryName
                        ? "Select your county"
                        : "First select country"
                    }
                    data={countyOptions}
                    value={field.value || ""}
                    onChange={(val: string) => field.onChange(val || null)}
                    disabled={!selectedCountryName}
                  />
                )}
              />

              <View className="flex-row gap-4 mt-4">
                <Button
                  text="Back"
                  variant="outline"
                  onPress={() => setStep(1)}
                  className="flex-1 self-center"
                />
                <Button
                  text={loading ? "Creating..." : "Create Profile"}
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading || !isDirty}
                  className="flex-1 self-center"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
}
