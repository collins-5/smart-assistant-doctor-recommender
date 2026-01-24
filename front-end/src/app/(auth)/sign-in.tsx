// src/app/(onboarding)/(auth)/sign-in.tsx
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link, useNavigation, useRouter } from "expo-router";
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
import { useSignIn } from "~/lib/hooks/useSignIn";
import GoogleSignInButton from "~/components/core/google-sign-in";

// Zod schema
const signInSchema = z.object({
  emailOrPhoneNumber: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const handleSuccess = () => {
    // Navigate to main app after successful login
    navigation.navigate("Main" as never); // or 'Home', 'Dashboard', etc.
  };

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
      router.replace("/(onboarding)/");
    } catch (err: any) {}
  };

  return (
    <>
      <HeaderSafeAreaView />
      <KeyboardAvoidingWrapper>
        <View className="flex-1 bg-background justify-center px-6 py-4">
          <Card className="bg-card rounded-2xl shadow-md">
            <CardHeader className="items-center pb-4">
              <CardTitle className="py-8">
                <CardDescription className="text-center text-primary font-extrabold text-3xl">
                  Sign In
                </CardDescription>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <View className="flex-row justify-center space-x-3">
                {/* <Button
                  text="Google"
                  variant="outline"
                  size="default"
                  className="flex-1 text-center"
                  disabled
                /> */}

                {/* <GoogleSignInButton
                  onSuccess={handleSuccess}
                /> */}
                

              </View>
              <Separator className="my-6 bg-foreground" text="OR" />

              <View className="my-2">
                {/* Email/Phone */}
                <Controller
                  control={control}
                  name="emailOrPhoneNumber"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      className="rounded-lg px-4 py-3 text-black"
                      placeholder="username"
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
              </View>

              <View className="my-2">
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
              </View>
              <TouchableOpacity
                onPress={() => SheetManager.show("reset-password")}
                className="mb-6"
              >
                <Text className="text-foregrond text-sm text-right underline">
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
                <Text className="text-red-500 text-center">
                  {mutationError}
                </Text>
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
