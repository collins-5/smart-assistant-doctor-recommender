// src/components/sheets/unbookmark-confirmation.tsx
import React from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { Button } from "../button";
import { useUnbookmarkDoctor } from "~/lib/hooks/useUnbookmarkDoctor";

interface UnbookmarkConfirmationSheetProps {
  payload?: {
    doctorId: number | string;
    doctorName?: string;
    // Optional: if you want to skip confirmation in some cases
    skipConfirmation?: boolean;
  };
}

const UnbookmarkConfirmationSheet: React.FC<
  UnbookmarkConfirmationSheetProps
> = ({ payload }) => {
  const insets = useSafeAreaInsets();
  const { unbookmark, loading: loadingUnbookmark } = useUnbookmarkDoctor();

  const doctorId = payload?.doctorId;
  const doctorName = payload?.doctorName || "this doctor";
  const skipConfirmation = payload?.skipConfirmation || false;

  // If skipConfirmation is true, unbookmark immediately
  React.useEffect(() => {
    if (skipConfirmation && doctorId) {
      unbookmark(doctorId);
      SheetManager.hide("unbookmark-confirmation");
    }
  }, [skipConfirmation, doctorId, unbookmark]);

  const handleUnbookmark = async () => {
    if (doctorId) {
      await unbookmark(doctorId);
      SheetManager.hide("unbookmark-confirmation");
    }
  };

  const handleCancel = () => {
    SheetManager.hide("unbookmark-confirmation");
  };

  // Don't render anything if skipping confirmation
  if (skipConfirmation) return null;

  return (
    <ActionSheet
      id="unbookmark-confirmation"
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
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
          <View className="w-28 h-28 rounded-3xl bg-orange-50 justify-center items-center shadow-lg mb-8">
            <View className="w-20 h-20 rounded-2xl bg-orange-100 justify-center items-center">
              <Ionicons name="heart" size={48} color="#F97316" />
            </View>
          </View>

          <Text className="text-3xl font-bold text-gray-900 text-center">
            Remove Bookmark?
          </Text>

          <Text className="text-gray-500 text-center text-base leading-6 mt-4 px-8">
            Are you sure you want to remove {doctorName} from your bookmarks?
          </Text>
        </View>

        <View className="gap-4 mt-6">
          <Button
            variant="destructive"
            onPress={handleUnbookmark}
            text="Remove Bookmark"
            disabled={loadingUnbookmark}
            loading={loadingUnbookmark}
            leftIcon={<Ionicons name="heart-dislike" size={22} color="white" />}
          />
          <Button
            variant="outline"
            onPress={handleCancel}
            text="Keep Bookmark"
          />
        </View>
      </View>
    </ActionSheet>
  );
};

export default UnbookmarkConfirmationSheet;
