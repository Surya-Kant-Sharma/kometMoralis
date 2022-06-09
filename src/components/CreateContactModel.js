import axios from 'axios'
import React from 'react'
import { View, Text, FlatList, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { getUserId } from '../common/Storage'
import { typography } from '../common/typography'
import GradientButton from './GradientButton'


const CreateContactModel = ({ open, setOpen, address, onSuccess, onCancel }) => {

    const [name, setName] = React.useState('');
    const [toAddress, setToAddress] = React.useState(address || 'address');


    const createContact = () => {
        if (name !== '') {
            getUserId().then((user) => {
                console.log(user, address?.accountAddress?.second)
                axios.post("https://staging.komet.me/api/v1/user/v1/contact/",
                    {
                        "name": name,
                        "chainId": "80001",
                        "walletAddress": toAddress
                    },
                    {
                        headers: {
                            'accept': '*/*',
                            'X-USER-ID': user,
                            'Content-Type': 'application/json'
                        }
                    }).then((res) => {
                        console.log(res)
                        setName('')
                        onSuccess()
                    }).catch((err) => {
                        console.log(err.message)
                        onCancel(err.message)
                    })
            }).catch((err) => {
                console.log(err.message)
                setName('')
            })
        } else {
            alert("name is required")
        }
    }

    return (
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
                            Create Contact
                        </Text>
                        <View style={{
                            width: '50%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {/* <TouchableOpacity style={{
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
                            </TouchableOpacity> */}
                        </View>
                    </View>

                    {/* Other Infromations to Show or Body */}

                    <View style={{
                        width: "100%"
                    }}>
                        {/* <Text style={{ color: 'white', marginHorizontal: 10, fontSize: 16 }}>Name *</Text> */}
                        <View
                            style={styles.textInputContainer}>
                            <TextInput
                                placeholder={'Name'}
                                value={name}
                                onChangeText={(text) => setName(text)}
                                keyboardType="ascii-capable"
                                style={{
                                    fontFamily: typography.regular,
                                    fontSize: 14,
                                    flex: 1,
                                }}
                            />

                        </View>
                    </View>

                    <View style={{
                        width: "100%"
                    }}>
                        <Text style={{ color: 'white', marginHorizontal: 10, fontSize: 16 }}>Address </Text>
                        <View
                            style={styles.textInputContainer}>
                            <TextInput
                                placeholder={'Address'}
                                value={toAddress}
                                onChangeText={(text) => setToAddress(text)}
                                keyboardType="ascii-capable"
                                style={{
                                    fontFamily: typography.regular,
                                    fontSize: 14,
                                    flex: 1,
                                }}
                            />

                        </View>
                    </View>


                    <View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                <GradientButton
                                    text={'Save'}
                                    size={150}
                                    disabled={(name == '') ? true : false}
                                    colors={(name !== '') ? ['#FF8DF4', '#89007C'] : ['rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.2)']}
                                    onPress={() => {
                                        setOpen(false)
                                        createContact()
                                    }}
                                />
                                <GradientButton
                                    text={'Cancel'}
                                    size={150}
                                    colors={['#FF8DF4', '#89007C']}
                                    onPress={() => {
                                        setOpen(false)
                                        setName('')
                                    }}
                                />

                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default CreateContactModel;

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