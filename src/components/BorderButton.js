import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {typography} from '../common/typography';

const BorderButton = ({borderColor, text, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{...styles.borderButton, borderColor: borderColor}}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default BorderButton;

const styles = StyleSheet.create({
  borderButton: {
    marginVertical: 20,
    paddingVertical: 13,
    borderRadius: 10,
    borderColor: '#FF8DF4',
    borderWidth: 1.3,
    width: 243,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontFamily: typography.semiBold},
});
