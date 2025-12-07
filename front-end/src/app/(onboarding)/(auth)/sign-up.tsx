// src/app/(auth)/sign-up.tsx
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Image } from "expo-image";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { useSignUp } from "~/lib/hooks/useSignUp";
import { signUpSchema, SignUpForm } from "~/lib/schemas/auth";

export default function SignUpScreen() {
  const router = useRouter();
  const {
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    submit,
    loading,
    error,
  } = useSignUp();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async () => {
    try {
      await submit();
      router.replace("/(onboarding)/create-profile");
    } catch (err) {}
  };

  return (
    <>
      <HeaderSafeAreaView />
      <KeyboardAvoidingWrapper>
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 bg-background justify-center">
            <Card className="bg-card rounded-2xl shadow-md">
              <CardHeader className="items-center pb-4">
                <View className="items-center mb-6">
                  <Image
                    source={require("../../../../assets/splash-logo.png")}
                    className="w-32 h-32"
                    contentFit="contain"
                  />
                </View>
                <CardTitle className="text-3xl font-bold text-primary mb-2">
                  Sign Up
                </CardTitle>
                <CardDescription className="text-center text-xl text-muted-foreground">
                  Create your account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <View className="flex-row justify-center space-x-3">
                  <Button
                    text="Google"
                    variant="outline"
                    size="default"
                    className="flex-1"
                    disabled
                  />
                </View>

                <Separator className="my-6 bg-foreground" text="OR" />

                {/* Email */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Email Address (Optional)"
                      value={value}
                      onChangeText={(t) => {
                        onChange(t);
                        setEmail(t);
                      }}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      iconProps={{ name: "email-outline", size: 20 }}
                    />
                  )}
                />

                {/* Phone Number */}
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Phone Number"
                      value={value}
                      onChangeText={(t) => {
                        onChange(t);
                        setPhoneNumber(t);
                      }}
                      error={errors.phoneNumber?.message}
                      keyboardType="phone-pad"
                      iconProps={{ name: "phone-outline", size: 20 }}
                    />
                  )}
                />

                {/* Password */}
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Password"
                      value={value}
                      onChangeText={(t) => {
                        onChange(t);
                        setPassword(t);
                      }}
                      error={errors.password?.message}
                      secureTextEntry
                      iconProps={{ name: "lock-outline", size: 20 }}
                    />
                  )}
                />

                {/* Confirm Password */}
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Confirm Password"
                      value={value}
                      onChangeText={onChange}
                      error={errors.confirmPassword?.message}
                      secureTextEntry
                      iconProps={{ name: "lock-outline", size: 20 }}
                    />
                  )}
                />

                <Button
                  text={loading ? "Creating Account..." : "Continue"}
                  variant="default"
                  size="lg"
                  className="bg-primary rounded-lg"
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                />

                {error && (
                  <Text className="text-red-500 text-center">{error}</Text>
                )}

                <View className="flex-row justify-center mt-6">
                  <Text className="text-muted-foreground">
                    Already have an account?{" "}
                  </Text>
                  <Link href="/(auth)/sign-in" asChild>
                    <TouchableOpacity>
                      <Text className="text-primary font-semibold">
                        Sign In
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </>
  );
}
