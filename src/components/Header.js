import React from 'react';
import {View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Header = () => {
  return (
    <>
      <View style={{flexDirection: 'row', height: 60}}>
        <View style={{flex: 1}}>
          <MaterialIcons name={'arrow-back-ios'} color={'white'} size={28} />
        </View>
        <View style={{flex: 1}}></View>
        <View style={{flex: 1}}></View>
      </View>
    </>
  );
};

export default Header;
