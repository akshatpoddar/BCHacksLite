import React, {Component} from 'react';
import {StyleSheet, View, PermissionsAndroid} from 'react-native';
import Constants from 'expo-constants';
import MapboxGL from '@react-native-mapbox-gl/maps';
import * as Location from 'expo-location';
import {FloatingAction} from 'react-native-floating-action';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiampraXZhaSIsImEiOiJja2d5NHI1bzcwcWU3MnJwZnNpM2VvcXY0In0.Cr_LBZeWzOy_vWr1r4wE0g',
);

let location = null;
let latitude = 0;
let longitude = 0;
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
      location = await Location.getCurrentPositionAsync({});
      longitude = location.coords.longitude;
      latitude = location.coords.latitude;
      //console.log(location);
      console.log(`${longitude}, ${latitude}`);
    } else {
      console.log('Not today data hacker');
    }
  } catch (err) {
    console.log(err);
  }
};

export default class MapPage2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longitude: 0,
      latitude: 0,
    };
  }
  componentDidMount() {
    requestLocation();
    this.setState({
      latitude: latitude,
      longitude: longitude,
    });
    MapboxGL.setTelemetryEnabled(false);
  }

  render() {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.UserLocation visible={true} />
            <MapboxGL.Camera followUserLocation zoomLevel={0} />
          </MapboxGL.MapView>
        </View>
        <FloatingAction
          actions={actions}
          onPressItem={(name) => console.log(`selected ${name}`)}
        />
      </View>
    );
  }
}
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
const actions = [
  {
    text: 'Scan QR Code',
    icon: require('./images/QR_ICON.png'),
    name: 'QR_READ',
    position: 1,
  },
  {
    text: 'Center Me',
    icon: require('./images/CENTER_ME.png'),
    name: 'CENTER',
    position: 2,
  },
  {
    text: 'TrickOTreat Mode',
    icon: require('./images/PUMPKIN.png'),
    name: 'TRICK_OR_TREAT',
    position: 3,
  },
];
