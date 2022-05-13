import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Header from '../../components/Header';
import BorderButton from '../../components/BorderButton';
import GradientButton from '../../components/GradientButton';

const {width, height} = Dimensions.get('screen');
const Collections = ({navigation,route}) => {
    console.log(route.params.item)
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <ScrollView style={styles.container}>
           <Image source={{uri:route.params.item.image_url}} style={{width:'100%',height:400,resizeMode:'cover'}}/>
           <View style={{borderTopEndRadius:20,backgroundColor:themeColor.primaryBlack,marginTop:-40,paddingVertical:40,paddingHorizontal:20}}>
           <Text style={styles.header}>{route.params.item.name}</Text>
         <Text  style={styles.description}>{route.params.item.description}</Text>
           <View
        style={styles.summaryTextContainer}>
         <Text  style={styles.subHeaderText}>Units Sold</Text>
         <Text style={styles.subHeaderValue}>{1*5}</Text>
      </View>
      <View
        style={styles.summaryTextContainer}>
         <Text  style={styles.subHeaderText}>Units Left</Text>
         <Text style={styles.subHeaderValue}>{1*26}</Text>
      </View>
      <View
        style={styles.summaryTextContainer}>
         <Text  style={{...styles.subHeaderText,fontSize:20,color:'#FF8DF4',alignSelf:'center'}}>Floor Price</Text>
         <View>
         <Text style={{...styles.price,color:'#FF8DF4',textAlign:'right'}}>$ 120</Text>
         <Text style={{...styles.price,color:'white',fontSize:18}}>200 <Text style={{color:'rgba(255,255,255,0.6)',fontFamily:typography.medium}}>MATIC</Text></Text>
         </View>
      </View>
      <View style={{alignSelf:'center'}}>
      <BorderButton
          borderColor={'#FF8DF4'}
          text={'  Buy Using OpenSea  '}
          onPress={() => {
            fetchSecretKey();
            //console.log('BorderPressed');
          }}
        />
      </View>
      <View style={{alignSelf:'center'}}>
      <GradientButton
          text={' Buy from KometVerse '}
          colors={['#FF8DF4', '#89007C']}
          onPress={() => {
            //navigation.navigate('Dashboard');
            //encryptText(route.params.phrase, pin, navigation);
            
            //decryptText();
          }}
        />
      </View>
      </View>
    </ScrollView>
  );
};

export default Collections;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: themeColor.primaryBlack},
  searchBarContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    margin: 10,
    
  },
  textInputContainer: {
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    width: width * 0.75,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cardContainer: {height: width * 0.5, width: width * 0.45, margin: 10},
  image: {
    height: width * 0.45,
    width: width * 0.45,
    borderRadius: 5,
  },
  imageText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontFamily: typography.medium,
  },
  subHeaderText:{fontFamily:typography.medium,color:'rgba(255,255,255,0.6)',marginHorizontal:10,fontSize:16},
  subHeaderValue:{fontFamily:typography.medium,color:'rgba(255,255,255,1)',marginHorizontal:10,fontSize:16},
  description:{fontFamily:typography.medium,color:'rgba(255,255,255,0.8)',marginHorizontal:10,fontSize:16},
  header:{fontFamily:typography.semiBold,color:'rgba(255,255,255,1)',marginHorizontal:10,fontSize:18},
  price:{fontFamily:typography.bold,color:'rgba(255,255,255,1)',marginHorizontal:10,fontSize:26},
  summaryTextContainer:{
    borderRadius: 10,
    
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  }
});
