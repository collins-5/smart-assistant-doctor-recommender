// src/components/sheets/logout-confirmation.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet, { SheetDefinition } from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { HandleLogout, useSessionStore } from "~/lib/store/auth";
import { Button } from "../button";
import Icon from "../icon";

const LogoutConfirmationSheet = () => {
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    HandleLogout()
    SheetManager.hide("logout-confirmation");
  };

  const handleCancel = () => {
    SheetManager.hide("logout-confirmation");
  };

  return (
    <ActionSheet
      id="logout-confirmation"
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      backgroundInteractionEnabled={true}
      containerStyle={{
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: "#ffffff",
      }}
      indicatorStyle={{ width: 50, height: 5, backgroundColor: "#e5e7eb" }}
    >
      <View className="py-8">
        <View className="items-center mb-10">
          <View className="w-28 h-28 rounded-3xl bg-red-50 justify-center items-center shadow-lg mb-8">
            <View className="w-20 h-20 rounded-2xl bg-red-100 justify-center items-center">
              <Ionicons name="log-out-outline" size={48} color="#EF4444" />
            </View>
          </View>

          <Text className="text-3xl font-bold text-gray-900 text-center">
            Log Out?
          </Text>

          <Text className="text-gray-500 text-center text-base leading-6 mt-4 px-8">
            You’ll need to sign in again next time you open the app.
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="gap-4  mt-6">

          <Button
            variant={"destructive"}
            onPress={handleLogout}
            text="log-out"
            leftIcon={<Ionicons name="log-out" size={22} color="white" />}
          />

          <Button
            variant={"outline"}
            onPress={handleCancel}
            text=" Stay Logged In"
            className="font-semibold text-center text-lg"
          />

        </View>
      </View>
    </ActionSheet>
  );
};

export type LogoutConfirmationSheetDefinition = SheetDefinition<{
  payload?: {
    onConfirm?: () => void;
  };
}>;

export default LogoutConfirmationSheet;
