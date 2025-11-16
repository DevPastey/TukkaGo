import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/useUserStore';
import constants from 'expo-constants';
import { Link } from 'expo-router';
import { useState } from 'react';
import { View, Text, Alert } from 'react-native';


const MODE= constants.expoConfig?.extra?.MODE;

export default function SignIn() {

  const {isSubmitting, login} = useUserStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

    const handleSubmit = async() => { 
      if(!form.email || !form.password) {
        Alert.alert("Error", "Please fill all input fields");
      };

      

      console.log(form);

      const success = await login(form);

      // if(success) {
      //   setForm({
      //     email: "",
      //     password: "",
      //   })
      // };


  
    }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
      {/* <Text>Sign in</Text>
      <Button title='Sign Up' onPress={() => router.push("/sign-up")}/> */}

      <CustomInput 
        placeholder="Enter your email"
        value={form.email} 
        onChangeText={ (text) => setForm( (prev) => ({ ...prev, email: text }) ) }
        autoCorrect={false}
        label="Email"
        keyboardType="email-address"
      />

      <CustomInput 
        placeholder="Enter your password"
        value={form.password} 
        onChangeText={ (text) => setForm( (prev) => ({ ...prev, password: text }) ) } 
        autoCorrect={false}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton title='Sign In' isLoading={isSubmitting} onPress={handleSubmit}/>

      <View className=' flex flex-row justify-center mt-5 gap-2'>
        <Text className='base-regular text-gray-100'>Don't have an Account?</Text>
        <Link href={"/sign-up"} className='base-bold text-primary'>Sign Up</Link>
      </View>
      

    </View>
  );
}
