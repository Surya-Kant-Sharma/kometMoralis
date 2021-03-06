import React, { useEffect, useRef, useState } from 'react';
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
  Image,
  Alert
} from 'react-native';
import { themeColor } from '../../common/theme';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
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
import { getAccountInfo, getDataLocally, setDataLocally } from '../../Utils/AsyncStorage';
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
import Clipboard from '@react-native-community/clipboard';
import ProgressDialog from '../../components/ProgressDialog';
import { MaticPrice } from '../../Utils/Api';
import { useFocusEffect } from '@react-navigation/native';



const Home = ({ navigation, route }) => {
  const address = useSelector(state => state.address);
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
  const [progress, setProgress] = useState(false);
  const [vaultModal, setVaultModal] = useState(false)
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


  let balanceEvent = useRef();


  useEffect(() => {
    //console.log(user);
    fetchOtherWallet(user?.attributes.accounts[0])
    fetchWallets(user?.attributes.accounts[0])
    getBalanceLocally()
  }, [isAuthenticated]);


  const getBalanceLocally = async () => {
    try {
      const bal = await getDataLocally(Locations.EOA2)
      console.log(bal)
      setBalance(bal)
    } catch (err) {
      console.log(err.message)
    }
  }


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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getDataFromTheLocally()
  //   }, [])
  // )


  const createSW = async () => {
    try {
      await getEoaBalance();

      if (vault) {
        navigation.navigate('Vault')
      } else {

        if (eoaOneBalance < 0.1) {
          AlertConfirm(
            'Insufficient funds',
            'You Need At least 0.1 Matic from create smart wallet \n\n',
            () => {
              Clipboard.setString(address?.accountAddress?.first?.toString())
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
          setProgress(true)
          const options = {
            privateKey: address?.privateKey?.first,
            address: address?.accountAddress?.first,
            name: 'eth_Komet_me'
          }
          // alert(options.privateKey + "  " + options.address)
          try {
            await createSmartWallet(options);
            setTimeout(() => {
              setVault(true)
              setProgress(false)
            }, 5000)
          }
          catch {
            console.log('Error')
          }
        }
      }
    } catch (err) {
      console.log(err.message)
      // alert(err.message)
    }

  }

  const getDataFromTheLocally = async () => {
    try {
      const value = await getAccountInfo();
      fetchAddress(value);
      listenBalance(value?.accountAddress?.second?.toString())
      vaultStatus()
    } catch (err) {
      console.log(err.message)
      // alert(err.message)
    }
  }

  const listenBalance = async (address) => {
    try {
      if (address) {
        const provider = walletProvider();
        let lastBalance = ethers.constants.Zero
        balanceEvent = provider.on("block", () => {
          // console.log('BalanceListen',address)
          provider.getBalance(address.toString()).then((balance) => {
            if (!balance.eq(lastBalance)) {
              lastBalance = balance
              const balanceInEth = ethers.utils.formatEther(balance)
              console.log(`balance: ${balanceInEth} ETH`)
              setBalance(balanceInEth)
              setEOABalance(balanceInEth)
              setDataLocally(Locations.EOA2, balanceInEth)
            }
          })
        })
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const vaultStatus = async (options) => {
    try {
      const data = await getDataLocally(Locations.SMARTACCOUNTS);
      console.log("VAULT ___>> " ,data)
      if (data[0])
        setVault(true)
      else 
        getSWallet()
    } catch (err) {
      console.log(err)
      console.log(err.message)
    }
  }

  const getSWallet = async () => {
    try {
      const info = {
        privateKey: address?.privateKey?.first,
        address: address?.accountAddress?.first
      }
      console.log(info)
      const smartAddress = await isVault(info);
      console.log("smart ADDRESS =>> ",smartAddress)
      if (smartAddress) {
        setDataLocally(Locations.SMARTACCOUNTS, smartAddress);
        setVault(true)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const getEoaBalance = async () => {
    try {
      const address = await getDataLocally(Locations.ACCOUNTS)
      const connection = await new ethers.providers.JsonRpcProvider(
        "https://matic-mumbai.chainstacklabs.com"
      );
      const firstAddress = await connection.getBalance(address?.accountAddress?.first)
      const bal = ethers.utils.formatEther(firstAddress)
      setEoaOneBalance(bal)
      console.log('bal', bal)
      // alert(bal)
    } catch (err) {
      console.log('Error:247', err)
      console.log(err.message)
    }

  }

  const initHome = async () => {
    getDataFromTheLocally()
    getEoaBalance()
    // getSWallet()
    
  }

  React.useEffect(() => {
    initHome()
  }, [])

  // useFocusEffect(

  //   React.useCallback(() => {
  //     console.log('Inside Focus')
  //     getEoaBalance()
  //   }, [])
  // )

  return (
    <View style={{ flex: 1, backgroundColor: themeColor.primaryBlack }}>
      <ScrollView nestedScrollEnabled>
        <View style={styles.headerContainer}>
          <LinearGradient
            style={{ borderRadius: 20 }}
            colors={['#FE85F2', '#B02FA4']}>
            <TouchableOpacity style={{ ...styles.headerDropdownContainer }} onPress={(!vault) ? () => setVaultModal(true) : () => createSW()}>
              <MaterialCommunityIcons name={'safe-square'} size={20} color={'white'} />
              <Text style={styles.dropDownText}>{(vault) ? 'Open Vault' : 'Create Smart Vault'}</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            onPress={() => !isAuthenticated ? handleCryptoLogin() : navigation.navigate('Profile')}
            style={{
              ...styles.headerDropdownContainer,
              backgroundColor: '#343153',
            }}>
            <Entypo name={'wallet'} color={'white'} size={20} />
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
                //justifyContent: 'flex-end',
              }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setOpen(false)}></TouchableOpacity>
              <View
                style={{
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  backgroundColor: '#2F2F3A',
                  alignItems: 'flex-start',
                  padding: 15,
                  flex: 1
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
                  width: '100%',
                  backgroundColor: themeColor.primaryBlack,
                  height: '100%',
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
                <Image source={require('../../../assets/images/E-wallet.png')} style={{ alignSelf: 'center' }} />
                <Text style={{ fontFamily: typography.medium, fontSize: 24, color: 'white', alignSelf: 'center', marginVertical: 15 }}>Create Komet smart vault</Text>
                <Text style={{ textAlign: 'center', fontFamily: typography.medium, fontSize: 16, color: 'rgba(255,255,255,0.60)', alignSelf: 'center', marginVertical: 15 }}>lorem ispusm jhiredf rwid wkeof uiofr poustyr quedro multia</Text>
                <View style={{ alignSelf: 'center' }}>
                  <GradientButton
                    text={'Create Vault'}
                    colors={['#FF8DF4', '#89007C']}
                    onPress={() => {
                      setVaultModal(false);
                      createSW()
                    }}
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
            Clipboard.setString(address?.accountAddress?.second?.toString())
            ToastAndroid.showWithGravity('Address Copied', ToastAndroid.LONG, ToastAndroid.CENTER)
          }}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.addressText}>
              {address?.accountAddress?.second?.substring(0, 8) + "..." + address?.accountAddress?.second?.substring(34, address?.accountAddress?.second?.length)}
            </Text>
            <MaterialIcons name='content-copy' size={14} style={{ marginLeft: 20 }} />
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
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <AntDesign name={'arrowup'} color={'white'} size={28} />
                </View>
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
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <AntDesign name={'arrowdown'} color={'white'} size={28} />
                </View>
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
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <AntDesign name={'swap'} color={'white'} size={28} />
                </View>
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
                width: '100%',
                backgroundColor: themeColor.primaryBlack,
                height: '100%',
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
              <Image source={require('../../../assets/images/E-wallet.png')} style={{ alignSelf: 'center' }} />
              <Text style={{ fontFamily: typography.medium, fontSize: 24, color: 'white', alignSelf: 'center', marginVertical: 15 }}>Create Komet smart vault</Text>
              <Text style={{ textAlign: 'center', fontFamily: typography.medium, fontSize: 16, color: 'rgba(255,255,255,0.60)', alignSelf: 'center', marginVertical: 15 }}>lorem ispusm jhiredf rwid wkeof uiofr poustyr quedro multia</Text>
              <View style={{ alignSelf: 'center' }}>
                <GradientButton
                  text={'Create Vault'}
                  colors={['#FF8DF4', '#89007C']}
                  onPress={() => {
                    createSW()
                    setVaultModal(false);
                  }}
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

        <ProgressDialog
          open={progress}
          setOpen={setProgress}
          completed={false}
        />
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
    width: width * 0.40,
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