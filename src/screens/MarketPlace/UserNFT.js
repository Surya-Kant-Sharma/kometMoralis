import React, { useState, useEffect } from 'react'
import { themeColor } from '../../common/theme';
import { typography } from '../../common/typography';
import { View, TouchableOpacity, Text, FlatList, StyleSheet, Dimensions, Image } from 'react-native'
import { useSelector } from 'react-redux';
import { getUserNfts } from '../../Utils/theGraph';
import axios from 'axios';
import allSettled from 'promise.allsettled';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

const UserNfts = (props) => {

    const address = useSelector(state => state.address)

    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        getNfts()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getNfts();
        }, [])
    )

    const getNfts = async () => {
        try {
            console.log(address?.accountAddress?.second)
            const data = await getUserNfts(address?.accountAddress?.second)
            console.log(data)

            const arr = await data.data?.nfts?.map((item) => {
                return axios.get(`http://staging.komet.me/api/v1/market/v1/token/search?collectionContractId=${item.address}&tokenBlockchainId=${item.tokenId}`)
            })

            allSettled(arr).then((res) => {
                const arr = res.map((value) => {
                    if (value?.value) {
                        return value?.value
                    }


                })
                setNfts(res)
                console.log(arr)
            }).catch((err) => {
                console.log(err.message)
            })
        } catch (err) {
            console.log(err.message)
        }
    }


    return (
        <View>
            <FlatList
                data={nfts}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                style={{ alignSelf: 'center' }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    const itm = item?.value
                    console.log(itm)
                    return (
                        <View>
                            <TouchableOpacity
                                key={itm?.data.tokenId}
                                style={styles.cardContainer}>
                                <Image source={{ uri: itm?.data?.mediaUrl}} style={styles.image} />
                                <Text style={styles.imageText}>{itm?.data?.attributes?.name}</Text>
                            </TouchableOpacity>

                        </View>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColor.primaryBlack },
    searchBarContainer: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        margin: 10,

    },
    textInputContainer: {
        flexDirection: 'row',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 20,
        width: width * 0.75,
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    cardContainer: { height: width * 0.5, width: width * 0.40, margin: 10, },
    image: {
        height: width * 0.40,
        width: width * 0.40,
        borderRadius: 5,
        alignSelf: 'flex-start'
    },
    imageText: {
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
        fontFamily: typography.medium,
    },
    subHeaderText: { fontFamily: typography.medium, color: 'rgba(255,255,255,0.6)', marginHorizontal: 10, fontSize: 16 },
    subHeaderValue: { fontFamily: typography.medium, color: 'rgba(255,255,255,1)', marginHorizontal: 10, fontSize: 16 },
    description: { fontFamily: typography.medium, color: 'rgba(255,255,255,0.8)', marginHorizontal: 10, fontSize: 16 },
    header: { fontFamily: typography.semiBold, color: 'rgba(255,255,255,1)', marginHorizontal: 10, fontSize: 18 },
    price: { fontFamily: typography.bold, color: 'rgba(255,255,255,1)', marginHorizontal: 10, fontSize: 26 },
    summaryTextContainer: {
        borderRadius: 10,

        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    addressText: {
        width: '80%',
        fontFamily: typography.regular,
        fontSize: 12,
        color: 'white',
    },
    addressContainer: {
        //width: width * 0.5,
        width: '60%',
        paddingHorizontal: 10,
        height: 25,
        borderRadius: 20,
        backgroundColor: '#343153',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 15
    },
});

export default UserNfts;