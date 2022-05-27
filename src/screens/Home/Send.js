import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Linking } from 'react-native';
import { themeColor } from '../../common/theme';
import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import QRCodeScanner from 'react-native-qrcode-scanner';
import AssetsLog from '../../components/AssetsLog';
import { getDataLocally } from '../../Utils/AsyncStorage';
import { Locations } from '../../Utils/StorageLocations';
import { FlatList } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { walletProvider } from '../../Utils/Provider';
import { useSelector } from 'react-redux'
import { utils } from 'ethers'
import PendingTransactions from '../../components/pendingTransactions';
import TransactionControlModal from '../../components/TransactionControlModel';
import { introspectionFromSchema } from 'graphql';
import TransactionRow from '../../components/tranasctionRow';
let provider;

const SendScreen = ({ navigation }) => {

    const address = useSelector(state => state.address)
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState();
    const [isPending, setIsPending] = useState(false);
    const [openTransactionController, setOpenTransactionController] = useState(false);
    const [transactionInfo, setTransactionInfo] = useState(false);


    useEffect(() => {
        getTransactionList();
        getPendingTransactions();
        return (() => {
            // provider?.removeAllListeners("pending", (err) => console.log(err.message))
        })
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getTransactionList();
        }, []))


    const getTransactionList = async () => {
        try {
            const data = await getDataLocally(Locations.SENDTRANSACTIONS);
            setData(data);
        } catch (err) {
            alert(err.message)
        }
    }

    const getPendingTransactions = async () => {
        try {
            provider = walletProvider()
            const info = await provider.getTransaction("0x3aabfdb2f211c76891c10f1820d69bac343a415fe59d3ba499c0408b21513a3b");
            console.log(info)
            if (info?.confirmations <= 0) {
                // setIsPending(true)
                const amt = Object.values(info.value)[0];
                const obj = {
                    to : info.to,
                    from: info.from,
                    amount : amt,
                    nonce : info.nonce,
                    pk : address.privateKey.second
                }

                console.log(obj)
                setTransactionInfo(obj)
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    const HeaderUI = () => {

        const item = {
            name: "pending...",
            amount: '0.00002'
        }

        return (
            <View style={{ width: '100%' }}>
                <Header navigation={navigation} />
                <Modal visible={visible} onRequestClose={() => setVisible(false)}>
                    <View
                        style={{
                            backgroundColor: themeColor.primaryBlack,
                            flex: 1,
                            padding: 30,
                            alignItems: 'center',
                        }}>
                        <Header navigation={navigation} />
                        <QRCodeScanner
                            onRead={val => {
                                console.log("Qrcode : " + val.data)
                                setVisible(false)
                                navigation.navigate('SendTokenFinalize', { to: val.data, name: '' })
                            }}
                        />
                    </View>
                </Modal>
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
                <View
                    style={{
                        borderRadius: 10,
                        borderColor: '#C445B8',
                        borderWidth: 1,
                        marginVertical: 20,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                    }}>
                    <MaterialIcons name={'search'} color={'white'} size={28} />
                    <TextInput
                        placeholder={'Search public address, or ENS'}
                        style={{
                            fontFamily: typography.regular,
                            fontSize: 14,

                            flex: 1,
                        }}
                    />
                </View>

                <TouchableOpacity
                    //onPress={() => setVisible(true)}
                    onPress={() => navigation.navigate('SendTokenFinalize', { to: '', name: '' })}
                    style={{
                        borderRadius: 10,
                        borderColor: '#ffffff',
                        borderWidth: 1,
                        marginVertical: 0,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        height: 50,
                    }}>
                    <Text
                        style={{
                            fontFamily: typography.regular,
                            fontSize: 14,

                            flex: 1,
                        }}>
                        {'  '}Make A New Transaction
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setVisible(true)}
                    // onPress={() => navigation.navigate('SendTokenFinalize')}
                    style={{
                        borderRadius: 10,
                        borderColor: '#232732',
                        borderWidth: 1,
                        marginVertical: 0,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        height: 50,
                    }}>
                    <MaterialIcons name={'qr-code'} color={'white'} size={28} />
                    {/* <MaterialIcons name={'history'} color={'white'} size={28} /> */}
                    <Text
                        style={{
                            fontFamily: typography.regular,
                            fontSize: 14,
                            flex: 1,
                        }}>
                        {'  '}Scan any QR code
                        {/* {'  '}Transaction History */}
                    </Text>
                </TouchableOpacity>

                {
                    (isPending) ?
                        <View>
                            <TouchableOpacity
                                activeOpacity={1}
                                //onPress={() => setVisible(true)}
                                // onPress={() => navigation.navigate('SendTokenFinalize')}
                                style={{
                                    borderRadius: 10,
                                    borderColor: '#232732',
                                    borderWidth: 1,
                                    marginVertical: 20,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    paddingHorizontal: 0,
                                    height: 50,
                                }}>
                                {/* <MaterialIcons name={'qr-code'} color={'white'} size={28} /> */}
                                {/* <MaterialIcons name={'history'} color={'white'} size={28} /> */}
                                <Text
                                    style={styles.subHeaderText}>
                                    {/* {'  '}Scan any QR code */}
                                    {'  '}Pending Transactions
                                </Text>
                            </TouchableOpacity>
                            <FlatList
                                data={[item]}
                                renderItem={(data) => {
                                    let item = data.item
                                    //console.log(item)
                                    return (
                                        <TouchableOpacity
                                            style={{
                                                borderBottomColor: '#ffffff',
                                                borderBottomWidth: 0.4,
                                                borderRadius: 20
                                            }}
                                            key={item.date}
                                            onPress={() => {
                                                setOpenTransactionController(true)
                                                setSelectedData(item)
                                            }}
                                        >
                                            <PendingTransactions
                                                image={'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg'}
                                                coinName={item.name}
                                                symbol={''}
                                                value={(new Date(item.date).toLocaleString()) || "Is not provided"}
                                                price={item.amount}
                                                change={1.3} />
                                        </TouchableOpacity>)

                                }}
                            />

                        </View> 
                        : null
                }


                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        borderRadius: 10,
                        borderColor: '#232732',
                        borderWidth: 1,
                        marginVertical: 20,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingHorizontal: 0,
                        height: 50,
                    }}>
                    <Text
                        style={styles.subHeaderText}>
                        {'  '}Transaction History
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View
            style={{ flex: 1, backgroundColor: themeColor.primaryBlack, paddingLeft: 20, paddingRight: 20 }}>

            <View
                style={{
                    borderRadius: 10,
                    marginVertical: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    borderColor: 'white'
                }}>

                <FlatList
                    data={data?.reverse()}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => {
                        return (
                            <HeaderUI />
                        )
                    }
                    }
                    renderItem={(data) => {
                        let item = data.item
                        //console.log(item)
                        return (
                            <TouchableOpacity
                                style={{
                                    // borderColor: '#ffffff',
                                    borderBottomColor: '#ffffff',
                                    borderBottomWidth: 0.4,
                                    borderRadius: 20
                                }}
                                key={item.date}
                                onPress={() => {
                                    setOpen(true)
                                    setSelectedData(item)
                                }}
                            >
                                <TransactionRow
                                    image={'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg'}
                                    coinName={item.name}
                                    symbol={''}
                                    value={item.date}
                                    price={item.amount}
                                    change={1.3} />
                            </TouchableOpacity>)

                    }
                    }
                />
            </View>

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
                                <Text style={styles.subHeaderText}> {selectedData?.from?.substring(0, 6) + "..." + selectedData?.from?.substring(36, selectedData?.from?.length)}</Text>
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>To</Text>
                                <Text style={styles.subHeaderText}> {selectedData?.to?.substring(0, 6) + "..." + selectedData?.to?.substring(36, selectedData?.to?.length)}</Text>
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>Name</Text>
                                <Text style={styles.subHeaderText}>{selectedData?.name}</Text>
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>Amount</Text>
                                <Text style={styles.subHeaderText}>{selectedData?.amount} Matic</Text>
                            </View>
                            {/* <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>Hash</Text>
                                <Text style={styles.subHeaderText}>$ {amount + gasFees}</Text>
                            </View> */}
                        </View>

                        <View>
                            <View style={{
                                flexDirection: 'row'
                            }}>

                                <TouchableOpacity style={{
                                    width: '45%',
                                    height: 40,
                                    backgroundColor: '#B02FA4',
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: 10
                                }}
                                    onPress={() => {
                                        setOpen(false)
                                        Linking.openURL("https://mumbai.polygonscan.com/tx/" + selectedData?.hash)
                                    }}
                                >
                                    <Text style={{ fontWeight: 'bold', color: 'white' }}>Explore</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    width: '45%',
                                    height: 40,
                                    backgroundColor: '#B02FA4',
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: 10
                                }}
                                    onPress={() => {
                                        setOpen(false)
                                        navigation.navigate('SendTokenFinalize', { to: selectedData?.to, name: selectedData?.name })
                                    }}
                                >
                                    <Text style={{ fontWeight: 'bold', color: 'white' }} >Send Again</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <TransactionControlModal 
                open={openTransactionController}
                setOpen={setOpenTransactionController}
                selectedData={transactionInfo}
                onSuccess={getPendingTransactions}
            />
        </View>
    );
};

export default SendScreen;


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