import { View,Image} from 'react-native'
import React from 'react'
import { Text } from '~/components/ui/text';

export default function index() {
  return (
    <View className="flex-1 ">
      <Image
        className="flex-1 w-full"
        resizeMode="cover"
        source={require("assets/splash-icon.png")}
      />
      <View className='absolute bottom-5 self-center'>
        <Text className='font-bold text-xl italic text-primary-foreground'> powered by Android</Text>
      </View>
     
    </View>
  );
}