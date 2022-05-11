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

const OnboardingScreen = ({navigation}) => {
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
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.floor(
            Math.floor(event.nativeEvent.contentOffset.x) /
              Math.floor(event.nativeEvent.layoutMeasurement.width),
          );
          setCurrentIndex(index);
          // work with: index
        }}
        data={onBoardingData}
        pagingEnabled
        renderItem={({item}) => (
          <View
            style={{
              paddingHorizontal: 20,
              width: width,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={item.image} />
            <Text
              style={{
                color: 'rgba(255,255,255,0.82)',
                fontFamily: typography.medium,
                fontSize: 18,
                textAlign: 'center',
              }}>
              {item.text}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => {
          index.toString();
        }}
      />
      <View style={{width: width, alignItems: 'center'}}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={[0, 1, 2, 3]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={{
                margin: 10,
                height: 9,
                width: 9,
                borderRadius: 9,
                backgroundColor: item == currentIndex ? '#C74ABB' : '#C4C4C4',
              }}></View>
          )}
        />
      </View>
      <View>
        <GradientButton
          text={'Create a new Wallet'}
          colors={['#FF8DF4', '#89007C']}
          onPress={() => {
            navigation.navigate('SelectUsername');
          }}
        />
        <BorderButton
          borderColor={'#FF8DF4'}
          text={'I already have one'}
          onPress={() => {
            navigation.navigate('ImportWallet');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default OnboardingScreen;
