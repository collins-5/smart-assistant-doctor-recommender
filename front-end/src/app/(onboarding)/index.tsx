import { View,Image} from 'react-native'
import React from 'react'

export default function index() {
  return (
    <View className="flex-1 ">
      <Image
        className="flex-1 w-full"
        resizeMode="cover"
        source={require("assets/splash-icon.png")}
      />
     
    </View>
  );
}