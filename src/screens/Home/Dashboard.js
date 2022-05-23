import React from 'react';
import {View, Text, Image, StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import MarketPlace from './MarketPlace';
import Profile from './Profile';
import {themeColor} from '../../common/theme';
import AntDesign from 'react-native-vector-icons/AntDesign'
const Tab = createBottomTabNavigator();
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeFive  from 'react-native-vector-icons/FontAwesome5';

const Dashboard = () => {
  return (
    <>
    <StatusBar backgroundColor={themeColor.primaryBlack}/>
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
            focused? (
              <View style={{ borderTopWidth:3, width: "100%", height: "100%", borderColor: 'white',alignItems:'center',justifyContent:'center',marginHorizontal:20 }}>
                  <AntDesign name={'home'} color={focused?'white':'#D3D3D3'} size={size}/>
              </View>) :
              (
                <AntDesign name={'home'} color={'#D3D3D3'} size={size}/>
              )
              
          }}
        />
        <Tab.Screen
          name="Marketplace"
          component={MarketPlace}
          options={{
            tabBarIcon: ({color, size, focused}) =>
            
            focused? (
              <View style={{ borderTopWidth:3, width: "100%", height: "100%", borderColor: 'white',alignItems:'center',justifyContent:'center',marginHorizontal:20 }}>
                   <MaterialIcon name={'storefront'} color={'white'} size={size}/>
              </View>) :
              (
                <MaterialIcon name={'storefront'} color={'#D3D3D3'} size={size}/>
              )
           
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({color, size, focused}) =>
            focused? (
              <View style={{ borderTopWidth:3, width: "100%", height: "100%", borderColor: 'white',alignItems:'center',justifyContent:'center',marginHorizontal:20 }}>
                    <AntDesign name={'user'} color={'white'} size={size}/>
              </View>) :
              (
                <AntDesign name={'user'} color={'#D3D3D3'} size={size}/>
              )
           
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default Dashboard;