import { router } from 'expo-router';
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function SignIn() {
  return (
    <View>
      <Text>Sign in</Text>
      <Button title='Sign Up' onPress={() => router.push("/sign-up")}/>
    </View>
  );
}
