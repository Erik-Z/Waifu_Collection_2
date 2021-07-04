import React, { useState } from 'react'
import { SafeAreaView, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import WaifuPreview from '../components/WaifuPreview';
const WaifuList = (props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const renderWaifuCard = ({ item }) => {
        return <WaifuPreview uri={item.image} name={item.name} series={item.series}
                    gotoDetails={() => {
                        props.navigation.navigate('Details', {waifu: item})
                    }}
                />
    }
    return (
        <SafeAreaView style={{flex: 1}}>
            <Searchbar
                placeholder="Search"
                onChangeText={(e) => { setSearchQuery(e) }}
                value={searchQuery}
            />
            <FlatList 
                data={props.waifus.filter(waifu => { return waifu.name.toLowerCase().includes(searchQuery.toLowerCase())})}
                renderItem={renderWaifuCard}
                keyExtractor={item => item._id}
            />
        </SafeAreaView>
    )
}

export default WaifuList