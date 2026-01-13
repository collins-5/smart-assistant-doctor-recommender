import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import View from "~/components/ui/view";

const DashbordChatButton = () => {
  const goToChat = () => {
    router.push("(protected)/(tabs)/chat");
  };

  return (
    <TouchableOpacity
      onPress={goToChat}
      className="absolute bottom-0 flex-row right-0"
      style={{ elevation: 10 }}
      activeOpacity={0.9}
    >
      <View className="self-center p-2 bg-muted roundel-full mx-1 ">
        <Text className="font-medium text-primary text-2xl mr-4">
          How are you feeling today?
        </Text>
      </View>
      <View className="bg-primary rounded-full shadow-2xl flex-row items-center p-5">
        <Ionicons name="chatbubble-ellipses" size={32} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default DashbordChatButton;
