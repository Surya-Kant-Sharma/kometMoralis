import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Linking, SectionList } from 'react-native';
import { themeColor } from '../../common/theme';
import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import QRCodeScanner from 'react-native-qrcode-scanner';
import AssetsLog from '../../components/AssetsLog';
import { getDataLocally, setDataLocally } from '../../Utils/AsyncStorage';
import { Locations } from '../../Utils/StorageLocations';
import { FlatList } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { walletProvider } from '../../Utils/Provider';
import { useSelector } from 'react-redux'
import { ethers, utils } from 'ethers'
import PendingTransactions from '../../components/pendingTransactions';
import TransactionControlModal from '../../components/TransactionControlModel';
import { introspectionFromSchema } from 'graphql';
import TransactionRow from '../../components/tranasctionRow';
import moment from 'moment'
import { check } from 'prettier';
import Snackbar from 'react-native-snackbar';
import GradientButton from '../../components/GradientButton';
import { CreateContractDialog } from '../../components/Alert';
import CreateContactModel from '../../components/CreateContactModel';
import { CustomSnackbar } from '../../components/SnackBar';
import TransactionShimmerRow from '../../components/tranasctionShimmerRow';
import axios from 'axios';
import { getUserId } from '../../common/Storage';
import { transformSync } from '@babel/core';
// import { ethers } from 'hardhat';

let provider;
let transactionHash;

const intialList = [

    {
        title: "Today",
        data: [1, 2, 3, 4]
    },
    {
        title: "Yesterday",
        data: [1, 2, 3, 4]
    },
    // {
    //     title: (previous.length > 0) ? "Others Transaction" : "empty",
    //     data: previous.reverse()
    // },
]

