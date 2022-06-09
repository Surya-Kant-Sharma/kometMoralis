import { View, Text, Image } from 'react-native'
import React from 'react'
import { typography } from '../common/typography'
import useNativeBalance from '../../frontend/hooks/useNativeBalance';
import moment from 'moment'


const TransactionRow = ({ image, coinName, value, symbol, price, change, chain }) => {
  return (
    <View style={{ marginVertical: 20, width: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', }}>
          <Image source={{ uri: image }} style={{ height: 40, width: 40, borderRadius: 40 }} />
          <View style={{ marginHorizontal: 10, width: 150 }}>
            <Text style={{ fontFamily: typography.regular, fontSize: 18, color: 'white' }} ellipsizeMode="tail" numberOfLines={1}>{coinName}</Text>
            <Text style={{ fontFamily: typography.regular, fontSize: 12, color: 'gray' }}>{moment.utc(value).local().startOf('seconds').fromNow()}</Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 10, width: 100 }}>
          <Text style={{ fontFamily: typography.regular, fontSize: 14, color: 'gray', textAlign: 'right' }}>{(price).toString().substring(0, 6)} MAT</Text>
          <Text style={{ fontFamily: typography.regular, fontSize: 14, color: '#3EFF15', textAlign: 'right' }}>$ {parseFloat(parseFloat(price).toPrecision(2) * 0.6).toPrecision(1)} </Text>
        </View>
      </View>
    </View>
  )
}

export default TransactionRow