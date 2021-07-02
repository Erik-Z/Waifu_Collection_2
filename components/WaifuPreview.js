import React from 'react'
import { StyleSheet, Text, View, Image} from 'react-native';
import {Card} from 'react-native-paper'
const WaifuPreview = (props) => {
    return (
        <Card style={styles.card} onPress={props.gotoDetails}>
            <View style={styles.cardView}>
                <Image 
                    style={styles.cardImage}
                    source={{uri: props.uri}}
                />
                <View style={{justifyContent:"center"}}>
                    <Text style={{fontSize:22}}> {props.name}</Text>
                </View>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    card:{
        margin: 5,
        padding: 5,
    },
    cardImage: {
        width:100, 
        height:100
    },
    cardView: {
        display:"flex",
        flexDirection:"row"
    }
})

export default WaifuPreview