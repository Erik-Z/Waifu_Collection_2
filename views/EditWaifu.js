import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Dimensions, SafeAreaView, ScrollView} from 'react-native';
import Constants from "expo-constants"
import { Appbar, TextInput, Button } from 'react-native-paper';
import axios from 'axios';
const EditWaifu = ({navigation, route}) => {
    const [name, setName] = useState("")
    const [series, setSeries] = useState("")
    const [description, setDescription] = useState("")
    const [gender, setGender] = useState("")

    useEffect(() => {
        setName(route.params.waifu.name)
        setSeries(route.params.waifu.series)
        setDescription(route.params.waifu.description)
        setGender(route.params.waifu.gender)
    }, [])

    const editWaifu = () => {
        axios({
            method: "put",
            data: {
                id: route.params.waifu._id,
                name: name,
                series: series,
                description: description,
                gender: gender,
            },
            withCredentials: true,
            url: "http://192.168.1.199:3000/update"
        })
        .then(() => {
            navigation.goBack()
            navigation.goBack()
        })
    }

    return (
        <View style={{flex: 1}}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="arrow-left" onPress={() => {navigation.goBack()}} />
                <Text style={styles.appHeader}> Edit Waifu </Text>
            </Appbar>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView>
                    <TextInput placeholder='Name' onChangeText={setName} value={name} style={styles.input}/>
                    <TextInput placeholder='Series' onChangeText={setSeries} value={series} style={styles.input}/>
                    <TextInput placeholder='Description' onChangeText={setDescription} value={description} 
                    multiline={true} numberOfLines={4} style={styles.input}/>  
                    <TextInput placeholder='Gender' onChangeText={setGender} value={gender} style={styles.input}/>
                    <Button icon="apple-keyboard-shift" mode="contained" onPress={editWaifu} style={styles.button}> Save </Button>
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

export default EditWaifu