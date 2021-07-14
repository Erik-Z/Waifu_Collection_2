import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Appbar, TextInput, Button, Avatar } from 'react-native-paper';
import { Col, Row, Grid } from "react-native-paper-grid";
import Constants from "expo-constants"
import axios from 'axios'
// TODO: Fetch 'currentUser' Data on mount
// Display user data

const UserProfile = ({navigation, userData, currentUser}) => {
    const [currentUserData, setcurrentUserData] = useState(null)
    useEffect(() => {
        axios.get("http://192.168.1.199:3000/get-user", {
            params: {username: currentUser}
        })
        .then(res => {
          if (!res.data){
            console.log("Something fucked up. Not suppose to show")
          } else {
            setcurrentUserData(res.data)
            console.log(res.data)
          }
        })
        .catch(err => console.log(err))
    }, [])

    return(
        <View style={{flex: 1}}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content titleStyle={styles.appHeader} title={currentUser + "'s Profile"}/>
            </Appbar>
            <Avatar.Image size={200} style={styles.profileImage} source={{ uri: currentUserData ? currentUserData.profileImage : "" }}/>
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