import React, {Component} from 'react';
import {RNCamera} from 'react-native-camera';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Modal,
  Alert,
  Text,
  Image,
} from 'react-native';
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

export default class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longitude: 0,
      latitude: 0,
      modalVisible: false,
      cameraModal: false,
    };
  }
  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };
  setCameraModalVisible = (visible) => {
    this.setState({cameraModal: visible});
  };
  componentDidMount() {
    requestLocation();
    this.setState({
      latitude: latitude,
      longitude: longitude,
    });
    MapboxGL.setTelemetryEnabled(false);
  }
  handleFloatPressed(name) {
    if (name === 'TRICK_OR_TREAT') {
      this.setModalVisible(true);
    }
    if (name === 'QR_READ') {
      this.setCameraModalVisible(true);
    }

    console.log(name);
  }
  barcodeRecognized = ({barcodes}) => {
    barcodes.forEach((barcode) => console.warn(barcode.data));
  };

  render() {
    return (
      <View style={styles.page}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Get ready to RRUUMMBBLLEEE!!');
            this.setModalVisible(false);
          }}>
          <View style={styles.modalcontainer}>
            <View style={styles.ModalView}>
              <Image source={require('./images/BLOOD.png')} blurRadius={0.1} />
              <Text style={styles.modalText}>
                Look at the map for special locations marked red
              </Text>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.cameraModal}
          onRequestClose={() => {
            this.setCameraModalVisible(false);
          }}>
          <View style={styles.Cameracontainer}>
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={{
                flex: 1,
                width: '100%',
              }}
              onGoogleVisionBarcodesDetected={
                this.barcodeRecognized
              }></RNCamera>
          </View>
        </Modal>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.UserLocation visible={true} />
            <MapboxGL.Camera followUserLocation zoomLevel={0} />
          </MapboxGL.MapView>
        </View>
        <FloatingAction
          actions={actions}
          onPressItem={(name) => this.handleFloatPressed(name)}
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
  Cameracontainer: {
    height: '60%',
    top: '20%',
    width: '100%',
    backgroundColor: 'tomato',
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'tomato',
  },
  modalcontainer: {
    height: '20%',
    top: '40%',
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderColor: 'red',
    borderWidth: 2,
  },
  /*ModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'grey',
    top: '50%',
    height: 150,
    width: '90%',
  },*/
  map: {
    flex: 1,
  },

  modalText: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
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
