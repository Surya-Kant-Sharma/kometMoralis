import { BigNumber, ethers } from 'ethers'
import React from 'react'
import { Button, View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient'
import { typography } from '../common/typography'
import { walletProvider } from '../Utils/Provider'
import Icons from 'react-native-vector-icons/MaterialIcons'
import { cancelTransactions, speedUpTransactions } from '../Utils/Transactions'
import GradientButton from './GradientButton'
import Snackbar from 'react-native-snackbar'


const TransactionControlModal = ({ open, setOpen, selectedData, onSuccess, onCancel }) => {

    const [currentGasFee, setCurrentGasFee] = React.useState(-1);
    let interval = React.useRef();

    React.useEffect(() => {

        if (open) {
            interval.current = setInterval(() => {
                calculateGesFee()
            }, 4000)
        }

        return () => {
            clearInterval(interval.current)
        }
    }, [open])

    const calculateGesFee = async () => {
        try {
            const provider = walletProvider();
            const gasFees = await provider.getGasPrice();
            const hex = Object.values(gasFees);
            console.log(parseInt(hex[0]), gasFees)
            setCurrentGasFee(parseInt(hex[0]));
        } catch (err) {
            console.log(err);
            alert(err.message);
        }
    }

    const speedUp = async () => {
        try {
            console.log(selectedData)
            setTimeout(() => {
                Snackbar.show({
                    text: 'Please Wait While Speeding Up',
                    duration: Snackbar.LENGTH_LONG,
                    textColor: 'white'
                });
            }, 2000)

            const hash = await speedUpTransactions(
                selectedData.to,
                selectedData.from,
                selectedData.amount,
                selectedData.nonce,
                currentGasFee,
                selectedData.pk,
            )
            console.log(hash)
            onSuccess(hash)

        } catch (err) {
            console.log(err.message)
        }
    }
    const cancel = async () => {
        try {
            console.log(selectedData)
            setTimeout(() => {
                Snackbar.show({
                    text: 'Please Wait While Canceling ',
                    duration: Snackbar.LENGTH_LONG,
                    textColor: 'white'
                });
            }, 2000)
            const hash = await cancelTransactions(
                selectedData.to,
                selectedData.from,
                selectedData.amount,
                selectedData.nonce,
                currentGasFee,
                selectedData.pk,
            )
            console.log(hash)
            onCancel(hash)
        } catch (err) {
            console.log(err.message)
        }
    }

    const totalAmount = () => {
        const a = BigNumber.from(ethers.utils.parseEther(amount.toString()));
        const b = BigNumber.from(parseInt(gasFees.toString()));
        console.log(a, b)
        const total = b.add(a);
        return (ethers.utils.formatUnits(total, 18).substring(0, 16))
    }

    return (
        <View>
            <Modal
                visible={open}
                transparent
                onRequestClose={() => setOpen(false)}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                    }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                        setOpen(false)
                        clearInterval(interval.current)
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
                            Speed Up Transaction
                        </Text>
                        <View style={{
                            width: '100%',
                            marginTop: 40
                        }}>

                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Icons name='speed' size={50} color="white" />
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        margin: 10,
                                        marginBottom: 40,
                                        fontSize: 16,
                                        color: 'white'
                                    }}
                                >This will speed up your transaction by replacing it. There's still a chance your orignal transaction will confrim first!</Text>
                            </View>


                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>Fast Network Fees</Text>
                                {(currentGasFee > 0) ?
                                    <Text style={styles.subHeaderText}> {parseFloat(ethers.utils.formatUnits(currentGasFee.toString(), "gwei")).toPrecision(3) + " Gwei"}</Text>
                                    : <ShimmerPlaceHolder style={{ width: '40%', borderRadius: 10 }} LinearGradient={LinearGradient} />}
                            </View>
                            <View
                                style={styles.summaryTextContainer}>
                                <Text style={styles.subHeaderText}>Amount</Text>
                                <Text style={styles.subHeaderText}>{parseFloat(selectedData?.amountEth)} Matic</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={1}
                            //onPress={() => setVisible(true)}
                            // onPress={() => navigation.navigate('SendTokenFinalize')}
                            style={{
                                width: '100%',
                                borderRadius: 10,
                                borderColor: 'yellow',
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
                                style={{ ...styles.subHeaderText, color: 'yellow', fontWeight: 'normal' }}>
                                {/* {'  '}Scan any QR code */}
                                {'  '}Add To Context
                            </Text>
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'column'
                        }}>
                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                <GradientButton
                                    text={'Speed Up'}
                                    size={150}
                                    disabled={(currentGasFee <= 0) ? true : false}
                                    colors={(currentGasFee > 0) ? ['#FF8DF4', '#89007C'] : ['rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.2)']}
                                    onPress={() => {
                                        setOpen(false)
                                        clearInterval(interval.current)
                                        speedUp()
                                    }}
                                />
                                <GradientButton
                                    text={'Cancel'}
                                    size={150}
                                    disabled={(currentGasFee <= 0) ? true : false}
                                    colors={(currentGasFee > 0) ? ['#FF8DF4', '#89007C'] : ['rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.2)']}
                                    onPress={() => {
                                        //            navigation.navigate('RestoreFromPhrase');
                                        setOpen(false)
                                        clearInterval(interval.current)
                                        cancel()
                                    }}
                                />

                            </View>

                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default TransactionControlModal;

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