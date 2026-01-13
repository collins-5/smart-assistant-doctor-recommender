// src/components/ui/SkeletonList.tsx

import React from "react";
import { View, ScrollView } from "react-native";

type Direction = "vertical" | "horizontal";

interface SkeletonListProps {
  skeletonComponent: React.FC<any>;
  count: number;
  direction?: Direction; // Optional – defaults to 'vertical'
  horizontalScrollEnabled?: boolean; // Optional: control scrolling in horizontal mode
}

const SkeletonList: React.FC<SkeletonListProps> = ({
  skeletonComponent: SkeletonComponent,
  count,
  direction = "vertical", // ← Defaults to vertical if not provided
  horizontalScrollEnabled = true,
}) => {
  const items = Array.from({ length: count }, (_, index) => (
    <SkeletonComponent key={index} />
  ));

  // Vertical layout (single column) – default
  if (direction === "vertical") {
    return <View className="gap-4">{items}</View>;
  }

  // Horizontal scrollable row
  if (direction === "horizontal") {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 py-2"
        scrollEnabled={horizontalScrollEnabled}
      >
        {items}
      </ScrollView>
    );
  }

  // Fallback (should not occur due to default)
  return null;
};

export default SkeletonList;
