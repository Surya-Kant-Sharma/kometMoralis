import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { typography } from '../common/typography';

const GradientButton = ({ colors, text, onPress, disabled,size }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || false}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{...styles.gradientButton,width:size||243,}}>
        <Text style={{
          ...styles.buttonText,
          
          color: (disabled) ? 'gray' : 'white'
        }}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  gradientButton: {
    marginVertical: 10,

    paddingVertical: 13,

    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 243,
  },
  buttonText: { color: 'white', fontFamily: typography.semiBold },
});
