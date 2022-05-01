import { Image, StyleSheet ,Text, View, TouchableOpacity,TextInput, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import {AntDesign}from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage,uploadBytes,ref } from 'firebase/storage';
import {setDoc,doc,serverTimestamp} from 'firebase/firestore'
import useAuth from '../hooks/useAuth';
import { db } from '../firebase';

const Imageselect = ( {navigation}) => {
  const [age,setAge] = useState(null)
  const [occupation,setOccupation] = useState(null)
  const [image,setImage] = useState(null);
  const [loading,setLoading] = useState(loading)



  const {user} = useAuth();
  

  const pickImage = async () => {
   
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

  

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadDetails = async ()=> {

    console.log("Entered")
    setLoading(true)

    // Uploading Image
    const storage = getStorage();
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    // Imageref
    const imageRef = ref(storage, `images/${user.uid}`);
    const metadata = {
        contentType: "image/jpeg",
      };

      await uploadBytes(imageRef, blob, metadata).then( async (snapshot)=> {
        const downloadUrl = await getDownloadURL(imageRef);
        setDoc(doc(db,'users',user.uid),{
          id: user.uid,
          displayName: user.displayName,
          photoUrl : downloadUrl,
          job: occupation,
          age: age, 
          timestamp: serverTimestamp()
        }).then(navigation.navigate('home'))
        .catch((error)=>{
          alert("Network issues please try agian !")
        })
      })
      setLoading(false)
  }


  const incomplete = !age || !occupation || !image;

  return (
    <>
    <SafeAreaView style={{paddingTop: Platform.OS === "android" ? 25 : 0}}>
      <View style={tw`items-center p-2`}>
      <Image style={tw`w-30 h-30 m-2 `} source={require('../assets/removedb.png')} />
      </View>
    <TouchableOpacity onPress={pickImage} style={[tw`items-center justify-center m-4 p-2 h-50`,styles.imageadd]}>
    {
      image ? 
      <Image style={tw`h-50 w-50 rounded-full`} resizeMode='cover' source={{uri: image}} />
      :
    <>
    <AntDesign name="addfile" size={40} color="black" />
    <Text style={tw`p-3 m-3 text-lg`}> Select Profile Picture</Text> 
    </> 

    }
      

    </TouchableOpacity>

    <View style={styles.input} >
    <TextInput keyboardType='numeric' onChangeText={(txt)=>setAge(txt)} style={styles.txt}   placeholder='Enter Your Age' />
    </View>
    <View style={styles.input} >
    <TextInput onChangeText={(txt)=>setOccupation(txt)} style={styles.txt}   placeholder='Enter Your Occupation/Branch' />
    </View> 

    <TouchableOpacity disabled={incomplete} style={[tw`bg-blue-400 p-4 rounded-xl m-4`, incomplete ? tw`bg-blue-200`: tw`bg-blue-400`]}>
      {
        loading ?
      <ActivityIndicator size="large" color="black" />
        :
      <Text onPress={uploadDetails} style={{textAlign: "center"}}> Submit Details</Text>
      }
    </TouchableOpacity>
    </SafeAreaView>
</>
  )
}

const styles = StyleSheet.create({
  input: {
    padding:10,
    borderColor: 'lightgrey',
    borderWidth: 2,
    margin: 20,
    borderRadius: 20,
    marginTop: 30

  },
  txt:{
    fontSize: 18,
    padding: 3
  },
  imageadd: {
    borderColor: "lightgrey",
    borderWidth: 1,
  }
})
export default Imageselect
