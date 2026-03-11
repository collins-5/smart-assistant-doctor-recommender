import React from "react";
import { View, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "../ui/skeleton";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48 - 16) / 3;

const SKELETON_COUNT = 15;

const SlotSkeletonGrid: React.FC = () => {
  const skeletonItems = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

  const renderSkeletonItem = () => (
    <View
      className="m-1 items-center justify-center flex-row rounded-2xl border border-gray-200 p-2 bg-card"
      style={{ width: ITEM_WIDTH }}
    >
      <Skeleton className="rounded-full" style={{ width: 28, height: 28 }} />
      <View className="ml-2 flex-1">
        <Skeleton className="mb-2" style={{ width: 60, height: 16 }} />
        <Skeleton style={{ width: 40, height: 12 }} />
      </View>
    </View>
  );

  return (
    <>
      <View className="bg-card rounded-2xl p-6 border border-gray-200 mb-4">
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="calendar" size={24} color="rgb(14, 103, 126)" />
          <Skeleton style={{ width: 120, height: 20 }} />
        </View>
        <Skeleton
          className="rounded-xl"
          style={{ width: "100%", height: 40 }}
        />
      </View>

      <View className="bg-card rounded-2xl p-6 border border-gray-200 mb-4">
        <View className="flex-row items-center gap-3 mb-2">
          <Ionicons name="time-outline" size={24} color="rgb(14, 103, 126)" />
          <Skeleton style={{ width: 150, height: 20 }} />
        </View>
        <Skeleton style={{ width: 100, height: 16 }} />
      </View>

      <FlashList
        data={skeletonItems}
        renderItem={renderSkeletonItem}
        numColumns={3}
        keyExtractor={(item) => `skeleton-${item}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 1,
          flexDirection: "column-reverse",
        }}
      />
    </>
  );
};

export default SlotSkeletonGrid;
