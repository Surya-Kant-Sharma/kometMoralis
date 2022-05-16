import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { themeColor } from '../../common/theme';
import Header from '../../components/Header';
import Send from '../../../assets/svg/Send.svg';
import LinearGradient from 'react-native-linear-gradient';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
// import ReceiveIcon from '../../../assets/svg/ReceiveIcon.svg';
import QRCode from 'react-native-qrcode-generator';
import { useSelector } from 'react-redux';

const ReceiveToken = ({ navigation }) => {

  const address = useSelector(state => state.address);

  return (
    <View
      style={{ flex: 1, backgroundColor: themeColor.primaryBlack, padding: 30 }}>
      <Header navigation={navigation} />
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
            <AntDesign name={'arrowdown'} size={28} color={'white'} />
          </TouchableOpacity>
        </LinearGradient>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
            fontFamily: typography.medium,
            color: 'white',
          }}>
          Receive
        </Text>
      </View>
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
          borderRadius: 10,
          borderColor: '#232732',
          borderWidth: 1,
          marginVertical: 20,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingHorizontal: 10,
          height: 50,
        }}>
        <MaterialIcons name={'qr-code'} color={'white'} size={28} />
        <Text
          style={{
            fontFamily: typography.regular,
            fontSize: 14,

            flex: 1,
          }}>
          {'  '}Receive via my QR code
        </Text>
      </View>

      <View style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <QRCode
          value={address?.accountAddress?.second}
          size={200}
          bgColor='#232732'
          fgColor='white' />
      </View>
      <View style={{
        width: '100%',
        justifyContent : 'center',
        alignItems : 'center'
      }}>


        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={{
            fontFamily: typography.regular,
            fontSize: 14,
            color: 'white',
            marginTop : 20
          }}>
          {address?.accountAddress?.second?.substring(0, 8) + "..." + address?.accountAddress?.second?.substring(34, address?.accountAddress?.second?.length)}
        </Text>

        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={{
            fontFamily: typography.regular,
            fontSize: 12,
            color: 'white',
            marginTop : 160,
          }}>
          Share Qr-Code to Receive Matic On Testnet
        </Text>


      </View>


    </View>
  );
};

export default ReceiveToken;
