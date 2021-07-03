import React from 'react';
import WaifuDetails from './WaifuDetails';
import AllWaifuContent from './AllWaifuContent';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

const AllWaifuDetailsNavigator = ({userData}) => {
    return (
        <Stack.Navigator initialRouteName="AllContent">
            <Stack.Screen options={{headerShown: false}} name="AllContent">
                {props => (<AllWaifuContent {...props} userData={userData}/>)}
            </Stack.Screen>
            <Stack.Screen options={{headerShown: false}} name="Details">
                {props => (<WaifuDetails {...props} userData={userData}/>)}
            </Stack.Screen>
        </Stack.Navigator>
    )
}

export default AllWaifuDetailsNavigator