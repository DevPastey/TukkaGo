import { images } from '@/constants';
import { Slot } from 'expo-router';

import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function _Layout() {


  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className='bg-white h-full' keyboardShouldPersistTaps="handled">
        <View className="w-full relative" 
          style={{
            height: Dimensions.get("screen").height/2.25,
          }}
        >
          <ImageBackground source={images.loginGraphic} className='rounded-b-lg size-full' resizeMode='stretch' />
          <Image source={images.logo} className='self-center size-28 rounded-full -bottom-10 absolute z-10'/>
        </View>
        <Slot />
      </ScrollView>
      
    </KeyboardAvoidingView>
  );
}
