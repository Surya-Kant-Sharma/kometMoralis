import { View, Text, Image } from 'react-native'
import React from 'react'
import { typography } from '../common/typography'
import useNativeBalance from '../../frontend/hooks/useNativeBalance';
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';


const TransactionShimmerRow = ({ image, coinName, value, symbol, price, change, chain }) => {
  return (
    <View style={{ marginVertical: 20, width: '100%', height : 40 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', }}>
          {/* <Image source={{ uri: image }} style={{ height: 40, width: 40, borderRadius: 40 }} /> */}
          <ShimmerPlaceHolder style={{ height: 40, width: 40, borderRadius: 40, opacity : 0.6 }} LinearGradient={LinearGradient} />
          <View style={{ marginHorizontal: 10 }}>
            {/* <Text style={{ fontFamily: typography.regular, fontSize: 18, color: 'white' }} ellipsizeMode="tail" numberOfLines={1}>{coinName}</Text>
            <Text style={{ fontFamily: typography.regular, fontSize: 12, color: 'gray' }}>{moment.utc(value).local().startOf('seconds').fromNow()}</Text> */}
            <ShimmerPlaceHolder style={{  width: 240, borderRadius: 10 , paddingBottom : 1, opacity : 0.6}} LinearGradient={LinearGradient} />
            <ShimmerPlaceHolder style={{ width: 240, borderRadius: 10, paddingTop : 1, opacity : 0.6 }} LinearGradient={LinearGradient} />
          </View>
        </View>  
        {/* <View style={{ marginHorizontal: 10, width: 100 }}> */}
          {/* <Text style={{ fontFamily: typography.regular, fontSize: 14, color: 'gray', textAlign: 'right' }}>{(price).toString().substring(0, 6)} MAT</Text>
          <Text style={{ fontFamily: typography.regular, fontSize: 14, color: '#3EFF15', textAlign: 'right' }}>$ {parseFloat(parseFloat(price).toPrecision(2) * 0.6).toPrecision(1)} </Text> */}
            {/* <ShimmerPlaceHolder style={{ fontFamily: typography.regular, fontSize: 14, color: 'gray', textAlign: 'right' }} LinearGradient={LinearGradient} />
            <ShimmerPlaceHolder style={{ fontFamily: typography.regular, fontSize: 14, color: '#3EFF15', textAlign: 'right' }} LinearGradient={LinearGradient} /> */}
        {/* </View> */}
      </View>
    </View>
  )
}

export default TransactionShimmerRow