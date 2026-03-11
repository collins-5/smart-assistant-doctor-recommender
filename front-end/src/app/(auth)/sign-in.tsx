import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { SheetManager } from "react-native-actions-sheet";
import { useSignIn } from "~/lib/hooks/useSignIn";

const { width, height } = Dimensions.get("window");

const signInSchema = z.object({
  emailOrPhoneNumber: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const router = useRouter();
  const {
    setEmailOrPhone,
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
    defaultValues: { emailOrPhoneNumber: "", password: "" },
  });

  const onSubmit = async () => {
    try {
      await submit();
      router.replace("/(protected)/(tabs)/dashboard");
    } catch (err: any) {}
  };

  return (
    <KeyboardAvoidingWrapper>
      <View className="flex-1 bg-background">
        {/* Top hero section */}
        <View
          className="bg-primary items-center justify-end"
          style={{ height: height * 0.28, paddingBottom: 32 }}
        >
          {/* Decorative circles */}
          <View
            className="absolute bg-white/10 rounded-full"
            style={{ width: 200, height: 200, top: -60, right: -40 }}
          />
          <View
            className="absolute bg-white/5 rounded-full"
            style={{ width: 140, height: 140, top: 10, left: -30 }}
          />

          {/* Logo / Icon */}
          <View className="items-center mb-2">
          <Image
            source={require("assets/sdr-logo.jpg")}
            className="w-20 h-20 rounded-2xl border-2 border-white/30"
            resizeMode="contain"
          />
          </View>
          <Text className="text-primary-foreground text-2xl font-bold tracking-wide">
            SDR Health
          </Text>
          <Text className="text-muted text-sm mt-1 tracking-widest uppercase">
            Your Smart Doctor Assistant
          </Text>
        </View>

        {/* Form card — floats over hero */}
        <View
          className="flex-1 bg-background rounded-t-3xl px-6"
          style={{ marginTop: -24 }}
        >
          <View className="pt-8 pb-4">
            <Text className="text-foreground text-2xl font-bold">
              Welcome back 👋
            </Text>
            <Text className="text-muted-foreground text-sm mt-1">
              Sign in to continue your health journey
            </Text>
          </View>

          <View className="gap-4 mt-2">
            {/* Username */}
            <Controller
              control={control}
              name="emailOrPhoneNumber"
              render={({ field: { onChange, value } }) => (
                <Input
                  className="rounded-xl px-4 py-3"
                  placeholder="Username or phone number"
                  placeholderTextColor="rgb(150, 150, 150)"
                  value={value}
                  onChangeText={(t) => {
                    onChange(t);
                    setEmailOrPhone(t);
                  }}
                  error={errors.emailOrPhoneNumber?.message}
                  keyboardType="default"
                  autoCapitalize="none"
                  iconProps={{
                    name: "account-outline",
                    size: 20,
                    className: "text-muted-foreground",
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
                  className="rounded-xl px-4 py-3"
                  placeholder="••••••••"
                  placeholderTextColor="rgb(150, 150, 150)"
                  value={value}
                  onChangeText={(t) => {
                    onChange(t);
                    setPassword(t);
                  }}
                  error={errors.password?.message}
                  secureTextEntry
                  iconProps={{
                    name: "lock-outline",
                    size: 20,
                    className: "text-muted-foreground",
                  }}
                />
              )}
            />

            {/* Forgot password */}
            <TouchableOpacity
              onPress={() => SheetManager.show("reset-password")}
              className="self-end"
            >
              <Text className="text-primary text-sm font-medium underline">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error */}
          {mutationError && (
            <View className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <Text className="text-red-600 text-sm text-center">
                {mutationError}
              </Text>
            </View>
          )}

          {/* Sign In button */}
          <View className="mt-6">
            <Button
              text={loading ? "Signing in..." : "Sign In"}
              variant="default"
              size="lg"
              className="rounded-xl"
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            />
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-6 gap-3">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-muted-foreground text-xs uppercase tracking-widest">
              New here?
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Sign up */}
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity
              className="border border-primary rounded-xl py-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-primary font-semibold text-base">
                Create an Account
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
}
