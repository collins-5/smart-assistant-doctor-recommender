import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import { format } from "date-fns";
import { FlashList } from "@shopify/flash-list"; 

import { useAIAssistant, ChatMessage } from "~/lib/hooks/useAIAssistant";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper"; // your wrapper
import ChatHeader from "~/components/chat/chat-header";

const Chat = () => {
  const { messages, inputText, setInputText, isLoading, sendMessage } =
    useAIAssistant();

  const flashListRef = useRef<any>(null);

  const handleSend = () => {
    sendMessage(inputText);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isBot = item.isBot;

    return (
      <View className={`my-2 mx-4 ${isBot ? "items-start" : "items-end"}`}>
        <View
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isBot
              ? "bg-cyan-100 rounded-bl-none"
              : "bg-green-100 rounded-br-none"
          }`}
        >
          {/* <Text
            className={`text-base leading-6 ${
              isBot ? "text-cyan-900" : "text-green-900"
            }`}
          >
            {item.text}
          </Text> */}
          <Markdown
            style={{
              body: { fontSize: 15, lineHeight: 22 },
              paragraph: { marginTop: 0, marginBottom: 8 },
              strong: { fontWeight: "700" },
              em: { fontStyle: "italic" },
              heading1: {
                fontSize: 22,
                fontWeight: "700",
                marginTop: 16,
                marginBottom: 8,
              },
              heading2: {
                fontSize: 20,
                fontWeight: "600",
                marginTop: 14,
                marginBottom: 6,
              },
              heading3: {
                fontSize: 18,
                fontWeight: "600",
                marginTop: 12,
                marginBottom: 6,
              },
              heading4: {
                fontSize: 16,
                fontWeight: "600",
                marginTop: 10,
                marginBottom: 4,
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
              fence: {
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
            {item.text}
          </Markdown>
          <Text className="text-xs text-gray-500 mt-2 text-right">
            {format(item.createdAt, "HH:mm")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
    <ChatHeader/>      
      <KeyboardAvoidingWrapper
        scrollEnabled={false} // ← Disable inner ScrollView – FlashList handles scrolling
        keyboardVerticalOffset={90}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-background">
          <View style={{ flex: 1, width: "100%" }}>
            <FlashList
              ref={flashListRef}
              data={messages}
              renderItem={renderMessage}
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
              <View className="bg-gray-200 rounded-2xl rounded-bl-none px-4 py-3 max-w-[60%] flex-row items-center">
                <ActivityIndicator size="small" color="#666" />
                <Text className="text-gray-600 ml-3">
                  Health Assistant is thinking...
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
              disabled={inputText.trim() === "" || isLoading}
              className="ml-3 p-3 rounded-full bg-primary mb-1"
            >
              <Ionicons
                name="send"
                size={24}
                color="white"
                style={{
                  opacity: inputText.trim() === "" || isLoading ? 0.5 : 1,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
};

export default Chat;
