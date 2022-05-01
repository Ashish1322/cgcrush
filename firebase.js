
 
  import { initializeApp } from "firebase/app";
  import {getAuth } from 'firebase/auth'
  import {getFirestore} from 'firebase/firestore'
  

  const firebaseConfig = {
    apiKey: "AIzaSyBipNDzF8obSbk-vpQhGGT4dRGop0H8130",
    authDomain: "cgc-crush.firebaseapp.com",
    projectId: "cgc-crush",
    storageBucket: "cgc-crush.appspot.com",
    messagingSenderId: "804935391963",
    appId: "1:804935391963:web:d4b2ad22b9f1386616cafe"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth()
  const db = getFirestore();

  export {db,auth} 
 