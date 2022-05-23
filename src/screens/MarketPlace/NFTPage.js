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
  Modal
} from 'react-native';

import { themeColor } from '../../common/theme';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Header from '../../components/Header';
import BorderButton from '../../components/BorderButton';
import GradientButton from '../../components/GradientButton';
import Clipboard from '@react-native-community/clipboard';
import { BuyNft } from '../../Utils/MarketPlace';
import { useSelector } from 'react-redux';
import { walletProvider } from '../../Utils/Provider';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';
import { getUserId } from '../../common/Storage';
import ProgressDialog from '../../components/ProgressDialog';
import { set } from 'react-native-reanimated';


const { width, height } = Dimensions.get('screen');
const NFTPage = ({ navigation, route }) => {
  const address = useSelector(state => state.address);
  const [collections, setCollections] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [gasFees, setGasFees] = useState(-1);
  const [amount, setAmount] = useState(route.params.price || 0);
  const [open, setOpen] = useState(false);
  const [tc, setTC] = useState(false);
  //const [loading,setLoading]=useState(false);
  let timeRef = React.useRef();

  console.log(route.params.item)
  console.log('Log', route.params.item.mediaUrl)

  const calculateGesFee = async () => {
    try {
      const provider = walletProvider();
      const gasFees = await provider.getGasPrice();
      const hex = Object.values(gasFees);
      console.log(parseInt(hex[0]))
      setGasFees(pre => pre = parseInt(hex[0]));
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  }

  const confirmTransaction = () => {
    try {
      setOpen(true)
      getUserId().then((userId) => {
        console.log("userID >>>> ", userId)
        axios.post('http://staging.komet.me/api/v1/market/v1/token/request_reservation',
          {
            "tokenId": route.params.item.tokenId,
            "timeToHold": 60
          },
          {
            headers: {
              'X-USER-ID': userId
            }
          }).then(async (response) => {
            console.log("key >>>> " + response.data.reservationRequestId, route.params.contract, '0x4D3f75262b6A2F9328b24245770970cbcE18Eb9a')
            try{
              const wallet = await BuyNft(amount, address?.privateKey?.second, '0x4D3f75262b6A2F9328b24245770970cbcE18Eb9a');
            console.log(wallet);

            await axios.post('http://staging.komet.me/api/v1/market/v1/token/request_reservation',
              {
                "reservationRequestId": response.data.reservationRequestId,
                "blockchainId": wallet,
                "tokenId": route.params.item.tokenId,
                "walletAddress": address?.accountAddress?.second

              },
              {
                headers: {
                  'X-USER-ID': userId
                }
              }).then((response) => {
                console.log(response)
                setTC(true)
              })
            }
            catch(error){
              setOpen(false);
            }
          })
      })
    } catch (err) {
      setOpen(false)
      console.log(err.message)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={{ width: '100%', height: 400, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 40, height: 40, width: 40, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 20, left: 20 }}>
            <MaterialIcons name={'keyboard-arrow-left'} color={'white'} size={28} />
          </TouchableOpacity>
          <Image source={{ uri: route.params.item.attributes['image'] }} style={{ width: '100%', height: 200, resizeMode: 'cover' }} />
        </View>

        <View style={{ borderTopEndRadius: 20, backgroundColor: '#1F1E2C', marginTop: -40, paddingVertical: 40, paddingHorizontal: 20, elevation: 20 }}>


          <Text style={styles.header}>{route.params.item.attributes.name}</Text>
          <Text style={styles.description}>{route.params.item.attributes.description}</Text>

          <View
            style={styles.summaryTextContainer}>
            <Text style={styles.subHeaderText}>Tokens on Sale</Text>
            <Text style={styles.subHeaderValue}>{route.params.item.attributes.decimals}</Text>
          </View>

          <View
            style={styles.summaryTextContainer}>
            <Text style={{ ...styles.subHeaderText, fontSize: 20, color: '#FF8DF4', alignSelf: 'center' }}>Floor Price</Text>
            <View>
              <Text style={{ ...styles.price, color: '#FF8DF4', textAlign: 'right' }}>{route.params.item.decimals}</Text>
              <Text style={{ ...styles.price, color: 'white', fontSize: 18 }}>{amount} <Text style={{ color: 'rgba(255,255,255,0.6)', fontFamily: typography.medium }}>MATIC</Text></Text>
            </View>
          </View>

          <View style={{ alignSelf: 'center' }}>
            <BorderButton
              borderColor={'#FF8DF4'}
              text={'  Buy Using OpenSea  '}
              onPress={() => {
                //fetchSecretKey();
                //console.log('BorderPressed');
              }}
            />
          </View>
          <View style={{ alignSelf: 'center' }}>
            <GradientButton
              text={' Buy from KometVerse '}
              colors={['#FF8DF4', '#89007C']}
              onPress={() => {
                setConfirm(true);
                calculateGesFee();
              }}
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={confirm}
        transparent
        onRequestClose={() => setConfirm(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
          }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => {
            clearInterval(timeRef.current)
            setConfirm(false)
          }}></TouchableOpacity>
          <View
            style={{
              flex: 0.7,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              backgroundColor: '#2F2F3A',
              alignItems: 'flex-start',
              padding: 15,
            }}>
            <View
              style={{
                height: 2,
                width: 40,
                backgroundColor: '#B02FA4',
                marginBottom: 30,
                alignSelf: 'center',
              }}></View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: typography.medium,
                color: 'white',
              }}>
              Transaction Info
            </Text>
            <View style={{
              width: '100%',
              marginTop: 40
            }}>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>From</Text>
                <Text style={{ ...styles.subHeaderText, width: '40%' }} ellipsizeMode={'middle'} numberOfLines={1}> {address?.accountAddress?.second}</Text>
              </View>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>To</Text>
                <Text style={{ ...styles.subHeaderText, width: '40%' }} ellipsizeMode={'middle'} numberOfLines={1} > {route?.params?.contract}</Text>
              </View>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>Gas Fees</Text>
                {(gasFees > 0) ?
                  <Text style={styles.subHeaderText}> {gasFees + " wei"}</Text>
                  : <ShimmerPlaceHolder style={{ width: '40%', borderRadius: 10 }} LinearGradient={LinearGradient} />}
              </View>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>Transaction</Text>
                <Text style={styles.subHeaderText}> {amount} MATIC</Text>
              </View>
            </View>

            <View style={{
              flexDirection: 'column'
            }}>

              <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                <GradientButton
                  text={'Confirm'}
                  size={150}
                  disabled={(gasFees <= 0) ? true : false}
                  colors={(gasFees > 0) ? ['#FF8DF4', '#89007C'] : ['rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.2)']}
                  onPress={() => {
                    clearInterval(timeRef.current)
                    confirmTransaction();
                    setConfirm(false);
                    setGasFees(0)
                  }}
                />
                <GradientButton
                  text={'Cancel'}
                  size={150}
                  colors={['#FF8DF4', '#89007C']}
                  onPress={() => {
                    //            navigation.navigate('RestoreFromPhrase');
                    clearInterval(timeRef.current)
                    setConfirm(false)
                    setGasFees(0)
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <ProgressDialog
        open={open}
        setOpen={setOpen}
        completed={tc}
        setCompleted={setTC}
      />
    </View>
  );
};

export default NFTPage;

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
  cardContainer: { height: width * 0.5, width: width * 0.45, margin: 10, },
  image: {
    height: width * 0.45,
    width: width * 0.45,
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
    fontFamily: typography.regular,
    fontSize: 12,
    color: 'white',
  },
  addressContainer: {
    //width: width * 0.5,
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