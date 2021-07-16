import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, ScrollView} from 'react-native';
import { Appbar, Card, Title, Paragraph, IconButton, Provider, Menu, Button,
        Colors, Divider, Subheading, Caption, Snackbar } from 'react-native-paper';
import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob';
import Constants from "expo-constants"
import axios from 'axios';
import * as MediaLibrary from "expo-media-library"
import * as FileSystem from "expo-file-system"
// Banner: ca-app-pub-5603368600392159/4958877436

const WaifuDetails = ({navigation, userData, route}) => {
    const [visible, setVisible] = useState(false)
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [isLiked, setIsLiked] = useState(false)

    const openMenu = () => setVisible(true)
    const closeMenu = () => setVisible(false)
    const openSnackbar = () => setSnackbarVisible(true)
    const closeSnackbar = () => setSnackbarVisible(false)
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'

    useEffect(() => {
        console.log("Waifu Details Mounted")
        setTestDeviceIDAsync("EMULATOR");
        axios.get("http://192.168.1.199:3000/liked-waifus", {
            params: {username: userData.username}
        })
        .then((likedWaifus)=>{
            if (likedWaifus.data.includes(route.params.waifu._id)){
                setIsLiked(true)
            }
        })
        return ()=> {console.log('Waifu Details Unmounted')}
    }, [])


    const downloadImage = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync()    
        if (status !== "granted") {
            alert('Gallary Access needed to Upload Image');
        } else {
            //store the cached file
            const file = await FileSystem.downloadAsync(
                route.params.waifu.image,
                FileSystem.documentDirectory + route.params.waifu.name +".jpg"
            );
            
            //save the image in the galery using the link of the cached file
            await MediaLibrary.createAssetAsync(file.uri)
            .then(()=>{
                closeMenu()
                openSnackbar()
            })
        }
    }

    const likeWaifu = () => {
        axios({
            method: "post",
            data: {
              username: userData.username,
              waifu: route.params.waifu._id
            },
            url: "http://192.168.1.199:3000/like-waifu"
        })
        .then(() => {
            axios({
                method: "post",
                data: {
                  waifu: route.params.waifu._id
                },
                url: "http://192.168.1.199:3000/inc-likes"
            })
            .then(() => {
                setIsLiked(!isLiked)
            })
        })
    }

    const unlikeWaifu = () => {
        axios({
            method: "post",
            data: {
              username: userData.username,
              waifu: route.params.waifu._id
            },
            url: "http://192.168.1.199:3000/unlike-waifu"
        })
        .then(() => {
            axios({
                method: "post",
                data: {
                  waifu: route.params.waifu._id
                },
                url: "http://192.168.1.199:3000/dec-likes"
            })
            .then(() => {
                setIsLiked(!isLiked)
            })
        })
    }

    const renderDeleteWaifu = () => {
        if (route.params.waifu.owner == userData.username){
            return (
                <Menu.Item onPress={() => {navigation.goBack()}} title="Delete Waifu" />
            )
        }
    } 

    return (
        <Provider>
        <View style={{flex: 1}}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={{ x: Dimensions.get('window').width, y: 70 }}>
                <Menu.Item onPress={downloadImage} title="Download Image" />
                <Menu.Item onPress={() => {}} title="Report" />
                {renderDeleteWaifu()}
            </Menu>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="keyboard-backspace" onPress={() => navigation.goBack()} />
                <Appbar.Content titleStyle={styles.appHeader} title={route.params.waifu.name}/>
                <Appbar.Action icon={MORE_ICON} onPress={openMenu} />
            </Appbar>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView>
                    <Card style={{marginTop: 5}}>
                        <Card.Cover style={styles.image} source={{ uri: route.params.waifu.image }} />
                        
                        <Card.Content>
                            <Title>
                                Series: <Text style={{fontSize: 20, fontWeight: "bold"}}>{route.params.waifu.series ? route.params.waifu.series : "None"}</Text>
                            </Title>
                            <Subheading>
                                <Title>Gender: </Title>{route.params.waifu.gender ? route.params.waifu.gender : "Unknown"}
                            </Subheading>
                            <Divider/>
                            <Paragraph>
                                Description:
                            </Paragraph>
                            <Paragraph>
                                {route.params.waifu.description}
                            </Paragraph>
                            <View></View>
                            <Divider/>
                        </Card.Content>
                        
                        <Card.Actions>
                            {/* <Button>Cancel</Button> */}
                            <IconButton
                                icon= {isLiked ? "heart" : "heart-outline"}
                                color={Colors.red500}
                                size={20}
                                onPress={() => {
                                    if (isLiked){
                                        unlikeWaifu()
                                    } else {
                                        likeWaifu()
                                    }
                                    
                                }}
                            />
                            <Caption>
                                <Text>Uploader:  </Text>
                                <Text style={styles.hyperText}
                                onPress={
                                    () => {navigation.navigate('Profile', {user: route.params.waifu.owner})} 
                                }>
                                    {route.params.waifu.owner}
                                </Text>
                            </Caption>
                        </Card.Actions>
                    </Card>
                </ScrollView>
            </SafeAreaView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={closeSnackbar}
                action={{
                label: 'Dismiss',
                onPress: () => {
                    closeSnackbar()
                },
                }}>
                Image Successfully Downloaded
            </Snackbar>
            <AdMobBanner
                bannerSize="smartBanner"
                adUnitID="ca-app-pub-5603368600392159/4958877436"
                servePersonalizedAds={false}
                onDidFailToReceiveAdWithError={(e) => console.log(e)}
            />
        </View> 
        </Provider>
    )
}
const styles = StyleSheet.create({
    image:{
        width: Dimensions.get('window').width,
        height: 400
    },
    appbar: {
        marginTop: Constants.statusBarHeight,
    },
    appHeader:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginLeft: -15
    },
    hyperText: {
        color:"#0645AD"
    }
})
export default WaifuDetails