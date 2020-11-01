/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native';
import MapPage from './components/MapPage';
import LoginView from './components/LoginView';
import AsyncStorage from '@react-native-community/async-storage';
const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      User: {},
      loggedIn: false,
    };
    this.checkIfUserExists();
  }
  checkIfUserExists = async () => {
    try {
      const user = await AsyncStorage.getItem('LocalUser');
      if (user !== null) {
        console.log('YOOOOOO');
        const loggedUser = JSON.parse(user);
        this.setState({User: loggedUser, loggedIn: true});
      } else {
        console.log('NNNNNNNNOOOOOO');
      }
    } catch (error) {
      console.error(error);
    }
  };
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {this.state.loggedIn ? (
            <Stack.Screen
              options={{headerShown: false}}
              initialParams={{User: {name: 'James'}}}
              name="MapView"
              component={MapPage}
            />
          ) : (
            <Stack.Screen
              options={{headerShown: false}}
              name="LoginView"
              component={LoginView}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
