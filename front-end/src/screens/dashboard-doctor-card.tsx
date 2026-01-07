// src/components/dashboard/DoctorCard.tsx

import React, { useState } from "react";
import { TouchableOpacity, Image, View } from "react-native";
import { Text } from "~/components/ui/text";
import Icon from "~/components/ui/icon";

type Specialty = {
  id: number | string;
  name: string;
};

type County = {
  name: string;
  country: {
    name: string;
  };
};

type Doctor = {
  id: number;
  title?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
  primarySpecialty?: Specialty | null;
  subSpecialties?: Specialty[] | null;
  teleconsultPrice?: number | string | null;
  clinicVisitPrice?: number | string | null;
  homecarePrice?: number | string | null;
  county?: County | null;
};

type DoctorCardProps = {
  doctor: Doctor;
  onPress: (id: number) => void;
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const onTextLayout = (event: any) => {
    const { lines } = event.nativeEvent;
    if (lines.length > 4) {
      setIsTruncated(true);
    }
  };

  const locationText = doctor.county
    ? `${doctor.county.name}, ${doctor.county.country.name}`
    : null;

  const displayName =
    doctor.fullName ||
    `${doctor.title || ""} ${doctor.firstName || ""} ${doctor.lastName || ""}`.trim() ||
    "Dr. Unknown";

  return (
    <TouchableOpacity
      onPress={() => onPress(doctor.id)}
      className="mr-5 bg-white rounded-3xl shadow-lg overflow-hidden"
      style={{ elevation: 8, width: 300 }}
      activeOpacity={0.95}
    >
      <View className="p-5 flex-row">
        {/* Profile Picture */}
        <View className="mr-4">
          {doctor.profilePictureUrl ? (
            <Image
              source={{ uri: doctor.profilePictureUrl }}
              className="w-20 h-20 rounded-2xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-24 h-24 bg-primary/20 rounded-2xl items-center justify-center">
              <Text className="text-primary text-3xl font-bold">
                {doctor.firstName?.[0]}
                {doctor.lastName?.[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Doctor Info */}
        <View className="flex-1">
          <Text className="text-xl font-bold text-foreground">
            {displayName}
          </Text>

          <Text className="text-muted-foreground mt-1 text-base">
            {doctor.primarySpecialty?.name || "General Practitioner"}
          </Text>

          {/* Location */}
          {locationText && (
            <View className="flex-row items-center mt-2">
              <Icon
                name="map-marker-radius-outline"
                size={18}
                color="#ef4444"
              />
              <Text className="text-muted-foreground text-sm ml-1">
                {locationText}
              </Text>
            </View>
          )}

          {/* Sub-specialties */}
          {doctor.subSpecialties && doctor.subSpecialties.length > 0 && (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {doctor.subSpecialties.slice(0, 1).map((sub) => (
                <View
                  key={sub.id}
                  className="bg-primary/10 px-3 py-1 rounded-full"
                >
                  <Text className="text-primary text-xs font-medium">
                    {sub.name}
                  </Text>
                </View>
              ))}
              {doctor.subSpecialties.length > 3 && (
                <Text className="text-muted-foreground text-xs self-center">
                  +{doctor.subSpecialties.length - 1} more
                </Text>
              )}
            </View>
          )}

          {/* Bio with Read More */}
          {doctor.bio && (
            <View className="mt-3">
              <Text
                className="text-foreground text-base leading-6"
                numberOfLines={isExpanded ? undefined : 4}
                onTextLayout={!isExpanded ? onTextLayout : undefined}
              >
                {doctor.bio}
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
      </View>

      {/* Prices */}
      {(doctor.teleconsultPrice != null ||
        doctor.clinicVisitPrice != null ||
        doctor.homecarePrice != null) && (
        <View className="px-1 pb-5 flex-row flex-wrap gap-1 justify-between">
          {doctor.teleconsultPrice != null && (
            <View className="bg-primary px-3 py-2 rounded-2xl">
              <Text className="text-primary-foreground text-sm font-medium">
                <Icon
                  name="video-outline"
                  size={18}
                  className="self-center text-primary-foreground"
                />{" "}
                <Text className="p-2 text-primary-foreground">
                  {doctor.teleconsultPrice}
                </Text>
              </Text>
            </View>
          )}
          {doctor.clinicVisitPrice != null && (
            <View className="bg-primary px-3 py-2 rounded-2xl">
              <Text className="text-primary-foreground text-sm font-medium">
                <Icon
                  name="hospital-building"
                  size={18}
                  className="self-center text-primary-foreground"
                />{" "}
                <Text className="p-2 text-primary-foreground">
                  {doctor.clinicVisitPrice}
                </Text>
              </Text>
            </View>
          )}
          {doctor.homecarePrice != null && (
            <View className="bg-primary px-3 py-2 rounded-2xl">
              <Text className="text-primary-foreground text-sm font-medium">
                <Icon
                  name="home-variant-outline"
                  size={18}
                  className="self-center text-primary-foreground"
                />{" "}
                <Text className="p-2 text-primary-foreground">
                  {doctor.homecarePrice}
                </Text>
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default DoctorCard;
