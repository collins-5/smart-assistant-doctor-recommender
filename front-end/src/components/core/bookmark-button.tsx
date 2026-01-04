// src/components/BookmarkDoctorButton.tsx

import React, { useEffect } from "react";
import { TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useBookmarkDoctor } from "~/lib/hooks/useBookmarkDoctor";
import { useUnbookmarkDoctor } from "~/lib/hooks/useUnbookmarkDoctor";
import { useBookmarkedDoctors } from "~/lib/hooks/useBookmarkedDoctors";
import Icon from "../ui/icon";
import { SheetManager } from "react-native-actions-sheet";
import { router } from "expo-router";

interface BookmarkDoctorButtonProps {
  doctorId: number | string;
  doctorName?: string;
  size?: number;
}

export const BookmarkDoctorButton: React.FC<BookmarkDoctorButtonProps> = ({
  doctorId,
  doctorName,
  size = 32,
}) => {
  const {
    bookmark,
    loading: loadingBookmark,
    error: bookmarkError,
  } = useBookmarkDoctor();
  const {
    unbookmark,
    loading: loadingUnbookmark,
    error: unbookmarkError,
  } = useUnbookmarkDoctor();
  const { doctors: bookmarkedDoctors = [] } = useBookmarkedDoctors();

  const isBookmarked = bookmarkedDoctors.some(
    (d: any) => Number(d.id) === Number(doctorId)
  );

  const isLoading = loadingBookmark || loadingUnbookmark;
  const error = bookmarkError || unbookmarkError;

  // Handle errors with smart messaging
  useEffect(() => {
    if (error) {
      const errorMessage = error.message?.toLowerCase() || "";

      if (
        errorMessage.includes("profile") ||
        errorMessage.includes("patient")
      ) {
        Alert.alert(
          "Profile Required",
          "You need to complete your patient profile before bookmarking doctors.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Complete Profile",
              onPress: () =>
                router.push("/(protected)/(profiles)/create-profile"),
            },
          ]
        );
      } else {
        // Network or other errors
        Alert.alert(
          "Something went wrong",
          error.message ||
            "Failed to update bookmark. Please check your connection and try again.",
          [{ text: "OK" }]
        );
      }
    }
  }, [error]);

  const handlePress = () => {
    if (isBookmarked) {
      SheetManager.show("unbookmark-confirmation", {
        payload: {
          doctorId,
          doctorName: doctorName || "this doctor",
        },
      });
    } else {
      bookmark(doctorId);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isLoading}
      activeOpacity={0.7}
      className="p-2"
    >
      {isLoading ? (
        <ActivityIndicator size={size * 0.7} color="#ef4444" />
      ) : (
        <Icon
          name={isBookmarked ? "heart" : "heart-outline"}
          size={size}
          color={isBookmarked ? "#ef4444" : "#6b7280"}
        />
      )}
    </TouchableOpacity>
  );
};
