import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Modal, TouchableHighlight, Alert} from 'react-native';
import { Appbar, Divider } from 'react-native-paper';
import Constants from "expo-constants"
import axios from 'axios';
import WaifuList from '../components/WaifuList';
const HomeContent = ({navigation, userData}) => {
    const [waifus, setWaifus] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
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

    return (
        <View style={{flex: 1}}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content titleStyle={styles.appHeader} title="Home"/>
                <Appbar.Action icon="information" onPress={() => {setModalVisible(true)}}/>
            </Appbar>
            <WaifuList waifus={waifus} navigation={navigation}/>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Welcome to Waifu Collection!</Text>
                        <Text style={styles.modalText}>This is the home page. To upload an image, hit the menu button next to 'Home' and goto the 'Create Waifu' tab. </Text>
                        <Text style={styles.modalText}>If you want to see what other people posted, goto the 'All Waifus' tab</Text>
                        <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                        onPress={() => {
                            setModalVisible(!modalVisible);
                        }}>
                        <Text style={styles.textStyle}>Close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})

export default HomeContent