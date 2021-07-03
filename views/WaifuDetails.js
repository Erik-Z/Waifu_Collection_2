import React, {useState} from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, ScrollView} from 'react-native';
import { Appbar, Card, Title, Paragraph, IconButton, Provider, Menu, Button,
        Colors, Divider, Subheading, Caption, Snackbar } from 'react-native-paper';
import Constants from "expo-constants"
import * as MediaLibrary from "expo-media-library"
import * as FileSystem from "expo-file-system"

const WaifuDetails = ({navigation, userData, route}) => {
    const [visible, setVisible] = useState(false)
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const openMenu = () => setVisible(true)
    const closeMenu = () => setVisible(false)
    const openSnackbar = () => setSnackbarVisible(true)
    const closeSnackbar = () => setSnackbarVisible(false)
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'
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
            // const assetLink = await MediaLibrary.createAssetAsync(file.uri);
            // console.log(file, assetLink);
            await MediaLibrary.createAssetAsync(file.uri)
            .then(()=>{
                closeMenu()
                openSnackbar()
            })
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
                                icon="heart-outline"
                                color={Colors.red500}
                                size={20}
                                onPress={() => console.log('Pressed')}
                            />
                            <Caption>
                                Uploader: {route.params.waifu.owner}
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
})
export default WaifuDetails