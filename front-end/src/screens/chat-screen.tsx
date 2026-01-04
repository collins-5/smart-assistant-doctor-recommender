// src/screens/Chat.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import { format } from "date-fns";
import { FlashList } from "@shopify/flash-list";

import { useAIAssistant, ChatMessage } from "~/lib/hooks/useAIAssistant";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import ChatHeader from "~/components/chat/chat-header";
import BookAppointmentButton from "~/components/chat/BookAppointmentButton";
import DoctorsCarousel from "~/components/chat/doctors-carousel";
import SpecialtiesGrid from "~/components/chat/specialties-grid";
import { Skeleton } from "~/components/ui/skeleton"; // ← Your skeleton component
import { Separator } from "~/components/ui/separator";

type Specialty = {
  id: number | string;
  name: string;
};

const ChatScreen = () => {
  const {
    messages,
    inputText,
    setInputText,
    isLoading,
    sendMessage,
    loadingHistory, // ← This tells us when backend history is loading
  } = useAIAssistant();

  const flashListRef = useRef<any>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
    }
  };

  // In Chat.tsx — replace your skeletonMessages with this:
  const skeletonMessages: ChatMessage[] = [
    {
      id: "s1",
      text: "", // empty text is fine
      isBot: true,
      createdAt: new Date(),
    },
    {
      id: "s2",
      text: "",
      isBot: false,
      createdAt: new Date(),
    },
    {
      id: "s3",
      text: "",
      isBot: true,
      createdAt: new Date(),
    },
    {
      id: "s4",
      text: "",
      isBot: true,
      createdAt: new Date(),
    },
  ];

 const renderSkeletonItem = ({ item }: { item: ChatMessage }) => {
   const isBot = item.isBot;

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

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isBot = item.isBot;

    const hasDoctors = item.text.includes("<DOCTORS_LIST/>");
    const hasSpecialties = item.text.includes("<SPECIALTIES_LIST/>");
    const hasBookButton = item.text.includes("<BOOK_APPOINTMENT_BUTTON/>");
    const hasAnyCard = hasDoctors || hasSpecialties || hasBookButton;

    const cleanText = item.text
      .replace(/<DOCTORS_LIST\/>/g, "")
      .replace(/<SPECIALTIES_LIST\/>/g, "")
      .replace(/<BOOK_APPOINTMENT_BUTTON\/>/g, "")
      .trim();

    return (
      <View className={`my-2 ${isBot ? "items-start" : "items-end"}`}>
        <View
          className={`
            ${hasAnyCard ? "w-full px-4" : "max-w-[85%] mx-4"}
            ${isBot ? "" : "items-end"}
          `}
        >
          <View
            className={`
              ${hasAnyCard ? "w-full" : "max-w-full"}
              rounded-2xl px-4 py-3
              ${isBot ? "bg-muted rounded-bl-none" : "bg-green-100 rounded-br-none"}
            `}
          >
            {cleanText ? (
              <Markdown
                style={{
                  body: {
                    fontSize: 15,
                    lineHeight: 22,
                    color: isBot ? "#164e63" : "#166534",
                  },
                  paragraph: { marginTop: 0, marginBottom: 8 },
                  strong: { fontWeight: "700" },
                  em: { fontStyle: "italic" },
                  heading1: {
                    fontSize: 22,
                    fontWeight: "700",
                    marginVertical: 8,
                  },
                  heading2: {
                    fontSize: 20,
                    fontWeight: "600",
                    marginVertical: 6,
                  },
                  heading3: {
                    fontSize: 18,
                    fontWeight: "600",
                    marginVertical: 6,
                  },
                  heading4: {
                    fontSize: 16,
                    fontWeight: "600",
                    marginVertical: 4,
                  },
                  bullet_list: { marginVertical: 4 },
                  ordered_list: { marginVertical: 4 },
                  list_item: { flexDirection: "row", marginBottom: 4 },
                  bullet_list_icon: { marginRight: 8, marginTop: 2 },
                  ordered_list_icon: { marginRight: 8, marginTop: 2 },
                  code_inline: {
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    fontSize: 14,
                    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    backgroundColor: "#f3f4f6",
                  },
                  code_block: {
                    padding: 12,
                    borderRadius: 8,
                    marginVertical: 8,
                    fontSize: 13,
                    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    backgroundColor: "#f3f4f6",
                  },
                  blockquote: {
                    borderLeftWidth: 4,
                    paddingLeft: 12,
                    paddingVertical: 8,
                    marginVertical: 8,
                    borderLeftColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                  },
                  hr: {
                    height: 1,
                    marginVertical: 16,
                    backgroundColor: "#e5e7eb",
                  },
                }}
              >
                {cleanText}
              </Markdown>
            ) : null}

            {/* Dynamic Components */}
            {hasDoctors && (
              <View className="mt-4 -mx-4">
                <DoctorsCarousel />
              </View>
            )}

            {hasSpecialties && (
              <View className="mt-4 -mx-4">
                <SpecialtiesGrid 
                />
              </View>
            )}

            {hasBookButton && (
              <View className="mt-4">
                <BookAppointmentButton />
              </View>
            )}

            <Text className="text-xs text-gray-500 mt-3 text-right">
              {format(item.createdAt, "HH:mm")}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <ChatHeader />

      <KeyboardAvoidingWrapper
        scrollEnabled={false}
        keyboardVerticalOffset={90}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-background">
          {/* Chat Messages or Skeleton */}
          <View style={{ flex: 1, width: "100%" }}>
            <FlashList
              ref={flashListRef}
              data={loadingHistory ? skeletonMessages : messages}
              renderItem={loadingHistory ? renderSkeletonItem : renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: 16, paddingBottom: 20 }}
              onContentSizeChange={() =>
                flashListRef.current?.scrollToEnd({ animated: true })
              }
              onLayout={() =>
                flashListRef.current?.scrollToEnd({ animated: false })
              }
              keyboardShouldPersistTaps="handled"
            />
          </View>

          {/* Typing Indicator */}
          {isLoading && (
            <View className="px-4 pb-3 self-start">
              <View className="bg-gray-200 rounded-2xl rounded-bl-none px-4 py-3 max-w-[70%] flex-row items-center">
                <ActivityIndicator size="small" color="#666" />
                <Text className="text-gray-600 ml-3">
                  {/* Health Assistant is thinking... */}
                </Text>
              </View>
            </View>
          )}

          {/* Input Bar */}
          <View className="border-t border-gray-200 bg-white px-4 py-3 flex-row items-end">
            <TextInput
              className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-base min-h-12 max-h-32"
              placeholder="Describe your symptoms..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
              className="ml-3 p-4 rounded-full bg-primary mb-1 shadow-lg"
            >
              <Ionicons
                name="send"
                size={24}
                color="white"
                style={{ opacity: !inputText.trim() || isLoading ? 0.5 : 1 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
};

export default ChatScreen;
