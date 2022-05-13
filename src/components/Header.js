import React from 'react';
import {View, Text,TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Header = ({navigation}) => {
  return (
    <>
      <View style={{flexDirection: 'row', height: 60}}>
        <TouchableOpacity style={{flex: 1}} onPress={()=>navigation.goBack()}>
          <MaterialIcons name={'arrow-back-ios'} color={'white'} size={28} />
        </TouchableOpacity>
        <View style={{flex: 1}}></View>
        <View style={{flex: 1}}></View>
      </View>
    </>
  );
};

export default Header;
