import React from 'react';
import {View, Text, Touchable, TouchableOpacity} from 'react-native';
import {typography} from '../common/typography';

const SeedPhraseButton = ({item, index}) => {
  return (
    <TouchableOpacity
      style={{
        height: 30,
        width: 130,
        flexDirection: 'row',
        borderWidth: 1.5,
        borderRadius: 15,
        borderColor: 'purple',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
      }}>
      <Text
        style={{fontFamily: typography.regular, fontSize: 12, color: 'white'}}>
        {index + 1}
      </Text>
      <Text
        style={{fontFamily: typography.regular, fontSize: 12, color: 'white'}}>
        {item}
      </Text>
    </TouchableOpacity>
  );
};

export default SeedPhraseButton;
