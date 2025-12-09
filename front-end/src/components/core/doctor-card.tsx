// src/components/DoctorCard.tsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import type { FC } from "react";

interface Specialty {
  id: string | number;
  name: string;
}

interface DoctorCardProps {
  id: string | number;
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
  onPress?: () => void;
}

export const DoctorCard: FC<DoctorCardProps> = ({
  firstName,
  lastName,
  fullName,
  profilePictureUrl,
  primarySpecialty,
  subSpecialties,
  teleconsultPrice,
  clinicVisitPrice,
  homecarePrice,
  onPress,
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      onPress={onPress}
      className="p-4 bg-white m-2 rounded-lg shadow flex-row"
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Profile Picture */}
      <View className="mr-4">
        {profilePictureUrl ? (
          <Image
            source={{ uri: profilePictureUrl }}
            className="w-20 h-20 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-teal-100 items-center justify-center">
            <Text className="text-teal-600 text-2xl font-bold">
              {firstName?.[0]}
              {lastName?.[0]}
            </Text>
          </View>
        )}
      </View>

      {/* Doctor Info */}
      <View className="flex-1">
        <Text className="text-lg font-bold text-teal-600">{fullName}</Text>
        <Text className="text-gray-600">
          {primarySpecialty?.name || "General Practice"}
        </Text>

        {subSpecialties && subSpecialties.length > 0 && (
          <View className="mt-3">
            <Text className="text-sm font-semibold text-gray-600 mb-1">
              Sub-specialties:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {subSpecialties.map((sub) => (
                <View
                  key={sub.id}
                  className="bg-teal-100 px-3 py-1 rounded-full"
                >
                  <Text className="text-teal-800 text-xs font-medium">
                    {sub.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="flex-row justify-between mt-2">
          <Text className="text-xs text-gray-500">
            Tele: KES {teleconsultPrice}
          </Text>
          <Text className="text-xs text-gray-500">
            Clinic: KES {clinicVisitPrice}
          </Text>
          <Text className="text-xs text-gray-500">
            Home: KES {homecarePrice}
          </Text>
        </View>
      </View>
    </CardWrapper>
  );
};
