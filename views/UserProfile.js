import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import Constants from "expo-constants"
// TODO: Fetch 'currentUser' Data on mount
// Display user data
// Update user model to have likes, follows, etc

const UserProfile = ({navigation, userData, currentUser}) => {
    return(
        <View style={{flex: 1}}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content titleStyle={styles.appHeader} title={currentUser + "'s Profile"}/>
            </Appbar>
        </View>
    )
}

const styles = StyleSheet.create({
    appbar: {
        marginTop: Constants.statusBarHeight
    },
    // appHeader:{
    //     fontSize: 20,
    //     fontWeight: "bold",
    //     color: "#FFFFFF"
    // },
    // input: {
    //     marginTop: 10,
    //     backgroundColor: 'rgba(0, 0, 0, 0.0)'
    // },
    // button: {
    //     margin: 20
    // }
})

export default UserProfile