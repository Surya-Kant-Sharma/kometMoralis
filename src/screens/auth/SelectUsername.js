import React from 'react';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import {themeColor} from '../../common/theme';
import Padlock from '../../../assets/svg/PadLock.svg';
import SvgImage from '../../components/SvgImage';
import {typography} from '../../common/typography';
import {useState} from 'react';
import Header from '../../components/Header';

const SelectUsername = ({navigation}) => {
  const [name, setName] = useState('');
  console.log(name);
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
        <Image source={require('../../../assets/images/ETH.png')} />
      </View>
      <View>
        <Text
          style={{color: 'white', fontFamily: typography.medium, fontSize: 24}}>
          Pick your username
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
          <TextInput
            style={{
              width: 320,
              color: '#8F8F8F',
              backgroundColor: 'white',
              height: 40,
              borderRadius: 10,
              padding: 10,
              paddingRight: 100,
            }}
            onChangeText={text => setName(text)}
            placeholder="@victoria05"
            placeholderTextColor={'#8F8F8F'}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('FinalizeUserName', {name})}
            style={{
              width: 97,
              height: 40,
              marginLeft: -97,
              backgroundColor: '#453D9F',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: typography.medium,
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: typography.regular,
                fontSize: 14,
              }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectUsername;
