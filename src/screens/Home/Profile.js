
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { themeColor } from '../../common/theme';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileIcons from '../../../assets/svg/ProfileIcons.svg';
import AssetIcon from '../../../assets/svg/AssetIcon.svg';
import { typography } from '../../common/typography';
//import axios from 'axios';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AssetsLog from '../../components/AssetsLog';
import { ActivityIndicator } from 'react-native-paper';
import { useNFTBalance } from '../../../frontend/hooks/useNFTBalance';
import NFTAssets from '../../../frontend/Components/NFT/NFTAssets'
import { useMoralis } from 'react-moralis';

const { width, height } = Dimensions.get('screen');

const Profile = ({ navigation }) => {
  const [assets, setAssets] = useState([]);
  const [otherAssets, setOtherAssets] = useState([]);
  const address = useSelector(state => state.address);
  const eoaBalance = useSelector(state => state.eoaBalance);
  const {
    authenticate,
    authError,
    isAuthenticating,
    isAuthenticated,
    logout,
    Moralis,
    user,
    refetchUserData, isUserUpdating, userError
  } = useMoralis();

  console.log(eoaBalance)

  const fetchAssets = async () => {
    await fetch('https://api.opensea.io/api/v1/collections?offset=0&limit=300')
      .then(async (res) => {
      }).catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchAssets();
  }, []);
  const [currentTab, setCurrentTab] = useState('Komet');

  const MODES = ['EOA2', 'Vault', 'External Wallet'];
  

  return (
    <ScrollView style={{ flex: 1, backgroundColor: themeColor.primaryBlack }}>
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-between',
            marginHorizontal: 20
          }}>
          <View
            style={{
              marginRight: 20,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row'
            }}>
            <Image source={require('../../../assets/images/ProfileImage.png')} />
            <View style={{ margin: 10, marginHorizontal: 20,flex:0.8 }}>
              <Text
                style={{

                  fontFamily: typography.medium,
                  color: 'white',
                  fontSize: 18,
                }}>
                Victoria
              </Text>
              <Text
              numberOfLines={1}
              ellipsizeMode={'middle'}
                style={{

                  fontFamily: typography.medium,
                  color: 'rgba(255,255,255,0.80)',
                  fontSize: 10,
                }}>
                {address.accountAddress.second || '0xff4533223454'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={{
              height: 42,
              width: 42,
              borderRadius: 32,
              backgroundColor: '#343153',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name={'menu'} size={26} color={'white'} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
          <TouchableOpacity style={{ borderRadius: 15, padding: 10, backgroundColor: '#E1E4F8', flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontFamily: typography.medium, color: 'white', fontSize: 12, color: '#453E9F' }}>{MODES[0]}</Text><MaterialIcons name={'keyboard-arrow-down'} size={16} color={'#453E9F'} /></TouchableOpacity>
          <Text style={{ fontFamily: typography.semiBold, color: 'white', fontSize: 18 }}>$ 1400.99</Text>
        </View>
      </View>
      {isAuthenticated&&<>
      <AssetsLog
        image={'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg'}
        coinName={'Polygon'}
        symbol={'MATIC'}
        value={parseFloat(address.balance.second).toPrecision(4)}
        price={'$1.34'}
        change={1.3} 
        chain={'rinkeby'}
        />
      <AssetsLog image={'https://cryptologos.cc/logos/axie-infinity-axs-logo.png?v=022'} coinName={'Axie Infinity'} symbol={'AXS'} value={'145.22'} price={'$1556.34'} change={'-6.3'} chain={0} />
      <AssetsLog image={'https://thegivingblock.com/wp-content/uploads/2021/12/Ethereum-Name-Service-ENS.png'} coinName={'ENS'} symbol={'ENS'} value={'785'} price={'$1244.34'} change={1.58} chain={80001}/>
      </>}
      <TouchableOpacity style={{ borderRadius: 15, padding: 10, backgroundColor: '#E1E4F8', flexDirection: 'row', alignItems: 'center', width: 50, margin: 20 }}><Text style={{ fontFamily: typography.medium, color: 'white', fontSize: 12, color: '#453E9F' }}>All</Text><MaterialIcons name={'keyboard-arrow-right'} size={16} color={'#453E9F'} /></TouchableOpacity>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20, alignItems: 'center' }}>
        <TouchableOpacity style={{ borderRadius: 15, padding: 10, flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontFamily: typography.medium, color: 'white', fontSize: 18, color: 'white' }}>Collectibles</Text></TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 15, backgroundColor: '#E1E4F8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, height: 35 }}><MaterialIcons name={'ios-share'} size={16} color={'#453E9F'} /><Text style={{ fontFamily: typography.medium, color: 'white', fontSize: 12, color: '#453E9F' }}>Share</Text></TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, alignItems: 'center' }}>
        <TouchableOpacity style={{ borderRadius: 15, padding: 10, flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontFamily: typography.medium, color: 'white', fontSize: 14, color: 'white' }}>Showcase</Text></TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, height: 35 }}><MaterialIcons name={'keyboard-arrow-down'} size={16} color={'white'} /></TouchableOpacity>
      </View>
      <NFTAssets/>
    </ScrollView>
  );
};

