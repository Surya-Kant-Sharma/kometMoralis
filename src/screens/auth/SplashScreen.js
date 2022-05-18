import React, { useState } from 'react';
import {View, Text, Image, StatusBar, TouchableOpacity, Alert} from 'react-native';
import {themeColor} from '../../common/theme';
import 'react-native-get-random-values';
import LocalAuth from 'react-native-local-auth'
import '@ethersproject/shims';
import {ethers} from 'ethers';
import {useDispatch, useSelector} from 'react-redux';
import {getProvider} from '../../store/Actions/action';
import { getDataLocally } from '../../Utils/AsyncStorage';
import { Locations } from '../../Utils/StorageLocations';
import TouchID from 'react-native-touch-id';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin,GoogleSigninButton } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { saveUserData } from '../../common/Storage';
import { ActivityIndicator } from 'react-native-paper';

const SplashScreen = ({navigation,route}) => {
  const loggedIn=useSelector((state)=>state.logIn)
  const [loading,setLoading]=useState(true)
  const [userInfo, setUserInfo] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [notLoggedIn,setNotLoggedInd]=React.useState(false)
  //console.log(route.params['state'])

  const login=async(token)=>{
    await axios.post('http://staging.komet.me/api/v1/user/v1/auth/login',{
    "idToken":token
    }).then((res)=>{
      saveUserData(res.data);
      if(authenticated){
        navigation.replace('OnBoarding')
      }
      else{
        _pressHandler()
      }
    })
  }

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

  const _pressHandler=()=> {
    
    LocalAuth.authenticate({
        reason: 'Please authenticate yourself to use the Komet Wallet',
        fallbackToPasscode: true,    // fallback to passcode on cancel
        suppressEnterPassword: false // disallow Enter Password fallback
      })
      .then(async(success) => {
        setAuthenticated(true)
        const isSignedIn = await GoogleSignin.isSignedIn();
        console.log('SignIn',isSignedIn)
        if(isSignedIn)
        {
          //setLoading(false)
          //await GoogleSignin.signOut();
          try {
            const data = await getDataLocally(Locations.ACCOUNTS) 
            if(data!=null){
              navigation.replace('Dashboard')
            }
            else{
              navigation.navigate('OnBoarding')
            }
          } catch (err) {
            //ssetLoading(false)
            navigation.navigate('OnBoarding')

          }
        }
        else{
          setNotLoggedInd(true)
   //       setLoading(false)
          return
        }
      })
      .catch(error => {
        setNotLoggedInd(true)
        //setLoading(false)
//        AlertIOS.alert('Authentication Failed', error.message)
      })
  }

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
        const isSignedIn = await GoogleSignin.isSignedIn();
        console.log('SignOut',isSignedIn)
        if(isSignedIn)
        {
          await GoogleSignin.signOut();
          try {
            const data = await getDataLocally(Locations.ACCOUNTS) 
            if(data!=null){
              navigation.replace('Dashboard')
            }
            else{
              navigation.navigate('OnBoarding')
            }
          } catch (err) {
            navigation.navigate('OnBoarding')

          }
        }
        else{
          return
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
  
 {/*
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
            navigation.navigate('OnBoarding')
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
*/}
  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      login(userInfo.idToken);
      //navigation.replace('OnBoarding')
      //navigation.replace('HomeScreen', {userInfo: userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Play Services Not Available or Outdated');
      } else {
        console.log('error.message', JSON.stringify(error));
        alert(error.message);
      }
    }
  };

  // Check if User is signned in or not?
  const _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      console.log('User is already signed in');
      // Get User Info if user is already signed in
      try {
        let info = await GoogleSignin.signInSilently();
        console.log('User Info --> ', info);
        navigation.replace('OnBoarding')
        //navigation.replace('HomeScreen', {userInfo: info});
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          alert('User has not signed in yet');
          console.log('User has not signed in yet');
        } else {
          alert("Unable to get user's info");
          console.log("Unable to get user's info", error);
        }
      }
    }
  };

  React.useEffect(() => {
  //  setLoading(true)
    GoogleSignin.configure({
      // Mandatory method to call before calling signIn()
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
      webClientId:
        '638019657946-thbc2c24p6phcuir5qfpfs32saa14haf.apps.googleusercontent.com',
    });

    //onAuthenticate(navigation,loggedIn);
    console.log('Loading',loading)
    _pressHandler(navigation,loggedIn)
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
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: themeColor.primaryBlack,
      }}>
      <StatusBar backgroundColor={themeColor.primaryBlack} />
      <TouchableOpacity>
        <Image source={require('../../../assets/images/Logo.png')} />
      </TouchableOpacity>
{notLoggedIn?

<GoogleSigninButton
  style={{ width: 230, height: 48,alignSelf:'center' }}
  size={GoogleSigninButton.Size.Wide}
  color={GoogleSigninButton.Color.Dark}
  onPress={_signIn}
  //disabled={this.state.isSigninInProgress}
/>:<View></View>}
 
</View>
  );
};

export default SplashScreen;


{/*



*/}