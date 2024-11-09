import { Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Link } from 'expo-router'

const index = () => {
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-3xl'>Aora!</Text>
      <StatusBar style='auto' />
      <Link href={'/profile'} className='text-blue-500 text-xl'>Go to Profile</Link>
    </View>
  )
}

export default index