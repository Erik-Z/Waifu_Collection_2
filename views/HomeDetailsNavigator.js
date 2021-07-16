import React, {useState, useEffect} from 'react';
import HomeContent from './HomeContent';
import WaifuDetails from './WaifuDetails';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from './UserProfile';
import {Text} from 'react-native';

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
        return <Text> Loadin' </Text>
    }
}

export default HomeDetailsNavigator