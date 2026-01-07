// src/components/doctors/InsuranceList.tsx

import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

type Insurance = {
  id: string | number;
  name: string;
};

type InsuranceListProps = {
  insurances: Insurance[];
};

const InsuranceList: React.FC<InsuranceListProps> = ({ insurances }) => {
  if (insurances.length === 0) return null;

  return (
    <View className="px-5 pb-1">
      <Text className="text-sm font-semibold text-foreground mb-2">
        Accepted Insurance
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {insurances.map((ins) => (
          <View
            key={ins.id}
            className="bg-teal-100 px-5 py-2.5 rounded-xl border border-blue-200 shadow-sm"
            style={{ elevation: 2 }}
          >
            <Text className="text-primary text-sm font-semibold tracking-wide">
              {ins.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default InsuranceList;
