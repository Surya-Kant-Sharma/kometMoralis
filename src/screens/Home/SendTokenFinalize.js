import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Image } from 'react-native';
import { themeColor } from '../../common/theme';
import Header from '../../components/Header';
//import Send from '../../../assets/svg/Send.svg';
import LinearGradient from 'react-native-linear-gradient';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { ScrollView } from 'react-native-gesture-handler';
import GradientButton from '../../components/GradientButton';
import { useSelector } from 'react-redux';


import HistoryIcon from '../../../assets/svg/HistoryIcon.svg';
import { getDataLocally, setDataLocally } from '../../Utils/AsyncStorage';
import { Locations } from '../../Utils/StorageLocations';
import { getSmartWalletBalance, smartWalletToEoa, transferToSmartWallet } from '../../Utils/SmartWallet';
import { ethers } from 'ethers'
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
    hash: ''
}

const SendTokenFinalize = ({ navigation, route }) => {

    const { to } = route?.params
    console.log(to)
    const address = useSelector(state => state.address);

    const [visible, setVisible] = useState(false);
    const [fromAddress, setFromAddress] = useState(address?.accountAddress?.second || '')
    const [toAddress, setToAddress] = useState(to || '')
    const [sentAddress, setSentAddress] = useState(route.params.name || '');
    const [balance, setBalance] = useState(0);
    const [gasFees, setGasFees] = useState(0);
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('EOA 1')
    const [confirm, setConfirm] = useState(false);

    const [transactionHash, setTransactionHash] = React.useState(false);
    const [startProgress, setStartProgress] = React.useState(0);

    let timeRef = useRef();
    let gasFeeRef = useRef();


    const [accounts, setAccounts] = useState([
        'EOA 1'
    ]);


    React.useEffect(() => {
        getSmartWalletInfo();
        // setToAddress(route.params.to)
        // setSentAddress(route.params.name)
    }, [])

    const getSmartWalletInfo = async () => {
        try {
            const provider = walletProvider()
            const balance = await provider.getBalance(address?.accountAddress?.second);
            const hex = Object.values(balance)
            const ether = ethers.utils.formatEther(balance)
            setBalance(parseFloat(ether).toPrecision(4))
        } catch (err) {
            alert(err.message)
        }
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

    const transferAmount = async () => {
        try {
            if (amount < balance) {
                setStartProgress(true)
                const transferHash = await transferToSmartWallet({
                    to: toAddress,
                    privateKey: address?.privateKey?.second,
                    amount: parseFloat(amount.toString())
                })

                if (transferHash) {
                    sendTransaction(transferHash.hash)
                    setTransactionHash(transferHash.hash)
                    // AlertCustomDialog(
                    //     'Transaction Hash',
                    //     'Check Your Transaction on Mumbai Testnet By Clicking Explore Btn and Otherwise Tap Ok Btn',
                    //     'Explore',
                    //     'Ok',
                    //     () => { Linking.openURL("https://mumbai.polygonscan.com/tx/" + transferHash.hash) },
                    //     () => console.log('dismiss')
                    // );
                }
            } else {
                alert('insufficent balance')
            }
        } catch (err) {
            console.log(err)
            alert(err.message)
        }
    }


    const sendTransaction = async (hash) => {
        let data = await getDataLocally(Locations.SENDTRANSACTIONS);
        const newItem = initalData;
        newItem.from = address?.accountAddress.first
        newItem.to = toAddress
        newItem.name = sentAddress
        newItem.amount = amount
        newItem.hash = hash
        newItem.date = new Date();

        if (data != null) {
            data.push(newItem);
        } else {
            data = [newItem];
        }

        console.log(data)
        console.log(data)
        await setDataLocally(Locations.SENDTRANSACTIONS, data);
    }




    // address

    const [name, setName] = useState('')
    const [amount, setAmount] = useState(0);
    console.log(sentAddress)
    return (
        <ScrollView
            style={{ backgroundColor: themeColor.primaryBlack, padding: 30 }}>
            <Header navigation={navigation}/>
            <View style={{ margins: 40 }}>

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
                                Select Account
                            </Text>
                            {accounts.map((item, index) => (
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
                        <AntDesign name={'arrowup'} color={'white'} size={28} />
                    </TouchableOpacity>
                </LinearGradient>
                <Text
                    style={{
                        alignSelf: 'center',
                        fontSize: 16,
                        fontFamily: typography.medium,
                        color: 'white',
                    }}>
                    Send
                </Text>
            </View>
            <Text style={{ fontFamily: typography.medium, color: 'white', marginHorizontal: 10, fontSize: 16 }}>From</Text>
            <TouchableOpacity
                onPress={() => setOpen(true)}
                style={styles.textInputContainer}>

                <Text
                    style={{
                        fontFamily: typography.regular,
                        fontSize: 14,
                        flex: 1,
                    }}>
                    {value}
                </Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: typography.medium, color: 'white', marginHorizontal: 10, fontSize: 16 }}>To</Text>
            <View
                style={styles.textInputContainer}>

                <TextInput
                    placeholder={'Address'}
                    value={toAddress}
                    onChangeText={(e) => setToAddress(e)}
                    style={{
                        fontFamily: typography.regular,
                        fontSize: 14,
                        flex: 1,
                    }}
                />

            </View>
            <Text style={{ fontFamily: typography.medium, color: 'white', marginHorizontal: 10, fontSize: 16 }}>Name</Text>
            <View
                style={styles.textInputContainer}>

                <TextInput
                    placeholder={'Name'}
                    value={sentAddress}
                    onChangeText={(text) => setSentAddress(text)}
                    style={{
                        fontFamily: typography.regular,
                        fontSize: 14,
                        flex: 1,
                    }}
                />

            </View>

            <Text style={{ fontFamily: typography.medium, color: 'white', marginHorizontal: 10, fontSize: 16 }}>Amount</Text>
            <View
                style={styles.textInputContainer}>
                <Image source={{ uri: 'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg' }} style={{ width: 35, height: 35, borderRadius: 50 }} />
                <TextInput
                    placeholder={'ENTER MATIC'}
                    onChangeText={(text) => setAmount(text)}
                    style={{
                        fontFamily: typography.medium,
                        fontSize: 16,
                        flex: 1,
                    }}
                />
            </View>


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
                            Trasaction Info
                        </Text>
                        <View style={{
                            width: '100%',
                            marginTop: 40
                        }}>


                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>From</Text>
                                <Text style={styles.subHeaderText}> {fromAddress?.substring(0, 6) + "..." + fromAddress?.substring(36, fromAddress?.length)}</Text>
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>To</Text>
                                <Text style={styles.subHeaderText}> {toAddress?.substring(0, 6) + "..." + toAddress?.substring(36, toAddress?.length)}</Text>
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>Gas Fees</Text>
                                <Text style={styles.subHeaderText}>$ {gasFees}</Text>
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>Transaction</Text>
                                <Text style={styles.subHeaderText}>$ {amount}</Text>
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>Total</Text>
                                <Text style={styles.subHeaderText}>$ {amount + gasFees}</Text>
                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'column'
                        }}>

                            <View style={{ alignItems: 'center' }}>
                                <GradientButton
                                    text={'Confirm'}
                                    disabled={(gasFees <= 0) ? true : false}
                                    colors={['#FF8DF4', '#89007C']}
                                    onPress={() => {
                                        //            navigation.navigate('RestoreFromPhrase');
                                        clearInterval(timeRef.current)
                                        transferAmount();
                                        setConfirm(false);
                                    }}
                                />
                            </View>

                            <View style={{ alignItems: 'center' }}>
                                <GradientButton
                                    text={'Cancel'}
                                    colors={['#FF8DF4', '#89007C']}
                                    onPress={() => {
                                        //            navigation.navigate('RestoreFromPhrase');
                                        clearInterval(timeRef.current)
                                        setConfirm(false)
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={{ alignItems: 'center' }}>
                <GradientButton
                    text={'Send Transaction'}
                    colors={['#FF8DF4', '#89007C']}
                    onPress={() => {
                        //           navigation.navigate('RestoreFromPhrase');
                        if ((fromAddress != '') && (toAddress != '')) {
                            timeRef.current = setInterval(() => {
                                calculateGesFee();
                            }, 6000)
                            setConfirm(true)
                        } else {
                            alert('Please Fill the Form and to Address')
                        }
                    }}
                />
            </View>

            <ProgressDialog
                open={startProgress}
                setOpen={setStartProgress}
                completed={transactionHash}
                setCompleted={setTransactionHash}
            />

        </ScrollView>
    );
};

export default SendTokenFinalize;

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