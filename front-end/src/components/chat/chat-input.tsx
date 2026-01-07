// src/components/chat/ChatInput.tsx

import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ChatInputProps = {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  placeholder?: string;
};

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  onSend,
  isLoading = false,
  placeholder = "Describe your symptoms...",
}) => {
  const canSend = inputText.trim().length > 0 && !isLoading;

  return (
    <View className="px-6 py-4 bg-white/90 backdrop-blur-lg border-t border-gray-200">
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-6 py-4 text-base"
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          returnKeyType="send"
          onSubmitEditing={onSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          onPress={onSend}
          disabled={!canSend}
          className="ml-4 p-4 bg-teal-600 rounded-full shadow-lg"
        >
          <Ionicons
            name="arrow-forward"
            size={26}
            color="white"
            style={{ opacity: canSend ? 1 : 0.5 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;
