import React, { useRef } from 'react';
import {useState, useEffect} from 'react';
import {View, Text, ScrollView, Alert, ToastAndroid} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import Crypto from 'crypto-js';
import {encryptForDrive, encryptText} from '../../common/fileFunctions';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { walletProvider } from '../../Utils/Provider';
import { getAccountDetails } from '../../Utils/ImportWallet';
import { setAccountInfo } from '../../Utils/AsyncStorage';
import { useDispatch } from 'react-redux';
import { loginUser, setAddress } from '../../store/Actions/action';
import { ActivityIndicator } from 'react-native-paper';
import { transferToSmartWallet } from '../../Utils/SmartWallet';
import { API_KEY } from '../../Utils/Api';
import {useNavigation} from '@react-navigation/native';
import GDrive from 'react-native-google-drive-api-wrapper';
import { getUserId } from '../../common/Storage';
import axios from 'axios';





var RNFS = require('react-native-fs');

const ChooseSecurityPin = ({navigation, route}) => {
  const codeRef=useRef()
  const [percentage,setPercentage]=useState(0)
  const [pin, setPin] = useState('');
  const navigations = useNavigation();
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedPin, setConfirmedPin] = useState('');
  const [loading,setLoading]=useState(false)
  const dispatch = useDispatch();
  const setLogin=(val)=>dispatch(loginUser(val))

  const processText=async()=>{
    setLoading(true)
    const text=await encryptText(route.params.phrase, pin, navigation);
    //console.log('Text',text)
    if(text==false || text==undefined){
      setLoading(false)
      ToastAndroid.showWithGravityAndOffset(
        'Error while creating file',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
    else{
      fetchPrivateKey();
    }
  }

  const processDriveText=async()=>{
    const text=await encryptForDrive(route.params.phrase, pin);
    setPercentage(15);
    if(text!=false && text!=undefined){
      console.log(text)
      setPercentage(28)
      setPercentage(35)
      await _uploadDriveData(text);
      try {
        setPercentage(45)
        //const sp = "clean gossip jar often rent coconut detect gossip crush invest vicious weapon"
        const WalletInfo = await getAccountDetails(route.params.phrase);
        if(WalletInfo) {
          setPercentage(74)
          fetchAddress(WalletInfo);
          setAccountInfo(WalletInfo);
          setPercentage(85)
          transferToSmartWallet({
            privateKey : API_KEY,
            to : WalletInfo?.accountAddress?.first,
            amount : "0.1"
          }).then((response) => {
            setPercentage(98)
            console.log(response)
          }).catch ((err) => {
            console.log(err.message);
          })
          //alert(WalletInfo?.accountAddress?.first)
        }
        setLogin(true)
        ToastAndroid.showWithGravityAndOffset(
          'Account created Successfully',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        
        setTimeout(()=>{
          navigations.reset({
            index: 0,
            routes: [{name: 'Dashboard'}],
          });
        },0) 
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  }
  
  const fetchAddress = address => dispatch(setAddress(address));

  useEffect(() => {
    setTimeout(() => {
      // Fix auto focus for Android
      codeRef.current.focus()
    }, 500)
  }, [codeRef])

  const fetchPrivateKey = async () => {
    
    try {
      //const sp = "clean gossip jar often rent coconut detect gossip crush invest vicious weapon"
      const WalletInfo = await getAccountDetails(route.params.phrase);
      if(WalletInfo) {

        fetchAddress(WalletInfo);
        setAccountInfo(WalletInfo);
        transferToSmartWallet({
          privateKey : API_KEY,
          to : WalletInfo?.accountAddress?.first,
          amount : "0.1"
        }).then((response) => {
          console.log(response)
        }).catch ((err) => {
          console.log(err.message);
        })
        //alert(WalletInfo?.accountAddress?.first)
      }
      setLogin(true)
      ToastAndroid.showWithGravityAndOffset(
        'Account created Successfully',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      
      setTimeout(()=>{
        navigations.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
      },0) 
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  {/*Drive Functionalities*/}
const _initGoogleDrive = async () => {
  // Getting Access Token from Google
  let token = await GoogleSignin.getTokens();
  if (!token) return alert('Failed to get token');
  console.log('res.accessToken =>', token.accessToken);
  // Setting Access Token
  GDrive.setAccessToken(token.accessToken);
  // Initializing Google Drive and confirming permissions
  GDrive.init();
  // Check if Initialized
  return GDrive.isInitialized();
};

React.useEffect(()=>{
  _initGoogleDrive();
},[])

const _uploadDriveData = async (text) => {

  const userId=await getUserId();
  try {
    // Check if file selected
    //setLoading(true);
    if (!(await _initGoogleDrive())) {
      return alert('Failed to Initialize Google Drive');
    }
    // Create Directory on Google Device
    let directoryId = await GDrive.files.safeCreateFolder({
      name: 'Komet',
      parents: ['root'],
    });
    console.log('directoryId -> ', directoryId);
    let fileName = userId + '.txt';
    // Check upload file response for success
    console.log('Text in Drive',text)
    let result = await GDrive.files.createFileMultipart(
      text,
      'application/text',
      {
        parents: [directoryId],
        name: fileName,
      },
      false,
    );
    // Check upload file response for success
    if (!result.ok) return alert('Uploading Failed');
    // Getting the uploaded File Id
    let fileId = await GDrive.files.getId(
      fileName,
      [directoryId],
      'application/text',
      false,
    );
    console.log({
      "fileId": fileId,
      "userId": userId
    })
    //setInputTextValue('');
    //alert(`Uploaded Successfull.`);
    await axios.post('https://x8ki-letl-twmt.n7.xano.io/api:Zg-JWWx8/AddFileId',{
      "fileId": fileId,
      "userId": userId
    }).then((res)=>console.log('Res',res.data)).catch((error)=>console.log(error))
  } catch (error) {
    console.log('Error->', JSON.stringify(error));
    alert(`Error-> ${error}`);
    setLoading(false);
  }
 
};
{/*Drive Functionalities*/}
  

  const authorizePin = () => {
    console.log(pin, confirmedPin);
    if (pin.length > 0 && confirmedPin.length > 0) {
      if (pin == confirmedPin) Alert.alert('Successful');
    } else {
      //console.log(pin, confirmedPin);
      Alert.alert('Keys does not match');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        padding: 30,
        alignItems: 'center',
        backgroundColor: themeColor.primaryBlack,
      }}>
      <Header navigation={navigation}/>
      <View>
        <Text
          style={{
            color: 'white',
            fontFamily: typography.semiBold,
            fontSize: 24,
            textAlign: 'center',
            marginBottom: 40,
          }}>
          {confirmed ? 'Re-enter' : 'Enter'} Pin
        </Text>
        <SmoothPinCodeInput
        ref={codeRef}
          autoFocus={true}
          password
          restrictToNumbers
          mask="﹡"
          cellSize={36}
          codeLength={4}
          cellSpacing={12}
          onFulfill={confirmed ? null : () => setConfirmed(true)}
          value={confirmed ? confirmedPin : pin}
          cellStyle={{
            borderWidth: 2,
            borderRadius: 24,
            borderColor: 'white',
            backgroundColor: themeColor.primaryBlack,
          }}
          cellStyleFocused={{
            borderWidth: 2,
            borderRadius: 24,
            borderColor: '#1951EC',
            backgroundColor: themeColor.primaryBlack,
          }}
          textStyle={{
            fontFamily: typography.medium,
            color: 'white',
            fontSize: 24,
          }}
          textStyleFocused={{
            fontFamily: typography.medium,
            color: 'white',
            fontSize: 24,
          }}
          onTextChange={
            confirmed
              ? password => setConfirmedPin(password)
              : password => setPin(password)
          }
        />
        {confirmedPin.length > 2 && (
          <Text
            style={{
              alignSelf: 'center',
              margin: 10,
              color: confirmedPin == pin ? 'green' : 'red',
              fontFamily: typography.medium,
            }}>
            {confirmedPin == pin ? 'Matched' : 'Pin does not match'}
          </Text>
        )}
      </View>
      <View></View>
      {loading?
      <ActivityIndicator size={'large'}/>:
      <>
      {confirmed && (confirmedPin == pin)?
        <GradientButton
          text={' Confirm '}
          colors={['#FF8DF4', '#89007C']}
          onPress={() => {
            //navigation.navigate('Dashboard');
            confirmedPin == pin ?
            (
              setLoading(true),
              setTimeout(() => {
                processDriveText()
              }, 200)
            )
              :Alert.alert('Please re-enter your Pin');
            //_signIn();
            //decryptText();
          }}
        />
      :null}
</>}
      <View></View>
    </View>
  );
};

export default ChooseSecurityPin;
