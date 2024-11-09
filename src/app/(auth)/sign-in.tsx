import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link } from 'expo-router'

const SignIn = () => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setisSubmitting] = useState(false)
  const submit = () => {}
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          <Image
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px] mx-auto'
          />
          <Text className='text-2xl text-white mt-5 font-psemibold mx-auto'>Login to Aora</Text>
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
            title='Sign In'
            handlePress={submit}
            containerStyles={'mt-7'}
            isLoading={isSubmitting}
            textStyles={undefined}
          />

          <View className='flex-row justify-center mt-7'>
            <Text className='text-white text-lg font-pmedium'>Don't have an account?</Text>
            <Link href={'/sign-up'} className='text-secondary text-lg font-psemibold ml-1'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn