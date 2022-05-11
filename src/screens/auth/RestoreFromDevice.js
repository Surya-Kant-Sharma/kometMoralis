import React, {useEffect, useState} from 'react';

import {View, Text, ScrollView, Alert} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import {ethers} from 'ethers';
import {useDispatch} from 'react-redux';
import {getAddress, getBalance} from '../../store/Actions/action';

import {decryptText} from '../../common/fileFunctions';
var RNFS = require('react-native-fs');

const RestoreFromDevice = ({navigation, route}) => {
  const [pin, setPin] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedPin, setConfirmedPin] = useState('');
  const dispatch = useDispatch();
  var provider;
  const fetchAddress = address => dispatch(getAddress(address));
  const fetchBalance = balance => dispatch(getBalance(balance));

  const fetchPrivateKey = async string => {
    provider = new ethers.providers.JsonRpcProvider(
      'https://rinkeby.infura.io/v3/d02fb37024ef430b8f15fdacf9134ccc',
    );

    try {
      const walletfromPhrase = new ethers.Wallet.fromMnemonic(string);
      const wallet = new ethers.Wallet(walletfromPhrase.privateKey, provider);
      console.log(wallet);
      const balance = await provider.getBalance(wallet.address);
      fetchAddress(wallet.address);
      fetchBalance(balance);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  const decryptFromDevice = async () => {
    const text = await decryptText(pin);
    if (text.length > 0) {
      fetchPrivateKey(text);
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
      <Header />
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
          decryptFromDevice();
          //decryptText();
        }}
      />

      <View></View>
    </View>
  );
};

export default RestoreFromDevice;
