import React, { useState } from 'react';
import {View, Text, Image, StatusBar, TouchableOpacity, Alert} from 'react-native';
import {themeColor} from '../../common/theme';
import 'react-native-get-random-values';

import '@ethersproject/shims';
import {ethers} from 'ethers';
import {useDispatch, useSelector} from 'react-redux';
import {getProvider} from '../../store/Actions/action';
import { getDataLocally } from '../../Utils/AsyncStorage';
import { Locations } from '../../Utils/StorageLocations';
import TouchID from 'react-native-touch-id';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation,route}) => {
  const loggedIn=useSelector((state)=>state.logIn)

  const [userInfo, setUserInfo] = React.useState(false);
  //console.log(route.params['state'])
  const userLogin = async () => {
    var bool=false;
    try {
      const data = await getDataLocally(Locations.ACCOUNTS) 
      console.log(data)
      bool=true;
        setUserInfo(true);
       // setLogin(true)
      
    } catch (err) {
      bool=false;
      console.log(err)
      alert(err.message)
      
    }
    return bool
  }

  

 
  
  const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };

  const navigate=async(state)=>{
    console.log('inside',state)
    if(state!=null)
        state?navigation.replace('Dashboard'):navigation.navigate('OnBoarding')
    
    
  }

  const onAuthenticate = (navigation,state) => {
    var auth=false;
    TouchID.authenticate(
      'Scan your fingerprint on the device scanner to continue',
      optionalConfigObject,
    )
      .then(async(res) => {
        try {
          const data = await getDataLocally(Locations.ACCOUNTS) 
          if(data!=null){
            navigation.replace('Dashboard')
          }
          else{
            navigation.navigate('OnBoarding')
          }

          
        } catch (err) {
          bool=false;
          console.log(err)
          navigation.navigate('OnBoarding')
          alert(err.message)
          
        }
//        navigate(state)
        //console.log(userInfo)
       
        //setAuthenticate(true);
        //Alert.alert('Authenticated successfully');
       
        //onGoogleButtonPress();
      })
      .catch(error => {
        Alert.alert(error.message);
        return false
        //setAuthenticate(false);
       
      });
      
  };

  React.useEffect(() => {
    onAuthenticate(navigation,loggedIn);
    // provider = new ethers.providers.JsonRpcProvider(
    //   'https://rinkeby.infura.io/v3/d02fb37024ef430b8f15fdacf9134ccc',
    // );
    //fetchProvider(provider);
    //   contract = new ethers.Contract(daiAddress, daiAbi, provider);
    //   fetchBlockNumber();
  }, [loggedIn]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColor.primaryBlack,
      }}>
      <StatusBar backgroundColor={themeColor.primaryBlack} />
      <TouchableOpacity>
        <Image source={require('../../../assets/images/Logo.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default SplashScreen;


{/*



*/}