import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Appbar } from 'react-native-paper';
import Constants from "expo-constants"
import axios from 'axios';
import WaifuList from '../components/WaifuList';
const AllWaifuContent = ({navigation, userData}) => {
    const [waifus, setWaifus] = useState([])
    useEffect(() => {
        if(userData){
            getWaifus()
        }
    }, [userData])

    const getWaifus = () => {
        axios.get("http://192.168.1.199:3000/all-waifus")
        .then(res => {
            setWaifus(res.data)
        })
        .catch(e => console.log(e))
    }

    return (
        <View style={{flex: 1}}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Text style={styles.appHeader}> All Waifus </Text>
            </Appbar>
            <WaifuList waifus={waifus} navigation={navigation}/>
        </View>
    )
}

const styles = StyleSheet.create({
    appbar: {
        marginTop: Constants.statusBarHeight,
    },
    appHeader:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF"
    }
})

export default AllWaifuContent