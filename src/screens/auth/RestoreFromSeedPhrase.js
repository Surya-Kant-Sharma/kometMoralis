import React from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import Tags from 'react-native-tags';
const {width, height} = Dimensions.get('screen');
import {ethers} from 'ethers';
import {useDispatch} from 'react-redux';
import {getAddress, getBalance,getWallets} from '../../store/Actions/action';

const RestoreFromSeedPhrase = ({navigation}) => {
  const [phrase, setPhrase] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const fetchAddress = address => dispatch(getAddress(address));
  const fetchWallets = address => dispatch(getWallets(address));
  const fetchBalance = balance => dispatch(getBalance(balance));

  var provider;

  // React.useEffect(() => {
  //   provider = new ethers.providers.JsonRpcProvider(
  //     'https://rinkeby.infura.io/v3/d02fb37024ef430b8f15fdacf9134ccc',
  //   );
  //   //fetchPrivateKey();
  // }, []);

  const formatString = () => {
    var string = '';
    for (var i = 0; i < phrase.length; i++) {
      string = `${string}${phrase[i].toLowerCase()}${
        i == phrase.length - 1 ? '' : ' '
      }`;
    }
    console.log(string);
    return string;
  };

  const fetchPrivateKey = async () => {
    provider = new ethers.providers.JsonRpcProvider(
      'https://rinkeby.infura.io/v3/d02fb37024ef430b8f15fdacf9134ccc',
    );
    setLoading(true);
    try {
      var string = formatString();
      const walletfromPhrase = new ethers.Wallet.fromMnemonic(string);
      const wallet = new ethers.Wallet(walletfromPhrase.privateKey, provider);
      console.log(wallet);
      const balance = await provider.getBalance(wallet.address);
      fetchAddress(wallet.address);
      fetchWallets(wallet.address)
      fetchBalance(balance);
      navigation.navigate('Dashboard');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 30,
        backgroundColor: themeColor.primaryBlack,
      }}>
      <Header navigation={navigation} />
      <View style={{marginVertical: 40}}>
        <Text
          style={{
            color: 'rgba(255,255,255,1)',
            fontFamily: typography.semiBold,
            fontSize: 24,
            textAlign: 'center',
          }}>
          Confirm your secret phrase
        </Text>

        <Text
          style={{
            color: 'rgba(255,255,255,0.82)',
            fontFamily: typography.regular,
            fontSize: 14,
            textAlign: 'center',
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Laoreet ut
          dui imperdiet.
        </Text>
      </View>
      <View
        style={{
          marginBottom: 50,

          backgroundColor: '#232732',
          width: width - 50,
          alignSelf: 'center',
          borderRadius: 20,
          padding: 20,
        }}>
        <Tags
          initialText=""
          textInputProps={{
            placeholder: '',
          }}
          initialTags={[]}
          onChangeTags={tags => {
            setPhrase(tags);
          }}
          onTagPress={(index, tagLabel, event, deleted) =>
            console.log(
              index,
              tagLabel,
              event,
              deleted ? 'deleted' : 'not deleted',
            )
          }
          containerStyle={{justifyContent: 'center'}}
          inputStyle={{
            backgroundColor: '#232732',
            color: 'white',
            fontFamily: typography.medium,
          }}
          renderTag={({tag, index, onPress, deleteTagOnPress, readonly}) => (
            <TouchableOpacity
              key={`${tag}-${index}`}
              onPress={onPress}
              style={{
                borderColor: 'white',
                borderRadius: 10,
                borderWidth: 1,
                padding: 5,
                marginHorizontal: 5,
              }}>
              <Text style={{fontFamily: typography.medium}}>
                {' '}
                {index + 1}.{' '}
                {
                  <Text style={{fontFamily: typography.medium, color: 'white'}}>
                    {tag.toLowerCase()}
                  </Text>
                }
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{alignItems: 'center'}}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <GradientButton
            text={'Confirm'}
            onPress={() => {
              fetchPrivateKey();
            }}
            colors={['#FF8DF4', '#89007C']}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default RestoreFromSeedPhrase;
