// src/components/dashboard/SpecialtyCard.tsx

import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import Icon from "~/components/ui/icon";
import { specialtyIconMap } from "~/lib/store/services";

type Specialty = {
  id: number | string;
  name: string;
};

const SpecialtyCard: React.FC<{ specialty: Specialty }> = ({ specialty }) => {
  const iconName = specialtyIconMap[specialty.name] || "medical-bag";

  return (
    <View
      className="w-32 bg-white rounded-3xl shadow-lg overflow-hidden"
      style={{ elevation: 6 }}
    >
      <View className="pb-4 items-center justify-center">
        <View className="w-16 h-16 bg-teal-100/60 rounded-2xl items-center justify-center">
          <Icon name={iconName} size={28} color="#0d9488" />
        </View>
        <Text className="mt-3 font-semibold text-foreground text-center text-sm">
          {specialty.name}
        </Text>
      </View>
    </View>
  );
};

export default SpecialtyCard;
