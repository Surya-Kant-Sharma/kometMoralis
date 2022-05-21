import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import Crypto from 'crypto-js';
import { PermissionsAndroid, ToastAndroid } from 'react-native';
import GDrive from 'react-native-google-drive-api-wrapper';
import { getUserId } from './Storage';
var RNFS = require('react-native-fs');

export const encryptText = async(text, key, navigation) => {
  var bool=false;
  try{
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
    const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
   
    if(!readGranted || !writeGranted ) {
      console.log('Read and write permissions have not been granted');
      return;
    }
    var encrypted = Crypto.DES.encrypt(text, key);
    //console.log(route.params.phrase, pin);
    var path = RNFS.ExternalDirectoryPath + '/wallet.txt';
    console.log(path)
    //console.log(`RNFS.ExternalStorageDirectoryPath/Downloads`);
    
    await RNFS.writeFile(path, encrypted.toString())
      .then(success => {
        
        ToastAndroid.showWithGravityAndOffset(
          'Wallet Created. Fetching Address from blockchain....',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        console.log('FILE WRITTEN!');
        bool=true;
      })
      .catch(err => {
        console.log(err.message);
        bool=false;
      });
  }catch(error){
    bool=false
  }
  
    return bool
};




export const encryptForDrive = async(text, key, navigation) => {
  try{
    var encrypted = await Crypto.DES.encrypt(text, key);
    console.log('encrypted',encrypted.toString());
    return encrypted.toString()
    //console.log(`RNFS.ExternalStorageDirectoryPath/Downloads`
  }catch(error){
    return false
  }
};

export const decryptText = async (pin, navigation) => {
  const userId=await getUserId();
  var stringResponse=false;
  try{
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      stringResponse=''
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
    const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
   
    if(!readGranted || !writeGranted ) {
      stringResponse=''
      console.log('Read and write permissions have not been granted');
      return;
    }
    var path = RNFS.ExternalDirectoryPath + `/${userId}.txt`;
    
    console.log(path);
    const response = await RNFS.readFile(path);
    try{
    const decrypted = Crypto.DES.decrypt(response, pin);
    console.log(decrypted.toString(Crypto.enc.Utf8));
    
    stringResponse=decrypted.toString(Crypto.enc.Utf8);
    console.log(stringResponse.length);
    }
    catch (error){
      stringResponse=''
    }
  }catch(error){
    stringResponse=''
  }
  
  return stringResponse;
};

export const decryptDriveText = async (pin, path, navigation) => {
  var stringResponse=false;
  try{
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      stringResponse=''
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
    const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
   
    if(!readGranted || !writeGranted ) {
      stringResponse=''
      console.log('Read and write permissions have not been granted');
      return;
    }
    else{
      try{ 
        console.log(path);
        const response = await RNFS.readFile(path);
        try{
        const decrypted = Crypto.DES.decrypt(response, pin);
        console.log(decrypted.toString(Crypto.enc.Utf8));
        
        stringResponse=decrypted.toString(Crypto.enc.Utf8);
        //console.log(stringResponse.length);
        }
        catch (error){
          stringResponse=''
        }
      }catch(error){
        stringResponse=''
      }
    }
    
  }catch{
    stringResponse=''
  }
  
  
  return stringResponse;
};
