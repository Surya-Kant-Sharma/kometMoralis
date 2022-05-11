import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import Header from '../../components/Header';
import ProfileIcons from '../../../assets/svg/ProfileIcons.svg';

const Settings = ({navigation}) => {
  return (
    <ScrollView
      style={{flex: 1, backgroundColor: themeColor.primaryBlack, padding: 20}}>
      <Header />
      <LinearGradient
        style={{
          width: '94%',
          paddingVertical: 5,
          paddingHorizontal: 20,
          alignSelf: 'center',
          borderRadius: 20,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={[
          '#FF84F3',
          'rgba(249,97,243,0.61)',
          'rgba(98,61,159,0.84)',
          'rgba(69,61,159,0.58)',
        ]}>
        <View>
          <Text
            style={{
              fontFamily: typography.regular,
              fontSize: 10,
              color: 'white',
            }}>
            Current Wallet
          </Text>
          <Text
            style={{
              fontFamily: typography.medium,
              fontSize: 14,
              color: 'white',
            }}>
            Komet Wallet
          </Text>
        </View>
        <ProfileIcons />
      </LinearGradient>
    </ScrollView>
  );
};

export default Settings;
