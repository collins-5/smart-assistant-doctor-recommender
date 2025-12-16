// src/components/core/DoctorCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import type { FC } from "react";
import { BookmarkDoctorButton } from "./bookmark-button";
import { useBookmarkedDoctors } from "~/lib/hooks/useBookmarkedDoctors";

interface Specialty {
  id: string | number;
  name: string;
}

interface ActionButton {
  text: string;
  onPress: () => void;
  variant?: "default" | "outline" | "destructive";
  loading?: boolean;
  disabled?: boolean;
}

interface DoctorCardProps {
  id: number;
  title?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  profilePictureUrl?: string | null;
  primarySpecialty?: Specialty | null;
  subSpecialties?: Specialty[] | null;
  teleconsultPrice?: number | string | null;
  clinicVisitPrice?: number | string | null;
  homecarePrice?: number | string | null;

  // Optional buttons
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;

  // Optional: tap entire card
  onPressCard?: () => void;
}

// Reusable internal button
const ActionButton: FC<{
  button: ActionButton;
  className?: string;
}> = ({ button, className = "" }) => {
  const { text, onPress, variant = "default", loading, disabled } = button;

  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border-2 border-primary text-primary bg-transparent",
    destructive: "bg-destructive text-primary-foreground",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`px-5 py-3.5 rounded-xl flex-row items-center justify-center gap-2 ${variants[variant]} ${disabled || loading ? "opacity-60" : ""} ${className}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text
          className={
            variant === "outline"
              ? "text-primary font-medium"
              : "text-primary-foreground font-medium"
          }
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const DoctorCard: FC<DoctorCardProps> = ({
  id,
  firstName,
  lastName,
  fullName,
  profilePictureUrl,
  primarySpecialty,
  subSpecialties,
  teleconsultPrice,
  clinicVisitPrice,
  homecarePrice,
  primaryAction,
  secondaryAction,
  onPressCard,
}) => {
  const { doctors: bookmarkedDoctors = [] } = useBookmarkedDoctors();

  const CardWrapper = onPressCard ? TouchableOpacity : View;

  return (
    <CardWrapper
      onPress={onPressCard}
      activeOpacity={onPressCard ? 0.95 : 1}
      className="bg-card rounded-2xl overflow-hidden shadow-lg mx-4 mb-5 border border-gray-200"
    >
      <View className="p-5 flex-row">
        {/* Profile Picture */}
        <View className="mr-4">
          {profilePictureUrl ? (
            <Image
              source={{ uri: profilePictureUrl }}
              className="w-20 h-20 rounded-2xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 rounded-2xl bg-primary/20 items-center justify-center">
              <Text className="text-primary text-2xl font-bold">
                {firstName?.[0]}
                {lastName?.[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View className="flex-1">
          <Text className="text-xl font-bold text-foreground">
            {fullName ||
              `${firstName || ""} ${lastName || ""}`.trim() ||
              "Dr. Unknown"}
          </Text>
          <Text className="text-muted-foreground mt-1">
            {primarySpecialty?.name || "General Practitioner"}
          </Text>

          {subSpecialties && subSpecialties.length > 0 && (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {subSpecialties.slice(0, 3).map((sub) => (
                <View
                  key={sub.id}
                  className="bg-primary/10 px-3 py-1 rounded-full"
                >
                  <Text className="text-primary text-xs font-medium">
                    {sub.name}
                  </Text>
                </View>
              ))}
              {subSpecialties.length > 3 && (
                <Text className="text-muted-foreground text-xs">
                  +{subSpecialties.length - 3} more
                </Text>
              )}
            </View>
          )}

          <View className="flex-row gap-4 mt-4">
            {teleconsultPrice != null && (
              <Text className="text-xs text-muted-foreground">
                Video: KES {teleconsultPrice}
              </Text>
            )}
            {clinicVisitPrice != null && (
              <Text className="text-xs text-muted-foreground">
                Clinic: KES {clinicVisitPrice}
              </Text>
            )}
            {homecarePrice != null && (
              <Text className="text-xs text-muted-foreground">
                Home: KES {homecarePrice}
              </Text>
            )}
          </View>
        </View>

        {/* Bookmark */}
        <View className="absolute top-4 right-4">
          <BookmarkDoctorButton doctorId={id} size={26} />
        </View>
      </View>

      {/* Optional Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <View className="px-5 pb-5 border-t border-gray-200 pt-4">
          {secondaryAction ? (
            <View className="flex-row gap-3">
              {primaryAction && (
                <ActionButton button={primaryAction} className="flex-1" />
              )}
              <ActionButton button={secondaryAction} className="flex-1" />
            </View>
          ) : primaryAction ? (
            <ActionButton button={primaryAction} />
          ) : null}
        </View>
      )}
    </CardWrapper>
  );
};
