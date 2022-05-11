import Crypto from 'crypto-js';
var RNFS = require('react-native-fs');

export const encryptText = (text, key, navigation) => {
  var encrypted = Crypto.DES.encrypt(text, key);
  //console.log(route.params.phrase, pin);
  var path = RNFS.DocumentDirectoryPath + '/wallet.txt';
  console.log(path);
  RNFS.writeFile(path, encrypted.toString())
    .then(success => {
      console.log('FILE WRITTEN!');
    })
    .catch(err => {
      console.log(err.message);
    });
};

export const decryptText = async (pin, navigation) => {
  var path = RNFS.DocumentDirectoryPath + '/wallet.txt';
  console.log(path);
  const response = await RNFS.readFile(path);
  const decrypted = Crypto.DES.decrypt(response, pin);
  console.log(decrypted.toString(Crypto.enc.Utf8));

  //console.log(response);
  return decrypted.toString(Crypto.enc.Utf8);
};
