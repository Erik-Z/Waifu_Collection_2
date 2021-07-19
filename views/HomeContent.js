import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, Provider, Menu } from 'react-native-paper';
import Constants from "expo-constants"
import axios from 'axios';
import WaifuList from '../components/WaifuList';
import CustomModal from '../components/Modal';
import { Filters } from '../constants';

const HomeContent = ({navigation, userData}) => {
    const [waifus, setWaifus] = useState([])
    const [filter, setFilter] = useState(Filters.MY_WAIFUS)
    const [modalVisible, setModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false)

    useFocusEffect(
        useCallback(() => {
            axios.get("http://192.168.1.199:3000/all-waifus")
            .then(res => {
                setWaifus(res.data)
            })
        }, [])
    )

    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    const toggleMyFilter = () => {
        setFilter(Filters.MY_WAIFUS)
        closeMenu()
    }
    
    const toggleLikedFilter = () => {
        setFilter(Filters.LIKED)
        closeMenu()
    }

    const toggleFollowedFilter = () => {
        setFilter(Filters.FOLLOWED)
        closeMenu()
    }

    const toggleNoFilter = () => {
        setFilter(Filters.ALL)
        closeMenu()
    }

    return (
        <Provider>
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={{ x: Dimensions.get('window').width, y: 70 }}>
                {filter === Filters.MY_WAIFUS ? <Menu.Item onPress={toggleMyFilter} titleStyle={styles.selectedFilterText} title="My Waifus" /> :<Menu.Item onPress={toggleMyFilter} title="My Waifus" />}
                {filter === Filters.LIKED ? <Menu.Item onPress={toggleLikedFilter} titleStyle={styles.selectedFilterText} title="Liked Waifus"/> : <Menu.Item onPress={toggleLikedFilter} title="Liked Waifus"/>}
                {filter === Filters.FOLLOWED ? <Menu.Item onPress={toggleFollowedFilter} titleStyle={styles.selectedFilterText} title="Followed"/> : <Menu.Item onPress={toggleFollowedFilter} title="Followed"/>}
                {filter === Filters.ALL ? <Menu.Item onPress={toggleNoFilter} titleStyle={styles.selectedFilterText} title="All Waifus"/> : <Menu.Item onPress={toggleNoFilter} title="All Waifus"/>}
            </Menu>
            <View style={{flex: 1}}>
                <Appbar style={styles.appbar}>
                    <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                    <Appbar.Content titleStyle={styles.appHeader} title="Home"/>
                    <Appbar.Action icon="information" onPress={() => {setModalVisible(true)}}/>
                    <Appbar.Action icon="filter-variant" onPress={openMenu} />
                </Appbar>
                <WaifuList waifus={waifus} navigation={navigation} filter={filter} userData={userData}/>
                <CustomModal 
                texts={[
                    "Welcome to Waifu Collection",
                    "This is the home page. To upload an image, hit the menu button next to 'Home' and goto the 'Create Waifu' tab.",
                    "If you want to see what other people posted, goto the 'All Waifus' tab"
                ]}
                visibleState={modalVisible}
                setVisibleState={setModalVisible}/>        
            </View>
        </Provider>
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
    selectedFilterText: {
        fontWeight: "bold",
        fontSize: 18
    }
})

export default HomeContent