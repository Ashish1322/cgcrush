import { ActivityIndicator, Button, TextInput,Keyboard  ,View, TouchableWithoutFeedback ,SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useState , useRef} from 'react'
import Header from '../components/Header'
import tw from 'twrnc'
import useAuth from '../hooks/useAuth'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import { db } from '../firebase'
import { collection, doc, onSnapshot, orderBy ,query, serverTimestamp, setDoc } from 'firebase/firestore'
const Message = ({route}) => {

   

    
    const {user} = useAuth()
    const {matchDetails,secondUser} = route.params;

    

    // Finding out the documnet key for matches

    let finalKey ;

    if( user.uid > secondUser.id)
    {
      finalKey = user.uid + secondUser.id;
    }
    else
    {
      finalKey = secondUser.id + user.uid
    }

    
    const [messages,setMessages] = useState([])
    useEffect(()=> {
      const unsub = onSnapshot(  query(collection(db,'matches',finalKey,'messages'), orderBy("key","asc") ),
      (snapshot)=> setMessages (
        snapshot.docs.map ( (doc)=> ({
          ...doc.data()
        }))
      ))
      
  
      return unsub;

    },[user])

    useEffect(()=> {
      // Update the view thing to true so that notification would not be shown
      function chatRowViewed()
      {
        matchDetails[user.uid] = true
        setDoc(doc(db,'matches',finalKey),matchDetails)
      }

      if(matchDetails[user.uid]!=undefined && matchDetails[user.uid]==false)
      {
        chatRowViewed()
      }

    },[user])

    

    const [input,setInput] = useState("");
    

 
    const sendMessage = () => 
    {
      let n = messages.length + 1;
       const id = "apqrs" + n;

       const final_message = { "message": input, "id": user.uid , key: n, time: serverTimestamp()}
      
      
       setDoc(doc(db,'matches',finalKey,'messages',id),final_message);
       //setting last message
       setDoc(doc(db,'matches',finalKey,'lastmessage','lastmsg'),{text: input});
       setInput("");
       
    } 
    
 
  // Refrence to end flatlist
  const list = useRef(null);
  
 


  return (
    messages ?
    <SafeAreaView style={tw`flex-1`}>

      {/* Header */}
      <Header image={secondUser.photoUrl} title= {secondUser.displayName}  />


      {/* Messages */}
       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         
        <FlatList data={messages} 
        ref={list}
        onContentSizeChange={() => list.current.scrollToEnd({animated: true})}
        onLayout={() => list.current.scrollToEnd({animated: true})}
        style={tw`p-2`} 
        keyExtractor={item=>  item.key}
        renderItem = { ({item}) => 
        item.id === user.uid ? (<SenderMessage message={item} />) :
         (<ReceiverMessage message={item} />)} />

       </TouchableWithoutFeedback>

      {/* Keyboard */}
       
        <View 
        style={[ tw`flex-row  justify-between border-t border-gray-300 items-center px-5 py-2`]}>

            <TextInput style={tw`h-10 w-80% text-lg`}
             placeholder="Send Message..."
             onChangeText={setInput}
             value={input}
       
             multiline={true}
             onSubmitEditing={sendMessage} />
             <Button title='Send' onPress={sendMessage} color="#FF5864" />
      </View>
       
 
   
    </SafeAreaView> : 

      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}} >
      <ActivityIndicator size={50} color="blue" /> 
    </View> 
  )
}



export default Message

