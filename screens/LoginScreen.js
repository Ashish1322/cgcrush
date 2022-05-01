import { View, Text, ActivityIndicator , ImageBackground, TouchableOpacity } from 'react-native'
import React, {useEffect} from 'react'
import tw from 'twrnc'
import useAuth from '../hooks/useAuth';




const LoginScreen = ( {navigation }) => {

  
  const {SignInWithGoogle, loading} = useAuth() ;

  return (
    <View style={tw`flex-1`}>
      <ImageBackground 
      resizeMode='cover'
      style={tw`flex-1`}
      source={require("../assets/bg.png")}>
        
       
        <TouchableOpacity style={[tw`absolute bottom-40 w-52 bg-white p-4 rounded-2xl` , {marginHorizontal: "20%"}]} onPress={ SignInWithGoogle}>
          {
            !loading ?
          <Text style={tw`font-semibold text-center`}> Sign In & get Matched</Text> :
          <ActivityIndicator color="lightblue" size={30} />
}
        </TouchableOpacity>

      
      </ImageBackground>

    </View>
  )
}

export default LoginScreen;

