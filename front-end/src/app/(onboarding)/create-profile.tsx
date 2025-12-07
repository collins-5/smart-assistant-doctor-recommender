// src/app/(onboarding)/create-profile.tsx
import { View, Text, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Picker } from "@react-native-picker/picker";
import { useEditProfile } from "~/lib/hooks/useEditProfile";
import { useSessionStore } from "~/lib/store/auth";
import { useCountries } from "~/lib/hooks/useCountries";
import { profileSchema, type ProfileForm } from "~/lib/schemas/auth";

export default function CreateProfileScreen() {
  const router = useRouter();
  const { session } = useSessionStore();
  const { submit, loading } = useEditProfile();
  const { countries, getCountiesByCountry } = useCountries();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: session?.email || "",
      phoneNumber: session?.phoneNumber || "",
      dateOfBirth: "",
      gender: "M",
      countryId: undefined,
      countyId: undefined,
    },
  });


  // THIS FIXES THE TS ERROR + makes filtering work reliably
  const selectedCountryId = watch("countryId");
  const filteredCounties = getCountiesByCountry(selectedCountryId); // Works with string OR number!

  const handleNextStep = async () => {
    const fieldsToValidate: (keyof ProfileForm)[] = [
      "email",
      "phoneNumber",
      "firstName",
      "middleName",
      "lastName",
      "gender",
    ];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      await submit({
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email || undefined,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        countryId: data.countryId ? Number(data.countryId) : undefined,
        countyId: data.countyId ? Number(data.countyId) : undefined,
      });
      Alert.alert("Success", "Profile created!", [
        { text: "Continue", onPress: () => router.replace("/(tabs)/dashboard") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save profile");
    }
  };

  return (
    <>
      <HeaderSafeAreaView />
      <KeyboardAvoidingWrapper>
        <ScrollView className="flex-1 bg-background">
          <View className="p-6">
            <Card className="bg-card rounded-2xl shadow-md">
              <CardHeader className="items-center pb-6">
                <CardTitle className="text-3xl font-bold text-primary">
                  Complete Your Profile
                </CardTitle>
                <Text className="text-center text-lg text-muted-foreground mt-2">
                  Step {currentStep} of 2
                </Text>
                <View className="flex-row items-center justify-center mt-4 w-full px-8">
                  <View
                    className={`h-2 flex-1 rounded-full ${
                      currentStep >= 1 ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                  <View className="w-4" />
                  <View
                    className={`h-2 flex-1 rounded-full ${
                      currentStep >= 2 ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                </View>
              </CardHeader>

              <CardContent className="space-y-6">
                {currentStep === 1 ? (
                  <>
                    {/* Step 1: Basic Information */}
                    {/* Email - READ ONLY */}
                    <View className="my-1">
                      <Text className="text-sm text-muted-foreground mb-2">
                        Email
                      </Text>
                      <Input
                        value={session?.email || ""}
                        editable={false}
                        className="bg-gray-100 text-muted-foreground"
                      />
                    </View>

                    {/* Phone Number - READ ONLY */}
                    <View className="my-1">
                      <Text className="text-sm text-muted-foreground mb-2">
                        Phone Number
                      </Text>
                      <Input
                        value={session?.phoneNumber || ""}
                        editable={false}
                        className="bg-gray-100 text-muted-foreground"
                      />
                    </View>

                    <View className="h-px bg-gray-300 my-4" />

                    {/* First Name */}
                    <View className="my-1">
                      <Controller
                        control={control}
                        name="firstName"
                        render={({ field }) => (
                          <View>
                            <Text className="text-sm text-muted-foreground mb-2">
                              First Name
                            </Text>
                            <Input
                              placeholder="John"
                              value={field.value}
                              onChangeText={field.onChange}
                              error={errors.firstName?.message}
                            />
                          </View>
                        )}
                      />
                    </View>

                    {/* Middle Name */}
                    <View className="my-1">
                      <Controller
                        control={control}
                        name="middleName"
                        render={({ field }) => (
                          <View>
                            <Text className="text-sm text-muted-foreground mb-2">
                              Middle Name (Optional)
                            </Text>
                            <Input
                              placeholder="Michael"
                              value={field.value}
                              onChangeText={field.onChange}
                              error={errors.middleName?.message}
                            />
                          </View>
                        )}
                      />
                    </View>

                    {/* Last Name */}
                    <View className="my-1">
                      <Controller
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                          <View>
                            <Text className="text-sm text-muted-foreground mb-2">
                              Last Name
                            </Text>
                            <Input
                              placeholder="Doe"
                              value={field.value}
                              onChangeText={field.onChange}
                              error={errors.lastName?.message}
                            />
                          </View>
                        )}
                      />
                    </View>

                    {/* Gender */}
                    <View className="my-1">
                      <Controller
                        control={control}
                        name="gender"
                        render={({ field }) => (
                          <View>
                            <Text className="text-sm text-muted-foreground mb-2">
                              Gender
                            </Text>
                            <View className="border border-gray-300 rounded-lg bg-white">
                              <Picker
                                selectedValue={field.value}
                                onValueChange={field.onChange}
                              >
                                <Picker.Item label="Male" value="M" />
                                <Picker.Item label="Female" value="F" />
                                <Picker.Item label="Other" value="O" />
                              </Picker>
                            </View>
                            {errors.gender && (
                              <Text className="text-red-500 text-sm mt-1">
                                {errors.gender.message}
                              </Text>
                            )}
                          </View>
                        )}
                      />
                    </View>

                    <Button
                      text="Next"
                      onPress={handleNextStep}
                      className="bg-primary mt-6"
                    />
                  </>
                ) : (
                  <>
                    {/* Step 2: Location & Date of Birth */}
                    <View className="my-1">
                      <Controller
                        control={control}
                        name="countryId"
                        render={({ field }) => (
                          <View>
                            <Text className="text-sm text-muted-foreground mb-2">
                              Country
                            </Text>
                            <View className="border border-gray-300 rounded-lg bg-white">
                              <Picker
                                selectedValue={field.value ?? null}
                                onValueChange={field.onChange}
                              >
                                <Picker.Item
                                  label="Select country"
                                  value={null}
                                />
                                {countries.map((c) => (
                                  <Picker.Item
                                    key={c.id}
                                    label={c.name}
                                    value={c.id}
                                  />
                                ))}
                              </Picker>
                            </View>
                            {errors.countryId && (
                              <Text className="text-red-500 text-sm mt-1">
                                {errors.countryId.message}
                              </Text>
                            )}
                          </View>
                        )}
                      />
                    </View>

                    <View className="my-1">
                      <Controller
                        control={control}
                        name="countyId"
                        render={({ field }) => (
                          <View>
                            <Text className="text-sm text-muted-foreground mb-2">
                              County
                            </Text>
                            <View className="border border-gray-300 rounded-lg bg-white">
                              <Picker
                                selectedValue={field.value ?? null}
                                onValueChange={field.onChange}
                                enabled={!!selectedCountryId}
                              >
                                <Picker.Item
                                  label="Select county"
                                  value={null}
                                />
                                {filteredCounties.map((c) => (
                                  <Picker.Item
                                    key={c.id}
                                    label={c.name}
                                    value={c.id}
                                  />
                                ))}
                              </Picker>
                            </View>
                            {errors.countyId && (
                              <Text className="text-red-500 text-sm mt-1">
                                {errors.countyId.message}
                              </Text>
                            )}
                          </View>
                        )}
                      />
                    </View>

                    <View className="my-1">
                      <Controller
                        control={control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <View>
                            <Text className="text-sm text-muted-foreground mb-2">
                              Date of Birth
                            </Text>
                            <Input
                              placeholder="1990-01-15"
                              value={field.value}
                              onChangeText={field.onChange}
                              error={errors.dateOfBirth?.message}
                              keyboardType="numbers-and-punctuation"
                            />
                            <Text className="text-xs text-muted-foreground mt-1">
                              Format: YYYY-MM-DD
                            </Text>
                          </View>
                        )}
                      />
                    </View>

                    <View className="flex-row gap-3 mt-6">
                      <Button
                        text="Back"
                        onPress={() => setCurrentStep(1)}
                        className="flex-1 bg-gray-200"
                      />
                      <Button
                        text={loading ? "Saving..." : "Complete Profile"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                        className="flex-1 bg-primary"
                      />
                    </View>
                  </>
                )}
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </>
  );
}
