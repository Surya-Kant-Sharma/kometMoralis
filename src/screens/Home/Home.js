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
  Linking,
  ToastAndroid,
  Image
} from 'react-native';
import { themeColor } from '../../common/theme';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
//import ScanIcon from '../../../assets/svg/ScanIcon.svg';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ethers } from 'ethers';
const { width, height } = Dimensions.get('screen');
import DropDownPicker from 'react-native-dropdown-picker';
import BorderButton from '../../components/BorderButton';
import Header from '../../components/Header';
import { getAccountDetails } from '../../Utils/ImportWallet';
import { getAccountInfo, getDataLocally } from '../../Utils/AsyncStorage';
import { getOtherWalletAddress, getWallets, setAddress, setEoaBalance } from '../../store/Actions/action';
import AlertConfirm from '../../components/Alert';
// import Clipboard from '@react-native-community/clipboard';
import { eoa2Balance } from '../../Utils/Balance';
import { walletProvider } from '../../Utils/Provider';
import { createSmartWallet, isVault } from '../../Utils/SmartWallet';
import { Locations } from '../../Utils/StorageLocations';
import { useWalletConnect } from "../../../frontend/WalletConnect";
import { useMoralis } from 'react-moralis';
import GradientButton from '../../components/GradientButton';


const Home = ({ navigation, route }) => {

  const address = useSelector(state => state.address);
  // const eoaBalance = useSelector(state => state.eoaBalance);
  const dispatch = useDispatch();
  const fetchAddress = address => dispatch(setAddress(address));
  const setEOABalance = balance => dispatch(setEoaBalance(balance));
  const [balance, setBalance] = useState(0);
  const [eoaOneBalance, setEoaOneBalance] = useState(0);
  const [vault, setVault] = useState(false);
  const fetchOtherWallet = (add) => dispatch(getOtherWalletAddress(add))
  const fetchWallets = (add) => dispatch((getWallets(add)))
  const [value, setValue] = useState('Polygon Testnet');
  const [open, setOpen] = useState(false);
  const [vaultModal,setVaultModal]=useState(false)
  const [networkModal, setNetworkModal] = useState(false);
  const [vaultInfo, setVaultInfo] = useState(false);
  const [networks, setNetworks] = useState([
    'Ethereum Mainnet',
    'Binance Smart Chain',
    'Polygon Smart Chain Mainnet',
    'Polygon Mainnet',
    'Polygon Testnet'
  ]);


  const connector = useWalletConnect();
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


  React.useEffect(() => {
    getDataFromTheLocally()
    getSWallet()
    getEoaBalance()
  }, [])

  useEffect(() => {
    //console.log(user);
    fetchOtherWallet(user?.attributes.accounts[0])
    fetchWallets(user?.attributes.accounts[0])
  }, [isAuthenticated]);


  const handleCryptoLogin = async () => {
    await authenticate({ connector })
      .then(() => {
        //navigation.navigate('Profile')
        if (authError) {
          //setErrortext(authError.message);
          console.log(authError)
          //setVisible(true);
        } else {
          if (isAuthenticated) {
            navigation.navigate("Profile");
          }
        }
      })
      .catch(() => { });
  };


  const createSW = async () => {

    try {

      if (vault) {
        navigation.navigate('Vault')
      } else {

        if (eoaOneBalance > 0.2) {
          AlertConfirm(
            'Insufficient funds',
            'You Need At least 0.002 Matic from create smart wallet \n\n',
            () => {
              Clipboard.setString(address?.accountAddress?.second?.toString())
              ToastAndroid.showWithGravity(
                "Address Coped in Clipboard",
                ToastAndroid.LONG,
                ToastAndroid.CENTER
              );
              setTimeout(() => Linking.openURL("https://faucet.polygon.technology/"), 500)

            },
            () => console.log('dismiss')
          );
        } else {
          setVaultInfo(true);
        }
      }
    } catch (err) {
      alert(err.message)
    }

  }

  const getDataFromTheLocally = async () => {
    try {
      const value = await getAccountInfo();
      // console.log(value);
      fetchAddress(value);
      listenBalance(address?.accountAddress?.second?.toString())
      // const options = {
      //   privateKey: value?.privateKey?.first,
      //   address: value?.accountAddress?.first
      // }
      // vaultStatus(options)
      // value?.accountAddress?.second;
    } catch (err) {
      alert(err.message)
    }
  }

  const listenBalance = async (address) => {
    try {
      const provider = walletProvider();
//      console.log(provider)
      let lastBalance = ethers.constants.Zero
      // const address = address?.accountAddress?.second;
      provider.on("block", () => {
        provider.getBalance(address).then((balance) => {
          if (!balance.eq(lastBalance)) {
            lastBalance = balance
            const balanceInEth = ethers.utils.formatEther(balance)
            console.log(`balance: ${balanceInEth} ETH`)
            setBalance(balanceInEth)
            setEOABalance(balanceInEth)
          }
        })
      })
    } catch (err) {
      alert(err.message)
    }
  }

  const vaultStatus = async (options) => {
    try {
      const status = await isVault(options);
      console.log('status', status)
      setVault(status)
    } catch (err) {
      console.log(err)
      alert(err.message)
    }
  }

  const getSWallet = async (options) => {
    try {
      const data = await getDataLocally(Locations.SMARTACCOUNTS);
      console.log(data)
      if (data?.address) {
        setVault(true)
      }
      return data
    } catch (err) {
      alert(err.message)
    }
  }

  const getEoaBalance = async () => {
    try {
      const connection = await new ethers.providers.JsonRpcProvider(
        "https://matic-mumbai.chainstacklabs.com"
      );
      const firstAddress = await connection.getBalance(address?.accountAddress?.first)
      const bal = ethers.utils.formatEther(firstAddress)
      setEoaOneBalance(bal)
      // alert(bal)
    } catch (err) {
      console.log(err)
      alert(err.message)
    }

  }

  return (
    <View style={{ flex: 1, backgroundColor: themeColor.primaryBlack }}>
      <ScrollView nestedScrollEnabled>
        <View style={styles.headerContainer}>
          <LinearGradient
            style={{ borderRadius: 20 }}
            colors={['#FE85F2', '#B02FA4']}>
            <TouchableOpacity style={{ ...styles.headerDropdownContainer }} onPress={(vault)?()=>setVaultModal(true):()=>createSW()}>
              <Entypo name={'wallet'} size={20} />
              <Text style={styles.dropDownText}>{(vault) ? 'Open Vault' : 'Create Smart Vault'}</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            onPress={() => handleCryptoLogin()}
            style={{
              ...styles.headerDropdownContainer,
              backgroundColor: '#343153',
            }}>
            <AntDesign name={'qrcode'} color={'white'} size={28} />
            <Text style={styles.dropDownText}> {!isAuthenticated ? 'Connect Wallet' : 'Open Other Wallet'} </Text>
          </TouchableOpacity>
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
          {/*Vault Modal*/}
          <Modal
            visible={vaultModal}
            transparent
            onRequestClose={() => setVaultModal(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',

              }}>
              <View
                style={{
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  width:'100%',
                  backgroundColor:themeColor.primaryBlack,
                  height:'100%',
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
                <Image source={require('../../../assets/images/E-wallet.png')} style={{alignSelf:'center'}}/>
                <Text style={{fontFamily:typography.medium,fontSize:24,color:'white',alignSelf:'center',marginVertical:15}}>Create Komet smart vault</Text>
                <Text style={{textAlign:'center',fontFamily:typography.medium,fontSize:16,color:'rgba(255,255,255,0.60)',alignSelf:'center',marginVertical:15}}>lorem ispusm jhiredf rwid wkeof uiofr poustyr quedro multia</Text>
                <View style={{ alignSelf: 'center' }}>
                  <GradientButton
                  text={'Create Vault'}
                  colors={['#FF8DF4', '#89007C']}
                  onPress={()=>{setVaultModal(false);createSW()}}
                  />
                  <BorderButton
                  size={150}
                    borderColor={'#FF8DF4'}
                    text={'Not Now'}
                    onPress={() => {
                      setVaultModal(false);
                      //navigation.navigate('RestoreFromDevice');
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          {/* EO Vault Modal*/}
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
              }}>
              <Header navigation={navigation} />
              <View>
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
            $ {parseFloat(balance).toPrecision(2)}
          </Text>
          <TouchableOpacity style={styles.addressContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.addressText}>
              {address?.accountAddress?.second?.substring(0, 8) + "..." + address?.accountAddress?.second?.substring(34, address?.accountAddress?.second?.length)}
            </Text>
          </TouchableOpacity>
          <View style={{ height: 50 }} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '80%',
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('Send')}>
              <LinearGradient
                colors={['#FF84F3', '#B02FA4']}
                style={{
                  height: 64,
                  width: 64,
                  alignItems: 'center',
                  borderRadius: 64,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <AntDesign name={'arrowup'} color={'white'} size={28} />
                </TouchableOpacity>
              </LinearGradient>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 12,
                  fontFamily: typography.medium,
                  color: 'white',
                }}>
                Send
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ReceiveToken')}>
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
                  <AntDesign name={'arrowdown'} color={'white'} size={28} />
                </TouchableOpacity>
              </LinearGradient>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 12,
                  fontFamily: typography.medium,
                  color: 'white',
                }}>
                Receive
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SwapToken', { path: 'home' })}>
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
                  <AntDesign name={'swap'} color={'white'} size={28} />
                </TouchableOpacity>
              </LinearGradient>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 12,
                  fontFamily: typography.medium,
                  color: 'white',
                }}>
                Swap
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOR CREATE WALLET APP */}

        <Modal
          visible={vaultInfo}
          transparent
          onRequestClose={() => setVaultInfo(false)}
        >

          <View
            style={{
              flex: 1,
              zIndex: 0,
              justifyContent: 'flex-start',
              backgroundColor: 'rgba(14,14,14,0.6)'
            }}>
            <TouchableOpacity style={{ flex: 1 }} ></TouchableOpacity>
            <View
              style={{
                flex: 1,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                backgroundColor: '#2F2F3A',
                alignItems: 'flex-start',
                padding: 15,
              }}>

              <Text
                style={{
                  fontSize: 16,
                  fontFamily: typography.medium,
                  color: 'white',
                }}>
                Waht Is Vault ?
              </Text>

              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <MaterialIcons style={{ width: '80%', alignItems: 'center', marginLeft: 120, margin: 40 }} name="account-balance" size={120} />
              </View>

              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: typography.thin,
                    color: 'white',
                  }}>
                  This is a vault for storing your assets with three layers of security with our wallet.
                </Text>
              </View>

            </View>
          </View>
          <View>
            <View style={{
              flexDirection: 'row'
            }}>

              <TouchableOpacity style={{
                width: '50%',
                height: 40,
                backgroundColor: '#B02FA4',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10
              }}
                onPress={() => {
                  setVaultInfo(false)
                  // Linking.openURL("https://mumbai.polygonscan.com/tx/" + selectedData?.hash)
                }}
              >
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Create Vault</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                width: '50%',
                height: 40,
                backgroundColor: '#B02FA4',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10
              }}
                onPress={async () => {
                  setVaultInfo(false)
                  const options = {
                    privateKey: address?.privateKey?.first,
                    address: address?.accountAddress?.first,
                    name: 'eth_surya_kant_sharma'
                  }
                  alert(options.privateKey + "  " + options.address)
                  await createSmartWallet(options);
                  // navigation.navigate('SendTokenFinalize', { to: selectedData?.to, name: selectedData?.name })
                }}
              >
                <Text style={{ fontWeight: 'bold', color: 'white' }}> Cancel </Text>
              </TouchableOpacity>

              {/* <View style={{ alignItems: 'center' }}>
                                    <GradientButton
                                        text={'Cancel'}
                                        colors={['#FF8DF4', '#89007C']}
                                        onPress={() => {
                                            //            navigation.navigate('RestoreFromPhrase');
                                            setConfirm(false)
                                        }}
                                    />
                                </View> */}
            </View>
          </View>
        </Modal>

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
    margin: 20,
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
    fontSize: 12,
    color: 'white',
  },
});
