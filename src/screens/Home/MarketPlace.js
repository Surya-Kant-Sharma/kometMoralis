import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { themeColor } from '../../common/theme';
import { typography } from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
const { width, height } = Dimensions.get('screen');
const MarketPlace = ({ navigation }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchCollections();
    }, [])
  )


  const fetchCollections = async () => {
    setLoading(true);
    await axios
      .get('http://staging.komet.me/api/v1/market/v1/collections?pageNo=0&pageSize=50')
      .then(res => {
        console.log(res.data)
        setCollections(res.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.searchBarContainer}>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            backgroundColor: '#89007C',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialIcons name='menu' color={'white'} size={30} />
        </TouchableOpacity>
        {/* <MaterialIcons name={'search'} size={24} color={'white'} />
          <TextInput placeholder={'Search'} style={{height: 40}} /> */}
        <Text style={{ fontSize: 18, fontFamily: typography.medium, color: 'white' }}>DISCOVER</Text>

        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            backgroundColor: '#89007C',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <MaterialIcons name='menu' color={'white'} size={30}/> */}
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size={32} style={{ margin: 20 }} color={'pink'} />
      ) : (
        <FlatList
          data={collections}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          style={{ alignSelf: 'center' }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Collections', { item: item })}
              style={styles.cardContainer}>
              <Image source={{ uri: item.collectionImage }} style={styles.image} />
              
              <Text style={styles.imageText}>{item.collectionName}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default MarketPlace;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: themeColor.primaryBlack },
  searchBarContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center'
  },
  textInputContainer: {
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    width: width * 0.75,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cardContainer: { height: width * 0.5, width: width * 0.45, margin: 2 },
  image: {
    height: width * 0.45,
    width: width * 0.45,
    borderRadius: 5,
  },
  imageText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontFamily: typography.medium,
  },
});