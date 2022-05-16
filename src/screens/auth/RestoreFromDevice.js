import React, {useEffect, useState} from 'react';

import {View, Text, ScrollView, Alert, ToastAndroid} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import {ethers} from 'ethers';
import {useDispatch, useSelector} from 'react-redux';
import {setAddress, setBalance} from '../../store/Actions/action';
import LottieView from 'lottie-react-native';
import {decryptText} from '../../common/fileFunctions';
import { walletProvider } from '../../Utils/Provider';
import ProgressDialog from '../../components/ProgressDialog';
import { getAccountDetails } from '../../Utils/ImportWallet';
import { setAccountInfo } from '../../Utils/AsyncStorage';
var RNFS = require('react-native-fs');
const setLogin=(val)=>dispatch(loginUser(val))

const RestoreFromDevice = ({navigation, route}) => {
  const [pin, setPin] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedPin, setConfirmedPin] = useState('');
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading,setLoading]=useState(false)
  var provider;

  const fetchAddress = address => dispatch(setAddress(address));
  const fetchBalance = balance => dispatch(setBalance(balance));

  const fetchPrivateKey = async (text) => {
    console.log(text.length)
    
  
      try {
        // var string = formatString();
        setOpen(true);
        const WalletInfo = await getAccountDetails(text);
        if(WalletInfo) {
          fetchAddress(WalletInfo);
          setAccountInfo(WalletInfo);
          //alert(WalletInfo?.accountAddress?.first)
        }
        ToastAndroid.showWithGravityAndOffset(
          'Account fetched Successfully',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        setLoading(false)
        navigation.goBack();
        navigation.goBack();
        navigation.goBack();
        navigation.replace('Dashboard');
        setOpen(false);
      } catch (error) {
        console.log(error); 
        setOpen(false);
      }
    
    
  };


  const decryptFromDevice = async () => {
    const text = await decryptText(pin);
    if (text.length > 0) {
      ToastAndroid.showWithGravityAndOffset(
        'Wallet Fetched from device',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      //alert(text)
      fetchPrivateKey(text);
    }
    else{
      setLoading(false)
      ToastAndroid.showWithGravityAndOffset(
        'Wrong Pincode',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

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
      {loading?
      <View style={{flex:1}}>
      <Text style={{
            color: 'white',
            fontFamily: typography.medium,
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 40,
          }}>Please wait while we verify your credentials with the Blockchain</Text>
      <LottieView source={require('../../../assets/chain.json')} autoPlay loop />
      </View>
      :<>
      <View>
      
        <Text
          style={{
            color: 'white',
            fontFamily: typography.semiBold,
            fontSize: 24,
            textAlign: 'center',
            marginBottom: 40,
          }}>
          Enter Pin
        </Text>
        <SmoothPinCodeInput
          password
          restrictToNumbers
          mask="﹡"
          cellSize={36}
          codeLength={4}
          cellSpacing={12}
          onFulfill={() => setConfirmed(true)}
          value={pin}
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
          onTextChange={password => setPin(password)}
        />
      </View>
      <View></View>

      <GradientButton
        text={' Confirm '}
        colors={['#FF8DF4', '#89007C']}
        onPress={() => {
          //
          setLoading(true)
          decryptFromDevice();
          //decryptText();
        }}
      /></>}

      <View></View>

      {/* <ProgressDialog 
        open={open}
        setOpen={setOpen}
        completed={false}
      /> */}
    </View>
  );
};

export default RestoreFromDevice;
