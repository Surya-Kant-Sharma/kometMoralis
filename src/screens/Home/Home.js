import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScanIcon from '../../../assets/svg/ScanIcon.svg';
import ReceiveIcon from '../../../assets/svg/ReceiveIcon.svg';
import Send from '../../../assets/svg/Send.svg';
import HistoryIcon from '../../../assets/svg/HistoryIcon.svg';
import {useSelector} from 'react-redux';
//import ScanIcon from '../../../assets/svg/ScanIcon.svg';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import {ethers} from 'ethers';
const {width, height} = Dimensions.get('screen');
import DropDownPicker from 'react-native-dropdown-picker';
import BorderButton from '../../components/BorderButton';
import Header from '../../components/Header';
import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";
import { useWalletConnect } from "../../../frontend/WalletConnect";

const Home = ({navigation, route}) => {
  const address = useSelector(state => state.address);
  var provider;
  var balance = useSelector(state => state.balance);
  const [value, setValue] = useState('Ethereum Mainnet');
  const [open, setOpen] = useState(false);
  const [networkModal, setNetworkModal] = useState(false);
  const [networks, setNetworks] = useState([
    'Ethereum Mainnet',
    'Binance Smart Chain',
    'Polygon Smart Chain Mainnet',
    'Polygon Mainnet',
  ]);
  const connector = useWalletConnect();
  const {
    authenticate,
    authError,
    isAuthenticating,
    isAuthenticated,
    logout,
    Moralis,
    user
  } = useMoralis();
  const handleCryptoLogin = () => {
    authenticate({ connector })
      .then(() => {
        console.log(user,isAuthenticating,isAuthenticated)
        console.log(JSON.stringify(user,null,2))
        if (authError) {
          //setErrortext(authError.message);
          console.log(authError)
          setVisible(true);
        } else {
          if (isAuthenticated) {
            navigation.navigate("Profile");
          }
        }
      })
      .catch(() => {});
  };

  return (
    <View style={{flex: 1, backgroundColor: themeColor.primaryBlack}}>
      <ScrollView nestedScrollEnabled>
        <View style={styles.headerContainer}>
          <LinearGradient
            style={{borderRadius: 20}}
            colors={['#FE85F2', '#B02FA4']}>
            <TouchableOpacity style={{...styles.headerDropdownContainer}}>
              <Entypo name={'wallet'} size={20} />
              <Text style={styles.dropDownText}>Create Smart Vault</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            onPress={() => handleCryptoLogin()}
            style={{
              ...styles.headerDropdownContainer,
              backgroundColor: '#343153',
            }}>
            {/* <ScanIcon /> */}
            <MaterialIcons name={'highlight'}/>
            <Text style={styles.dropDownText}>Connect Wallet</Text>
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
                        fontSize: 12,
                        fontFamily: typography.regular,
                        color: 'white',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View style={{alignSelf: 'center'}}>
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
              }}>
              <Header />
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
            $ {ethers.utils.formatEther(balance)}
          </Text>
          <TouchableOpacity style={styles.addressContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.addressText}>
              {address}
            </Text>
          </TouchableOpacity>
          <View style={{height: 50}} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '80%',
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('SendToken')}>
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
                  style={{alignItems: 'center', justifyContent: 'center'}}>
                  {/* <Send /> */}
                  <MaterialIcons name={'highlight'}/>
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
                  style={{alignItems: 'center', justifyContent: 'center'}}>
                  {/* <ReceiveIcon /> */}
                  <MaterialIcons name={'highlight'}/>
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
            <TouchableOpacity onPress={() => navigation.navigate('SwapToken')}>
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
                  style={{alignItems: 'center', justifyContent: 'center'}}>
                  {/* <HistoryIcon /> */}
                  <MaterialIcons name={'highlight'}/>
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
