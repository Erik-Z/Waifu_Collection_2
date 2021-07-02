import React, {useState, useEffect} from 'react';
import HomeContent from './HomeContent';
import WaifuDetails from './WaifuDetails';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

const HomeDetailsNavigator = ({userData}) => {
    return (
        <Stack.Navigator initialRouteName="HomeContent">
            <Stack.Screen options={{headerShown: false}} name="HomeContent">
                {props => (<HomeContent {...props} userData={userData}/>)}
            </Stack.Screen>
            <Stack.Screen name="Details">
                {props => (<WaifuDetails {...props} userData={userData}/>)}
            </Stack.Screen>
        </Stack.Navigator>
    )
}

export default HomeDetailsNavigator