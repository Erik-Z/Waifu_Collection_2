import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, TextInput, Avatar, Menu, Provider } from 'react-native-paper';
import { Col, Row, Grid } from "react-native-paper-grid";
import Constants from "expo-constants"
import axios from 'axios'
// TODO: Display user data

const UserProfile = ({navigation, userData, currentUser, route}) => {
    const [currentUserData, setcurrentUserData] = useState(null)
    const [followed, setFollowed] = useState(false)
    const [visible, setVisible] = useState(false)

    const openMenu = () => setVisible(true)
    const closeMenu = () => setVisible(false)
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'

    if (route.params){
        currentUser = route.params.user
    }
    useFocusEffect(
        useCallback(() => {
            console.log("User Profile Mounted")
            axios.get("http://192.168.1.199:3000/get-user", {
                params: {username: currentUser}
            })
            .then(res => {
                if (!res.data){
                    console.log("Not suppose to show")
                } else {
                    setcurrentUserData(res.data)
                    // If this is not the profile of the current logged in user, get logged in user data.
                    if (route.params){
                        axios.get("http://192.168.1.199:3000/get-user", {
                            params: {username: userData.username}
                        })
                        .then(result => {
                            if (!result.data){
                                console.log("Not suppose to show")
                            } else {
                                if(result.data.followersList.includes(res.data.username)){
                                    setFollowed(true)
                                }
                            }
                        })
                        .catch(err => console.log(err))
                    }
                }
            })
            .catch(err => console.log(err))
            return () => {
                console.log("User Profile UnMounted")
            }
        }, [])
    )
    
    const followUser = () => {
        axios({
            method: "post",
            data: {
                user: currentUserData.username
            },
            withCredentials: true,
            url: "http://192.168.1.199:3000/follow-user"
        })
        .then(()=> {
            axios({
                method: "post",
                data: {
                    user: currentUserData.username
                },
                withCredentials: true,
                url: "http://192.168.1.199:3000/inc-followers"
            })
            .then(()=>{
                setFollowed(true)
                setcurrentUserData(oldState => ({...oldState, followers: oldState.followers + 1}))
                closeMenu()
            })
        })
    }

    const unfollowUser = () => {
        axios({
            method: "post",
            data: {
                user: currentUserData.username
            },
            withCredentials: true,
            url: "http://192.168.1.199:3000/unfollow-user"
        })
        .then(()=> {
            axios({
                method: "post",
                data: {
                    user: currentUserData.username
                },
                withCredentials: true,
                url: "http://192.168.1.199:3000/dec-followers"
            })
            .then(()=>{
                setFollowed(false)
                setcurrentUserData(oldState => ({...oldState, followers: oldState.followers - 1}))
                closeMenu()
            })
        })
    }

    const renderAppbarDrawer = () => {
        if(route.params) {
            return (
                <Appbar.Action icon="arrow-left" onPress={() => navigation.goBack()} />
            )
        } else {
            return (
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
            )
        }
    }

    const renderMenuOptions = () => {
        if(userData.username == currentUser) {
            return (
                <Menu.Item onPress={() => {
                    closeMenu()
                    navigation.navigate("EditProfile", {userInfo: currentUserData})
                }} title="Edit Profile" />
            )
        } else {
            if(followed){
                return (
                    <Menu.Item onPress={unfollowUser} title="UnFollow" />
                )
            } else {
                return (
                    <Menu.Item onPress={followUser} title="Follow" />
                )
            }
        }
    }

    return(
        <Provider>
        <View style={{flex: 1}}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={{ x: Dimensions.get('window').width, y: 70 }}>
                {renderMenuOptions()}
            </Menu>

            <Appbar style={styles.appbar}>
                {renderAppbarDrawer()}
                <Appbar.Content titleStyle={styles.appHeader} title={currentUser + "'s Profile"}/>
                <Appbar.Action icon={MORE_ICON} onPress={openMenu} />
            </Appbar>
            <Avatar.Image size={200} style={styles.profileImage} source={{ uri: currentUserData ? currentUserData.profileImage : "data:image/jpeg;base64,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" }}/>
            <Grid>
                <Row>
                    <Col>
                        <Text style={styles.profileText}>
                            <Text style={styles.profileText}>Followers:   </Text>
                            <Text>{currentUserData ? currentUserData.followers : 0}</Text>
                        </Text>
                    </Col>
                    <Col>
                        <Text style={styles.profileText}>
                            <Text>Liked Waifus:   </Text>
                            <Text style={styles.hyperText} onPress={()=>console.log('Navigate to liked waifus')}>{currentUserData ? currentUserData.likedWaifus.length : 0}</Text>
                        </Text>
                    </Col>
                </Row>
                <Row style={{marginTop: 20}}>
                    <Text>
                        <Text style={{fontWeight: "bold"}}>About: </Text>
                        <Text>{"\n"}{currentUserData ? currentUserData.about : ""}</Text>
                    </Text>
                </Row>
            </Grid>
        </View>
        </Provider>
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
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    hyperText: {
        color: "#0645AD"
    }
})

export default UserProfile