// src/components/ui/bottom-sheets/generic-select-sheet.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet from "react-native-actions-sheet";
import { SheetManager } from "react-native-actions-sheet";
import { Button } from "~/components/ui/button";
import Icon from "~/components/ui/icon";

type SelectItem = {
  id: string | number;
  name: string;
};

type GenericSelectSheetPayload = {
  title: string;
  data: SelectItem[];
  selectedId?: string | number | null;
};

type GenericSelectSheetProps = {
  payload: GenericSelectSheetPayload;
};

const GenericSelectSheet: React.FC<GenericSelectSheetProps> = ({ payload }) => {
  const insets = useSafeAreaInsets();
  const { title, data, selectedId } = payload;

  const handleClose = () => {
    SheetManager.hide("generic-select-sheet");
  };

  const handleSelect = (id: string | number | null) => {
    // We'll handle selection in the calling component via onSelect callback
    // This sheet only closes — selection is handled externally
    SheetManager.hide("generic-select-sheet");
  };

  return (
    <ActionSheet
      id="generic-select-sheet"
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      containerStyle={{
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: "#ffffff",
      }}
      indicatorStyle={{ width: 50, height: 5, backgroundColor: "#e5e7eb" }}
      onClose={handleClose}
    >
      <View className="py-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-foreground">{title}</Text>
          <Button variant="ghost" onPress={handleClose} size="icon">
            <Icon name="close" size={28} color="#374151" />
          </Button>
        </View>

        {/* All Option */}
        <TouchableOpacity
          onPress={() => handleSelect(null)}
          className={`px-5 py-4 rounded-xl border mb-3 ${
            selectedId == null
              ? "bg-primary border-primary"
              : "bg-white border-gray-300"
          }`}
        >
          <Text
            className={`font-medium text-left ${selectedId == null ? "text-white" : "text-foreground"}`}
          >
            All {title}
          </Text>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
          <View className="gap-2">
            {data.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelect(item.id)}
                className={`px-5 py-4 rounded-xl border ${
                  selectedId === item.id
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`font-medium text-left ${selectedId === item.id ? "text-white" : "text-foreground"}`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </ActionSheet>
  );
};

export default GenericSelectSheet;

// Proper typing for SheetManager
export type GenericSelectSheetDefinition = {
  payload: GenericSelectSheetPayload;
};
