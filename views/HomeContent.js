import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import Constants from "expo-constants"
import axios from 'axios';
import WaifuList from '../components/WaifuList';
import CustomModal from '../components/Modal';
const HomeContent = ({navigation, userData}) => {
    const [waifus, setWaifus] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    
    useFocusEffect(
        useCallback(() => {
            axios.get("http://192.168.1.199:3000/waifus", {
                params: {owner: userData.username}
            })
            .then(res => {
                setWaifus(res.data)
            })
        }, [])
    )
    
    return (
        <View style={{flex: 1}}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content titleStyle={styles.appHeader} title="Home"/>
                <Appbar.Action icon="information" onPress={() => {setModalVisible(true)}}/>
            </Appbar>
            <WaifuList waifus={waifus} navigation={navigation}/>
            <CustomModal 
            texts={[
                "Welcome to Waifu Collection",
                "This is the home page. To upload an image, hit the menu button next to 'Home' and goto the 'Create Waifu' tab.",
                "If you want to see what other people posted, goto the 'All Waifus' tab"
            ]}
            visibleState={modalVisible}
            setVisibleState={setModalVisible}/>        
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
        color: "#FFFFFF",
        marginLeft: -15
    },
    container:{
        flex: 1
    },
})

export default HomeContent