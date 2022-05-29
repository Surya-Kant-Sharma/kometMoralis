import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  RefreshControl,
  ToastAndroid
} from 'react-native';
import { themeColor } from '../../common/theme';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScanIcon from '../../../assets/svg/ScanIcon.svg';
import ReceiveIcon from '../../../assets/svg/ReceiveIcon.svg';
import Send from '../../../assets/svg/Send.svg';
// import HistoryIcon from '../../../assets/svg/HistoryIcon.svg';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux';
//import ScanIcon from '../../../assets/svg/ScanIcon.svg';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import { ethers } from 'ethers';
const { width, height } = Dimensions.get('screen');
import DropDownPicker from 'react-native-dropdown-picker';
import BorderButton from '../../components/BorderButton';
import Header from '../../components/Header';
import { getAccountDetails } from '../../Utils/ImportWallet';
import { getDataLocally, setDataLocally } from '../../Utils/AsyncStorage';
import { setAddress, setVaultBalance } from '../../store/Actions/action';
import AlertConfirm from '../../components/Alert';
import Clipboard from '@react-native-community/clipboard';
import { eoa2Balance } from '../../Utils/Balance';
import { walletProvider } from '../../Utils/Provider';
import { Locations } from '../../Utils/StorageLocations';
import { getSmartWalletBalance } from '../../Utils/SmartWallet';
import GradientButton from '../../components/GradientButton';

