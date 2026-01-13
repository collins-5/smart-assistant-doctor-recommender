import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import Icon from "~/components/ui/icon";

interface ScrollToBottomButtonProps {
  onPress: () => void;
  visible: boolean;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  onPress,
  visible,
}) => {
  if (!visible) return null;

  return (
    <View>
      <View className="flex justify-end absolute bottom-0 right-4">
        <Button
          onPress={onPress}
          className="rounded-full text-center w-12"
          leftIcon={<Icon name="chevron-down" />}
        />
      </View>
    </View>
  );
};

export default ScrollToBottomButton;
