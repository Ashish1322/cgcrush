import { StyleSheet ,Text, View, ActivityIndicator ,SafeAreaView ,TouchableOpacity,Platform ,Image} from 'react-native'
import {React, useEffect, useRef , useState, useLayoutEffect } from 'react'
import tw from 'twrnc'
import useAuth from '../hooks/useAuth'
import {MaterialIcons , AntDesign, Entypo, MaterialCommunityIcons}from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generate-id';
import { CommonActions } from '@react-navigation/native';




const Home = ( {navigation}) => {

 

  const swipeRef = useRef(null)
  const {user, logout ,loading} = useAuth()
  const [profiles, setProfiles] = useState([])
  const [notification,setNotification] = useState(false)

  useLayoutEffect(()=> {
    if(user)
    {
    getDoc(doc(db,'users',user.uid)).then((snapshot)=> {
      // User is new as not in database
      if(!snapshot.exists())
      {
        navigation.navigate('modal')
      }
    })
    }
  })

 useEffect(()=> {
    let unsub;
    
    
    const fetchCards = async ()  => {

      let passedUsers = []
      let matchedUsers = []

      const passes =  await getDocs(collection(db,"users",user.uid,"passes"));
      passes.forEach((doc)=> {
        passedUsers.push(doc.id)
      })

      const matches = await getDocs(collection(db,'users',user.uid,'matches'))
      matches.forEach((doc)=>{
        matchedUsers.push(doc.id)
      })

      if(passedUsers.length === 0)
      {
        passedUsers = ["text"]
      }
      if(matchedUsers.length === 0)
      {
        matchedUsers = ["text"]
      }
       
        
      unsub =  onSnapshot(query(collection(db,'users'), where('id','not-in',[...passedUsers,...matchedUsers])) , (snapshot) => { 
        setProfiles( snapshot.docs.filter(doc=> doc.id !== user.uid).map ((doc)=> ({
          id: doc.id,
          ...doc.data(),
        })))
      })
      
    } 

    fetchCards()
    return unsub
 } , [user])

 // To check for dot sign on the chat as notification
 useEffect(()=> {
   
  const unsub = onSnapshot( query( collection(db,'matches'), where(user.uid,'==',false) ), (snapshot)=> {
     if(snapshot.docs.length > 0)
     {
       setNotification(true)
     }
  },)

return unsub;
 },[])
  
 // Reject
  const swipeLeft  =  ( cardIndex) => {

    if(!profiles[cardIndex])
    {
      return
    }
    
    const userSwiped = profiles[cardIndex] ;
    setDoc(doc(db,'users',user.uid,'passes',userSwiped.id), userSwiped)


  }

  // Match
  const swipeRight = async ( cardIndex ) => {
    if(!profiles[cardIndex])
    return
    

    const userSwiped = profiles[cardIndex]
    const currenUser = await ( await getDoc(doc(db,'users',user.uid))).data();
   

    
    // check if user swiped on you
    getDoc(doc(db,'users',userSwiped.id,'matches' , user.uid)).then((snapshot)=> {
       if(snapshot.exists())
       {
         // Matches
         setDoc(doc(db,'users',user.uid,'matches',userSwiped.id),userSwiped)
         
         // Creating a Match
         setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)),{
           users: {
             [user.uid] : currenUser,
             [userSwiped.id]: userSwiped
           },
           usersMatches: [user.uid, userSwiped.id],
           timestamp: serverTimestamp(),
           // To give dot sign on the home message button to second user
           [userSwiped.id] : false

        

         
         } );

         // Setting up Initial Messages messages
         setDoc(doc(db,'matches', generateId(user.uid, userSwiped.id), 'messages','apqrs01'),{ "id": user.uid, "message": "Hey!", "key":0})
    
  
         

         navigation.navigate("Match",{
           currenUser,userSwiped
         })

       }
       else
       {

        // First Interaction
        console.log("first")
        setDoc(doc(db,'users',user.uid,'matches',userSwiped.id),userSwiped)
       }

    })

  
  }

  return (
   profiles ?
    <SafeAreaView style={[tw`flex-1 `, {paddingTop: Platform.OS === "android" ? 25 : 0}]}>

     {/* Header */}
      <View style={[tw`flex-row  items-center relative justify-between px-5`, Platform.OS === 'android' ? tw`py-5`: tw`py-0`]}>

        <TouchableOpacity onPress={logout}>
          <Image style={tw`h-10 w-10 rounded-full`} source={{uri: user.photoURL}}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate('modal')}>
          <Image style={tw`h-14 w-18 rounded-xl`} source={require("../assets/removedb.png")}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate('chat')} >
          {
            notification ?
            <MaterialIcons name='mark-chat-unread' size={32} color="#FF5864" />:
        <MaterialCommunityIcons name='message' size={32} color="#FF5864" /> 
          

          }
         
        </TouchableOpacity>



      </View> 
     {/* End Header */}


     
     
     {/* Card Starting */}
     {/* Show the card only once profiles are loaded */}
     {  profiles ?
     <View style={tw`flex-1 -mt-6`}>
      <Swiper 
      ref={swipeRef}
      cards={profiles} 
      stackSize={5}
      cardIndex={0}
      animateCardOpacity
      verticalSwipe={false}
      overlayLabels={{
        left: {
          title: "NOPE",
          style: {
            label:{
            textAlign: "right",
            color: "red"
            },
          },
          
        },
        right: {
          title: "Match",
          style: {
            label: {
          
            color: "green"
            },
          }
        }
      }}
      onSwipedLeft = { (cardIndex)=> {
        swipeLeft(cardIndex);
      }}

      onSwipedRight = { (cardIndex) => {
        swipeRight(cardIndex);
      }}
     
      containerStyle={{backgroundColor: "transparent"}}
      renderCard={ (card) => card ? 
        (
        <View key={card.id} style={tw`relative  h-3/4 rounded-xl h-3/4 bg-white`}>

          <Image style={tw`absolute top-0 h-full w-full rounded-xl `} source={{uri: card.photoUrl}} />

          <View style={[tw`flex-row px-2 px-6 py-2 items-center absolute bottom-0 bg-white w-full h-20 justify-between rounded-b-xl`, styles.cardShadow]}>
            <View > 
              <Text style={tw`text-xl font-bold`}>{card.displayName}</Text>
              <Text> {card.job}</Text>
            </View>
            <Text style={tw`text-2xl font-bold`}> {card.age}</Text>


          </View> 

      </View>
       
      ) : 
      ( <View style={tw`relative  h-3/4 rounded-xl h-3/4 bg-white justify-center items-center`}>
        <Text style={tw`font-bold pb-5`}> No More Profiles</Text>
        <Image style={tw`h-20 w-20`}  source={{uri:"https://links.papareact.com/6gb"}} />
        </View> )}/>
      </View> :
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}} >
      <ActivityIndicator size={50} color="blue" /> 
    </View> 

}
    {/* Cards Ending */}

    {/* Bottom Button Starting */}
        <View style={tw`flex flex-row justify-evenly my-4`}>
          <TouchableOpacity
          onPress={()=> swipeRef.current.swipeLeft()}
            style={tw`bg-red-200 rounded-full w-15 h-15 justify-center items-center`}>
            <Entypo name='cross' size={24} />
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> swipeRef.current.swipeRight()} style={tw`bg-green-200 rounded-full w-15 h-15 justify-center items-center`}>

            <AntDesign name='heart' size={24}  />
          </TouchableOpacity>
        </View>
    {/* Bottom Button Ending */}

    </SafeAreaView> : 
    <ActivityIndicator color="blue" size={30} />

  )
}

const styles = StyleSheet.create({
  cardShadow : {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  }
})

export default Home

