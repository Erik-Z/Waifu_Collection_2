import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList} from 'react-native';
import { Appbar } from 'react-native-paper';
import Constants from "expo-constants"
import WaifuPreview from '../components/WaifuPreview';
import axios from 'axios';
const HomeContent = ({navigation, userData}) => {
    const [waifus, setWaifus] = useState([])
    useEffect(() => {
        if(userData){
            getWaifus()
        }
    }, [userData])

    const getWaifus = () => {
        axios.get("http://192.168.1.199:3000/waifus", {
                params: {owner: userData.username}
        })
        .then(res => {
            setWaifus(res.data)
        })
    }

    const renderWaifuCard = ({ item }) => {
        return <WaifuPreview uri={item.image} name={item.name} 
                gotoDetails={() => {
                    navigation.navigate('Details', {waifu: item})
                }}
            />
    }

    return (
        <View style={{flex: 1}}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Text style={styles.appHeader}> Home </Text>
            </Appbar>
            <SafeAreaView style={{flex: 1}}>
                <FlatList 
                    data={waifus}
                    renderItem={renderWaifuCard}
                    keyExtractor={item => item._id}
                />
            </SafeAreaView>
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
    },
    container:{
        flex: 1
    }
})

export default HomeContent