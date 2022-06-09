import React from 'react';
import { View, Text, ScrollView, Image, ToastAndroid, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { themeColor } from '../../common/theme';
import { typography } from '../../common/typography';
import Header from '../../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeFive from 'react-native-vector-icons/FontAwesome5'
import ProfileButton from '../../components/ProfileButton';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


//import ProfileIcons from '../../../assets/svg/ProfileIcons.svg';

const Settings = ({ navigation }) => {

  const navigations = useNavigation();
  const logOut = async () => {
    await GoogleSignin.signOut();
    const keys = await AsyncStorage.getAllKeys()
    await AsyncStorage.multiRemove(keys).then(() => {
      navigations.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      });
    })
  }

  const onLogoutPressed = () => {
    Alert.alert(
      'Are you sure, you want to logout? ',
      'You can access your account by importing from device',
      [
        {
          text: 'Logout',
          onPress: () => logOut(),
          style: 'cancel',
        },

      ]
    );
  }

  const comingSoon = () => {
    return ToastAndroid.showWithGravityAndOffset(
      'Feature Coming Soon',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: themeColor.primaryBlack, padding: 20 }}>
      <Header navigation={navigation} /><LinearGradient
        style={{
          width: '94%',
          paddingVertical: 5,
          paddingHorizontal: 20,
          alignSelf: 'center',
          borderRadius: 20,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={[
          '#FF84F3',
          'rgba(249,97,243,0.61)',
          'rgba(98,61,159,0.84)',
          'rgba(69,61,159,0.58)',
        ]}>
        <View>
          <Text
            style={{
              fontFamily: typography.regular,
              fontSize: 10,
              color: 'white',
            }}>
            Current Wallet
          </Text>
          <Text
            style={{
              fontFamily: typography.medium,
              fontSize: 14,
              color: 'white',
            }}>
            Komet Wallet
          </Text>
        </View>
        <Image source={require('../../../assets/images/ProfileImage.png')} style={{ height: 60, width: 60 }} />
      </LinearGradient>
      <ProfileButton subTitle={'Dark'} icon={<FontAwesomeFive name={'moon'} color={'white'} size={20} />} leftIcon={false} title={'Theme'} margin={true} onPress={() => comingSoon()} />
      <View style={{ height: 25 }}></View>
      <View style={{ backgroundColor: '#232732', borderRadius: 10 }}>
        <ProfileButton icon={<Feather name={'users'} color={'white'} size={20} />} leftIcon={true} title={'Contacts'} margin={false} onPress={() => navigation.navigate('Contacts')} />
        <ProfileButton icon={<MaterialCommunityIcons name={'purse'} color={'white'} size={20} />} leftIcon={true} title={'Wallet Management'} margin={false} onPress={() => comingSoon()} />
        <ProfileButton icon={<MaterialCommunityIcons name={'lock'} color={'white'} size={20} />} leftIcon={true} title={'Lock'} margin={false} onPress={() => comingSoon()} />
        <ProfileButton icon={<FontAwesomeFive name={'globe-asia'} color={'white'} size={20} />} leftIcon={true} title={'Network'} subTitle={"Polygon"} margin={false} onPress={() => comingSoon()} />
        <ProfileButton icon={<MaterialCommunityIcons name={'account-check'} color={'white'} size={20} />} leftIcon={true} title={'Approval Request'} margin={false} onPress={() => comingSoon()} />
        <ProfileButton icon={<MaterialIcons name={'notifications'} color={'white'} size={20} />} leftIcon={true} title={'Push Notification'} margin={false} onPress={() => comingSoon()} />
        <ProfileButton icon={<MaterialCommunityIcons name={'note-text'} color={'white'} size={20} />} leftIcon={true} title={'View Seed Phrase'} margin={false} onPress={() => navigation.navigate('ViewSeedPhrase')} />
      </View>
      <View style={{ height: 25 }}></View>
      <View style={{ backgroundColor: '#232732', borderRadius: 10 }}>
        <ProfileButton icon={<MaterialCommunityIcons name={'share-variant'} color={'white'} size={20} />} leftIcon={true} title={'Share KometWallet'} margin={false} />
        <ProfileButton icon={<MaterialCommunityIcons name={'twitter'} color={'white'} size={20} />} leftIcon={true} title={'Follow us on Twitter'} margin={false} />
        <ProfileButton icon={<MaterialCommunityIcons name={'discord'} color={'white'} size={20} />} leftIcon={true} title={'Join our Discord'} margin={false} />
        <ProfileButton icon={<MaterialCommunityIcons name={'star'} color={'white'} size={20} />} leftIcon={true} title={'Rate us'} margin={false} />
        <ProfileButton icon={<MaterialIcons name={'support-agent'} color={'white'} size={20} />} leftIcon={true} title={'Feedback and Support'} margin={false} />

      </View>
      <ProfileButton subTitle={''} leftIcon={false} title={'Logout'} margin={true} onPress={() => onLogoutPressed()} />
      <View style={{ height: 50 }}></View>
    </ScrollView>
  );
};

export default Settings;