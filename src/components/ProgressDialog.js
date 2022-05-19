import React from 'react'
import { Text, View, ActivityIndicator, TouchableOpacity, Modal, Linking } from 'react-native'
import { typography } from '../common/typography'

const ProgressDialog = ({ open, setOpen, completed, setCompleted }) => {

    // const [open, setOpen] = React.useState(true)

    return (
        <View>
            <Modal
                visible={open}
                transparent
                onRequestClose={() => setOpen(false)}
            >

                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        backgroundColor: 'rgba(14,14,14,0.6)'
                    }}>
                    <TouchableOpacity style={{ flex: 1 }} ></TouchableOpacity>
                    <View
                        style={{
                            flex: 0,
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            backgroundColor: '#2F2F3A',
                            alignItems: 'flex-start',
                            padding: 15,
                        }}>
                        {(!completed) ?
                            <View style={{ width: '100%' }}>

                                <View
                                    style={{
                                        height: 2,
                                        width: 40,
                                        backgroundColor: '#B02FA4',
                                        marginBottom: 30,
                                        alignSelf: 'center',
                                    }}></View>
                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <ActivityIndicator style={{ marginRight: 6 }} color={'purple'} />

                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontFamily: typography.medium,
                                            color: 'white',
                                        }}>
                                        Please Wait...
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontFamily: typography.medium,
                                        color: 'white',
                                        marginLeft: 20,
                                        marginTop: 20,
                                    }}>
                                    Please Don't Perform Any Operation Now
                                </Text>
                                <View style={{
                                    width: '100%',
                                    marginTop: 40
                                }}>

                                </View>
                            </View>
                            :
                            <View style={{ width: '100%' }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: typography.medium,
                                        color: 'white',
                                    }}>
                                    Transaction Completed.
                                </Text>

                                <View>
                                    <Text style={{ margin: 10 }}>Your Transaction Successfully Completed. If you want to explore transaction tap on Explore Button and otherwise click ok</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={{
                                        width: '45%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        borderColor: 'white',
                                        padding: 10,
                                        marginRight: 10
                                    }}
                                        onPress={() => {

                                            Linking.openURL("https://mumbai.polygonscan.com/tx/" + completed)
                                            setCompleted(false)
                                            setOpen(false)
                                        }}
                                    >
                                        <Text style={{ color: 'white' }}>Explore</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        width: '45%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        borderColor: 'white',
                                        padding: 10
                                    }}
                                        onPress={() => {
                                            setOpen(false)
                                            setCompleted(false)
                                        }}
                                    >
                                        <Text>Ok</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ProgressDialog;