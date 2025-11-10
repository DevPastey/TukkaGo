import { images } from '@/constants';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';


export default function CartButton() {
    const totalItems = 10;
  return (
    <TouchableOpacity onPress={() => {}}>
        
        <View className="bg-[#181C2E] py-3 px-3 rounded-full relative">
        <Image  source={images.bag} className="size-4" resizeMode="contain"/>
        </View>
        
        {totalItems >= 1 && (
            <View className="absolute -top-1 -right-1 z-10 bg-primary flex-center size-5 rounded-full">
            <Text className=" text-white text-xs">{totalItems}</Text>
            </View>
        )}

    </TouchableOpacity>
  );
}
