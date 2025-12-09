import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';

import View from '~/components/ui/view';

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("assets/core/not-found.svg")}
          className="w-96 h-96"
          contentFit="contain"
        />
        <Link
          href="/(tabs)/dashboard"
          className="text-primary underline"
          replace
        >
          Go to home screen
        </Link>
      </View>
    </>
  );
};

export default NotFoundScreen;
