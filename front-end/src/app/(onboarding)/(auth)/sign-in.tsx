// src/app/(onboarding)/(auth)/sign-in.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { Separator } from "~/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { SheetManager } from "react-native-actions-sheet";
import { Image } from "expo-image";
import { useSignIn } from "~/lib/hooks/useSignIn";

// Zod schema
const signInSchema = z.object({
  emailOrPhoneNumber: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const router = useRouter();
  
  // Your hook returns: emailOrPhone, password, submit(), loading, error
  const {
    emailOrPhone,
    setEmailOrPhone,
    password,
    setPassword,
    submit,
    loading,
    error: mutationError,
  } = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      emailOrPhoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    try {
      await submit(); // ← NO ARGUMENTS — uses internal state
      router.replace("/(onboarding)/create-profile");
    } catch (err: any) {
    }
  };

  return (
    <>
      <HeaderSafeAreaView />
      <KeyboardAvoidingWrapper>
        <View className="flex-1 bg-background justify-center px-6 py-4">
          <Card className="bg-card rounded-2xl shadow-md">
            <CardHeader className="items-center pb-4">
              <CardTitle className="text-3xl font-bold text-primary mb-2">
                Sign In
                <View className="items-center mb-10">
                  <Image
                    source={require("../../../../assets/splash-logo.png")}
                    className="w-32 h-32"
                    contentFit="contain"
                  />
                </View>
              </CardTitle>
              <CardDescription className="text-center text-xl">
                Welcome back
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <View className="flex-row justify-center space-x-3">
                <Button text="Google" variant="outline" size="default" className="flex-1" disabled />
              </View>

              <Separator className="my-6 bg-foreground" text="OR" />

              {/* Email/Phone */}
              <Controller
                control={control}
                name="emailOrPhoneNumber"
                render={({ field: { onChange, value } }) => (
                  <Input
                    className="rounded-lg px-4 py-3 text-black"
                    placeholder="Email or Phone Number"
                    placeholderTextColor="rgb(105, 105, 105)"
                    value={value}
                    onChangeText={(t) => {
                      onChange(t);
                      setEmailOrPhone(t); // Sync with hook
                    }}
                    error={errors.emailOrPhoneNumber?.message}
                    keyboardType="default"
                    autoCapitalize="none"
                    iconProps={{
                      name: "account-outline",
                      size: 20,
                      className: "text-gray-500",
                    }}
                  />
                )}
              />

              {/* Password */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    className="rounded-lg px-4 py-3 text-black"
                    placeholder="••••••••"
                    placeholderTextColor="rgb(105, 105, 105)"
                    value={value}
                    onChangeText={(t) => {
                      onChange(t);
                      setPassword(t); // Sync with hook
                    }}
                    error={errors.password?.message}
                    secureTextEntry
                    iconProps={{
                      name: "lock-outline",
                      size: 20,
                      className: "text-black",
                    }}
                  />
                )}
              />

              <TouchableOpacity
                onPress={() => SheetManager.show("reset-password")}
                className="mb-6"
              >
                <Text className="text-gray-500 text-sm text-right underline">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <Button
                text="Sign In"
                variant="default"
                size="lg"
                className="rounded-lg"
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              />

              {mutationError && (
                <Text className="text-red-500 text-center">{mutationError}</Text>
              )}

              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Link href="/(auth)/sign-up" asChild>
                  <TouchableOpacity>
                    <Text className="text-primary font-semibold">Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </CardContent>
          </Card>
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
}