const Home = ({ navigation, route }) => {
  const address = useSelector(state => state.address);
  const vaultBalance = useSelector(state => state.vaultBalance);
  const dispatch = useDispatch();
  const fetchAddress = address => dispatch(setAddress(address));
  const setVAULTBalance = balance => dispatch(setVaultBalance(balance));
  const [balance, setBalance] = useState(0);
  const [sdata, setSData] = React.useState();
  console.log(address?.balance?.first)
  var provider;
  const [value, setValue] = useState('Polygon Testnet');
  const [open, setOpen] = useState(false);
  const [networkModal, setNetworkModal] = useState(false);
  const [networks, setNetworks] = useState([
    'Ethereum Mainnet',
    'Binance Smart Chain',
    'Polygon Smart Chain Mainnet',
    'Polygon Mainnet',
    'Polygon Testnet'
  ]);


  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getSWallet();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  React.useEffect(() => {
    getSWallet()
    getBalanceLocally()
  }, [])



  const getBalanceLocally = async () => {
    try {
      const bal = await getDataLocally(Locations.VAULT)
      console.log(bal)
      setBalance(bal)
    } catch (err) {
      console.log(err.message)
    }
  }



  // const createSW = () => {
  //   if (balance < 0.2) {
  //     AlertConfirm(
  //       'Insufficient funds',
  //       'You Need At least 0.002 Matic from create smart wallet \n\n',
  //       () => {
  //         Clipboard.setString(address?.accountAddress?.second?.toString())
  //         ToastAndroid.showWithGravity(
  //           "Address Coped in Clipboard",
  //           ToastAndroid.LONG,
  //           ToastAndroid.CENTER
  //         );
  //         setTimeout(() => Linking.openURL("https://faucet.polygon.technology/"), 500)

  //       },
  //       () => console.log('dismiss')
  //     );
  //   } else {
  //     navigation.navigate('vault')
  //   }
  // }

  // const getDataFromTheLocally = async () => {
  //   try {
  //     const value = await getAccountInfo();
  //     // console.log(value);
  //     fetchAddress(value);
  //     listenBalance('0x4bAecAd2C2ad9AD8B06Be25D7B83A5C0aCdE816E')
  //     // value?.accountAddress?.second;
  //   } catch (err) {
  //     alert(err.message)
  //   }
  // }

  // const listenBalance = async (address) => {
  //   try {
  //     const provider = walletProvider();
  //     let lastBalance = ethers.constants.Zero
  //     // const address = address?.accountAddress?.second;
  //     provider.on("block", () => {
  //       provider.getBalance(address).then((balance) => {
  //         if (!balance.eq(lastBalance)) {
  //           lastBalance = balance
  //           console.log("last Balance" + balance);
  //           // convert a currency unit from wei to ether
  //           const balanceInEth = ethers.utils.formatEther(balance)
  //           setBalance(balanceInEth)
  //           console.log(`balance: ${balanceInEth} ETH`)
  //         }
  //       })
  //     })
  //   } catch (err) {
  //     alert(err.message)
  //   }
  // }

  const getSWallet = async () => {
    try {
      const data = await getDataLocally(Locations.SMARTACCOUNTS);
      console.log('SWData',data)
      // alert(data.address)
      if (data.address) {
        setSData(data)
        getBalance(data)

      }
    } catch (err) {
      alert(err.message)
    }
  }

  const getBalance = async (data) => {
    try {
      const options = {
        privateKey: address?.privateKey?.first,
        address: data?.address
      }
      const balance = await getSmartWalletBalance(options);
      setBalance(balance)
      setVAULTBalance(balance)
      setDataLocally(Locations.VAULT, balance)
      // console.log(balance);
    } catch (err) {
      console.log(err)
      alert(err.message)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: themeColor.primaryBlack, padding: 30 }}>
      <ScrollView nestedScrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Header navigation={navigation}/>
        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
          {/* <LinearGradient
            style={{ borderRadius: 20 }}
            colors={['#FE85F2', '#B02FA4']}>
            <TouchableOpacity style={{ ...styles.headerDropdownContainer }} onPress={createSW}>
              <Entypo name={'wallet'} size={20} />
              <Text style={styles.dropDownText}>Create Smart Vault</Text>
            </TouchableOpacity>
          </LinearGradient> */}
          {/* <TouchableOpacity
            //onPress={() => handleCryptoLogin()}
            style={{
              ...styles.headerDropdownContainer,
              backgroundColor: '#343153',
            }}>
            <ScanIcon />
            <Text style={styles.dropDownText}>Connect Wallet</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigation.navigate('SwapToken', { path: 'vault' })}>
            <LinearGradient
              colors={['#FF84F3', '#B02FA4']}
              style={{
                height: 64,
                width: 64,
                borderRadius: 64,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={'wallet'} color={'white'} size={32} />
              </TouchableOpacity>
            </LinearGradient>

          </TouchableOpacity>
          <Text
            fontSize={20}
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{

              ...styles.addressText,
              fontSize: 20,
              fontFamily: typography.semiBold,
            }}>
            {"Komet Smart Vault"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Modal
            visible={open}
            transparent
            onRequestClose={() => setOpen(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <View
                style={{
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
                  Select Networks
                </Text>
                {networks.map((item, index) => (
                  <TouchableOpacity
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
                        fontSize: 12,
                        fontFamily: typography.regular,
                        color: 'white',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View style={{ alignSelf: 'center' }}>
                  <BorderButton
                    borderColor={'#FF8DF4'}
                    text={'Add Network'}
                    onPress={() => {
                      setNetworkModal(true);
                      //navigation.navigate('RestoreFromDevice');
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            visible={networkModal}
            transparent
            onRequestClose={() => setNetworkModal(false)}>
            <KeyboardAvoidingView
              behavior="padding"
              style={{
                flex: 1,
                backgroundColor: themeColor.primaryBlack,
                padding: 30,
              }}><Header navigation={navigation} /><View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: typography.regular,
                    color: 'white',
                  }}>
                  Network Name
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#232732',
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                />
              </View>
              {/*2*/}
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: typography.regular,
                    color: 'white',
                  }}>
                  New RPC URL
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#232732',
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                />
              </View>
              {/*3*/}
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: typography.regular,
                    color: 'white',
                  }}>
                  Chain ID
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#232732',
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                />
              </View>
              {/*4*/}
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: typography.regular,
                    color: 'white',
                  }}>
                  Currency Symbol
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#232732',
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                />
              </View>
              {/*5*/}
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: typography.regular,
                    color: 'white',
                  }}>
                  Block Explorer URL (optional)
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#232732',
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                />
              </View>
              {/**/}
            </KeyboardAvoidingView>
          </Modal>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={{
              justifyContent: 'space-around',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: typography.medium,
                color: 'white',
                fontSize: 12,
              }}>
              {value}
            </Text>
            <MaterialIcons
              name={'keyboard-arrow-down'}
              color={'white'}
              size={15}
            />
          </TouchableOpacity>

          <Text style={styles.balanceText}>
            $ {parseFloat(parseFloat(balance).toPrecision(2) * 0.6).toPrecision(1)}
          </Text>

          <Text style={{
            ...styles.addressText,
            fontSize: 16,
            margin: 4
          }}>
            {parseFloat(balance).toPrecision(2)} Matic
          </Text>
          <TouchableOpacity style={styles.addressContainer} onPress={() => {
            Clipboard.setString(sdata?.address?.toString())
            ToastAndroid.showWithGravity('Address Copied', ToastAndroid.LONG, ToastAndroid.CENTER)
          }}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.addressText}>
              {sdata?.address?.substring(0, 8) + "..." + sdata?.address?.substring(34, sdata?.address?.length)}
            </Text>
            <MaterialIcons name='content-copy' size={14} style={{ marginLeft: 20 }} />
          </TouchableOpacity>
          <View style={{ height: 50 }} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '80%',
            }}>
            <TouchableOpacity style={{ alignItems: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('SwapToken', { path: 'vault' })}>
              <GradientButton
                text={' Swap '}
                colors={['#FF8DF4', '#89007C']}
                onPress={() => navigation.navigate('SwapToken', { path: 'vault' })}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 0.4,

    marginVertical: 30,
  },
  headerDropdownContainer: {
    height: 30,
    width: width * 0.45,
    borderRadius: 20,

    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  dropDownText: {
    fontFamily: typography.regular,
    fontSize: 10,
    color: 'white',
  },
  textContainer: {
    flex: 1.6,
    margin: 6,
    justifyContent: 'space-around',
    paddingVertical: 30,
    alignItems: 'center',
    alignSelf: 'center',
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
  },
  balanceText: {
    fontSize: 36,
    fontFamily: typography.semiBold,
    color: 'white',
    textAlign: 'center',
  },
  addressText: {
    fontFamily: typography.regular,
    // fontSize: 12,
    color: 'white',
  },
});