import { StyleSheet, Text, TextComponent, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import Home from './screens/Home';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import useAuth from './hooks/useAuth';

import MatchScreen from './screens/MatchScreen';
import Message from './screens/Message';
import Imageselect from './screens/Imageselect';
import { db } from './firebase';
import { getDoc,doc } from 'firebase/firestore';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

    const {user} = useAuth( ) ;
    

    

  return (
    <Stack.Navigator>
   
     
     
        {user ? (
            <>
            <Stack.Group>
             
              
              <Stack.Screen name='home' component={Home} options={{title: "Home" , headerShown:false}} /> 
              <Stack.Screen name='chat' component={ChatScreen} options={{title: "Chat",headerShown:false}} />
              <Stack.Screen name='Message' component={Message} options={{title: "Message",headerShown:false}} />
              
              
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen name="modal" component={Imageselect} options={{headerShown:false}} />
        </Stack.Group>

        <Stack.Group screenOptions={{presentation: 'transparentModal'}}>
          <Stack.Screen name="Match" component={MatchScreen} options={{headerShown:false}} />
        </Stack.Group>

       
      
        </> ): 
        <Stack.Screen name='login' component={LoginScreen} options={{title: "Login" , headerShown:false}} /> 
           }

        
       
    </Stack.Navigator>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})