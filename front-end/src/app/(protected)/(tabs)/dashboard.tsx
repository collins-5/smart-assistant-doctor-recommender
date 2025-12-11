import { FlatList, Animated, ScrollView, View as RNView } from "react-native";
import { useRef } from "react";
import View from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import Header from "~/components/Dashboard/header";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";


export default function Dashboard() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View className="flex-1 bg-background">
      <Header />

      <View className="my-8 justify-center items-center">
        <Button
          text="powered by"
          onPress={() => router.push("/(onboarding)")}
          className="w-1/2"
        />
      </View>
    </View>
  );
}
