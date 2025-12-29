// src/components/BookmarkDoctorButton.tsx
import React from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { useBookmarkDoctor } from "~/lib/hooks/useBookmarkDoctor";
import { useUnbookmarkDoctor } from "~/lib/hooks/useUnbookmarkDoctor";
import { useBookmarkedDoctors } from "~/lib/hooks/useBookmarkedDoctors";
import Icon from "../ui/icon";
import { SheetManager } from "react-native-actions-sheet";

interface BookmarkDoctorButtonProps {
  doctorId: number | string;
  doctorName?: string; // Optional: for better confirmation message
  size?: number;
}

export const BookmarkDoctorButton: React.FC<BookmarkDoctorButtonProps> = ({
  doctorId,
  doctorName,
  size = 32,
}) => {
  const { bookmark, loading: loadingBookmark } = useBookmarkDoctor();
  const { unbookmark, loading: loadingUnbookmark } = useUnbookmarkDoctor();
  const { doctors: bookmarkedDoctors = [] } = useBookmarkedDoctors();

  const isBookmarked = bookmarkedDoctors.some(
    (d: any) => Number(d.id) === Number(doctorId)
  );

  const isLoading = loadingBookmark || loadingUnbookmark;

  const handlePress = () => {
    if (isBookmarked) {
      // Show confirmation sheet with doctor name
      SheetManager.show("unbookmark-confirmation", {
        payload: {
          doctorId,
          doctorName,
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
