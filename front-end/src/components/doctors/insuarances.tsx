// src/components/doctors/InsuranceList.tsx

import React from "react";
import { View, Image, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Text } from "~/components/ui/text";

type Insurance = {
  id: string | number;
  name: string;
  logoUrl?: string | null;
};

type InsuranceListProps = {
  insurances: Insurance[];
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const InsuranceList: React.FC<InsuranceListProps> = ({ insurances }) => {
  const validInsurances = insurances.filter((ins) => ins.name?.trim());

  if (validInsurances.length === 0) return null;

  return (
    <View className="px-5 pb-4">
      <Text className="text-sm font-semibold text-foreground mb-3">
        Accepted Insurance
      </Text>

      <View >
        <FlashList
          data={validInsurances}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          ItemSeparatorComponent={() => <View style={{ width: 5 }} />} 
          renderItem={({ item }) => (
            <View className="items-center justify-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
              {item.logoUrl ? (
                <Image
                  source={{ uri: item.logoUrl }}
                  className="w-16 h-8"
                  resizeMode="contain"
                  onError={(e) =>
                    console.log(
                      "Logo load error:",
                      item.name,
                      e.nativeEvent.error
                    )
                  }
                />
              ) : (
                <Text className="text-primary text-xs font-semibold text-center px-2">
                  {item.name}
                </Text>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default InsuranceList;
