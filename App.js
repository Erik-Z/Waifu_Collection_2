import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginView from './views/login'
import RegisterView from './views/register'
import Home from './views/Home'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

export default function App() {
  return (
      <NavigationContainer id="App" styles={styles.container}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Register" component={RegisterView} />
          <Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
          <Stack.Screen name="Login" component={LoginView} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
