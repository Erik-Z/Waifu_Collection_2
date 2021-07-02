import React from 'react'
import { StyleSheet, Image} from 'react-native';
import { Card } from 'react-native-paper';
const WaifuPreview = (props) => {
    return (
        <Card style={styles.card} onPress={props.gotoDetails}>
        <Card.Title
            title={props.name}
            subtitle={props.series ? props.series : "None"}
            left={() => <Image 
                            style={styles.cardImage}
                            source={{uri: props.uri}}
                        />}
            leftStyle={styles.cardImage}
        />
        </Card>
    )
}

const styles = StyleSheet.create({
    card:{
        marginTop: 5,
        marginBottom: 5,
    },
    cardImage: {
        width: 100, 
        height: 100,
        marginLeft: -8,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    }
})

export default WaifuPreview