import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { typography } from '../common/typography'

const ProfileButton = ({title,subTitle,leftIcon,margin,icon,onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{width: '94%',alignSelf:'center',backgroundColor:'#232732',justifyContent:'space-between',flexDirection:'row',marginVertical:margin?20:0,alignItems:'center',padding:5,borderRadius:10}}>
    <View style={{flexDirection:'row',alignItems:'center'}}>
    <View style={{height:30,width:30,borderRadius:30,backgroundColor:'#B02FA4',alignItems:'center',justifyContent:'center'}}>
        {icon}
    </View>
    <Text style={{color:'white',fontFamily:typography.medium}}>{'  '}{title}</Text>
    </View>
    <View style={{flexDirection:'row',alignItems:'center'}}>
    <Text style={{color:'white',fontFamily:typography.medium}}>{subTitle}</Text>
    {leftIcon&&<MaterialIcons name='keyboard-arrow-right' color={'white'} size={28}/>
    }</View>      
  </TouchableOpacity>
  )
}

export default ProfileButton