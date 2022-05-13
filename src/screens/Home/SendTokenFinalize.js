import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Image} from 'react-native';
import {themeColor} from '../../common/theme';
import Header from '../../components/Header';
//import Send from '../../../assets/svg/Send.svg';
import LinearGradient from 'react-native-linear-gradient';
import {typography} from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import { ScrollView } from 'react-native-gesture-handler';
import GradientButton from '../../components/GradientButton';

const SendTokenFinalize = ({navigation,route}) => {
  const [visible, setVisible] = useState(false);
  const [fromAddress,setFromAddress]=useState('')
  const [sentAddress,setSentAddress]=useState(route.params.account);
  const [gasFees,setGasFees]=useState(1.5);
  const [open,setOpen]=useState(false)
  const [value,setValue]=useState('EOA 1')


  const [accounts, setAccounts] = useState([
    'EOA 1',
    'EOA 2',
    'EOA 3',
  ]);

  const [name,setName]=useState('')
  const [amount,setAmount]=useState(0);
  console.log(sentAddress)
  return (
    <ScrollView
      style={{ backgroundColor: themeColor.primaryBlack, padding: 30}}>
      <Header navigation={navigation} />
      <View style={{margins:40}}>

        {/* {'Account Select Modal'} */}
      <Modal
            visible={open}
            transparent
            onRequestClose={() => setOpen(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
              }}>
              <TouchableOpacity style={{flex:1}} onPress={()=>setOpen(false)}></TouchableOpacity>
              <View
                style={{
                  flex:1,
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
                  Select Account
                </Text>
                {accounts.map((item, index) => (
                  <TouchableOpacity
                  key={item.toString()}
                    onPress={() => {
                      setValue(item);
                      setOpen(false);
                    }}
                    style={{
                      marginHorizontal: 20,
                      marginVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 50,
                        backgroundColor: value == item ? '#FF84F3' : '#C4C4C4',
                        marginHorizontal: 10,
                      }}></View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: typography.regular,
                        color: 'white',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
                
              </View>
            </View>
          </Modal>
          {/* {'Account Select Modal'} */}
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
      <Text style={{fontFamily:typography.medium,color:'white',marginHorizontal:10,fontSize:16}}>From</Text>
      <TouchableOpacity
      onPress={()=>setOpen(true)}
        style={styles.textInputContainer}>
        
        <Text
        
          //placeholder={'Search public address, or ENS'}
         
          style={{
            fontFamily: typography.regular,
            fontSize: 14,

            flex: 1,
          }}>
            {value}
        </Text>
      </TouchableOpacity>
      <Text style={{fontFamily:typography.medium,color:'white',marginHorizontal:10,fontSize:16}}>To</Text>
      <View
         style={styles.textInputContainer}>
        
        <TextInput
          placeholder={'Address'}
          value={sentAddress}
          style={{
            fontFamily: typography.regular,
            fontSize: 14,
            flex: 1,
          }}
        />
        
      </View>
      <Text style={{fontFamily:typography.medium,color:'white',marginHorizontal:10,fontSize:16}}>Name</Text>
      <View
         style={styles.textInputContainer}>
        
        <TextInput
          placeholder={'Name'}
          onChangeText={(text)=>setSentAddress(text)}
          style={{
            fontFamily: typography.regular,
            fontSize: 14,
            flex: 1,
          }}
        />
        
      </View>

      <Text style={{fontFamily:typography.medium,color:'white',marginHorizontal:10,fontSize:16}}>Amount</Text>
      <View
         style={styles.textInputContainer}>
        <Image source={{uri:'https://ffnews.com/wp-content/uploads/2021/07/q4itcBEb_400x400-300x300.jpg'}} style={{width:35,height:35,borderRadius:50}}/>
        <TextInput
          placeholder={'ENTER MATIC'}
          onChangeText={(text)=>setAmount(text)}
          style={{
            fontFamily: typography.medium,
            fontSize: 16,
            flex: 1,
          }}
        />
      </View>    

      <View
         style={styles.summaryTextContainer}>
         <Text style={styles.subHeaderText}>Gas Fees</Text>
         <Text  style={styles.subHeaderText}>$ {gasFees}</Text>
      </View>
      <View
        style={styles.summaryTextContainer}>
         <Text  style={styles.subHeaderText}>Transaction</Text>
         <Text style={styles.subHeaderText}>$ {amount*0.8944}</Text>
      </View>
      <View
        style={styles.summaryTextContainer}>
         <Text  style={styles.subHeaderText}>Total</Text>
         <Text  style={styles.subHeaderText}>$ {amount*0.8944 + gasFees}</Text>
      </View>
      <View style={{alignItems:'center'}}>
      <GradientButton
          text={'Send Transaction'}
          colors={['#FF8DF4', '#89007C']}
          onPress={() => {
//            navigation.navigate('RestoreFromPhrase');
          }}
        />
      </View>
     </ScrollView>
  );
};

export default SendTokenFinalize;

const styles=StyleSheet.create({
  textInputContainer:{
    borderRadius: 10,
    height:50,
    borderColor: '#C445B8',
    borderWidth: 1,
    marginVertical: 13,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  subHeaderText:{fontFamily:typography.medium,color:'white',marginHorizontal:10,fontSize:16},
  summaryTextContainer:{
    borderRadius: 10,
    
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  }
})