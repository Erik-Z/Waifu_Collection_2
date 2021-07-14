import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Appbar, TextInput, Button, Avatar } from 'react-native-paper';
import { Col, Row, Grid } from "react-native-paper-grid";
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
            <Avatar.Image size={200} style={styles.profileImage} source={{ uri: "https://mydesktopwalls.com/wp-content/uploads/2020/09/Anime-Wallpaper.jpg" }}/>
            <Grid>
                <Row>
                    <Col><Text style={styles.profileImage}>Followers: </Text></Col>
                    <Col><Text style={styles.profileImage}>Liked Waifus: </Text></Col>
                </Row>
            </Grid>
        </View>
    )
}

const styles = StyleSheet.create({
    appbar: {
        marginTop: Constants.statusBarHeight
    },
    profileImage: {
        marginTop: 20,
        alignSelf: "center"
    },
    profileText: {
        fontSize: 20,
        textAlign: 'center'
    }
})

export default UserProfile