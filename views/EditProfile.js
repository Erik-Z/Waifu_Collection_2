import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, TextInput, Button, Avatar} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { readAsStringAsync } from 'expo-file-system';
import Constants from "expo-constants"
import axios from 'axios'

const EditProfile = ({navigation, userData}) => {
    const [dataUri, setDataUri] = useState(null)
    const [image, setImage] = useState(null)
    const [description, setDescription] = useState("")
    useFocusEffect(
        useCallback(() => {
            console.log("Edit Profile Mounted")
           
            return () => {
                console.log("Edit Profile UnMounted")
            }
        }, [])
    )

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
        if (!result.cancelled) {
            const uri = result.uri
            const format = uri.split(".").pop()
            const dataUri = await readAsStringAsync(uri, { encoding: 'base64' })
            setDataUri(dataUri)
            setImage("data:image/" + format + ";base64," + dataUri)
        }
    }

    const uploadProfileImage = () => {
        axios({
            method: "post",
            data: {
              image: dataUri,
              user: userData.username
            },
            withCredentials: true,
            url: "http://192.168.1.199:3000/upload-profile-picture"
        })
        .then(() => {
            navigation.goBack()
        })
    }

    return(
        <View style={{flex: 1}}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="arrow-left" onPress={() => navigation.goBack()} />
                <Appbar.Content titleStyle={styles.appHeader} title={"Edit Profile"}/>
            </Appbar>
            <TextInput placeholder='About' onChangeText={setDescription} maxLength = {200}
            value={description} style={styles.input} multiline={true} numberOfLines={4}/>
            <Button onPress={pickImage}> Change Profile Image </Button>
            {image && <Avatar.Image size={200} style={styles.profileImage} source={{ uri: image }}/>}
            <Button icon="apple-keyboard-shift" mode="contained" onPress={uploadProfileImage} style={styles.button}> Save </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    appbar: {
        marginTop: Constants.statusBarHeight
    },
    input: {
        marginTop: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.0)'
    },
    profileImage: {
        marginTop: 20,
        alignSelf: "center"
    },
    button: {
        margin: 20,
    }
})

export default EditProfile