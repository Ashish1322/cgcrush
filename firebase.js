
 
  import { initializeApp } from "firebase/app";
  import {getAuth } from 'firebase/auth'
  import {getFirestore} from 'firebase/firestore'
  

  const firebaseConfig = {
    apiKey: "Api kye here",
    authDomain: "cgc-crush.firebaseapp.com",
    projectId: "cgc-crush",
    storageBucket: "cgc-crush.appspot.com",
    messagingSenderId: "804935391963",
    appId: "App id here"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth()
  const db = getFirestore();

  export {db,auth} 
 
