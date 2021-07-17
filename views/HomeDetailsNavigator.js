import React, {useState, useEffect} from 'react';
import HomeContent from './HomeContent';
import WaifuDetails from './WaifuDetails';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from './UserProfile';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const Stack = createStackNavigator()

const HomeDetailsNavigator = ({userData}) => {
    if(userData) {
        return (
            <Stack.Navigator initialRouteName="HomeContent">
                <Stack.Screen options={{headerShown: false}} name="HomeContent">
                    {props => (<HomeContent {...props} userData={userData}/>)}
                </Stack.Screen>
                <Stack.Screen options={{headerShown: false}} name="Details">
                    {props => (<WaifuDetails {...props} userData={userData}/>)}
                </Stack.Screen>
                <Stack.Screen options={{headerShown: false}} name="Profile">
                    {props => (<UserProfile {...props} userData={userData}/>)}
                </Stack.Screen>
            </Stack.Navigator>
        )
    } else {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={100} color="#8F00FF" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center"
    }
});

export default HomeDetailsNavigator