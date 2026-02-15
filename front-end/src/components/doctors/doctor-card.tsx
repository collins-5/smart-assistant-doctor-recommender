import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import type { FC } from "react";
import { BookmarkDoctorButton } from "../core/bookmark-button";
import Icon from "../ui/icon";
import { Button } from "~/components/ui/button"; // ← Your new Button component
import InsuranceList from "./insuarances";
import ConsultationPrices from "./consulatation-prices";

interface Specialty {
  id: string | number;
  name: string;
}

interface County {
  name: string;
  country: {
    name: string;
  };
}

interface Insurance {
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
  id: string;
  title?: string | null;
  firstName?: string | null;
  bio?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  profilePictureUrl?: string | null;
  primarySpecialty?: Specialty | null;
  subSpecialties?: Specialty[] | null;
  teleconsultPrice?: number | string | null;
  clinicVisitPrice?: number | string | null;
  homecarePrice?: number | string | null;
  county?: County | null;
  insuarance?: Insurance[] | null;
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
  onPressCard?: () => void;
}

export const DoctorCard: FC<DoctorCardProps> = ({
  id,
  firstName,
  lastName,
  fullName,
  bio,
  profilePictureUrl,
  primarySpecialty,
  subSpecialties,
  teleconsultPrice,
  clinicVisitPrice,
  homecarePrice,
  county,
  insuarance,
  primaryAction,
  secondaryAction,
  onPressCard,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const onTextLayout = (event: any) => {
    const { lines } = event.nativeEvent;
    if (lines.length > 4) {
      setIsTruncated(true);
    }
  };

  const locationText = county ? `${county.name}, ${county.country.name}` : null;

  const CardWrapper = onPressCard ? TouchableOpacity : View;

  const insurances = Array.isArray(insuarance)
    ? insuarance
    : insuarance
      ? [insuarance]
      : [];

  return (
    <CardWrapper
      onPress={onPressCard}
      activeOpacity={onPressCard ? 0.95 : 1}
      className="bg-card rounded-2xl overflow-hidden shadow-lg mx-4 mb-2 border border-gray-200"
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

          <Text className="text-muted-foreground">
            {primarySpecialty?.name || "General Practitioner"}
          </Text>

          {/* Location: County, Country */}
          {locationText && (
            <Text className="text-muted-foreground text-sm">
              <Icon
                name="map-marker-radius-outline"
                className="text-destructive ml-r"
                size={16}
              />
              {locationText}
            </Text>
          )}

          {subSpecialties && subSpecialties.length > 0 && (
            <View className="mt-1 flex-row flex-wrap gap-2">
              {subSpecialties.slice(0, 1).map((sub) => (
                <View
                  key={sub.id}
                  className="bg-primary/10 px-3 py-1 rounded-full"
                >
                  <Text className="text-primary text-xs font-medium">
                    {sub.name}
                  </Text>
                </View>
              ))}
              {subSpecialties.length > 1 && (
                <Text className="text-muted-foreground text-xs">
                  +{subSpecialties.length - 1} more
                </Text>
              )}
            </View>
          )}

          {bio && (
            <View className="mt-2">
              <Text
                className="text-gray-700 text-base leading-6"
                numberOfLines={isExpanded ? undefined : 4}
                onTextLayout={!isExpanded ? onTextLayout : undefined}
              >
                {bio}
              </Text>
              {isTruncated && (
                <Text
                  onPress={() => setIsExpanded(!isExpanded)}
                  className="text-primary font-semibold mt-2"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Bookmark */}
        <View className="absolute top-4 right-4">
          <BookmarkDoctorButton doctorId={id} size={26} />
        </View>
      </View>

      <InsuranceList insurances={insurances} />

      <ConsultationPrices
        teleconsultPrice={teleconsultPrice}
        clinicVisitPrice={clinicVisitPrice}
        homecarePrice={homecarePrice}
      />

      {/* Optional Action Buttons — Now using your new Button component */}
      {(primaryAction || secondaryAction) && (
        <View className="px-5 pb-5 border-t border-gray-200 pt-4">
          {secondaryAction ? (
            <View className="flex-row gap-3">
              {primaryAction && (
                <Button
                  text={primaryAction.text}
                  onPress={primaryAction.onPress}
                  variant={primaryAction.variant}
                  loading={primaryAction.loading}
                  disabled={primaryAction.disabled}
                  className="flex-1 text-center"
                />
              )}
              <Button
                text={secondaryAction.text}
                onPress={secondaryAction.onPress}
                variant={secondaryAction.variant}
                loading={secondaryAction.loading}
                disabled={secondaryAction.disabled}
                className="flex-1 text-center"
              />
            </View>
          ) : primaryAction ? (
            <Button
              text={primaryAction.text}
              onPress={primaryAction.onPress}
              variant={primaryAction.variant}
              loading={primaryAction.loading}
              disabled={primaryAction.disabled}
            />
          ) : null}
        </View>
      )}
    </CardWrapper>
  );
};
