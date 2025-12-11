// src/components/BookmarkDoctorButton.tsx   (or wherever your button lives)

import React from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { useBookmarkDoctor } from "~/lib/hooks/useBookmarkDoctor";
import { useBookmarkedDoctors } from "~/lib/hooks/useBookmarkedDoctors";
import { useUnbookmarkDoctor } from "~/lib/hooks/useUnbookmarkDoctor";
import Icon from "../ui/icon";

interface BookmarkDoctorButtonProps {
  doctorId: number | string;
  size?: number;
}

export const BookmarkDoctorButton: React.FC<BookmarkDoctorButtonProps> = ({
  doctorId,
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
      unbookmark(doctorId);
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
