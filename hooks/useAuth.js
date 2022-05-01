import { View, Text } from 'react-native'
import React, { createContext,useContext, useEffect, useState , useMemo } from 'react'
import * as Google from 'expo-google-app-auth';
import { auth} from '../firebase';


import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from 'firebase/auth'

const AuthContext = createContext({}) 

const config =  {
  iosClientId: "804935391963-g437ebvhfdepi4n6roes06042olm1643.apps.googleusercontent.com",
  androidClientId: "804935391963-mneklrcvbh41enq0q15pofutchp5ffrp.apps.googleusercontent.com",
 
  androidStandaloneAppClientId: "804935391963-j0gth8oeqdeb2ne2i01k1d95kdcbscol.apps.googleusercontent.com",
  scopes: ["profile","email"],
  permissions : ["public_profile","email","gender","location"]

}

export const  AuthProvider = ( {children}  ) => {

  const [error,setError] = useState(null);
  const [user,setUser] = useState(null);
  const [loadinInitial, setLoadingInitial] = useState(true)
  const [loading,setLoading] = useState(false)


  useEffect(()=> 
    onAuthStateChanged(auth, (user)=> {
      if(user)
      {
        // Login 
        setUser(user)
        // Checking if the user is new or has been logged in previously

      }
      else{
        // Not Login
        setUser(false)
      } 
      setLoadingInitial(false)
    })
  ,[])

 


 const logout  =  ()=>{
   setLoading( true);
   signOut(auth).catch((error)=> setError(error)).finally(setLoading(false));

 }
  
  const SignInWithGoogle = async () => {
    setLoading(true)
     await Google.logInAsync(config).then(async (logInResult )=>{
       if(logInResult.type ==='success')
       {
         // Login

         const {idToken, accessToken} = logInResult;
         const credential = GoogleAuthProvider.credential(idToken,accessToken);
         await signInWithCredential(auth,credential)
          

       }

       return Promise.reject();
      
     }).catch(error => setError(error)).finally(()=>setLoading(false))
  }

  const memoedValue = useMemo(()=> ({ 
    user  ,
     SignInWithGoogle , 
     loading , 
     error ,
      logout  

  }),[user,loading,error ])

  return (
    <AuthContext.Provider value={memoedValue}>
    
        {!loadinInitial && children}
     
    </AuthContext.Provider>
  )
}


export default function useAuth()
{
        return useContext(AuthContext )
}