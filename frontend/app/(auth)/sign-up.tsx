import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function SignUp() {
  const [ password, setPassword ] = useState<string>("");
  const [ confirPassword, setConfirmPassword ] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");

  return (
    <View className='gap-6 bg-white rounded-lg p-5 mt-5'>
          {/* <Text>Sign in</Text>
          <Button title='Sign Up' onPress={() => router.push("/sign-up")}/> */}

          <CustomInput 
            placeholder="Enter your email"
            value={email} 
            onChangeText={ (text) => setEmail( text ) }
            autoCorrect={false}
            label="Email"
            keyboardType="email-address"
          />
    
          <CustomInput 
            placeholder="Enter your email"
            value={email} 
            onChangeText={ (text) => setEmail( text ) }
            autoCorrect={false}
            label="Email"
            keyboardType="email-address"
          />
    
          <CustomInput 
            placeholder="Enter your password"
            value={password} 
            onChangeText={(text) => setPassword( text )  } 
            autoCorrect={false}
            label="Password"
            secureTextEntry={true}
          />

          <CustomInput 
            placeholder="Confirm your password"
            value={password} 
            onChangeText={(text) => setConfirmPassword( text )  } 
            autoCorrect={false}
            label="Confirm Password"
            secureTextEntry={true}
          />

          <CustomButton title='Sign Up' onPress={}/>
    
          <View className=' flex flex-row justify-center items-center mt-5 gap-2'>
            <Text className='base-regular text-gray-100'>Already have an Account?</Text>
            <Link href={"/sign-in"} className='base-bold text-primary'>Sign In</Link>
          </View>
          
    
        </View>
  );
}
