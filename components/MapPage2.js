import React, {Component} from 'react';
import {StyleSheet, View, PermissionsAndroid} from 'react-native';
import Constants from 'expo-constants';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiampraXZhaSIsImEiOiJja2d5NHI1bzcwcWU3MnJwZnNpM2VvcXY0In0.Cr_LBZeWzOy_vWr1r4wE0g',
);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'tomato',
  },
  map: {
    flex: 1,
  },
});
const requestLocation = async () => {
  try {
    const confirmed = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'We would like your location',
        message: 'To view cool haunted houses, we need your location',
        buttonNeutral: 'Not today',
        buttonPositive: "Let's Party!!",
        buttonNegative: 'Never :(',
      },
    );
    if (confirmed == PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can get location');
    } else {
      console.log('Not today data hacker');
    }
  } catch (err) {
    console.log(err);
  }
};

export default class MapPage2 extends Component {
  componentDidMount() {
    requestLocation();
    MapboxGL.setTelemetryEnabled(false);
  }

  render() {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map} />
          <MapboxGL.UserLocation />
        </View>
      </View>
    );
  }
}
