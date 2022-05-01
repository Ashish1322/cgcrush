import { FlatList, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import useAuth from '../hooks/useAuth';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Chatrow from './Chatrow';

const Chatlist = () => {

    const [matches,setMatches] =  useState([]);
    const {user}= useAuth();

   useEffect(()=> {
    const unsub = onSnapshot(  query( collection(db,'matches'), where('usersMatches','array-contains',user.uid) ), (snapshot)=> setMatches(
        snapshot.docs.map( (doc) => ({
            id: doc.id,
            ...doc.data()
        }))


    ))
 
   // Sorting the matches according to the timestamp so that they can displayed accordingly
   

    return unsub;
   },[user])
 

   // To sort the matches 
   useEffect(()=>{
    if(matches.length > 0)
    {
 
     function compare( a, b ) {
       if ( a.timestamp < b.timestamp ){
         return 1;
       }
       if ( a.timestamp > b.timestamp ){
         return -1;
       }
       return 0;
     }
      let a = matches
      a.sort(compare)
      console.log(a[0])
      setMatches(a)
    
    }
   },[matches])
  

   
   
  
  
  return (
  
    <FlatList style={tw`h-full`} data={matches} keyExtractor={item => item.id} renderItem={ ({item}) => <Chatrow matchDetails = {item} currUser={user.uid} />}  /> 


    
  )
}

export default Chatlist

