import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Linking, Modal, StyleSheet, Image } from 'react-native';
import GradientButton from '../../components/GradientButton';
import { themeColor } from '../../common/theme';
import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { getDataLocally, setDataLocally } from '../../Utils/AsyncStorage';
import { Locations } from '../../Utils/StorageLocations';
import { getSmartWalletBalance, smartWalletToEoa, transferToSmartWallet } from '../../Utils/SmartWallet';
import { useSelector } from 'react-redux';
import { BigNumber, ethers, utils } from 'ethers'
import { walletProvider } from '../../Utils/Provider';
import { parse } from 'url';
import AlertConfirm, { AlertCustoDialog, AlertCustomDialog } from '../../components/Alert';
import ProgressDialog from '../../components/ProgressDialog';


const initalData = {
  to: '',
  from: '',
  name: '',
  amount: '',
  date: '',
  hash: '',
  contractId: ''
}

const SwapToken = ({ navigation, route }) => {
  const { path } = route.params;
  const [balanceVault, setBalanceVault] = React.useState(0);
  const [balanceEoa, setBalanceEoa] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  const [gasFees, setGasFees] = React.useState(0);
  const [confirm, setConfirm] = React.useState(0);
  const [transactionHash, setTransactionHash] = React.useState(false);
  const [startProgress, setStartProgress] = React.useState(0);
  const [selectedData, setSelectedData] = React.useState(0);
  const address = useSelector(state => state.address);
  const [vdata, setVData] = React.useState('');
  let timeRef = useRef()

  React.useEffect(() => {
    getSmartWalletInfo();
  }, [])

  const getSmartWalletInfo = async () => {
    try {
      const data = await getDataLocally(Locations.SMARTACCOUNTS)
      const provider = walletProvider();
      const balance = await provider.getBalance(address?.accountAddress?.second);
      getVaultBalance(data[0]);

      const hex = Object.values(balance);
      const ether = ethers.utils.formatEther(balance)

      console.log(data, ether)
      setBalanceEoa(parseFloat(ether).toPrecision(4))
      setVData(data[0
      ]);
    } catch (err) {
      alert(err.message)
    }
  }


  const getVaultBalance = async (data) => {
    try {
      const options = {
        privateKey: address?.privateKey?.first,
        address: data
      }
      const balance = await getSmartWalletBalance(options);
      setBalanceVault(balance)
      console.log(balance);
    } catch (err) {
      console.log(err)
      alert("You don't have any Vault")
    }
  }


  const transferEoaToVault = async () => {
    try {
      const isPending = await checkTransactionStatus();
      if (amount < balanceEoa && isPending) {
        setStartProgress(true)
        const transferHash = await transferToSmartWallet({
          to: vdata,
          privateKey: address?.privateKey?.second,
          amount: parseFloat(amount.toString())
        },
          {
            to: vdata,
            value: ethers.utils.parseEther(parseFloat(amount.toString()).toString()),
            gasPrice : gasFees,
            gasLimit : 60000
          }
        )

        if (transferHash) {
          setTransactionHash(transferHash?.hash)
          const newItem = initalData;
          newItem.from = address?.accountAddress.first
          newItem.to = vdata
          newItem.name = 'Swap to vault'
          newItem.amount = parseFloat(amount.toString())
          newItem.hash = transferHash.hash
          newItem.date = new Date();
          newItem.contractId = 'contactId'
          await setDataLocally(Locations.TEMPTRANSACTION, newItem);
        }
      } else {
        alert('insufficent balance')
      }
    } catch (err) {
      console.log(err)
      alert(err.message)
      setStartProgress(false)
    }
  }

  const transferVaultToEoa = async () => {
    try {
      const isPending = await checkTransactionStatus();
      if (amount < balanceVault && isPending) {
        setStartProgress(true)
        const transferHash = await smartWalletToEoa({
          from: vdata,
          to: address?.accountAddress?.second,
          privateKey: address?.privateKey?.first,
          amount: parseFloat(amount.toString())
        },
          {
            to: address?.accountAddress?.second,
            value: ethers.utils.parseEther(parseFloat(amount.toString()).toString()),
            gasPrice : gasFees,
            gasLimit : 60000
          }
        )

        if (transferHash) {
          setTransactionHash(transferHash?.hash)
          const newItem = initalData;
          newItem.from = vdata
          newItem.to = address?.accountAddress.first
          newItem.name = 'Swap to kometWallet'
          newItem.amount = parseFloat(amount.toString())
          newItem.hash = transferHash.hash
          newItem.date = new Date();
          newItem.contractId = 'contactId'
          await setDataLocally(Locations.TEMPTRANSACTION, newItem);
        }
      } else {
        console.log(balanceVault)
        alert('insufficent balance + ' + balanceVault)
      }
    } catch (err) {
      console.log(err)
      alert(err.message)
      setStartProgress(false)
    }
  }

  const handleText = (e) => {
    setAmount(e)
  }

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

  const totalAmount = () => {
    const a = BigNumber.from(ethers.utils.parseEther(amount.toString()));
    const b = BigNumber.from(parseInt(gasFees.toString()));
    console.log(a, b)
    const total = b.add(a);
    return (ethers.utils.formatUnits(total, 18).substring(0, 16))
  }

  const checkTransactionStatus = async () => {
    try {
      const lastTransactions = await getDataLocally(Locations.TEMPTRANSACTION);
      const provider = walletProvider()
      const tx = await provider.getTransaction(lastTransactions.hash)
      if (tx?.confirmations <= 0) {
        console.log('confirm ===>>> ', tx?.confirmations)
        AlertCustomDialog(
          "Pending",
          "",
          "Check",
          "Ok",
          () => {
            navigation.navigate("Send")
          },
          () => {
            console.log('cancel')
          }
        )
        return false
      }
      return true
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: themeColor.primaryBlack, padding: 30 }}>
      <Header navigation={navigation} />
      <View>
        <LinearGradient
          colors={['#FF84F3', '#B02FA4']}
          style={{
            height: 64,
            width: 64,
            alignItems: 'center',
            borderRadius: 64,
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: 20,
          }}>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}>
            <AntDesign name={'swap'} color={"white"} size={28} />
          </TouchableOpacity>
        </LinearGradient>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
            fontFamily: typography.medium,
            color: 'white',
          }}>
          Swap
        </Text>
      </View>
      {/* <View
        style={{
          borderRadius: 10,
          backgroundColor: '#232732',
          marginVertical: 20,

          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 10,
        }}>
        <View style={{justifyContent: 'space-between'}}>
          <View style={{height: 20}}></View>
          <Text style={{fontSize: 12, fontFamily: typography.regular}}>
            Swap From
          </Text>
          <TextInput
            placeholder={'0'}
            style={{
              fontSize: 32,
              fontFamily: typography.regular,
              width: 150,
            }}
          />
          <View style={{height: 20}}></View>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <MaticIcon />
          <View
            style={{
              margin: 5,
              marginTop: 20,
              borderColor: '#FF84F3',
              borderWidth: 1,
              borderRadius: 5,
              padding: 5,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: typography.regular,
                fontSize: 12,
                color: 'white',
              }}>
              Matic
            </Text>
            <MaterialIcons name={'keyboard-arrow-down'} size={15} />
          </View>
        </View>
      </View>
      <View
        style={{
          borderRadius: 10,
          backgroundColor: '#232732',
          marginVertical: 20,

          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 30,
        }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: typography.regular,
            alignSelf: 'flex-start',
          }}>
          Swap To
        </Text>
        <View
          style={{
            height: 50,
            width: 250,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#FF84F3',
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: typography.regular,
              color: 'white',
            }}>
            Select a Token
          </Text>
          <MaterialIcons name={'keyboard-arrow-down'} size={24} />
        </View>
      </View> */}

      {
        (path === "home") ?
          <View
            style={{
              borderRadius: 10,
              backgroundColor: '#232732',
              marginVertical: 20,

              justifyContent: 'space-around',
              alignItems: 'center',
              padding: 30,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: typography.regular,
                alignSelf: 'flex-start',
              }}>
              Deposite To Smart Wallet
            </Text>
            <Text
              style={{
                fontFamily: typography.regular,
                // fontSize: 12,
                color: 'white',
              }}>
              {vdata && vdata?.substring(0, 8) + "..." + vdata?.substring(34, vdata?.length)}
            </Text>
            <View
              style={{
                height: 50,
                width: 250,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#FF84F3',
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TextInput style={{
                textAlign: 'center'
              }}
                keyboardType='number-pad'
                placeholder='Enter Value In Matic'
                onChangeText={handleText}
              />
              {/* <MaterialIcons name={'keyboard-arrow-down'} size={24} /> */}
            </View>

            <View style={{ alignItems: 'center' }}>
              <GradientButton
                text={'Transfer'}
                colors={(balanceEoa > 0) ? ['#FF8DF4', '#89007C'] : ['rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.2)']}
                disabled={(balanceEoa > 0) ? false : true}
                onPress={() => {
                  if ((selectedData.from != '') && (selectedData.to != '') && amount != '') {
                    const object = {
                      from: address?.accountAddress?.second,
                      to: vdata,
                      amount: amount,
                    }
                    setSelectedData(object)
                    timeRef.current = setInterval(() => {
                      calculateGesFee();
                    }, 6000)
                    setConfirm(true)
                  } else {
                    alert('Please fill the amount')
                  }
                }}
              />
            </View>
          </View>
          :
          <View
            style={{
              borderRadius: 10,
              backgroundColor: '#232732',
              marginVertical: 20,

              justifyContent: 'space-around',
              alignItems: 'center',
              padding: 30,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: typography.regular,
                alignSelf: 'flex-start',
              }}>
              Add From Vault To EOA2
            </Text>
            <Text
              style={{
                fontFamily: typography.regular,
                // fontSize: 12,
                color: 'white',
              }}>
              {address && address?.accountAddress?.second?.substring(0, 8) + "..." + address?.accountAddress?.second?.substring(34, address?.accountAddress?.second?.length)}
            </Text>
            <View
              style={{
                height: 50,
                width: 250,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#FF84F3',
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TextInput style={{
                textAlign: 'center'
              }}
                keyboardType='number-pad'
                placeholder='Enter Value In Matic'
                onChangeText={handleText}
              />
              {/* <MaterialIcons name={'keyboard-arrow-down'} size={24} /> */}
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
              <GradientButton
                text={'Transfer'}
                colors={['#FF8DF4', '#89007C']}
                onPress={() => {

                  if ((selectedData.from != '') && (selectedData.to != '' && amount != '')) {
                    const object = {
                      from: vdata,
                      to: address?.accountAddress?.second,
                      amount: amount,
                    }
                    setSelectedData(object)
                    timeRef.current = setInterval(() => {
                      calculateGesFee();
                    }, 6000)
                    setConfirm(true)
                  } else {
                    alert('Please Fill the Amount')
                  }
                }}
              />
            </View>

            {/* <TouchableOpacity style={{
              width: '100%',
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: '#FF84F3'
            }}

            >
              <Text style={{
                color: 'black',
                fontWeight: 'bold',
                letterSpacing: 1,
                fontSize: 16
              }}>Trasfer</Text>
            </TouchableOpacity> */}
          </View>
      }

      {/* <Modal
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
              flex: 0,
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
                <Text style={styles.subHeaderText}> {selectedData?.from?.substring(0, 8) + "..." + selectedData?.from?.substring(34, selectedData?.from?.length)}</Text>
              </View>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>To</Text>
                <Text style={styles.subHeaderText}> {selectedData?.to?.substring(0, 8) + "..." + selectedData?.to?.substring(34, selectedData?.to?.length)}</Text>

              </View>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>Gas Fees</Text>
                {(gasFees > 0) ?
                  <Text style={styles.subHeaderText}> {parseFloat(ethers.utils.formatUnits(gasFees.toString(), "gwei")).toPrecision(3) + " Gwei"}</Text>
                  : <ShimmerPlaceHolder style={{ width: '40%', borderRadius: 10 }} LinearGradient={LinearGradient} />}
              </View>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>Transaction</Text>
                <Text style={styles.subHeaderText}>{selectedData?.amount} Matic</Text>
              </View>
              {/* <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>Total</Text>
                <Text style={styles.subHeaderText}> {parseFloat(amount) + parseFloat(gasFees)} wei</Text>
              </View> */}
      {/* </View> */}

      {/* <View style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>

              <View style={{ alignItems: 'center', width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
                <GradientButton
                  text={'Confirm'}
                  disabled={(gasFees <= 0) ? true : false}
                  colors={(gasFees > 0) ? ['#FF8DF4', '#89007C'] : ['rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.2)']}
                  // disabled={(gasFees <= 0) ? true : false}
                  // colors={['#FF8DF4', '#89007C']}
                  size={150}

                  onPress={() => {
                    clearInterval(timeRef.current)
                    if (path == 'home') {
                      transferEoaToVault()
                    } else {
                      transferVaultToEoa()
                    }
                    setGasFees(0)
                    setConfirm(false);
                  }}
                />
                <GradientButton
                  size={150}
                  text={'Cancel'}
                  colors={['#FF8DF4', '#89007C']}
                  onPress={() => {
                    //            navigation.navigate('RestoreFromPhrase');
                    clearInterval(timeRef.current)
                    setGasFees(0)
                    setConfirm(false)
                  }}
                />
              </View>


            </View>
          </View>
        </View> */}
      {/* </Modal> */}


      <Modal
        visible={confirm}
        transparent
        onRequestClose={() => setConfirm(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            backgroundColor: 'rgba(0,0,0,0.6)'
          }}>
          <TouchableOpacity style={{ flex: (parseFloat(ethers.utils.formatUnits(gasFees.toString(), "gwei")).toPrecision(3) > 3) ? 0.48 : 0.86 }} onPress={() => {
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
              marginTop: 40,
              marginBottom: 20,
            }}>
              {/* Warring Message For Hihger Gas Fees */}

              {(parseFloat(ethers.utils.formatUnits(gasFees.toString(), "gwei")).toPrecision(3) > 3) ?
                <View>
                  <View style={{
                    width: '100%',
                    borderRadius: 6,
                    borderColor: 'yellow',
                    borderWidth: 1,
                    marginBottom: 20,
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      margin: 10
                    }}>
                      <MaterialIcons name="warning" size={20} color="yellow" />
                      <Text style={{ ...styles.subHeaderText, fontWeight: 'normal', color: 'yellow' }}>Warning</Text>
                    </View>
                    <Text style={{ padding: 6, fontWeight: 'normal', color: 'yellow' }}> Gas fess is too high for transactions to be confirmed.
                      If you want to save gas fees then come after some time.</Text>
                  </View>
                </View>
                : null
              }

              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>From</Text>
                <Text style={styles.subHeaderText}> {selectedData?.from?.substring(0, 8) + "..." + selectedData?.from?.substring(34, selectedData?.from?.length)}</Text>
              </View>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>To</Text>
                <Text style={styles.subHeaderText}> {selectedData?.to?.substring(0, 8) + "..." + selectedData?.to?.substring(34, selectedData?.to?.length)}</Text>
              </View>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>Gas Fees</Text>
                {(gasFees > 0) ?
                  <Text style={styles.subHeaderText}> {parseFloat(ethers.utils.formatUnits(gasFees.toString(), "gwei")).toPrecision(3) + " Gwei"}</Text>
                  : <ShimmerPlaceHolder style={{ width: '40%', borderRadius: 10 }} LinearGradient={LinearGradient} />}
              </View>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>Transaction</Text>
                <Text style={styles.subHeaderText}>{selectedData?.amount} Matic</Text>
              </View>
              <View
                style={styles.summaryTextContainer}>
                <Text style={styles.subHeaderText}>Total</Text>
                <Text style={styles.subHeaderText}>$ {totalAmount(selectedData?.amount, gasFees)}</Text>
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
                    if (path == 'home') {
                      transferEoaToVault()
                    } else {
                      transferVaultToEoa()
                    }
                    setGasFees(0)
                    setConfirm(false);
                  }}
                />
                <GradientButton
                  text={'Cancel'}
                  size={150}
                  colors={['#FF8DF4', '#89007C']}
                  onPress={() => {
                    //            navigation.navigate('RestoreFromPhrase');
                    clearInterval(timeRef.current)
                    setGasFees(0)
                    setConfirm(false)
                  }}
                />

              </View>

            </View>
          </View>
        </View>
      </Modal>

      {/* pogress model */}

      <ProgressDialog
        open={startProgress}
        setOpen={setStartProgress}
        completed={transactionHash}
        setCompleted={setTransactionHash}
      />

    </View>
  );
};

export default SwapToken;


const styles = StyleSheet.create({
  textInputContainer: {
    borderRadius: 10,
    height: 50,
    borderColor: '#C445B8',
    borderWidth: 1,
    marginVertical: 13,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  subHeaderText: { fontFamily: typography.medium, color: 'white', marginHorizontal: 10, fontSize: 16 },
  summaryTextContainer: {
    borderRadius: 10,

    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  }
})