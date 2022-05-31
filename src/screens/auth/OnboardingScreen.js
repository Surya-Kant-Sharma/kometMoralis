import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { saveUserData, saveUserName } from '../../common/Storage';
import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import BorderButton from '../../components/BorderButton';
import GradientButton from '../../components/GradientButton';
import CoinOnboarding from '../../components/SVG/CoinOnboarding';
import NFTOnboarding from '../../components/SVG/NFTOnboarding';
import PaintOnboarding from '../../components/SVG/PaintOnboarding';

const OnboardingScreen = ({navigation}) => {
  const {height, width} = Dimensions.get('screen');
  const [currentIndex, setCurrentIndex] = useState([0]);

  const login=async(token)=>{
    console.log(token)
    await axios.post('https://staging.komet.me/api/v1/user/v1/auth/login',{
    "idToken":token
    }).then(async(res)=>{
      console.log(res.data['userDto']['userAccountId'])
      saveUserData(res.data);
      try{
        const response= await axios.get(`https://staging.komet.me/api/v1/user/v1/wallet/drive_location`,
        {
          headers: {
            'X-USER-ID': res.data['userDto']['userAccountId']
          }
        });
        if(response.status==200){
          ToastAndroid.show('Wallet Already Exists',ToastAndroid.SHORT)
          navigation.navigate('RestoreFromDrive',{fileId:response.data['fileId']})
      }
      else{
        navigation.replace('SelectUsername')
      }
      }
      catch(error){
        console.log('Error',error)
        navigation.replace('SelectUsername')
      }
      
      
      })
  }

  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      saveUserName(userInfo.user.name)
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

  useEffect(()=>{

  },[])

  const onBoardingData = [
    
    {
      id: 1,
      text: 'Easily access and own trusted NFTs with a single click',
      image: ()=>{return <NFTOnboarding/> },
    },
    {
      id: 2,
      text: 'Progressive wallet security to safegaurd your funds.',
      image: ()=>{return <CoinOnboarding/>},
    },
    {
      id: 3,
      text: "Create your distinct identity in the  community",
      image: ()=>{return <Image source={require('../../../assets/images/OnBoarding4.png')}/>},
    },
  ];

  return (
    <View
      style={{
        backgroundColor: themeColor.primaryBlack,
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.floor(
            Math.floor(event.nativeEvent.contentOffset.x) /
              Math.floor(event.nativeEvent.layoutMeasurement.width),
          );
          setCurrentIndex(index);
          // work with: index
        }}
        data={onBoardingData}
        pagingEnabled
        renderItem={({item}) => (
          <View
            style={{
              
              paddingHorizontal: 20,
              width: width,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {item.image()}
            
            <Text
              style={{
                color: 'rgba(255,255,255,0.82)',
                fontFamily: typography.medium,
                fontSize: 18,
                textAlign: 'center',
              }}>
              {item.text}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => {
          index.toString();
        }}
      />
      <View style={{width: width, alignItems: 'center'}}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={[0, 1, 2]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={{
                margin: 10,
                height: 9,
                width: 9,
                borderRadius: 9,
                backgroundColor: item == currentIndex ? '#C74ABB' : '#C4C4C4',
              }}></View>
          )}
        />
      </View>
      <View>
        <GradientButton
          text={'Get Started with Komet Wallet'}
          colors={['#FF8DF4', '#89007C']}
          onPress={() => {
            _signIn();
            //navigation.navigate('SelectUsername');
          }}
        />
        <BorderButton
          borderColor={'#FF8DF4'}
          text={'I already have one'}
          onPress={() => {
            navigation.navigate('ImportWallet');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default OnboardingScreen;