import React from 'react';
import { StyleSheet, Text} from 'react-native';
export default function ErrorMessage({error}) {
    if (error){
        return(
            <Text style={styles.errorText}>{error}</Text>
        )
    }
    return(<></>)
}

const styles = StyleSheet.create({
    errorText: {
        fontSize: 12,
        color: "#FF0000",
        textAlign: "center"
    }
})