export default Profile;
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
  cardContainer: { height: width * 0.5, width: width * 0.4, margin: 10 },
  image: {
    height: width * 0.4,
    width: width * 0.4,
    borderRadius: 20,
  },
  imageText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontFamily: typography.medium,
  },
});







// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Dimensions,
//   Image,
// } from 'react-native';
// import {themeColor} from '../../common/theme';
// import Octicons from 'react-native-vector-icons/Octicons';
// import Feather from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import ProfileIcons from '../../../assets/svg/ProfileIcons.svg';
// import AssetIcon from '../../../assets/svg/AssetIcon.svg';
// import {typography} from '../../common/typography';
// import axios from 'axios';
// import {useSelector} from 'react-redux';

// const {width, height} = Dimensions.get('screen');

// const Profile = ({navigation}) => {
//   const [assets, setAssets] = useState([]);
//   const [otherAssets, setOtherAssets] = useState([]);
//   const address = useSelector(state => state.address);

//   const fetchAssets = async () => {
//     await axios
//       .get('https://api.opensea.io/api/v1/collections?offset=0&limit=300')
//       .then(res => {
//         setAssets(
//           res.data.collections.filter(
//             (a, index) => a.image_url != null && index % 2 == 0,
//           ),
//         );
//         setOtherAssets(
//           res.data.collections.filter(
//             (a, index) => a.image_url != null && index % 2 != 0,
//           ),
//         );
//       });
//     console.log(assets).catch(error => {
//       console.log(error);
//     });
//   };

//   useEffect(() => {
//     fetchAssets();
//   }, []);
//   const [currentTab, setCurrentTab] = useState('Komet');

