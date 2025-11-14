import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

export default function _Layout() {


    const user = false;
    if (!user) return <Redirect href="/sign-in" />;
  return (
    <Slot />
  );
}
