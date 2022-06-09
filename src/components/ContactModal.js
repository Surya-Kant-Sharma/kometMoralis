import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal ,StyleSheet } from 'react-native';
import { typography } from '../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios'
import { getUserId } from '../common/Storage';
import ContactBookRow from './contactBookRow';

const ContactBoookModal = ({ open, setOpen, selectedContact }) => {
    const [contactList, setContactList] = React.useState();

    React.useEffect(() => {
        getContactBook()
    }, [])

    const getContactBook = () => {
        getUserId().then((user) => {
            // console.log("user", user)
            axios.get("http://staging.komet.me/api/v1/user/v1/contact?pageNo=0&pageSize=10", {
                headers: {
                    'accept': '*/*',
                    'X-USER-ID': user,
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                setContactList(res?.data);
            }).catch((err) => {
                console.log(err.message)
            })
        })
    }

    const Items = ({ item }) => {
        return (
            <TouchableOpacity 
            onPress={() => {
                selectedContact(item)
                setOpen(false)
            }}>
                <ContactBookRow
                    image={'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg'}
                    coinName={item.name}
                    symbol={'Mat'}
                    value={item.walletAddress}
                    chainId={item.chainId}
                    change={1.3}
                />
            </TouchableOpacity>
        )
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
                <TouchableOpacity style={{ flex: 0.4 }} onPress={() => {
                    // clearInterval(timeRef.current)
                    setOpen(false)
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


                    <Text style={{
                        width: '100%',
                        fontSize: 20,
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        Contact Book
                    </Text>


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

                    <FlatList
                        data={contactList}
                        renderItem={Items}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default ContactBoookModal;
