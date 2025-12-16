import { FlatList, Animated, ScrollView, View as RNView } from "react-native";
import { useRef } from "react";
import View from "~/components/ui/view";
import Header from "~/components/Dashboard/header";


export default function Dashboard() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View className="flex-1 bg-background">
      <Header />
    </View>
  );
}
