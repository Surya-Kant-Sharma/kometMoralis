import React from 'react';
import {View, Text, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeIcon from '../../../assets/svg/HomeIcon.svg';
import MarketPlaceIcon from '../../../assets/svg/MarketPlaceIcon.svg';
import ProfileIcon from '../../../assets/svg/ProfileIcon.svg';
import HomeIconSelected from '../../../assets/svg/HomeIconSelected.svg';
import MarketPlaceIconSelected from '../../../assets/svg/MarketPlaceIconSelected.svg';
import ProfileIconSelected from '../../../assets/svg/ProfileIconSelected.svg';
import Home from './Home';
import MarketPlace from './MarketPlace';
import Profile from './Profile';
import {themeColor} from '../../common/theme';
const Tab = createBottomTabNavigator();
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const Dashboard = () => {
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarShowLabel: false,

          tabBarStyle: {
            height: 60,
            paddingHorizontal: 5,
            paddingTop: 0,
            backgroundColor: themeColor.tabBarBackground,
          },

          headerShown: false,
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({color, size, focused}) =>
              <MaterialIcon name={'highlight'}/>
          }}
        />
        <Tab.Screen
          name="Marketplace"
          component={MarketPlace}
          options={{
            tabBarIcon: ({color, size, focused}) =>
            <MaterialIcon name={'highlight'}/>
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({color, size, focused}) =>
            <MaterialIcon name={'highlight'}/>
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default Dashboard;
