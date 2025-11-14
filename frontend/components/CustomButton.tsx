import { CustomButtonProps } from '@/types';
import React from 'react';
import { View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import cn from "clsx";

export default function CustomButton({title="Click Me", onPress, style, textStyle, leftIcon, isLoading=false}: CustomButtonProps) {
  return (
    <TouchableOpacity className={cn("custom-btn", style)} onPress={onPress}>
        {leftIcon}

        <View className='flex flex-row'>
            {isLoading ? (
                <ActivityIndicator size="small" color="white" />) 
                : (
                <Text className={cn("text-white-100 paragraph-semibold", textStyle)}>{title}</Text>
            )}
        </View>
        
    </TouchableOpacity>
  );
}
