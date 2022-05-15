import React, {useEffect, useState} from 'react';

import {View, Text, ScrollView, Alert, ToastAndroid,FlatList} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import {ethers} from 'ethers';
import {useDispatch, useSelector} from 'react-redux';
import {setAddress, setBalance} from '../../store/Actions/action';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import {decryptText} from '../../common/fileFunctions';
import { walletProvider } from '../../Utils/Provider';
import { decode } from 'punycode';
import {  TouchableOpacity } from 'react-native-gesture-handler';
import Clipboard from '@react-native-community/clipboard';
import { text } from 'stream/consumers';
import SeedPhraseButton from '../../components/SeedPhraseButton';
var RNFS = require('react-native-fs');

const ViewSeedPhrase = ({navigation, route}) => {
  const [pin, setPin] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedPin, setConfirmedPin] = useState('');
  const [phrase,setPhrase]=useState('')
  const [decoded,setDecoded]=useState(false)
  const dispatch = useDispatch();
  var provider;
  const fetchAddress = address => dispatch(setAddress(address));

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
      //fetchBalance(balance);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
      //alert(err.message)
    }
  };

  const decryptFromDevice = async () => {
      console.log(pin)
      try{
        const text = await decryptText(pin);
        if (text.length > 0) {
          //Alert.alert(text)
          setDecoded(true)
          setPhrase(text);
    //      fetchPrivateKey(text);
        }
        else{
            Alert.alert('Incorrect Password')
        }
      }
      catch (error){
          console.log(error)
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
      {decoded &&
      <View>
          <TouchableOpacity onPress={()=>{Clipboard.setString(phrase); ToastAndroid.show('Copied Successfully', ToastAndroid.SHORT)}}>
          <FontAwesome5 name={'copy'} size={25} color={'white'} style={{alignSelf:'flex-end',marginBottom:20}}/>

          </TouchableOpacity>
          {/* <Text style={{fontSize:25,fontFamily:typography.medium,color:'white',textAlign:'center'}}>{phrase}</Text> */}
          
          <View style={{alignSelf:'center'}}>
          <GradientButton
        text={!decoded?'Show':'Hide'}
        colors={['#FF8DF4', '#89007C']}
        onPress={() => {
          //
        !decoded?
          decryptFromDevice():setDecoded(false)
          //decryptText();
        }}
      />
      </View>

          <FlatList
          data={phrase.split(' ')}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <SeedPhraseButton item={item} index={index} />
          )}
        />
          
      </View>
  }
      
      {!decoded &&
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
      }
      <View></View>

      <GradientButton
        text={!decoded?'Show':'Hide'}
        colors={['#FF8DF4', '#89007C']}
        onPress={() => {
          //
        !decoded?
          decryptFromDevice():setDecoded(false)
          //decryptText();
        }}
      />
      
      <View></View>
    </View>
  );
};

export default ViewSeedPhrase;