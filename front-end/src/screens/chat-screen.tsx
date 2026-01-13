// src/screens/Chat.tsx

import { useRef, useState, useCallback, useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";

// Only these are added for date headers
import { format, isToday, isYesterday, startOfDay } from "date-fns";

import { useAIAssistant } from "~/lib/hooks/useAIAssistant";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import ChatHeader from "~/components/chat/chat-header";
import ChatInput from "~/components/chat/chat-input";
import MessageBubble from "~/components/chat/message";
import MessageSkeleton from "~/components/chat/message-skeleton";
import ScrollToBottomButton from "~/components/chat/scroll-button";

const ChatScreen = () => {
  const {
    messages,
    inputText,
    setInputText,
    isLoading,
    sendMessage,
    loadingHistory,
  } = useAIAssistant();

  const flashListRef = useRef<any>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
    }
  };

  const scrollToBottom = useCallback((animated = true) => {
    flashListRef.current?.scrollToEnd({ animated });
  }, []);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = 150;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    setIsNearBottom(isCloseToBottom);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      if (isNearBottom || messages.length === 1) {
        setTimeout(() => scrollToBottom(), 100);
      }
    }
  }, [messages.length, isNearBottom, scrollToBottom]);

  useEffect(() => {
    if (!loadingHistory && messages.length > 0) {
      setTimeout(() => scrollToBottom(false), 300);
    }
  }, [loadingHistory, scrollToBottom]);

  const skeletonData = [
    { id: "s1", isBot: true },
    { id: "s2", isBot: false },
    { id: "s3", isBot: true },
    { id: "s4", isBot: true },
  ];

  return (
    <>
      <ChatHeader />

      <KeyboardAvoidingWrapper
        scrollEnabled={false}
        keyboardVerticalOffset={90}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-background relative">
          <FlashList
            ref={flashListRef}
            data={loadingHistory ? skeletonData : messages}
            renderItem={({ item, index }) => {
              if (loadingHistory) {
                return <MessageSkeleton isBot={item.isBot} />;
              }

              const currentMessage = item;
              const previousMessage = messages[index - 1];

              const currentDate = new Date(currentMessage.createdAt);
              const previousDate = previousMessage
                ? new Date(previousMessage.createdAt)
                : null;

              const isNewDay =
                !previousDate ||
                startOfDay(currentDate).getTime() !==
                  startOfDay(previousDate).getTime();

              const headerText = isToday(currentDate)
                ? "Today"
                : isYesterday(currentDate)
                  ? "Yesterday"
                  : format(currentDate, "MMMM d, yyyy");

              return (
                <>
                  {isNewDay && (
                    <View style={styles.dateHeader}>
                      <Text style={styles.dateHeaderText}>{headerText}</Text>
                    </View>
                  )}
                  <MessageBubble
                    text={currentMessage.text}
                    isBot={currentMessage.isBot}
                    createdAt={currentMessage.createdAt}
                  />
                </>
              );
            }}
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={{ paddingVertical: 16, paddingBottom: 20 }}
            onScroll={handleScroll}
            scrollEventThrottle={100}
            keyboardShouldPersistTaps="handled"
          />

          {!isNearBottom && messages.length > 0 && (
            <ScrollToBottomButton
              onPress={() => scrollToBottom(true)}
              visible={!isNearBottom && messages.length > 0}
            />
          )}

          {isLoading && (
            <View className="px-4 pb-3 self-start">
              <View className="bg-gray-200 rounded-2xl rounded-bl-none px-4 py-3 max-w-[70%] flex-row items-center">
                <ActivityIndicator size="small" color="#666" />
                <Text className="text-gray-600 ml-3">
                  Health Assistant is thinking...
                </Text>
              </View>
            </View>
          )}

          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
};

// Only these styles were added for the date header
const styles = StyleSheet.create({
  dateHeader: {
    alignItems: "center",
    paddingVertical: 12,
  },
  dateHeaderText: {
    backgroundColor: "#e5e5ea",
    color: "#000",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
});

export default ChatScreen;
