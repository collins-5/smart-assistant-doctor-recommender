import { View, Text } from 'react-native'
import { StatusBar } from "react-native";

export default function ThemeStatusBar() {
  return (
    <View className="bg-primary">
      <StatusBar backgroundColor={"transparent"} />
    </View>
  );
}