import { SafeAreaView, Text , Button} from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Header from '../components/Header'
import Chatlist from '../components/Chatlist'

const ChatScreen = ({navigation}) => {
  return (
    <SafeAreaView >
      <Header title="Chat"   />
      <Chatlist />
      
    </SafeAreaView>
  )
}

export default ChatScreen