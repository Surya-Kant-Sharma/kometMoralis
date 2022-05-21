import React from 'react';
import {useState} from 'react';
import {View, Text, FlatList, Dimensions, ToastAndroid, Touchable} from 'react-native';
import bip39 from 'react-native-bip39';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import BorderButton from '../../components/BorderButton';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import SeedPhraseButton from '../../components/SeedPhraseButton';
import {ethers} from 'ethers';
import { getAccountDetails } from '../../Utils/ImportWallet';
import { setAccountInfo } from '../../Utils/AsyncStorage';
import { transferToSmartWallet } from '../../Utils/SmartWallet';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setAddress } from '../../store/Actions/action';
import { API_KEY } from '../../Utils/Api';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Clipboard from '@react-native-community/clipboard';

const ChooseSeedPhrase = ({navigation}) => {
  const [phrase, setPhrase] = useState([]);
  const [string, setString] = useState('');
  const dispatch=useDispatch();
  const [loading,setLoading]=useState(false)
  const fetchAddress = address => dispatch(setAddress(address));
  var provider;

  const fetchSecretKey = async () => {
    const walletfromPhrase = new ethers.Wallet.fromMnemonic(
      'round unfold finger zoo trouble potato feel crucial jazz ask dutch repair',
    );
    //const wallet = new ethers.Wallet(walletfromPhrase.privateKey, provider);
    console.log(walletfromPhrase.privateKey);
  };

  const genrateSeedPhrase = async () => {
    const generateMnemonics = async () => {
      try {
        return await bip39.generateMnemonic(128); // default to 128
      } catch (e) {
        return false;
      }
    };

    const a = await generateMnemonics.call();
    console.log(a);
    setString(a);

    setPhrase(a.split(' '));

    // => 'reveal man culture nominee tag abuse keen behave refuse warfare crisp thunder valve knock unique try fold energy torch news thought access hawk table'

    // => '5cf2d4a8b0355e90295bdfc565a022a409af063d5365bb57bf74d9528f494bfa4400f53d8349b80fdae44082d7f9541e1dba2b003bcfec9d0d53781ca676651f'

    // => <Buffer 5c f2 d4 a8 b0 35 5e 90 29 5b df c5 65 a0 22 a4 09 af 06 3d 53 65 bb 57 bf 74 d9 52 8f 49 4b fa 44 00 f5 3d 83 49 b8 0f da e4 40 82 d7 f9 54 1e 1d ba 2b ...>

    //bip39.validateMnemonic(myMnemonic);
    // => true
  };

  React.useEffect(() => {
    genrateSeedPhrase();
  }, []);

  const createAccount=async()=>{
      //setLoading(true);
      //console.log(loading)
      try {
        //const sp = "clean gossip jar often rent coconut detect gossip crush invest vicious weapon"
        const WalletInfo = await getAccountDetails(string);
        if(WalletInfo) {
          fetchAddress(WalletInfo);
          setAccountInfo(WalletInfo);
          transferToSmartWallet({
            privateKey : API_KEY,
            to : WalletInfo?.accountAddress?.first,
            amount : "0.1"
          }).then((response) => {
            setLoading(false)
            console.log(response)
          }).catch ((err) => {
            console.log(err.message);
            setLoading(false)
          })
          //alert(WalletInfo?.accountAddress?.first)
        }
        //setLogin(true)
        ToastAndroid.showWithGravityAndOffset(
          'Account created Successfully',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        
        setTimeout(()=>{
          navigation.replace('Dashboard')
        },0) 
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    
  }

  return (
    <View
      style={{
        padding: 20,
        flex: 1,
        height: Dimensions.get('screen').height,
        backgroundColor: themeColor.primaryBlack,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}>
<Header navigation={navigation}/>
<View style={{alignItems: 'center',marginTop:-40}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text
          style={{
            fontFamily: typography.semiBold,
            color: 'white',
            fontSize: 24,
          }}>
          Secret Recovery Phrase{' '}
        
        </Text>
        <TouchableOpacity onPress={()=>{Clipboard.setString(string);ToastAndroid.show('Phrase Copied',ToastAndroid.SHORT)}}>
        <Ionicons name={'md-copy'} color={'white'} size={20} />
        </TouchableOpacity>
        </View>
        <Text
          style={{
            fontFamily: typography.medium,
            color: 'rgba(255,255,255,0.60)',
            fontSize: 16,
            textAlign: 'center',
          }}>
          Lorem ipsum dolor sit amet, adipiscing elit. Laoreet ut dui imperdiet.
        </Text>
      </View>
      <View
        style={{
          height: Dimensions.get('screen').height * 0.35,
          alignItems: 'center',
        }}>
        <FlatList
        showsVerticalScrollIndicator={false}
          data={phrase}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <SeedPhraseButton item={item} index={index} />
          )}
        />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <GradientButton
          text={'Back up my Account '}
          colors={['#FF8DF4', '#89007C']}
          onPress={() => {
            navigation.navigate('AuthenticateWallet', {phrase: string});
          }}
        />
         {loading?
        <ActivityIndicator size={'small'} color={'pink'}/> 
        :<BorderButton
        borderColor={'#FF8DF4'}
        text={'  Skip for Now  '}
        onPress={() => {
          setLoading(true);
          setTimeout(()=>{
            createAccount()
          },0)
          //console.log('BorderPressed');
        }}
      />
      }
 
      </View>

      {/* {phrase.map((item, index) => (
        <View>
          <Text>
            {index} {item}
          </Text>
        </View>
      ))} */}
    </View>
  );
};

export default ChooseSeedPhrase;
