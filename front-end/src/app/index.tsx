import React from "react";
import { View, Image } from "react-native";
import { Text } from "~/components/ui/text";

const Index = () => {
  return (
    <View className="flex-1 bg-primary">
      <Image
        source={require("../../assets/splash-icon.png")}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute bottom-10 w-full items-center">
        <Text className="text-primary-foreground text-lg">
          Welcome to Smart Assistant
        </Text>
        <Text className="text-primary-foreground/70 mt-2">Powered by</Text>
        <Image
          source={require("../../assets/core/Gemini-AI-Logo.png")}
          className="w-20 h-20 mt-2"
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default Index;
