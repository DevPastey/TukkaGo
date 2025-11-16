import { images } from '@/constants';
import { router, Slot } from 'expo-router';
import { useState } from 'react';
import cn from "clsx";

import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function _Layout() {
  const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">("sign-in");



  const handlePress = (id: "sign-in" | "sign-up") => {
    setActiveTab(id);
    router.push(`/${id}`)
  };

  
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className='bg-white h-full' keyboardShouldPersistTaps="handled">
        <View className="w-full relative" 
          style={{
            height: Dimensions.get("screen").height/2.5,
          }}
        >
          <ImageBackground source={images.loginGraphic} className='rounded-b-lg size-full' resizeMode='stretch' />
         
          <View className='self-center size-20 flex justify-center items-center rounded-full top-[18rem] absolute z-40 bg-white'>
            <Image source={images.logo} className='self-center size-20'/>
          </View>
          <View style={styles.overlay} className='z-10 rounded-b-3xl' />

        </View>
        

        <View className='flex flex-row mt-8 justify-center items-center bg-white-100 mx-6 py-1 px-1 rounded'>
          <TouchableOpacity className={cn('justify-center items-center py-3 w-[50%] rounded', activeTab === "sign-in" ? "bg-white" : "bg-white-100")} onPress={() => handlePress('sign-in')}>
            <Text className={cn("font-semibold text-base", activeTab === "sign-in" ? "text-primary" : "text-gray-100")}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity className={cn('justify-center items-center flex w-[50%] py-3 rounded', activeTab === "sign-up" ? "bg-white" : "bg-white-100")} onPress={() => handlePress('sign-up')} > 
          <Text className={cn("font-semibold text-base" , activeTab === "sign-up"  ? "text-primary" : "text-gray-100")} >Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Slot  />
      </ScrollView>
      
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills the parent
    backgroundColor: "rgba(0,0,0,0.1)", // black with 50% opacity
    height: Dimensions.get("screen").height/2.75,
  },

});