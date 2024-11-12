import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'

const SearchInput = ({title,value,placeholder,handleChangeText,otherStyles,keyboardType,...props}) => {

    const [showPassword, setShowPassword] = useState(false)
    return (
        <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
            <TextInput
                value={value}
                onChangeText={handleChangeText}
                placeholder={"Search for a Video Topic"}
                placeholderTextColor={'#7b7b8b'}
                keyboardType={keyboardType}
                secureTextEntry={title==='Password' && !showPassword}
                className='text-base mt-0.5 text-white flex-1 font-pregular'
            />
            <TouchableOpacity>
                <Image
                    source={icons.search}
                    className='w-5 h-5'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    )
}

export default SearchInput