//   return (
//     <View style={{flex: 1, backgroundColor: themeColor.primaryBlack}}>
//       <View style={{flex: 1}}>
//         <View
//           style={{
//             flexDirection: 'row',
//             height: 60,
//             justifyContent: 'flex-end',
//             margin: 9,
//           }}>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('Settings')}
//             style={{
//               height: 42,
//               width: 42,
//               borderRadius: 32,
//               backgroundColor: '#343153',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <Octicons name={'gear'} size={26} color={'white'} />
//           </TouchableOpacity>
//         </View>
//         <View
//           style={{
//             margin: 20,
//             alignSelf: 'center',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//           <ProfileIcons />
//           <Text
//             style={{
//               margin: 10,
//               fontFamily: typography.medium,
//               color: 'white',
//               fontSize: 18,
//             }}>
//             Victoria
//           </Text>
//           <Text
//             style={{
//               margin: 10,
//               fontFamily: typography.medium,
//               color: 'rgba(255,255,255,0.80)',
//               fontSize: 10,
//             }}>
//             {address}
//           </Text>
//         </View>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-around',
//             marginHorizontal: 30,
//           }}>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-around',
//               alignItems: 'center',
//             }}>
//             <Feather name={'copy'} color={'#4E75F3'} size={24} />
//             <Text style={{color: '#4E75F3', fontFamily: typography.medium}}>
//               {'  '}
//               Copy Address
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-around',
//               alignItems: 'center',
//             }}>
//             <Ionicons name={'qr-code'} color={'#4E75F3'} size={24} />
//             <Text style={{color: '#4E75F3', fontFamily: typography.medium}}>
//               {'  '}
//               Receive
//             </Text>
//           </View>
//         </View>
//       </View>
//       <View style={{flex: 1.2, backgroundColor: '#2F2F3A'}}>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-around',
//             marginHorizontal: 30,
//           }}>
//           <View>
//             <View
//               style={{
//                 borderBottomLeftRadius: 5,
//                 borderBottomRightRadius: 5,
//                 backgroundColor: currentTab == 'Komet' ? '#B02FA4' : '#2F2F3A',
//                 height: 5,
//                 marginBottom: 10,
//               }}></View>
//             <TouchableOpacity
//               onPress={() => setCurrentTab('Komet')}
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-around',
//                 alignItems: 'center',
//               }}>
//               <AssetIcon />
//               <Text style={{color: 'white', fontFamily: typography.medium}}>
//                 {'  '}
//                 Komet Asset
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <View>
//             <View
//               style={{
//                 borderBottomLeftRadius: 5,
//                 borderBottomRightRadius: 5,
//                 backgroundColor: currentTab == 'Other' ? '#B02FA4' : '#2F2F3A',
//                 height: 5,
//                 marginBottom: 10,
//               }}></View>

//             <TouchableOpacity
//               onPress={() => setCurrentTab('Other')}
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-around',
//                 alignItems: 'center',
//               }}>
//               <AssetIcon />
//               <Text style={{color: 'white', fontFamily: typography.medium}}>
//                 {'  '}
//                 Other Asset
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         {currentTab == 'Komet' ? (
//           <FlatList
//             data={assets}
//             numColumns={2}
//             showsVerticalScrollIndicator={false}
//             style={{alignSelf: 'center'}}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({item, index}) => (
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('NFTPage', {item: item})}
//                 style={styles.cardContainer}>
//                 <Image
//                   source={{uri: item.image_url}}
//                   style={{
//                     ...styles.image,
//                     height: width * 0.4,
//                     width: width * 0.4,
//                   }}
//                 />
//                 {/* <Text style={styles.imageText}>{item.slug}</Text> */}
//               </TouchableOpacity>
//             )}
//           />
//         ) : (
//           <FlatList
//             data={otherAssets}
//             numColumns={2}
//             showsVerticalScrollIndicator={false}
//             style={{alignSelf: 'center'}}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({item, index}) => (
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('NFTPage', {item: item})}
//                 style={styles.cardContainer}>
//                 <Image
//                   source={{uri: item.image_url}}
//                   style={{
//                     ...styles.image,
//                     height: width * 0.4,
//                     width: width * 0.4,
//                   }}
//                 />
//                 {/* <Text style={styles.imageText}>{item.slug}</Text> */}
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// export default Profile;
// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: themeColor.primaryBlack},
//   searchBarContainer: {
//     justifyContent: 'space-around',
//     flexDirection: 'row',
//     margin: 10,
//   },
//   textInputContainer: {
//     flexDirection: 'row',
//     borderColor: 'white',
//     borderWidth: 1,
//     borderRadius: 20,
//     width: width * 0.75,
//     height: 40,
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   cardContainer: {height: width * 0.5, width: width * 0.4, margin: 10},
//   image: {
//     height: width * 0.4,
//     width: width * 0.4,
//     borderRadius: 20,
//   },
//   imageText: {
//     alignSelf: 'center',
//     textAlign: 'center',
//     color: 'white',
//     fontFamily: typography.medium,
//   },
// });



