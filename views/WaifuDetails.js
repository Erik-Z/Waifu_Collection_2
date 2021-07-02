import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, ScrollView} from 'react-native';
import { Appbar } from 'react-native-paper';
import Constants from "expo-constants"
const WaifuDetails = ({navigation, userData, route}) => {
    console.log(route.params.waifu)
    return (
        <View>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="keyboard-backspace" onPress={() => navigation.goBack()} />
                <Text style={styles.appHeader}> {route.params.waifu.name} </Text>
            </Appbar>
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <Image source={{ uri: route.params.waifu.image }} style={styles.image}/>
                    <Text> Series: {route.params.waifu.series} </Text>
                    <Text> Gender: {route.params.waifu.gender} </Text>
                    <Text> Uploader: {route.params.waifu.owner} </Text>
                </ScrollView>
            </SafeAreaView>
        </View> 
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
        color: "#FFFFFF"
    },
})
export default WaifuDetails