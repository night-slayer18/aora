import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const SignUp = () => {
  const {setUser, setisLoggedIn} = useGlobalContext()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [isSubmitting, setisSubmitting] = useState(false)
  const submit = async () => {
    if(!form.username || !form.email || !form.password){
      Alert.alert('Error', 'All fields are required')
    }
    setisSubmitting(true)
    try {
      const result = await createUser(form.email, form.password, form.username)
      setUser(result)
      setisLoggedIn(true)
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    }
    finally{
      setisSubmitting(false)
    }
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[87vh] px-4 my-6'>
          <Image
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px] mx-auto'
          />
          <Text className='text-2xl text-white mt-5 font-psemibold mx-auto'>Signup to Aora</Text>
          <FormField
            title='Username'
            value={form.username}
            handleChangeText={(e: any)=>setForm({...form, username: e})}
            otherStyles='mt-10'
            keyboardType={undefined}
            placeholder={undefined}
          />
          <FormField
            title='Email'
            value={form.email}
            handleChangeText={(e: any)=>setForm({...form, email: e})}
            otherStyles='mt-7'
            keyboardType='email-address'
            placeholder={undefined}
          />
          <FormField
            title='Password'
            value={form.password}
            handleChangeText={(e: any)=>setForm({...form, password: e})}
            otherStyles='mt-7'
            placeholder={undefined}
            keyboardType={undefined}
          />
          <CustomButton
            title='Sign Up'
            handlePress={submit}
            containerStyles={'mt-7'}
            isLoading={isSubmitting}
            textStyles={undefined}
          />

          <View className='flex-row justify-center mt-7'>
            <Text className='text-white text-lg font-pmedium'>Already have an account?</Text>
            <Link href={'/sign-in'} className='text-secondary text-lg font-psemibold ml-1'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp