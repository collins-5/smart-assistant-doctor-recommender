// src/components/doctors/ConsultationPrices.tsx

import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

type ConsultationPricesProps = {
  teleconsultPrice?: number | string | null;
  clinicVisitPrice?: number | string | null;
  homecarePrice?: number | string | null;
};

const ConsultationPrices: React.FC<ConsultationPricesProps> = ({
  teleconsultPrice,
  clinicVisitPrice,
  homecarePrice,
}) => {
  const hasAnyPrice =
    teleconsultPrice != null ||
    clinicVisitPrice != null ||
    homecarePrice != null;

  if (!hasAnyPrice) return null;

  return (
    <View className="p-0">
      <Text className="text-sm px-4 font-medium text-foreground">
        Consultation modes
      </Text>
      <View className="flex-row gap-2 px-8 mb-2">
        {teleconsultPrice != null && (
          <View className="bg-primary p-1 rounded-2xl justify-center items-center h-8">
            <Text className="text-xs text-primary-foreground">
              Video: {teleconsultPrice} /=
            </Text>
          </View>
        )}
        {clinicVisitPrice != null && (
          <View className="bg-primary p-1 rounded-2xl justify-center items-center h-8">
            <Text className="text-xs text-primary-foreground">
              Clinic: {clinicVisitPrice} /=
            </Text>
          </View>
        )}
        {homecarePrice != null && (
          <View className="bg-primary p-1 rounded-2xl justify-center items-center h-8">
            <Text className="text-xs text-primary-foreground">
              Home: {homecarePrice} /=
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ConsultationPrices;
