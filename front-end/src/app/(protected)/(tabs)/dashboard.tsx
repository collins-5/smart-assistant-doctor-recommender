import {
  FlatList,
  Animated,
  ScrollView,
  View as RNView,
  TouchableOpacity,
} from "react-native";
import { useRef } from "react";
import View from "~/components/ui/view";
import Header from "~/components/Dashboard/header";
import { TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useAIAssistant } from "~/lib/hooks/useAIAssistant";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { router } from "expo-router";

export default function Dashboard() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const { messages, inputText, setInputText, isLoading, sendMessage } =
    useAIAssistant();

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      router.push("(protected)/(tabs)/chat")
    }
  };

  return (
    <>
      <KeyboardAvoidingWrapper
        scrollEnabled={false}
        keyboardVerticalOffset={90}
        showsVerticalScrollIndicator={false}
      >
        <Header />
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
            className="ml-3 p-3 rounded-full bg-primary mb-1"
          >
            <Ionicons
              name="send"
              size={24}
              color="white"
              style={{ opacity: !inputText.trim() || isLoading ? 0.5 : 1 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
}
