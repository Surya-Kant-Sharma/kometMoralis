import React, {useState} from 'react';
import {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  Touchable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import BorderButton from '../../components/BorderButton';
import GradientButton from '../../components/GradientButton';
import AddWallet from '../../../assets/svg/AddWallet.svg';

const ImportWallet = ({navigation}) => {
  const {height, width} = Dimensions.get('screen');
  const [currentIndex, setCurrentIndex] = useState([0]);
  const onBoardingData = [
    {
      id: 0,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Laoreet ut dui imperdiet.',
      image: require('../../../assets/images/OnBoarding1.png'),
    },
    {
      id: 1,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Laoreet ut dui imperdiet.',
      image: require('../../../assets/images/OnBoarding2.png'),
    },
    {
      id: 2,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Laoreet ut dui imperdiet.',
      image: require('../../../assets/images/OnBoarding3.png'),
    },
    {
      id: 3,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Laoreet ut dui imperdiet.',
      image: require('../../../assets/images/OnBoarding4.png'),
    },
  ];

  return (
    <View
      style={{
        backgroundColor: themeColor.primaryBlack,
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <View
        style={{
          paddingHorizontal: 20,
          width: width,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AddWallet />
        <Text
          style={{
            color: 'rgba(255,255,255,1)',
            fontFamily: typography.semiBold,
            fontSize: 24,
            textAlign: 'center',
          }}>
          {'Import your wallet'}
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

      <View>
        <GradientButton
          text={'Restore with Secret Phrase'}
          colors={['#FF8DF4', '#89007C']}
          onPress={() => {
            navigation.navigate('RestoreFromPhrase');
          }}
        />
        <BorderButton
          borderColor={'#FF8DF4'}
          text={'Restore from Device'}
          onPress={() => {
            navigation.navigate('RestoreFromDevice');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ImportWallet;
