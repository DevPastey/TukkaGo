import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import axiosInstance from '@/lib/axios';
import { Link } from 'expo-router';
import { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';

export default function SignIn() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [ password, setPassword ] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");
  
    const submit = async() => { 
      if(!form.email || !form.password) {
        Alert.alert("Error", "Please fill all input fields");
      };

      setIsSubmitting(true);

      try {
        // Autheticate user
        await axiosInstance.post("")
      } catch (error) {
        console.log("Error", error)
      }
    }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
      {/* <Text>Sign in</Text>
      <Button title='Sign Up' onPress={() => router.push("/sign-up")}/> */}

      <CustomInput 
        placeholder="Enter your email"
        value={email} 
        onChangeText={ text => setEmail( text ) }
        autoCorrect={false}
        label="Email"
        keyboardType="email-address"
      />

      <CustomInput 
        placeholder="Enter your password"
        value={password} 
        onChangeText={text => setPassword( text )  } 
        autoCorrect={false}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton title='Sign In' onPress={() => console.log(email)}/>

      <View className=' flex flex-row justify-center mt-5 gap-2'>
        <Text className='base-regular text-gray-100'>Don't have an Account?</Text>
        <Link href={"/sign-up"} className='base-bold text-primary'>Sign Up</Link>
      </View>
      

    </View>
  );
}
