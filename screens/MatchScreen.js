import { StyleSheet, Text, View , TouchableOpacity, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'

const MatchScreen = ( {route, navigation}) => {
    const {  currenUser,userSwiped} = route.params;

    
  return (
    <View style={ [tw`h-full bg-red-500 pt-15`, {opacity: 0.88} ]}>
      <View style={tw`justify-center px-7 pt-20 `}>
          <Image style={tw`h-20`} source={{uri: "https://links.papareact.com/mg9"}} />

        
      </View>

      <Text style={tw`text-white text-center mt-8`}> You and {userSwiped.displayName} have liked each other.</Text> 

      <View style={tw`flex-row justify-evenly mt-13`}>
          <View>
            <Image style={tw`h-30 w-30 rounded-full `} source={{uri:currenUser.photoUrl}} />

           

          </View>
          <View>
          <Image style={tw`h-30 w-30 rounded-full `} source={{uri:userSwiped.photoUrl}} />

          
          </View>
      </View>

      <View style={tw`mt-20`}>
          <TouchableOpacity onPress={()=> {
              navigation.goBack();
              navigation.navigate("chat")
          }} style={[tw` p-6 rounded-full mx-10`, {backgroundColor: "white"}]} >
               <Text style={[tw`text-center`]}>Send a Message</Text>  
          </TouchableOpacity>
      </View>


    </View>
  )
}

export default MatchScreen

