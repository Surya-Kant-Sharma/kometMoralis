import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {themeColor} from '../../common/theme';

import {typography} from '../../common/typography';
import GradientButton from '../../components/GradientButton';
import BorderButton from '../../components/BorderButton';
import TouchID from 'react-native-touch-id';
import Padlock from '../../../assets/svg/PadLock.svg';
import ETH from '../../../assets/svg/ETH.svg';
import Header from '../../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
const FinalizeUserName = ({navigation, route}) => {
  console.log(route.params);

  return (
    <View
      style={{
        padding: 20,
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        backgroundColor: themeColor.primaryBlack,
      }}>
      <Header />
      <View style={{alignSelf: 'center'}}>
      <MaterialIcons name={'highlight'}/>
      </View>
      <View>
        <Text
          style={{color: 'white', fontFamily: typography.medium, fontSize: 24}}>
          Create easy wallet address
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.82)',
            fontFamily: typography.regular,
            fontSize: 15,
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Laoreet ut
          dui imperdiet.
        </Text>
        <View style={{flexDirection: 'row', marginVertical: 40}}>
          <View
            style={{
              width: 320,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              height: 40,
              borderRadius: 10,
              padding: 10,
            }}>
            <Text style={{color: '#8F8F8F', fontFamily: typography.medium}}>
              @{route.params.name.toString()}
              <Text style={{color: '#4F5686', fontFamily: typography.medium}}>
                .komet.me
              </Text>
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: '80%',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <GradientButton
          text={"Let's get it ! "}
          colors={['#453D9F', '#453D9F']}
          onPress={() => {
            navigation.navigate('ChooseSeedPhrase');
          }}
        />
        <BorderButton
          borderColor={'#453D9F'}
          text={'Skip for Now'}
          onPress={() => {
            console.log('BorderPressed');
          }}
        />
      </View>
    </View>
  );
};

export default FinalizeUserName;