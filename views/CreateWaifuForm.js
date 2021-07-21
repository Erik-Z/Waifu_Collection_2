import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
    Image, Dimensions, SafeAreaView, ScrollView} from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import Constants from "expo-constants"
import * as ImagePicker from 'expo-image-picker';
import { readAsStringAsync } from 'expo-file-system';
import axios from 'axios';
import ErrorMessage from '../components/ErrorMessage';
import { CommonActions } from '@react-navigation/native';
import { DevState } from '../constants';

const CreateWaifuForm = ({navigation, userData}) => {
    const [name, setName] = useState("")
    const [series, setSeries] = useState("")
    const [description, setDescription] = useState("")
    const [gender, setGender] = useState("")
    const [dataUri, setDataUri] = useState(null)
    const [image, setImage] = useState(null)
    const [error, setError] = useState("")
    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Gallary Access needed to Upload Image');
            }
          }
        })()
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
            const uri = result.uri
            const format = uri.split(".").pop()
            const dataUri = await readAsStringAsync(uri, { encoding: 'base64' })
            setDataUri(dataUri)
            setImage("data:image/" + format + ";base64," + dataUri)
        }
    };
    /*
        Uploads Image to Imgur and Adds Waifu to MongoDB
    */
    const uploadWaifu = async () => {
        axios({
            method: "post",
            data: {
              image: dataUri,
            },
            withCredentials: true,
            url: DevState + "upload-image"
        })
        .then(res => {
            console.log(res.data)
            axios({
                method: "post",
                data: {
                  name: name,
                  series: series,
                  description: description,
                  gender: gender,
                  image: res.data,
                  likes: 0,
                  owner: userData.username
                },
                withCredentials: true,
                url: DevState + "add-waifu"
              })
            .then(() => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                          { name: 'Home' },
                        ],
                    })
                )
            })
        })
        .catch((err) => {
            console.log(err)
            if(image){
                setError("Something went wrong. Please try again.")
            } else {
                setError("An Image is Required.")
            }
            
        })
    }

    return (
        <View style={{flex: 1}}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Text style={styles.appHeader}> Create Waifu </Text>
            </Appbar>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView>
                    <TextInput placeholder='Name' onChangeText={setName} value={name} style={styles.input} maxLength={50}/>
                    <TextInput placeholder='Series' onChangeText={setSeries} value={series} style={styles.input} maxLength={50}/>
                    <TextInput placeholder='Description' onChangeText={setDescription} value={description} 
                    multiline={true} numberOfLines={4} style={styles.input}/>  
                    <TextInput placeholder='Gender' onChangeText={setGender} value={gender} maxLength={20} style={styles.input}/>
                    <Button onPress={pickImage}> Choose Image </Button>
                    {image && <Image source={{ uri: image }} style={{ width: Dimensions.get('window').width, height: 400 }} />}

                    <ErrorMessage error={error}/>
                    <Button icon="apple-keyboard-shift" mode="contained" onPress={uploadWaifu} style={styles.button}> Upload </Button>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    appbar: {
        marginTop: Constants.statusBarHeight
    },
    appHeader:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF"
    },
    input: {
        marginTop: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.0)'
    },
    button: {
        margin: 20
    }
})

export default CreateWaifuForm