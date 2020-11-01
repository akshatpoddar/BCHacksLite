import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Linking,
} from 'react-native';

export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      name: '',
      password: '',
      email: '',
      emailInvalid: false,
      nameInvalid: false,
      passInvalid: false,
    };
  }
  signUpHandlePress = () => {
    const URL = 'https://ourwebsiteurl.com/signup/';
    Linking.canOpenURL(URL).then((supported) => {
      if (supported) {
        Linking.openURL(URL);
      } else {
        console.log('IMPOSSIBLE');
      }
    });
  };
  onPressHandle = async () => {
    const email = this.state.email;
    const name = this.state.name;
    const pass = this.state.password;
    let error = false;
    const mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(mailformat)) {
      console.log('valid');
    } else {
      this.setState({emailInvalid: true});
      error = true;
    }
    if (name.length < 2) {
      this.setState({nameInvalid: true});
      error = true;
    }
    //ifpassword checker
    //axios check password
    //error = true;

    if (!error) {
      const navigation = this.props.navigation;
      const User = {email: this.state.email, name: this.state.name};
      try {
        await AsyncStorage.setItem('LocalUser', JSON.stringify({User: User}));
      } catch (error) {
        console.error(error);
      }
      navigation.navigate('MapView', {User: User});
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            source={require('./images/LOGO.png')}
            style={{width: 200, height: 200}}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Character Name"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => this.setState({name: text})}
          />
        </View>
        {this.state.nameInvalid ? (
          <View style={styles.invalidView}>
            <Text style={styles.invalidInput}>Invalid Name</Text>
          </View>
        ) : null}
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            onChangeText={(text) =>
              this.setState({email: text, emailInvalid: false})
            }
          />
        </View>
        {this.state.emailInvalid ? (
          <View style={styles.invalidView}>
            <Text style={styles.invalidInput}>Invalid Email</Text>
          </View>
        ) : null}

        <View style={styles.inputView}>
          <TextInput
            secureTextEntry={true}
            style={styles.inputText}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => this.setState({password: text})}
          />
        </View>
        {this.state.passInvalid ? (
          <View style={styles.invalidView}>
            <Text style={styles.invalidInput}>Invalid Password</Text>
          </View>
        ) : null}
        <TouchableOpacity style={styles.loginBtn} onPress={this.onPressHandle}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.signUpHandlePress}>
          <Text style={{color: 'white'}}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#ffb103e1',
    borderRadius: 25,
    height: 50,
    marginBottom: 5,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
    marginTop: 0,
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },

  loginBtn: {
    width: '80%',
    backgroundColor: '#ff7f00',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  invalidView: {
    justifyContent: 'center',
  },
  invalidInput: {
    color: 'red',
    fontSize: 12,
  },
});
