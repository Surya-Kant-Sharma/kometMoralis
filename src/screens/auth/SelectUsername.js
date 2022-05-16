import React from 'react';
import {View, Text, Image, TextInput, TouchableOpacity, Alert} from 'react-native';
import {themeColor} from '../../common/theme';

import {typography} from '../../common/typography';
import {useState} from 'react';
import Header from '../../components/Header';
import axios from 'axios';

const SelectUsername = ({navigation}) => {
  const [name, setName] = useState('');

  const checkUserName=async()=>{
    await axios.get(`http://staging.komet.me/api/v1/user/v1/nick/check_availability?nick=${name}`).then((res)=>{
      if(res.data.available==true){
        console.log(res.data.available)
         navigation.navigate('FinalizeUserName', {name});
      }
      else{
        Alert.alert('Username not Available')
      }
    }).catch((error)=>{
      Alert.alert('Error');
      navigation.navigate('FinalizeUserName', {name});
    })
  }

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
      <Header navigation={navigation}/>

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
            onPress={()=>checkUserName()}
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
