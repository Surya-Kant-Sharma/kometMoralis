import { View, Text,Image } from 'react-native'
import React, { useEffect } from 'react'
import { typography } from '../common/typography'
import useNativeBalance from '../../frontend/hooks/useNativeBalance';

const AssetsLog = ({image,coinName,value,symbol,price,change,chain}) => {

    const {nativeBalance} = useNativeBalance(0);
    console.log(nativeBalance)
  return (
    <View style={{margin:20}}>
    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <View style={{flexDirection:'row',}}>
        <Image source={{uri:image}} style={{height:40,width:40,borderRadius:40}}/>
        <View style={{marginHorizontal:10}}>
          <Text style={{fontFamily:typography.regular,fontSize:14,color:'white'}}>{coinName}</Text>
          <Text style={{fontFamily:typography.regular,fontSize:12,color:'gray'}}>{nativeBalance?.split(' ')[0]} ETH</Text>
        </View>
      </View>
      <View style={{marginHorizontal:10}}>
          <Text style={{fontFamily:typography.regular,fontSize:14,color:'white',textAlign:'right'}}>{price}</Text>
          <Text style={{fontFamily:typography.regular,fontSize:12,color:'gray',textAlign:'right'}}>{change} %</Text>
        </View>
    </View>
    
  </View>
  )
}

export default AssetsLog