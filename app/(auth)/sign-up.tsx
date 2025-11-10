import { router } from 'expo-router';
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function SignUp() {
  return (
    <View>
      <Text>Sign up</Text>
      <Button title='Sign In' onPress={() => router.push("/sign-in")}/>
      
     </View>
  );
}
