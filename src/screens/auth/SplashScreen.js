import React from 'react';
import {View, Text, Image, StatusBar, TouchableOpacity} from 'react-native';
import {themeColor} from '../../common/theme';
import 'react-native-get-random-values';

import '@ethersproject/shims';
import {ethers} from 'ethers';
import {useDispatch} from 'react-redux';
import {getProvider} from '../../store/Actions/action';
import TouchID from 'react-native-touch-id';

const SplashScreen = ({navigation}) => {
  const dispatch = useDispatch();

  //var connector;

  //var fetchProvider = provider => dispatch(getProvider(provider));

  //const INFURA_ID = 'd02fb37024ef430b8f15fdacf9134ccc';
  //const daiAddress = '0x16FC4D55f9f8D5f43F8e639198AD509737450AE3';
  //var provider;
  var contract;
  // const daiAbi = [
  //   // Some details about the token
  //   'function name() view returns (string)',
  //   'function symbol() view returns (string)',

  //   // Get the account balance
  //   'function balanceOf(address) view returns (uint)',

  //   // Send some of your tokens to someone else
  //   'function transfer(address to, uint amount)',

  //   // An event triggered whenever anyone transfers to someone else
  //   'event Transfer(address indexed from, address indexed to, uint amount)',
  // ];

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

  const onAuthenticate = (navigation) => {
    TouchID.authenticate(
      'Scan your fingerprint on the device scanner to continue',
      optionalConfigObject,
    )
      .then(res => {
        //setAuthenticate(true);
        //Alert.alert('Authenticated successfully');
        setTimeout(()=>navigation.navigate('OnBoarding'),1000)
        //onGoogleButtonPress();
      })
      .catch(error => {
        setAuthenticate(false);
        Alert.alert(error.message);
      });
  };

  React.useEffect(() => {
    onAuthenticate(navigation)
    // provider = new ethers.providers.JsonRpcProvider(
    //   'https://rinkeby.infura.io/v3/d02fb37024ef430b8f15fdacf9134ccc',
    // );
    //fetchProvider(provider);
    //   contract = new ethers.Contract(daiAddress, daiAbi, provider);
    //   fetchBlockNumber();
  }, []);

  // const fetchBlockNumber = async () => {
  //   const receiverAddress = '0x44Ad8BA47A77326f4d19599A1a9367DD5aa8EF42';
  //   const senderAddress = '0x861ebcA227bD300a55813539dec64d59f30059c5';

  //   var balance1 = await provider.getBalance(senderAddress);
  //   var balance2 = await provider.getBalance(receiverAddress);

  //   console.log(balance1, balance2);

  //   const privateKey =
  //     '60e1a0914c6bd7aa79c6b958d8a46f24aab052564bacb75518fdaadb64a403eb';
  //   const walletfromPhrase = new ethers.Wallet.fromMnemonic(
  //     'bright arch guitar misery library own minimum resource inch exist chair awful',
  //   );
  //   const wallet = new ethers.Wallet(walletfromPhrase.privateKey, provider);
  //   console.log(wallet);
  //   // const tx = await wallet.sendTransaction({
  //   //   to: receiverAddress,
  //   //   value: ethers.utils.parseEther('0.0025'),
  //   // });
  //   //let b = await contract.name();
  //   //await tx.wait();
  //   //console.log(JSON.stringify(tx, null, 2));

  //   //balance1 = await provider.getBalance(senderAddress);
  //   //balance2 = await provider.getBalance(receiverAddress);

  //   //console.log(balance1, balance2);
  //   //console.log(b);
  // };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColor.primaryBlack,
      }}>
      <StatusBar backgroundColor={themeColor.primaryBlack} />
      <TouchableOpacity
        onPress={
          () => navigation.navigate('OnBoarding')
          //confirmRequest()
          //disconnect()
        }>
        <Image source={require('../../../assets/images/Logo.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default SplashScreen;
