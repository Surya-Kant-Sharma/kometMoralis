import React from 'react';
import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import {themeColor} from '../../common/theme';
import Header from '../../components/Header';
//import {MaticIcon} from '../../../assets/svg/MaticIcon.svg';
import LinearGradient from 'react-native-linear-gradient';
import {typography} from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'

//import HistoryIcon from '../../../assets/svg/HistoryIcon.svg';
const SwapToken = ({navigation}) => {
  return (
    <View
      style={{flex: 1, backgroundColor: themeColor.primaryBlack, padding: 30}}>
      <Header navigation={navigation} />
      <View>
        <LinearGradient
          colors={['#FF84F3', '#B02FA4']}
          style={{
            height: 64,
            width: 64,
            alignItems: 'center',
            borderRadius: 64,
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: 20,
          }}>
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <AntDesign name={'swap'} color={'white'} size={32} />
          </TouchableOpacity>
        </LinearGradient>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
            fontFamily: typography.medium,
            color: 'white',
          }}>
          Swap
        </Text>
      </View>
      <View
        style={{
          borderRadius: 10,
          backgroundColor: '#232732',
          marginVertical: 20,

          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 10,
        }}>
        <View style={{justifyContent: 'space-between'}}>
          <View style={{height: 20}}></View>
          <Text style={{fontSize: 12, fontFamily: typography.regular}}>
            Swap From
          </Text>
          <TextInput
            placeholder={'0'}
            style={{
              fontSize: 32,
              fontFamily: typography.regular,
              width: 150,
            }}
          />
          <View style={{height: 20}}></View>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image source={{uri:'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg'}} style={{height:40,width:40,borderRadius:40}}/>
          <View
            style={{
              margin: 5,
              marginTop: 20,
              borderColor: '#FF84F3',
              borderWidth: 1,
              borderRadius: 5,
              padding: 5,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: typography.regular,
                fontSize: 12,
                color: 'white',
              }}>
              Matic
            </Text>
            <MaterialIcons name={'keyboard-arrow-down'} size={15} />
          </View>
        </View>
      </View>
      <View
        style={{
          borderRadius: 10,
          backgroundColor: '#232732',
          marginVertical: 20,

          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 30,
        }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: typography.regular,
            alignSelf: 'flex-start',
          }}>
          Swap To
        </Text>
        <View
          style={{
            height: 50,
            width: 250,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#FF84F3',
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: typography.regular,
              color: 'white',
            }}>
            Select a Token
          </Text>
          <MaterialIcons name={'keyboard-arrow-down'} size={24} />
        </View>
      </View>
    </View>
  );
};

export default SwapToken;
