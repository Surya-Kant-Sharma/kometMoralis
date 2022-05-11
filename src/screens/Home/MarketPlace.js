import React, {useEffect, useState} from 'react';
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

import {themeColor} from '../../common/theme';
import {typography} from '../../common/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const {width, height} = Dimensions.get('screen');
const MarketPlace = ({navigation}) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchCollections = async () => {
    setLoading(true);
    // await axios
    //   .get('https://api.opensea.io/api/v1/collections?offset=0&limit=300')
    //   .then(res => {
    //     setCollections(res.data.collections.filter(a => a.image_url != null));
    //     setLoading(false);
    //   })
    //   .catch(error => {
    //     setLoading(false);
    //     console.log(error);
    //   });
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.textInputContainer}>
          <MaterialIcons name={'search'} size={24} color={'white'} />
          <TextInput placeholder={'Search'} style={{height: 40}} />
        </View>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Explore</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size={32} style={{margin: 20}} color={'pink'} />
      ) : (
        <FlatList
          data={collections}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          style={{alignSelf: 'center'}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('NFTPage', {item: item})}
              style={styles.cardContainer}>
              <Image source={{uri: item.image_url}} style={styles.image} />
              <Text style={styles.imageText}>{item.slug}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default MarketPlace;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: themeColor.primaryBlack},
  searchBarContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    margin: 10,
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
  cardContainer: {height: width * 0.5, width: width * 0.4, margin: 10},
  image: {
    height: width * 0.4,
    width: width * 0.4,
    borderRadius: 20,
  },
  imageText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontFamily: typography.medium,
  },
});
