import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, TextInput, Button, Avatar} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { readAsStringAsync } from 'expo-file-system';
import Constants from "expo-constants"
import axios from 'axios'
import ErrorMessage from '../components/ErrorMessage';
import { DevState } from '../constants';
const EditProfile = ({navigation, userData, route}) => {
    const [dataUri, setDataUri] = useState(null)
    const [image, setImage] = useState(null)
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")
    useFocusEffect(
        useCallback(() => {
            console.log("Edit Profile Mounted")
            
            setDescription(route.params.userInfo.about)

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
            url: DevState + "upload-profile-picture"
        })
        .then(() => {
            changeUserAbout()
            .then(() => navigation.goBack())
            
        })
        .catch((err) => {
            console.log(err)
            setError(err.response.data.message)
        })
    }

    const changeUserAbout = () =>{
        return axios({
            method: "post",
            data: {
                about: description,
                user: userData.username
            },
            withCredentials: true,
            url: DevState + "update-user-about"
        })
    }

    const onSaveHandler = () => {
        if (image){
            uploadProfileImage()  
        } else {
            changeUserAbout()
            .then(() => navigation.goBack())
        }
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
            <ErrorMessage error={error}/>
            <Button icon="apple-keyboard-shift" mode="contained" onPress={onSaveHandler} style={styles.button}> Save </Button>
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