const SendScreen = ({ navigation }) => {

    const address = useSelector(state => state.address)
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [createContactOpen, setCreateContactOpen] = useState(false);
    const [data, setData] = useState(intialList);
    const [isFetch, setIsFetch] = useState(true);
    const [selectedData, setSelectedData] = useState();
    const [isPending, setIsPending] = useState(false);
    const [openTransactionController, setOpenTransactionController] = useState(false);
    const [transactionInfo, setTransactionInfo] = useState(false);
    let listenPendingTransaction = React.useRef();


    useEffect(() => {
        getTransactionList();

        return () => {
            // provider?.removeAllListeners("pending", (err) => console.log(err.message))
            clearInterval(listenPendingTransaction.current)
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getPendingTransactions();
            // getTransactionList();
        }, []))


    const getTransactionList = async () => {
        try {
            // let data = await getDataLocally(Locations.SENDTRANSACTIONS);
            setIsFetch(true)
            const userId = await getUserId();
            axios.get("https://staging.komet.me/api/v1/user/v1/transactions?pageNo=0&pageSize=20", {
                headers: {
                    'X-USER-ID': userId
                }
            }).then((res) => {
                const data = res.data;
                const yesterday = []
                const today = []
                const previous = []

                data?.map((item) => {
                    const day = moment.utc(item.txnTime).local().startOf('seconds').fromNow()
                    // console.log("list", day)

                    if (day == 'a day ago') {
                        yesterday.push(item)
                    } else if (
                        day.includes("hour ago") ||
                        day.includes("hours ago") ||
                        day.includes("minutes ago") ||
                        day.includes("a few seconds ago")) {
                        today.push(item)
                    } else {
                        previous.push(item)
                    }

                })
                console.log(today, yesterday, previous)

                const list = [
                    {
                        title: (today.length > 0) ? "Today" : "empty",
                        data: today
                    },
                    {
                        title: (yesterday.length > 0) ? "Yesterday" : "empty",
                        data: yesterday
                    },
                    {
                        title: (previous.length > 0) ? "Others Transaction" : "empty",
                        data: previous
                    },
                ]
                setData(list);
                setIsFetch(false);
            }).catch((err) => {
                console.log(err.message)
            })


        } catch (err) {
            alert(err.message)
        }
    }

    const getPendingTransactions = async () => {
        try {
            const provider = walletProvider()
            const lastTransactions = await getDataLocally(Locations.TEMPTRANSACTION);
            console.log("Last Transactions", lastTransactions);
            const transactionList = data[0].data
            const tx = await provider.getTransaction(lastTransactions.hash)
            const amt = Object.values(tx.value)[0];
            const obj = {
                to: tx.to,
                from: tx.from,
                amount: tx.amount,
                nonce: tx.nonce,
                pk: address.privateKey.second,
                amountEth: lastTransactions?.amount
            }
            setTransactionInfo(obj)

            const lastHash = (transactionList.length > 0) ? transactionList[0].hash : transactionList?.hash

            console.log(lastHash === lastTransactions.hash, lastHash, lastTransactions.hash, transactionList)

            if (lastTransactions.hash !== lastHash) {
                if (tx?.confirmations > 0) {
                    setHistory(lastTransactions)
                    setIsPending(false)
                    return
                } else if (tx?.confirmations <= 0) {
                    setIsPending(true)
                    listenPendingTransaction.current = setInterval(() => {
                        checkTransaction(lastTransactions);
                    }, 6000)
                }
            }


        } catch (err) {
            // alert(err.message)
            console.log(err.message)
        }
    }

    const checkTransaction = async (lastTransactions) => {
        const provider = walletProvider()
        const tx = await provider.getTransaction(lastTransactions.hash)
        if (tx?.confirmations > 0) {
            console.log('confirm ===>>> ', tx?.confirmations)
            clearInterval(listenPendingTransaction.current)
            setHistory(lastTransactions)
            setIsPending(false)
            return true
        }
        return false
    }

    const setHistory = async (pendingTx) => {
        console.log("send History : = ", pendingTx)
        // let data = await getDataLocally(Locations.SENDTRANSACTIONS);
        if (data !== null) {
            // data.push(pendingTx);
            // console.log(pendingTx)
            const userId = await getUserId();

            // alert("RE RUN")

            axios.post("https://staging.komet.me/api/v1/user/v1/transactions", 
            {
                "fromWalletAddress": pendingTx.from,
                "toWalletAddress": pendingTx.to,
                "amount": pendingTx.amount,
                "txnTime": pendingTx.date,
                "hash": pendingTx.hash,
                "chainId": "80001",
                "description": pendingTx.name
            }, {
                headers: {
                    'X-USER-ID': userId
                }
            }).then((res) => {
                console.log("Status : ", res.status)
            }).catch((err) => {
                console.log(err.message)
            })
        } else {
            data = [pendingTx];
        }


        // setDataLocally(Locations.SENDTRANSACTIONS, data);
        getTransactionList()
    }

    // const getPendingTransactions = async (data) => {
    //     try {
    //         provider = walletProvider()
    //         const pTransaction = await getDataLocally(Locations.TEMPTRANSACTION)
    //         const info = await provider.getTransaction(pTransaction?.hash);
    //         const last = data[data?.length - 1].hash
    //         console.log("get ===>>>>> ", pTransaction)
    //         console.log(info)

    //         if (last !== pTransaction.hash) {
    //             if (info.confirmations <= 0) {
    //                 setIsPending(true)
    //                 const amt = Object.values(info.value)[0];
    //                 const obj = {
    //                     to: info.to,
    //                     from: info.from,
    //                     amount: amt,
    //                     nonce: info.nonce,
    //                     pk: address.privateKey.second
    //                 }

    //                 listenPendingTransaction.current = setInterval(async () => {
    //                     const info = await provider.getTransaction(pTransaction?.hash);
    //                     console.log(info)
    //                     if (info?.confirmations > 0 || info == null) {
    //                         setIsPending(false);
    //                         clearInterval(listenPendingTransaction.current)
    //                         // if (data != null) {
    //                         //     data.push(pTransaction);
    //                         // } else {
    //                         //     data = [pTransaction];
    //                         // }
    //                         // setDataLocally(Locations.SENDTRANSACTIONS, data)
    //                         // getTransactionList();
    //                     }
    //                 }, 6000)
    //                 console.log(obj)
    //                 setTransactionInfo(obj)
    //             } else if (info.confirmations > 0) {
    //                 clearInterval(listenPendingTransaction.current)
    //                 if (data != null) {
    //                     data.push(pTransaction);
    //                 } else {
    //                     data = [pTransaction];
    //                 }
    //                 setDataLocally(Locations.SENDTRANSACTIONS, data)
    //                 getTransactionList();
    //                 setIsPending(false);
    //             }
    //         }
    //     } catch (err) {
    //         console.log(err.message)
    //         clearInterval(listenPendingTransaction.current)
    //         setIsPending(false)
    //     }
    // }


    const onSpeedUpTransactionComplete = async (data) => {
        console.log("HASH FROM =>>>> ", data)
        const temp = await getDataLocally(Locations.TEMPTRANSACTION);
        let list = await getDataLocally(Locations.SENDTRANSACTIONS);
        if (data.hash !== temp.hash) {
            temp.hash = data.hash
            if (list != null) {
                list.push(temp);
            } else {
                list = [temp];
            }
            setDataLocally(Locations.SENDTRANSACTIONS, list)
            console.log("SET DATA IN LOCATIONS")
            getTransactionList()
        }
        setIsPending(false)
        CustomSnackbar("Success", "Contact Succesfully Save")

    }

    const onCancelTransactionComplete = async (data) => {
        console.log("Cancecl Transactions =>>>> ", data)
        setIsPending(false)
    }

    const Item = ({ title }) => {
        // console.log(title)
        const item = title
        return (<View>
            {(isFetch) ?

                <TouchableOpacity
                    style={{
                        width: '100%',
                        // borderColor: '#ffffff',
                        borderBottomColor: '#ffffff',
                        // borderBottomWidth: 0.4,
                        // borderRadius: 20
                    }}
                    key={item.date}
                // onPress={() => {
                //     setOpen(true)
                //     setSelectedData(item)
                // }}
                >
                    <TransactionShimmerRow
                    // image={'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg'}
                    // coinName={item.name}
                    // symbol={''}
                    // value={item.date}
                    // price={item.amount}
                    // change={1.3} 
                    />
                </TouchableOpacity>
                :
                <TouchableOpacity
                    style={{
                        width: '100%',
                        // borderColor: '#ffffff',
                        borderBottomColor: '#ffffff',
                        // borderBottomWidth: 0.4,
                        // borderRadius: 20
                    }}
                    key={item.date}
                    onPress={() => {
                        setOpen(true)
                        setSelectedData(item)
                    }}
                >
                    <TransactionRow
                        image={'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg'}
                        coinName={item.description}
                        symbol={''}
                        value={item.txnTime}
                        price={item.amount}
                        change={1.3} />
                </TouchableOpacity>
            }
        </View>)
    }

    const HeaderUI = () => {

        const item = {
            name: "pending...",
            amount: '0.00002'
        }

        return (
            <View style={{ width: '100%' }}>
                <View style={{
                    width: '100%',
                    flexDirection: 'row'
                }}>
                    <View style={{
                        width: '50%'
                    }}>
                        <Header navigation={navigation} />
                    </View>

                    <TouchableOpacity
                        style={{
                            width: '50%',
                            alignItems: 'flex-end'
                        }}
                        onPress={() => setVisible(true)}
                    >
                        <MaterialIcons name={'qr-code-scanner'} color={'white'} size={28} />
                    </TouchableOpacity>
                </View>
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

                {/* search Bar */}

                {/* <View
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
                </View> */}

                <View
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <TouchableOpacity

                        onPress={() => {
                            if (!isPending) {
                                navigation.navigate('SendTokenFinalize', { to: '', name: '' })
                                // onSpeedUpTransactionComplete({ to: '', name: '', hash : 'jai shri ram' })
                            } else {
                                alert("Please speed up your previous transaction or cancel it because if you create a new Transaction it is also in a pending state until your first transaction is confirmed")
                            }
                        }}
                        style={{
                            width: '100%',
                            borderRadius: 80,
                            borderColor: '#C445B8',
                            // borderWidth: 1,
                            marginVertical: 0,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',

                            // backgroundColor: '#C445B8',
                            opacity: 0.9,
                            height: 50,
                            marginTop: 40
                        }}>

                        <LinearGradient
                            colors={['#FF84F3', '#B02FA4']}
                            style={{
                                height: 50,
                                width: '80%',
                                alignItems: 'center',
                                borderRadius: 80,
                                justifyContent: 'center',
                                flexDirection: 'row',
                                alignSelf: 'center',
                                marginBottom: 20,
                                paddingHorizontal: 20,
                            }}>
                            <MaterialIcons name="add" size={28} color="white" />
                            <Text
                                style={{
                                    fontFamily: typography.regular,
                                    fontSize: 14,
                                    textAlign: 'center',
                                    flex: 1,
                                    color: 'white',
                                    fontWeight: 'bold',

                                }}>
                                Make A New Transaction
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>


                {/* <TouchableOpacity
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
                {/* <Text
                        style={{
                            fontFamily: typography.regular,
                            fontSize: 14,
                            flex: 1,
                        }}>
                        {'  '}Scan any QR code
                        {/* {'  '}Transaction History */}
                {/* </Text> */}
                {/* </TouchableOpacity>  */}

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
                                                // borderBottomColor: '#ffffff',
                                                // borderBottomWidth: 0.4,
                                                // borderRadius: 20
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


                {/* <TouchableOpacity
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
                </TouchableOpacity> */}
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

                <SectionList
                    sections={data}
                    ListHeaderComponent={<HeaderUI />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <View>
                            {
                                (title != "empty") ?
                                    <Text style={{
                                        ...styles.subHeaderText,
                                        fontSize: 25,
                                        opacity: 0.8,
                                        marginTop: 15,
                                        marginLeft: 10,
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>{title}</Text> :
                                    null
                            }
                        </View>
                    )}
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
                        backgroundColor: 'rgba(0,0,0,0.6)'
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
                            }}>
                        </View>

                        {/* Add title and add contract */}

                        <View style={{
                            width: '100%',
                            flexDirection: 'row'
                        }}>

                            <Text
                                style={{
                                    width: '50%',
                                    fontSize: 16,
                                    fontFamily: typography.medium,
                                    color: 'white',
                                }}>
                                Transaction Info
                            </Text>
                            <View style={{
                                width: '50%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    borderRadius: 20,
                                    borderColor: 'green',
                                    borderWidth: 2,
                                    paddingVertical: 4,
                                    paddingHorizontal: 10,
                                    backgroundColor: 'green'
                                }}

                                    onPress={() => {
                                        setOpen(false)
                                        setCreateContactOpen(true)
                                    }}
                                >
                                    <MaterialIcons name="add" size={20} color="white" />

                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontFamily: typography.medium,
                                            color: 'white',
                                        }}>
                                        Add To Contact
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Other Infromations to Show or Body */}

                        <View style={{
                            width: '100%',
                            marginTop: 40
                        }}>

                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>From</Text>
                                <Text style={styles.subHeaderText}> {selectedData?.fromWalletAddress?.substring(0, 6) + "..." + selectedData?.fromWalletAddress?.substring(36, selectedData?.fromWalletAddress?.length)}</Text>
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>To</Text>
                                <Text style={styles.subHeaderText}> {selectedData?.toWalletAddress?.substring(0, 6) + "..." + selectedData?.toWalletAddress?.substring(36, selectedData?.toWalletAddress?.length)}</Text>
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>Name</Text>
                                <Text style={styles.subHeaderText}>{selectedData?.description}</Text>
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>Amount</Text>
                                <Text style={styles.subHeaderText}>{selectedData?.amount} Matic</Text>
                            </View>
                        </View>

                        <View>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                    <GradientButton
                                        text={'Explore'}
                                        size={150}
                                        disabled={false}
                                        colors={['#FF8DF4', '#89007C']}
                                        onPress={() => {
                                            setOpen(false)
                                            Linking.openURL("https://mumbai.polygonscan.com/tx/" + selectedData?.hash)
                                        }}
                                    />
                                    <GradientButton
                                        text={'Send Again'}
                                        size={150}
                                        colors={['#FF8DF4', '#89007C']}
                                        onPress={() => {
                                            setOpen(false)
                                            // navigation.navigate('SendTokenFinalize', { to: selectedData?.to, name: selectedData?.name })
                                            if (!isPending) {
                                                navigation.navigate('SendTokenFinalize', { to: selectedData?.to, name: selectedData?.name })
                                            } else {
                                                alert("Please speed up your previous transaction or cancel it because if you create a new Transaction it is also in a pending state until your first transaction is confirmed")
                                            }
                                        }}
                                    />

                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


            <TransactionControlModal
                open={openTransactionController}
                setOpen={setOpenTransactionController}
                selectedData={transactionInfo}
                onSuccess={onSpeedUpTransactionComplete}
                onCancel={onCancelTransactionComplete}
            />

            <CreateContactModel
                open={createContactOpen}
                setOpen={setCreateContactOpen}
                address={selectedData?.to}
                onSuccess={() => CustomSnackbar("Success", "Contact Succesfully Save")}
                onCancel={(msg) => CustomSnackbar("failure", msg)}
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