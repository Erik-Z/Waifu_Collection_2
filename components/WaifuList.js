import React from 'react'
import { SafeAreaView, FlatList } from 'react-native';
import WaifuPreview from '../components/WaifuPreview';
const WaifuList = (props) => {
    const renderWaifuCard = ({ item }) => {
        return <WaifuPreview uri={item.image} name={item.name} series={item.series}
                    gotoDetails={() => {
                        props.navigation.navigate('Details', {waifu: item})
                    }}
                />
    }
    return (
        <SafeAreaView style={{flex: 1}}>
            <FlatList 
                data={props.waifus}
                renderItem={renderWaifuCard}
                keyExtractor={item => item._id}
            />
        </SafeAreaView>
    )
}

export default WaifuList