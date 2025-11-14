import { CustomInputProps } from '@/types';
import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import cn from "clsx";

export default function CustomInput({
    placeholder, autoCorrect, value, onChangeText, label, secureTextEntry=false, keyboardType="default"
}: CustomInputProps) {
    const [isFocused, setIsFocused] = useState<boolean>()
  return (
    <View className='w-full'>
        <Text className='label'>{label}</Text>
         <TextInput 
            autoCapitalize='none'
            autoCorrect={autoCorrect}
            value={value}
            onChange={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            placeholderTextColor={"#888"}

            className={cn("input", isFocused ? "border-primary": "border-gray-300")}
        />
    </View>

  );
}
