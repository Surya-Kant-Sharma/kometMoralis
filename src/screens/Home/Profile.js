
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  Modal
} from 'react-native';
import { themeColor } from '../../common/theme';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileIcons from '../../../assets/svg/ProfileIcons.svg';
import AssetIcon from '../../../assets/svg/AssetIcon.svg';
import { typography } from '../../common/typography';
//import axios from 'axios';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AssetsLog from '../../components/AssetsLog';
import { ActivityIndicator } from 'react-native-paper';
import { useNFTBalance } from '../../../frontend/hooks/useNFTBalance';
import NFTAssets from '../../../frontend/Components/NFT/NFTAssets'
import { useMoralis } from 'react-moralis';
import { Picker } from '@react-native-picker/picker';
const { width, height } = Dimensions.get('screen');
import { ethers } from 'ethers';
import { getDataLocally } from '../../Utils/AsyncStorage';
import { Locations } from '../../Utils/StorageLocations';
import useNativeBalance from '../../../frontend/hooks/useNativeBalance';
import { getWallets, setAddress } from '../../store/Actions/action';
import { getSmartWalletBalance } from '../../Utils/SmartWallet';

console.ignoredYellowBox = ['Setting a timer'];

const Profile = ({ navigation }) => {
  const eoaTwo = useSelector(state => state.address);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [otherAssets, setOtherAssets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [selectedMode, setSelectedMode] = useState();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('Komet Wallet')
  const [Modes, setModes] = useState(['Komet Wallet'])
  const address = useSelector(state => state.address);
  const otherWalletAddress = useSelector(state => state.otherWallet);
  const eoaBalance = useSelector(state => state.eoaBalance);
  const {
    authenticate,
    authError,
    isAuthenticating,
    isAuthenticated,
    logout,
    Moralis,
    user,
    refetchUserData, isUserUpdating, userError
  } = useMoralis();

  let MODES = ['EOA2'];

  const { nativeBalance } = useNativeBalance('0x13881');
  console.log("matic ",nativeBalance)

  const fetchAssets = async () => {
    await fetch('https://api.opensea.io/api/v1/collections?offset=0&limit=300')
      .then(async (res) => {
      }).catch(error => {
        console.log(error);
      });
  };


  useEffect(() => {
    getSelectedItemInfo()
    getModesBalance()
    getExternalWallet()
  }, [value, isAuthenticated])

  const getSelectedItemInfo = () => {
    switch (value) {
      case 'Komet Wallet':
        setSelectedAddress(address?.accountAddress?.second)
        getModesBalance(address?.accountAddress?.second)
        break
      case 'Vault':
        getVaultDetails();
        break
      case 'External Wallet':
        getOtherWalletBalance()
        break
      default:
        alert('No such feild are present')
    }
  }


  const getVaultInfo = async () => {
    try {
      const info = await getDataLocally(Locations.SMARTACCOUNTS);
      if (info?.address)
        // MODES.push("Vault")
        if (Modes.indexOf('Vault') == -1) {
          setModes(pre => [...pre, 'Vault'])
        }
      // alert(info);
    } catch (err) {
      // alert(err.message)
    }
  }

  const getVaultDetails = async() => {
    try {
      const info = await getDataLocally(Locations.SMARTACCOUNTS);
      if (info?.address){
        setSelectedAddress(info?.address)
        const bal = await getVaultBalance({
          privateKey: address?.privateKey?.first,
          address: info?.address
        })
        // setBalance(0)
      }
      
      // alert(info);
    } catch (err) {
      // alert(err.message)
    }
  }
  
  const getVaultBalance = async (options) => {
    try {
      const balance = await getSmartWalletBalance(options);
      setBalance(balance)
      // console.log(balance);
    } catch (err) {
      console.log(err.message)
    //   alert(err.message)
    }
  }



  const getExternalWallet = () => {
    if (isAuthenticated) {
      console.log(Modes.indexOf('External Wallet'))        
      if (Modes.indexOf('External Wallet') == -1) {
        setModes(pre => [...pre, 'External Wallet'])
      }
      
      
    }
  }

  const getOtherWalletBalance = () => {
    setSelectedAddress(otherWalletAddress)
    setBalance(nativeBalance)
  }

  const getModesBalance = async (address) => {
    try {
      const connection = await new ethers.providers.JsonRpcProvider(
        "https://matic-mumbai.chainstacklabs.com"
      );
      const firstAddress = await connection.getBalance(address)
      const bal = ethers.utils.formatEther(firstAddress)
      setBalance(bal)
      // alert(bal)
    } catch (err) {
      console.log(err)
      // alert(err.message)
    }

  }

  useEffect(() => {
    fetchAssets();
    getVaultInfo();
    getExternalWallet();
  }, []);
  const [currentTab, setCurrentTab] = useState('Komet');

  // const MODES = ['EOA2', 'Vault', ];


  return (
    <ScrollView style={{ flex: 1, backgroundColor: themeColor.primaryBlack }}>
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-between',
            marginHorizontal: 20
          }}>
          <View
            style={{
              marginRight: 20,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row'
            }}>
            <Image source={require('../../../assets/images/ProfileImage.png')} />
            <View style={{ margin: 10, marginHorizontal: 20, flex: 0.8 }}>
              <Text
                style={{

                  fontFamily: typography.medium,
                  color: 'white',
                  fontSize: 18,
                }}>
                Victoria
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode={'middle'}
                style={{

                  fontFamily: typography.medium,
                  color: 'rgba(255,255,255,0.80)',
                  fontSize: 10,
                }}>
                {selectedAddress || '0xff4533223454'}
              </Text>
            </View>
          </View>



          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={{
              height: 42,
              width: 42,
              borderRadius: 32,
              backgroundColor: '#343153',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name={'menu'} size={26} color={'white'} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
          <TouchableOpacity style={{ borderRadius: 15, padding: 10, backgroundColor: '#E1E4F8', flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setOpen(true)}>
            <Text style={{ fontFamily: typography.medium, color: 'white', fontSize: 12, color: '#453E9F' }}>
              {value}
            </Text>

            <MaterialIcons name={'keyboard-arrow-down'} size={16} color={'#453E9F'} /></TouchableOpacity>
          <Text style={{ fontFamily: typography.semiBold, color: 'white', fontSize: 18 }}>$ {(parseFloat(balance).toPrecision(4) * 0.6).toPrecision(2) * 0.6}</Text>
        </View>
      </View>



      {(isAuthenticated) ?
        <AssetsLog
          image={'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg'}
          coinName={'Polygon'}
          symbol={'MATIC'}
          value={parseFloat(balance).toPrecision(4)}
          price={'0.6'}
          change={balance}
          chain={'polygon'}
        /> :
        <AssetsLog
          image={'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg'}
          coinName={'Polygon'}
          symbol={'MATIC'}
          value={parseFloat(balance).toPrecision(4)}
          price={'$1.34'}
          change={'low'}
          chain={'polygon'}
        />
      }
      <TouchableOpacity style={{ borderRadius: 15, padding: 10, backgroundColor: '#E1E4F8', flexDirection: 'row', alignItems: 'center', width: 50, margin: 20 }}><Text style={{ fontFamily: typography.medium, color: 'white', fontSize: 12, color: '#453E9F' }}>All</Text><MaterialIcons name={'keyboard-arrow-right'} size={16} color={'#453E9F'} /></TouchableOpacity>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20, alignItems: 'center' }}>
        <TouchableOpacity style={{ borderRadius: 15, padding: 10, flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontFamily: typography.medium, color: 'white', fontSize: 18, color: 'white' }}>Collectibles</Text></TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 15, backgroundColor: '#E1E4F8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, height: 35 }}><MaterialIcons name={'ios-share'} size={16} color={'#453E9F'} /><Text style={{ fontFamily: typography.medium, color: 'white', fontSize: 12, color: '#453E9F' }}>Share</Text></TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, alignItems: 'center' }}>
        <TouchableOpacity style={{ borderRadius: 15, padding: 10, flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontFamily: typography.medium, color: 'white', fontSize: 14, color: 'white' }}>Showcase</Text></TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, height: 35 }}><MaterialIcons name={'keyboard-arrow-down'} size={16} color={'white'} /></TouchableOpacity>
      </View>
      <NFTAssets chain={'0x13881'}/>

      {/* {'Account Select Modal'} */}
      <Modal
        visible={open}
        transparent
        onRequestClose={() => setOpen(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
          }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setOpen(false)}></TouchableOpacity>
          <View
            style={{
              flex: 1,
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
              Select Modes
            </Text>
            {Modes.map((item, index) => (
              <TouchableOpacity
                key={item.toString()}
                onPress={() => {
                  setValue(item);

                  setOpen(false);
                }}
                style={{
                  marginHorizontal: 20,
                  marginVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 12,
                    width: 12,
                    borderRadius: 50,
                    backgroundColor: value == item ? '#FF84F3' : '#C4C4C4',
                    marginHorizontal: 10,
                  }}></View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: typography.regular,
                    color: 'white',
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}

          </View>
        </View>
      </Modal>
      {/* {'Account Select Modal'} */}

    </ScrollView>
  );
};

export default Profile;
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
  cardContainer: { height: width * 0.5, width: width * 0.4, margin: 10 },
  image: {
    height: width * 0.4,
    width: width * 0.4,
    borderRadius: 20,
  },
  imageText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontFamily: typography.medium,
  },
});





