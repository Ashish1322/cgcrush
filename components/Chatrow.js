import { TouchableOpacity, ActivityIndicator, StyleSheet  ,Image, Text, View } from 'react-native'
import {React,useState,useEffect} from 'react'
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native'
import { getDoc,doc } from 'firebase/firestore'
import { db } from '../firebase'



const Chatrow = ( {matchDetails, currUser}) => {

    // Finding the id of the second person excep who is loging to fetch his deatia like photo and Name
    const [secondUser, setSecondUser] = useState(null);
    const [lastMessage,setLastMessage] = useState(null);
    const [notification,setNotification] = useState(null);
    const navigation = useNavigation();
  

    useEffect(()=> {
      let temp;
      if (matchDetails.usersMatches[0]===currUser)
      temp = matchDetails.usersMatches[1];
      else
      temp = matchDetails.usersMatches[0];
  
  
      getDoc(doc(db,'users',temp)).then( (snapshot)=> {
        setSecondUser(snapshot.data())
    
      })

      // Fetching the key for match so that we get last messge
      let finalKey;
      temp>currUser? finalKey = temp+currUser: finalKey=currUser+temp
    
      // Fetching the last message from the final key
      getDoc(doc(db,'matches',finalKey,'lastmessage','lastmsg')).then((snapshot)=>
      {
        if(snapshot.exists())
        {
          const txt = snapshot.data().text
          if(txt.length > 20)
          {
            let result = txt.substring(0, 20) + ".....";
            setLastMessage(result)

          }
          else
          {
            setLastMessage(txt)
          }
        
        }
        else
        {
          setLastMessage("Hey!")
        }
        
      }
      )

      // Check for notification
      if(matchDetails[currUser]!=undefined)
      {
        matchDetails[currUser] ? setNotification(false) : setNotification(true)
      }
      else
      {
        setNotification(false)
      }

   
    },[matchDetails,currUser])


  
    
  const ready = secondUser && lastMessage && (notification!=null)
 
    
  return (
    ready ?
    <TouchableOpacity onPress={()=>navigation.navigate('Message',{matchDetails,secondUser})}  style={[tw`flex-row p-3 m-4 items-center `,{backgroundColor: 'white'}, styles.cardShadow, 
    {  elevation: notification ? 6 : 2, shadowOpacity: notification ? 0.5: 0.2, }
    
    ]}>


         <View>
            <Image style={tw`h-15 w-15 rounded-full`} source={{uri: secondUser?.photoUrl}} />
         </View>

         <View style={tw`mx-5`}>
            <Text style={tw`font-semibold text-lg`}> {secondUser?.displayName} </Text>
            <Text> { lastMessage ? lastMessage : 'Hey !' } </Text>
         </View>

      
    </TouchableOpacity> : 
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}} >
      <ActivityIndicator size={50} color="blue" /> 
    </View> 
  )
}

export default Chatrow

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor:"#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.1,
    elevation: 2

  },

})

