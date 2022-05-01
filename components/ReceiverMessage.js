import { View, Text, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'
const ReceiverMessage = ( {message}) => {
  return (
    <View style={[tw`flex-row items-center  my-2 mx-2`,{maxWidth: "70%"}]} >
      
      <View style={[tw`rounded-lg rounded-tl-none px-5 py-3 mx-2`,{backgroundColor: "#FF5864"}]}>
        <Text style={tw`text-white`} >{message.message}</Text>
      </View>
    </View>
  )
}

export default ReceiverMessage