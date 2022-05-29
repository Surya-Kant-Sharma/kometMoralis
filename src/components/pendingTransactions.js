import { View, Text, Image } from 'react-native'
import React from 'react'
import { typography } from '../common/typography'
import useNativeBalance from '../../frontend/hooks/useNativeBalance';
import GradientButton from './GradientButton';
import { ActivityIndicator } from 'react-native-paper';

const PendingTransactions = ({ image, coinName, value, symbol, price, change, chain }) => {

  let gasFees = 1;
  return (
    <View style={{ marginVertical: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', }}>
          {/* <Image source={{ uri: image }} style={{ height: 40, width: 40, borderRadius: 40 }} /> */}
          <ActivityIndicator style={{ height: 40, width: 40, borderRadius: 40 }} color="white" />
          <View style={{ marginHorizontal: 10 }}>
            <Text style={{ fontFamily: typography.regular, fontSize: 14, color: 'white' }}>{coinName}</Text>
            <Text style={{ fontFamily: typography.regular, fontSize: 12, color: 'white' }}>{"Please Wait"} </Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <Text style={{ fontFamily: typography.regular, fontSize: 14, color: 'white', textAlign: 'right' }}> MAT {price}</Text>
          <Text style={{fontFamily:typography.regular,fontSize:12,color:'gray',textAlign:'right'}}>$ {parseFloat(parseFloat(price).toPrecision(2) * 0.6).toPrecision(1)} </Text>
        </View>
      </View>

      {/* <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
      }}>
        <GradientButton
          text={'Speed Up'}
          size={150}
          disabled={(gasFees <= 0) ? true : false}
          colors={(gasFees > 0) ? ['#FF8DF4', '#89007C'] : ['rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.2)']}
          onPress={() => {
            // clearInterval(timeRef.current)
            // transferAmount();
            // setConfirm(false);
            // setGasFees(0)
          }}
        />
        <GradientButton
          text={'Cancel'}
          size={150}
          colors={['#FF8DF4', '#89007C']}
          onPress={() => {
            //            navigation.navigate('RestoreFromPhrase');
            // clearInterval(timeRef.current)
            // setConfirm(false)
            // setGasFees(0)
          }}
        />

      </View> */}

    </View>
  )
}

export default PendingTransactions