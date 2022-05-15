import Crypto from 'crypto-js';
import { PermissionsAndroid, ToastAndroid } from 'react-native';
var RNFS = require('react-native-fs');
export const encryptText = async(text, key, navigation) => {
  var bool=false;
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
    return bool
};

export const decryptText = async (pin, navigation) => {
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
  var path = RNFS.ExternalDirectoryPath + '/wallet.txt';
  var stringResponse=false;
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
  return stringResponse;
};
