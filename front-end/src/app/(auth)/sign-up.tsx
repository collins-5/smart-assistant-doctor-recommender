import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { useSignUp } from "~/lib/hooks/useSignUp";
import { signUpSchema, SignUpForm } from "~/lib/schemas/auth";

const { height } = Dimensions.get("window");

export default function SignUpScreen() {
  const router = useRouter();
  const {
    setUsername,
    setEmail,
    setPhoneNumber,
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
      username: "",
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
    } catch (err: any) {}
  };

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        className="flex-1 bg-background"
      >
        {/* Hero Header */}
        <View
          className="bg-primary items-center justify-end"
          style={{ height: height * 0.22, paddingBottom: 28 }}
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

        {/* Form — slides up over hero */}
        <View
          className="bg-background rounded-t-3xl px-6 pb-10"
          style={{ marginTop: -24 }}
        >
          {/* Title */}
          <View className="pt-8 pb-6">
            <Text className="text-foreground text-2xl font-bold">
              Create your account ✨
            </Text>
            <Text className="text-muted-foreground text-sm mt-1">
              Join thousands getting smarter healthcare
            </Text>
          </View>

          <View className="gap-4">
            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Username"
                  value={value}
                  onChangeText={(t) => {
                    onChange(t);
                    setUsername(t);
                  }}
                  error={errors.username?.message}
                  autoCapitalize="none"
                  className="rounded-xl"
                  iconProps={{
                    name: "account-outline",
                    size: 20,
                    className: "text-muted-foreground",
                  }}
                />
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Email Address"
                  value={value}
                  onChangeText={(t) => {
                    onChange(t);
                    setEmail(t);
                  }}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="rounded-xl"
                  iconProps={{
                    name: "email-outline",
                    size: 20,
                    className: "text-muted-foreground",
                  }}
                />
              )}
            />

            {/* Phone */}
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
                  className="rounded-xl"
                  iconProps={{
                    name: "phone-outline",
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
                  placeholder="Password"
                  value={value}
                  onChangeText={(t) => {
                    onChange(t);
                    setPassword(t);
                  }}
                  error={errors.password?.message}
                  secureTextEntry
                  className="rounded-xl"
                  iconProps={{
                    name: "lock-outline",
                    size: 20,
                    className: "text-muted-foreground",
                  }}
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
                  className="rounded-xl"
                  iconProps={{
                    name: "lock-outline",
                    size: 20,
                    className: "text-muted-foreground",
                  }}
                />
              )}
            />
          </View>

          {/* Error banner */}
          {error && (
            <View className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <Text className="text-red-600 text-sm text-center">{error}</Text>
            </View>
          )}

          {/* Submit */}
          <View className="mt-6">
            <Button
              text={loading ? "Creating Account..." : "Create Account"}
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
              Have an account?
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Sign in */}
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity
              className="border border-primary rounded-xl py-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-primary font-semibold text-base">
                Sign In Instead
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Terms note */}
          <Text className="text-muted-foreground text-xs text-center mt-6 leading-relaxed">
            By creating an account you agree to our{" "}
            <Text className="text-primary underline">Terms of Service</Text> and{" "}
            <Text className="text-primary underline">Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
}
