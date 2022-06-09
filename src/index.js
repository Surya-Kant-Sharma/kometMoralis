import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionSpecs,
  HeaderStyleInterpolators,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import SplashScreen from './screens/auth/SplashScreen';
import 'react-native-gesture-handler';
import OnboardingScreen from './screens/auth/OnboardingScreen';
import SelectUsername from './screens/auth/SelectUsername';
import FinalizeUserName from './screens/auth/FinalizeUsername';
import AuthenticateWallet from './screens/auth/AuthenticateWallet';
import Dashboard from './screens/Home/Dashboard';
import ChooseSeedPhrase from './screens/auth/ChooseSeedPhrase';
import ChooseSecurityPin from './screens/auth/ChooseSecurityPin';
import NFTPage from './screens/MarketPlace/NFTPage';
import ImportWallet from './screens/auth/ImportWallet';
import RestoreFromSeedPhrase from './screens/auth/RestoreFromSeedPhrase';
import Home from './screens/Home/Home';
import RestoreFromDevice from './screens/auth/RestoreFromDevice';
import Settings from './screens/Profile/Settings';
import SendToken from './screens/Home/SendToken';
import ReceiveToken from './screens/Home/ReceiveToken';
import SwapToken from './screens/Home/SwapToken';
import { getAccountsInfo, getDataLocally } from './Utils/AsyncStorage';
import Vault from './screens/Home/vault';
// import SendToken from './screens/Home/Send'
import SendScreen from './screens/Home/Send';
import SendTokenFinalize from './screens/Home/SendTokenFinalize';
import { Provider, useDispatch, useSelector } from 'react-redux';
import appStore from './store/store';
import Collections from './screens/MarketPlace/Collections';
import { Locations } from './Utils/StorageLocations';
import ViewSeedPhrase from './screens/Profile/ViewSeedPhrase';
import { loginUser } from './store/Actions/action';
import Drive from './screens/auth/Drive';
import RestoreFromDrive from './screens/auth/RestoreFromDrive';
import ContactBook from './screens/Settings/Contacts';

console.ignoredYellowBox = ['Setting a timer'];

const RootNavigation = () => {
  const Stack = createStackNavigator();
  const setLogin=(val)=>dispatch(loginUser(val))
  const loggedIn=useSelector((state)=>state.logIn)
  const dispatch=useDispatch();

  const [userInfo, setUserInfo] = React.useState(false);

  const userLogin = async () => {
    try {
      const data = await getDataLocally(Locations.ACCOUNTS) 
        setUserInfo(true);
        console.log(userInfo)
        setLogin(true)
      return data;
    } catch (err) {
      setLogin(true)
      console.log(err)
      alert(err.message)
      return undefined
    }
  }

  React.useEffect(()=>{
    userLogin()
    //console.log('Index',loggedIn)
  },[])
  

  // React.useState(() => userLogin(), [])

  return (
    
    <NavigationContainer>
        <Stack.Navigator
        initialRouteName={'Splash'}
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
          headerShown: false,
          animationEnabled: true
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
        <Stack.Screen name="SelectUsername" component={SelectUsername} />
        <Stack.Screen name="FinalizeUserName" component={FinalizeUserName} />
        <Stack.Screen name="ChooseSeedPhrase" component={ChooseSeedPhrase} />
        <Stack.Screen name="ImportWallet" component={ImportWallet} />
        <Stack.Screen
          name="AuthenticateWallet"
          component={AuthenticateWallet}
        />
        <Stack.Screen name="ChooseSecurityPin" component={ChooseSecurityPin} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="NFTPage" component={NFTPage} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Contacts" component={ContactBook} />
        <Stack.Screen name="Vault" component={Vault} />
        <Stack.Screen name="Send" component={SendScreen} />
        <Stack.Screen name="SendTokenFinalize" component={SendTokenFinalize} />
        <Stack.Screen name="Collections" component={Collections} />
        <Stack.Screen
          name="RestoreFromPhrase"
          component={RestoreFromSeedPhrase}
        />
                <Stack.Screen
          name="Drive"
          component={Drive}
        />
        <Stack.Screen name="RestoreFromDevice" component={RestoreFromDevice} />
        <Stack.Screen name="RestoreFromDrive" component={RestoreFromDrive} />
        <Stack.Screen name="SendToken" component={SendToken} />
        <Stack.Screen name="ReceiveToken" component={ReceiveToken} />
        <Stack.Screen name="SwapToken" component={SwapToken} />
        <Stack.Screen name="ViewSeedPhrase" component={ViewSeedPhrase} />
       
        </Stack.Navigator>
    </NavigationContainer>
    
  );
};

export default RootNavigation;
