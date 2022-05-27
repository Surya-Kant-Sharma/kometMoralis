import React, { useEffect, useState } from 'react';
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
  ToastAndroid,
} from 'react-native';

import { themeColor } from '../../common/theme';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Header from '../../components/Header';
import BorderButton from '../../components/BorderButton';
import GradientButton from '../../components/GradientButton';
import Clipboard from '@react-native-community/clipboard';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { GrapghMintedQuery } from '../../Utils/theGraph';
import { set } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');
const Collections = ({ navigation, route }) => {
  const [collections, setCollections] = useState([]);
  const [sold, setSold] = useState(0);
  const [loading, setLoading] = useState(false);
  //const [loading,setLoading]=useState(false);

  const fetchCollections = async () => {
    setLoading(true);
    // alert(route.params.item.collectionId)
    await axios
      .get(`http://staging.komet.me/api/v1/market/v1/token?pageNo=0&pageSize=50&collectionId=${route.params.item.collectionId}`, {
        headers: {
          'X-USER-ID': 'worl'
        }
      })
      .then((res) => {
        console.log(res)
        // setCollections(res.data);
        setLoading(false);

        GrapghMintedQuery(route.params.item.collectionContractId).then(result => {
          console.log(result.data.nfts);

          const value = result.data.nfts || []
          setSold(res.data.length - value.length);

          const arr = res.data.map((item, index) => {
            if(index <= (res.data.length - value.length)) {
              return item
            }
          })

          console.log(arr);
          setCollections(arr)
         

        }
        ).catch((err) => {
          console.log(err.message)
        })
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCollections()
    }, [])
  )

  useEffect(() => {
    fetchCollections();
  }, []);

  // console.log(route.params.item)


  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={{ width: '100%', height: 320, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 40, height: 40, width: 40, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 20, left: 20 }}>
            <MaterialIcons name={'keyboard-arrow-left'} color={'white'} size={28} />
          </TouchableOpacity>
          <Image source={{ uri: route.params.item.collectionImage }} style={{ width: '50%', height: 200, resizeMode: 'cover' }} />
        </View>

        <View style={{
          borderTopEndRadius: 20,
          backgroundColor: '#1F1E2C',
          marginTop: -40,
          paddingVertical: 40,
          paddingHorizontal: 20,
          elevation: 20,
        }}>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity style={styles.addressContainer} onPress={() => {
              Clipboard.setString(route.params.item.collectionContractId)
              ToastAndroid.showWithGravity('Address Copied', ToastAndroid.LONG, ToastAndroid.CENTER)
            }}>
              <Text
                numberOfLines={1}
                ellipsizeMode={'middle'}
                style={styles.addressText}>
                {route.params.item.collectionContractId}
              </Text>
              <MaterialIcons name='content-copy' size={14} style={{ marginLeft: 20 }} />
            </TouchableOpacity>
          </View>


          <Text style={styles.header}>{route.params.item.collectionName}</Text>
          {/* <Text  style={styles.description}>{route.params.item.description}</Text> */}
          <View
            style={styles.summaryTextContainer}>
            <Text style={styles.subHeaderText}>Organiser's Name</Text>
            <Text style={styles.subHeaderValue}>{route.params.item.organiserName}</Text>
          </View>
          <View
            style={styles.summaryTextContainer}>
            <Text style={styles.subHeaderText}>Tokens on Sale</Text>
            <Text style={styles.subHeaderValue}>{sold}</Text>
          </View>

          <View
            style={styles.summaryTextContainer}>
            <Text style={{ ...styles.subHeaderText, fontSize: 20, color: '#FF8DF4', alignSelf: 'center' }}>Floor Price</Text>
            <View>
              <Text style={{ ...styles.price, color: '#FF8DF4', textAlign: 'right' }}>{parseFloat(route.params.item.collectionPrice)} Matic</Text>
              {/* <Text style={{...styles.price,color:'white',fontSize:18}}>200 <Text style={{color:'rgba(255,255,255,0.6)',fontFamily:typography.medium}}>MATIC</Text></Text> */}
            </View>
          </View>
          <View
            style={styles.summaryTextContainer}>
            <Text style={{ ...styles.subHeaderText, color: 'white' }}>Check out Collection's NFTs</Text>

          </View>
          {loading ? (
            <ActivityIndicator size={32} style={{ margin: 20 }} color={'pink'} />
          ) : (
            <FlatList
              data={collections}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              style={{ alignSelf: 'flex-start' }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('NFTPage', {
                    item: item,
                    contract: route.params.item.collectionContractId,
                    price: route.params.item.collectionPrice
                  })}
                  style={styles.cardContainer}>
                  <Image source={{ uri: item.mediaUrl }} style={styles.image} />
                  <Text style={styles.imageText}>{item.attributes.name + " " + index}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* <View style={{alignSelf:'center'}}>
      <BorderButton
          borderColor={'#FF8DF4'}
          text={'  Buy Using OpenSea  '}
          onPress={() => {
            fetchSecretKey();
            //console.log('BorderPressed');
          }}
        />
      </View> */}
          {/*<View style={{alignSelf:'center'}}>
      <GradientButton
          text={' Buy from KometVerse '}
          colors={['#FF8DF4', '#89007C']}
          onPress={() => {
            //navigation.navigate('Dashboard');
            //encryptText(route.params.phrase, pin, navigation);
            
            //decryptText();
          }}
        /> 
      </View>*/}
        </View>
      </ScrollView>
    </View>
  );
};

export default Collections;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: themeColor.primaryBlack },
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
  cardContainer: { height: width * 0.5, width: width * 0.40, margin: 10, },
  image: {
    height: width * 0.40,
    width: width * 0.40,
    borderRadius: 5,
    alignSelf: 'flex-start'
  },
  imageText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontFamily: typography.medium,
  },
  subHeaderText: { fontFamily: typography.medium, color: 'rgba(255,255,255,0.6)', marginHorizontal: 10, fontSize: 16 },
  subHeaderValue: { fontFamily: typography.medium, color: 'rgba(255,255,255,1)', marginHorizontal: 10, fontSize: 16 },
  description: { fontFamily: typography.medium, color: 'rgba(255,255,255,0.8)', marginHorizontal: 10, fontSize: 16 },
  header: { fontFamily: typography.semiBold, color: 'rgba(255,255,255,1)', marginHorizontal: 10, fontSize: 18 },
  price: { fontFamily: typography.bold, color: 'rgba(255,255,255,1)', marginHorizontal: 10, fontSize: 26 },
  summaryTextContainer: {
    borderRadius: 10,

    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  addressText: {
    width: '80%',
    fontFamily: typography.regular,
    fontSize: 12,
    color: 'white',
  },
  addressContainer: {
    //width: width * 0.5,
    width: '60%',
    paddingHorizontal: 10,
    height: 25,
    borderRadius: 20,
    backgroundColor: '#343153',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 15
  },
});