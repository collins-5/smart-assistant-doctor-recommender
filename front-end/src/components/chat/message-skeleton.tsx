// src/components/chat/MessageSkeleton.tsx
import React from "react";
import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";

interface MessageSkeletonProps {
  isBot: boolean;
}

const MessageSkeleton: React.FC<MessageSkeletonProps> = ({ isBot }) => {
  return (
    <View className={`my-3 ${isBot ? "items-start" : "items-end"}`}>
      <View className="mx-4 max-w-[85%]">
        <View
          className={`
            rounded-2xl px-4 py-3
            ${isBot ? "bg-cyan-100 rounded-bl-none" : "bg-green-100 rounded-br-none"}
          `}
        >
          <View className="space-y-2">
            <Skeleton className="h-4 w-48 rounded-full" />
            <Skeleton className="h-4 w-64 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-full" />
          </View>
          <View className="mt-3 flex-row justify-end">
            <Skeleton className="h-3 w-12 rounded-full" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MessageSkeleton;
