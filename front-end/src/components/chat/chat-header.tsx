import Icon from "../ui/icon";
import { Text } from "../ui/text";
import View from "../ui/view";

const ChatHeader = () => {
  return (
    <View className="h-16 flex-row items-center bg-primary px-4 shadow-sm">
      <View className="flex-1 flex-row items-center gap-3">
        <Icon name="robot" color="white" size={32} />
        <Text className="text-2xl font-semibold text-primary-foreground tracking-wide">
          SDR-ai
        </Text>
      </View>
    </View>
  );
};

export default ChatHeader;
