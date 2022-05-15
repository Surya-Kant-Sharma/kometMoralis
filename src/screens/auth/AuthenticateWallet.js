import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  Dimensions,
} from 'react-native';
import {themeColor} from '../../common/theme';

import {typography} from '../../common/typography';
import GradientButton from '../../components/GradientButton';
import BorderButton from '../../components/BorderButton';
import TouchID from 'react-native-touch-id';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const AuthenticateWallet = ({navigation, route}) => {
  const [pinModal, setPinModal] = useState(false);

  const {height, width} = Dimensions.get('screen');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '638019657946-thbc2c24p6phcuir5qfpfs32saa14haf.apps.googleusercontent.com',
    });
  }, []);

  const [authenticate, setAuthenticate] = useState(false);

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

  const onAuthenticate = () => {
    TouchID.authenticate(
      'Scan your fingerprint on the device scanner to continue',
      optionalConfigObject,
    )
      .then(res => {
        setAuthenticate(true);
        //Alert.alert('Authenticated successfully');
        navigation.navigate('ChooseSeedPhrase');
        //onGoogleButtonPress();
      })
      .catch(error => {
        setAuthenticate(false);
        Alert.alert(error.message);
      });
  };

  return (
    <View
      style={{
        padding: 20,
        flex: 1,
        justifyContent: 'space-around',
        flexDirection: 'column',
        backgroundColor: themeColor.primaryBlack,
      }}>
      <Modal
        transparent
        visible={pinModal}
        onDismiss={() => setPinModal(false)}
        onRequestClose={() => setPinModal(false)}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.50)',
            flex: 1,
            justifyContent: 'flex-end',
            height: height,
            width: width,
          }}>
          <View
            style={{
              marginBottom: 20,
              height: 150,
              width: width * 1,
              backgroundColor: '#343333',
              borderRadius: 20,
              padding: 20,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: typography.regular,
                fontSize: 16,
                textAlign: 'center',
              }}>
              Authenticate to protect your wallet
            </Text>

            <TouchableOpacity
              onPress={()=>{
                
                  navigation.navigate('ChooseSecurityPin', {
                    phrase: route.params.phrase,
                  });
                  setPinModal(false)
              }}>
              <Text
                style={{
                  color: '#1951EC',
                  fontFamily: typography.semiBold,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Enter Pin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPinModal(false)}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: typography.regular,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{marginTop: -30}}>
        <View style={{alignSelf: 'center'}}>
          <Image source={require('../../../assets/images/PadLock.png')} />
        </View>
        <View>
          <Text
            style={{
              color: 'white',
              fontFamily: typography.semiBold,
              fontSize: 24,
              textAlign: 'center',
            }}>
            Protect your wallet
          </Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.60)',
              fontFamily: typography.regular,
              fontSize: 16,
              textAlign: 'center',
            }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Laoreet ut
            dui imperdiet.
          </Text>
        </View>
        <View
          style={{
            borderRadius: 15,
            backgroundColor: '#343153',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: 60,
            marginTop: 25,
          }}>
          <Image source={require('../../../assets/images/fingerprint.png')} />
          <View>
            <Text style={{color: 'white', fontFamily: typography.medium}}>
              Device{' '}
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.60)',
                fontFamily: typography.regular,
              }}>
              Use Device Authentication{' '}
            </Text>
          </View>
          <Switch
            value={authenticate}
            thumbColor={'white'}
            trackColor={{false: 'grey', true: '#FF84F3'}}
            //onChange={!authenticate ? () => onAuthenticate() : null}
            onChange={() => setPinModal(!pinModal)}
          />
        </View>
      </View>

      <View style={{alignItems: 'center', alignItems: 'center'}}>
        <GradientButton
          text={' Next '}
          colors={['#FF8DF4', '#89007C']}
          onPress={() => {
            navigation.navigate('Dashboard');
          }}
        />
      </View>
    </View>
  );
};

export default AuthenticateWallet;
