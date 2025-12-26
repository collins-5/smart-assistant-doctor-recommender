// front-end/src/app/(protected)/(profiles)/edit-profile.tsx
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";

import { useEditProfile } from "~/lib/hooks/useEditProfile";
import { useProfile } from "~/lib/hooks/useProfile";
import { useCountries } from "~/lib/hooks/useCountries";
import Icon from "~/components/ui/icon";

const editProfileSchema = z.object({
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

type FormData = z.infer<typeof editProfileSchema>;

type ProfileWithLocation = ReturnType<typeof useProfile>["profile"] & {
  middleName?: string | null;
  countryId?: number | null;
  countyId?: number | null;
};

export default function EditProfileScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const { submit, loading } = useEditProfile();
  const { profile: rawProfile, loading: profileLoading } = useProfile();
  const {
    countries,
    getCountiesByCountryName, // ← Now using name-based version
    loading: locationsLoading,
  } = useCountries();

  const profile = rawProfile as ProfileWithLocation | null;

  const hasReset = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(editProfileSchema),
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

  // Watch countryId from form
  const watchedCountryId = watch("countryId");

  // Derive country name from selected countryId
  const selectedCountryName = watchedCountryId
    ? countries.find((c) => c.id.toString() === watchedCountryId)?.name || null
    : null;

  // Get counties using country name
  const countiesInSelectedCountry = selectedCountryName
    ? getCountiesByCountryName(selectedCountryName)
    : [];

  // Reset county when country changes
  useEffect(() => {
    setValue("countyId", null);
  }, [watchedCountryId, setValue]);

  // Populate form with existing profile data
  useEffect(() => {
    if (profile && !hasReset.current) {
      const dob = profile.dateOfBirth
        ? new Date(profile.dateOfBirth)
        : new Date();
      setDate(dob);

      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        middleName: profile.middleName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: (profile.gender as "M" | "F" | "O") || "O",
        countryId: profile.countryId?.toString() || null,
        countyId: profile.countyId?.toString() || null,
      });

      hasReset.current = true;
    }
  }, [profile, reset]);

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

      // Optional: trigger refetch on profile tab when going back
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to update profile");
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

  if (profileLoading || locationsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground">Loading...</Text>
      </View>
    );
  }

  const StepIndicator = () => (
    <View className="flex-row justify-center items-center gap-4 my-6">
      {[1, 2].map((i) => (
        <View key={i} className="flex-row items-center">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              step === i ? "bg-primary" : "bg-muted"
            }`}
          >
            <Text
              className={`font-bold ${step === i ? "text-white" : "text-foreground"}`}
            >
              {i}
            </Text>
          </View>
          {i === 1 && <View className="w-20 h-1 bg-muted mx-2" />}
        </View>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView className="flex-1 bg-background">
        <View className="flex-row bg-primary p-4">
          <Button
            onPress={() => (step === 1 ? router.back() : setStep(1))}
            className="w-12"
            rightIcon={<Icon name="arrow-left" size={32} />}
          />
          <View className="flex justify-center items-center flex-1">
            <Text className="text-primary-foreground text-3xl font-extrabold">
              Edit Profile
            </Text>
          </View>
          <View className="w-12" />
        </View>

        <View className="px-6 py-8">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Edit Profile
              </CardTitle>
              <StepIndicator />
            </CardHeader>

            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  {/* Step 1: Personal Info (unchanged) */}
                  <View className="my-2">
                    <Controller
                      control={control}
                      name="firstName"
                      render={({ field }) => (
                        <Input
                          placeholder="First Name"
                          value={field.value}
                          onChangeText={field.onChange}
                          error={errors.firstName?.message}
                        />
                      )}
                    />
                  </View>

                  <View className="my-2">
                    <Controller
                      control={control}
                      name="lastName"
                      render={({ field }) => (
                        <Input
                          placeholder="Last Name"
                          value={field.value}
                          onChangeText={field.onChange}
                          error={errors.lastName?.message}
                        />
                      )}
                    />
                  </View>

                  <View className="my-2">
                    <Controller
                      control={control}
                      name="middleName"
                      render={({ field }) => (
                        <Input
                          placeholder="Middle Name (Optional)"
                          value={field.value || ""}
                          onChangeText={field.onChange}
                        />
                      )}
                    />
                  </View>

                  <View className="my-2">
                    <Controller
                      control={control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <>
                          <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="border border-input rounded-xl px-4 py-4 bg-background"
                          >
                            <Text
                              className={
                                field.value
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              {field.value
                                ? format(new Date(field.value), "PPP")
                                : "Date of Birth"}
                            </Text>
                          </TouchableOpacity>
                          {errors.dateOfBirth && (
                            <Text className="text-red-500 text-sm mt-1">
                              {errors.dateOfBirth.message}
                            </Text>
                          )}
                          {showDatePicker && (
                            <DateTimePicker
                              value={date}
                              mode="date"
                              display={
                                Platform.OS === "ios" ? "inline" : "default"
                              }
                              maximumDate={new Date()}
                              onChange={onDateChange}
                            />
                          )}
                        </>
                      )}
                    />
                  </View>

                  <View className="my-2">
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <View className="space-y-3">
                          <Text className="text-foreground/80 font-medium">
                            Gender
                          </Text>
                          <View className="flex-row justify-between">
                            {(["M", "F", "O"] as const).map((g) => (
                              <TouchableOpacity
                                key={g}
                                onPress={() => field.onChange(g)}
                                className={`flex-1 mx-1 py-4 rounded-xl border-2 ${field.value === g ? "bg-primary border-primary" : "border-muted"}`}
                              >
                                <Text
                                  className={`text-center font-medium ${field.value === g ? "text-white" : "text-foreground"}`}
                                >
                                  {g === "M"
                                    ? "Male"
                                    : g === "F"
                                      ? "Female"
                                      : "Other"}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                          {errors.gender && (
                            <Text className="text-red-500 text-sm">
                              {errors.gender.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />
                  </View>

                  <View className="my-2">
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          placeholder="Email"
                          value={field.value}
                          onChangeText={field.onChange}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          error={errors.email?.message}
                        />
                      )}
                    />
                  </View>

                  <View className="my-2">
                    <Controller
                      control={control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <Input
                          placeholder="Phone Number"
                          value={field.value}
                          onChangeText={field.onChange}
                          keyboardType="phone-pad"
                          error={errors.phoneNumber?.message}
                        />
                      )}
                    />
                  </View>

                  <View className="mt-6">
                    <Button
                      text="Next"
                      className="text-xl"
                      rightIcon={<Icon name="arrow-right" />}
                      onPress={() => setStep(2)}
                    />
                  </View>
                </>
              )}

              {/* Step 2: Location – Now using country name */}
              {step === 2 && (
                <>
                  <Text className="text-lg font-medium text-foreground mb-4">
                    Your Location
                  </Text>

                  {/* Country Select */}
                  <View className="my-2">
                    <Controller
                      control={control}
                      name="countryId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select Country"
                        >
                          <SelectTrigger>
                            <Text>
                              {field.value
                                ? countries.find(
                                    (c) => c.id.toString() === field.value
                                  )?.name || "Select Country"
                                : "Select Country"}
                            </Text>
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((c) => (
                              <SelectItem
                                key={c.id}
                                label={c.name}
                                value={c.id.toString()}
                              />
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </View>

                  {/* County Select – Using country name */}
                  <View className="my-2">
                    <Controller
                      control={control}
                      name="countyId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder={
                            !selectedCountryName
                              ? "First select country"
                              : "Select County"
                          }
                          disabled={!selectedCountryName}
                        >
                          <SelectTrigger>
                            <Text>
                              {field.value
                                ? countiesInSelectedCountry.find(
                                    (c) => c.id.toString() === field.value
                                  )?.name || "Select County"
                                : selectedCountryName
                                  ? "Select County"
                                  : "First select country"}
                            </Text>
                          </SelectTrigger>
                          <SelectContent>
                            {countiesInSelectedCountry.map((county) => (
                              <SelectItem
                                key={county.id}
                                label={county.name}
                                value={county.id.toString()}
                              />
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </View>

                  <View className="flex-row justify-between mt-8 gap-3">
                    <Button
                      text="Back"
                      onPress={() => setStep(1)}
                      variant="outline"
                      className="flex-1 text-center"
                    />
                    <Button
                      text={loading ? "Saving..." : "Save Changes"}
                      onPress={handleSubmit(onSubmit)}
                      disabled={loading || !isDirty}
                      className="flex-1 text-center"
                    />
                  </View>
                </>
              )}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
}
