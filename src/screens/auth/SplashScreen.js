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
import { GoogleSignin,GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { getUserName, saveUserData, saveUserName } from '../../common/Storage';
import { ActivityIndicator } from 'react-native-paper';
import SplashScreens from 'react-native-splash-screen'
import Lottie from 'lottie-react-native'
import GradientButton from '../../components/GradientButton';

const SplashScreen = ({navigation,route}) => {
  const loggedIn=useSelector((state)=>state.logIn)
  const [loading,setLoading]=useState(true)
  const [userInfo, setUserInfo] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [notLoggedIn,setNotLoggedInd]=React.useState(false)
  //console.log(route.params['state'])

  const login=async(token)=>{
    console.log(token)
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

  

 
  

  const _pressHandler=()=> {
    
    LocalAuth.authenticate({
        reason: 'Please authenticate yourself to use the Komet Wallet',
        fallbackToPasscode: true,    // fallback to passcode on cancel
        suppressEnterPassword: true // disallow Enter Password fallback
      })
      .then(async(success) => {
        setAuthenticated(true)
        const isSignedIn = await GoogleSignin.isSignedIn();
        console.log('SignIn',isSignedIn)
        if(isSignedIn)
        {
          const userInfo=await GoogleSignin.getCurrentUser();
          console.log('CurrentUser',userInfo)
          saveUserName(userInfo.user.name)
          //setLoading(false)
          //await GoogleSignin.signOut();
          try {
            const data = await getDataLocally(Locations.ACCOUNTS) 
            if(data!=null){
              navigation.replace('Dashboard')
            }
            else{
              navigation.replace('OnBoarding')
            }
          } catch (err) {
            //ssetLoading(false)
            navigation.replace('OnBoarding')

          }
        }
        else{
          //setNotLoggedInd(true)
          navigation.replace('OnBoarding')
   //       setLoading(false)
          return
        }
      })
      .catch(error => {
       // _pressHandler()
        //setNotLoggedInd(true)
        //setLoading(false)
//        AlertIOS.alert('Authentication Failed', error.message)
      })
  }
  

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
    SplashScreens.hide()
  //  setLoading(true)
    GoogleSignin.configure({
      // Mandatory method to call before calling signIn()
      scopes: [
       'https://www.googleapis.com/auth/drive.file',
         //'https://www.googleapis.com/auth/drive',
        // 'https://www.googleapis.com/auth/drive.file',
        // 'https://www.googleapis.com/auth/drive.appdata',
        // 'https://www.googleapis.com/auth/drive.readonly',
      ],
      webClientId:
        '277296107198-d50chhens1hleigr5kdi9evbpv99oacg.apps.googleusercontent.com',
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
{!authenticated?
<View style={{alignItems:'center'}}>
<Lottie
  
  source={require('../../../assets/Animation/Authenticate.json')}
  style={{height:200,width:200}}
  loop={false}
  
  autoPlay={true}
  
/>
<GradientButton
                  text={'Authenticate Again'}
                  colors={['#FF8DF4', '#89007C']}
                  onPress={() => {
                    
                    _pressHandler();
                  }}
                />
</View>

:<View></View>}
 
</View>
  );
};

export default SplashScreen;

{/* <GoogleSigninButton
  style={{ width: 230, height: 48,alignSelf:'center' }}
  size={GoogleSigninButton.Size.Wide}
  color={GoogleSigninButton.Color.Dark}
  onPress={_signIn}
  //disabled={this.state.isSigninInProgress}
/> */}
{/*



*/}