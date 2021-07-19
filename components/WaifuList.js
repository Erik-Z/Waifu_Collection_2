import React, { useState, useCallback } from 'react'
import { SafeAreaView, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import WaifuPreview from '../components/WaifuPreview';
import { Filters } from '../views/HomeContent';
import axios from 'axios';
const WaifuList = (props) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [userInfo, setUserInfo] = useState(null)
    useFocusEffect(
        useCallback(() => {
            console.log("WaifuList Mounted")
            axios.get("http://192.168.1.199:3000/get-user", {
                params: {username: props.userData.username}
            })
            .then(res => {
                if (!res.data){
                    console.log("Not suppose to show")
                } else {
                    setUserInfo(res.data)
                }
            })
            .catch(err => console.log(err))

            return () => {
                console.log("Waifu List UnMounted")
            }
        }, [])
    )
    const renderWaifuCard = ({ item }) => {
        return <WaifuPreview uri={item.image} name={item.name} series={item.series}
                    gotoDetails={() => {
                        props.navigation.navigate('Details', {waifu: item})
                    }}
                />
    }

    const myFilter = (waifuList) => {
        return waifuList.filter(waifu => {return waifu.owner === props.userData.username})
    }
    
    const likedFilter = (waifuList) => {
        return waifuList.filter(waifu => {return userInfo.likedWaifus.includes(waifu._id)})
    }

    const followedFilter = (waifuList) => {
        return waifuList.filter(waifu => {return userInfo.followersList.includes(waifu.owner)})
    }

    const filterWaifuList = () => {
        if (props.filter === Filters.MY_WAIFUS){
            return (
                <FlatList
                    data={myFilter(props.waifus.filter(waifu => { return waifu.name.toLowerCase().includes(searchQuery.toLowerCase())}))}
                    renderItem={renderWaifuCard}
                    keyExtractor={item => item._id}
                />
            )
        } else if (props.filter === Filters.LIKED){
            return (
                <FlatList
                    data={likedFilter(props.waifus.filter(waifu => { return waifu.name.toLowerCase().includes(searchQuery.toLowerCase())}))}
                    renderItem={renderWaifuCard}
                    keyExtractor={item => item._id}
                />
            )
        } else if (props.filter === Filters.FOLLOWED){
            return (
                <FlatList
                    data={followedFilter(props.waifus.filter(waifu => { return waifu.name.toLowerCase().includes(searchQuery.toLowerCase())}))}
                    renderItem={renderWaifuCard}
                    keyExtractor={item => item._id}
                />
            )
        } else if (props.filter === Filters.ALL){
            return (
                <FlatList
                    data={props.waifus.filter(waifu => { return waifu.name.toLowerCase().includes(searchQuery.toLowerCase())})}
                    renderItem={renderWaifuCard}
                    keyExtractor={item => item._id}
                />
            )
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <Searchbar
                placeholder="Search"
                onChangeText={(e) => { setSearchQuery(e) }}
                value={searchQuery}
            />
            {filterWaifuList()}
        </SafeAreaView>
    )
}

export default WaifuList