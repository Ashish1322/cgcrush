import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import {Ionicons , Foundation}from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const Header = ({title , callEnabled, image}) => {


  const navigation = useNavigation();
  return (
    <View style={ [tw`flex-row items-center justify-between p-2`, {paddingTop: Platform.OS === "android" ? 25 : 0}] } >
      <View style={tw`flex flex-row items-center`}>
          <TouchableOpacity onPress={()=> navigation.goBack() } style={tw`p-2`}>
            <Ionicons name='chevron-back-outline' size={35} color="#FF5864"/>
          </TouchableOpacity>
          {
            image ?
          <Image style={tw`w-10 h-10 rounded-full`} source={{uri: image}} />
          : null
          } 
          <Text style={tw`text-2xl font-bold p-2`}>
            {title}
          </Text>
      </View>

      {callEnabled && (
        <TouchableOpacity style={tw`bg-red-200 rounded-full mr-4 p-2`}>
          <Foundation name='telephone' size={25} color="red" />
        </TouchableOpacity>
      )}
      
      
  
    </View>
  )
}

export default Header