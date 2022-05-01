import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { auth } from '../firebase'

const SenderMessage = ( {message}) => {
  return (
    <View style={[tw`bg-purple-500  rounded-tr-none px-5 py-3 my-2 mx-2 rounded-lg`,{alignSelf: "flex-start" , marginLeft: "auto",maxWidth: "70%"}]}>
      <Text style={tw`text-white`}>{message.message}</Text>
    </View>
  )
}

export default SenderMessage