import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios'

import ContactBookRow from '../../components/contactBookRow';
import { getUserId } from '../../common/Storage';
import { typography } from '../../common/typography';
import { themeColor } from '../../common/theme';
import TransactionShimmerRow from '../../components/tranasctionShimmerRow';


const ContactBook = ({ navigation }) => {
    const [contactList, setContactList] = React.useState([1, 2, 3, 4, 5, 6]);
    const [isFetch, setIsFetch] = React.useState(true);
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
                setIsFetch(false);
            }).catch((err) => {
                console.log(err.message)
                setIsFetch(false);
            })
        })
    }

    const Items = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('SendTokenFinalize', { to: item.walletAddress, name: item.name })
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

    const ShimmerItems = ({ item }) => {
        return (
            <TransactionShimmerRow />
        )
    }

    return (
        <View>
            <View
                style={{
                    height: '100%',
                    padding: 15,
                    backgroundColor: themeColor.primaryBlack
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

                {
                    (isFetch) ?
                        <FlatList
                            data={contactList}
                            renderItem={ShimmerItems}
                        /> :
                        <FlatList
                            data={contactList}
                            renderItem={Items}
                        />
                }
            </View>
        </View>
    )
}

export default ContactBook;
