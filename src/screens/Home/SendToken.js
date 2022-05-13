import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Modal} from 'react-native';
import {themeColor} from '../../common/theme';
import Header from '../../components/Header';
//import Send from '../../../assets/svg/Send.svg';
import LinearGradient from 'react-native-linear-gradient';
import {typography} from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const SendToken = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  return (
    <View
      style={{flex: 1, backgroundColor: themeColor.primaryBlack, padding: 30}}>
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
              console.log(val);
            }}
            //flashMode={RNCamera.Constants.FlashMode.torch}
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
            style={{alignItems: 'center', justifyContent: 'center'}}>
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
        onPress={()=>navigation.navigate('SendTokenFinalize')}
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
          {'  '}Scan any QR code
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        //onPress={() => setVisible(true)}
        onPress={()=>navigation.navigate('SendTokenFinalize',{account:'0x871B104A1f9022b8e92c192fdcc1f943fd080152'})}
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
          borderColor:'white'
        }}>
        <Text
        numberOfLines={1}
        ellipsizeMode={'middle'}
          style={{
            fontFamily: typography.regular,
            fontSize: 14,

            flex: 1,
          }}>
          0x871B104A1f9022b8e92c192fdcc1f943fd080152
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendToken;
