import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, ScrollView} from 'react-native';
import { Appbar, Card, Title, Paragraph, IconButton, Colors, Divider, Subheading, Caption } from 'react-native-paper';
import Constants from "expo-constants"
const WaifuDetails = ({navigation, userData, route}) => {
    return (
        <View style={{flex: 1}}>
            <Appbar style={styles.appbar}>
                <Appbar.Action icon="keyboard-backspace" onPress={() => navigation.goBack()} />
                <Text style={styles.appHeader}> {route.params.waifu.name} </Text>
            </Appbar>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView>
                    <Card>
                        <Card.Cover style={styles.image} source={{ uri: route.params.waifu.image }} />
                        <Card.Content>
                            <Title>
                                Series: <Text style={{fontSize: 20, fontWeight: "bold"}}>{route.params.waifu.series ? route.params.waifu.series : "None"}</Text>
                            </Title>
                            <Subheading>
                                <Title>Gender: </Title>{route.params.waifu.gender ? route.params.waifu.gender : "Unknown"}
                            </Subheading>
                            <Divider/>
                            <Paragraph>
                                Description:
                            </Paragraph>
                            <Paragraph>
                                {route.params.waifu.description}
                            </Paragraph>
                            <View></View>
                            <Divider/>
                        </Card.Content>
                        
                        <Card.Actions>
                            {/* <Button>Cancel</Button> */}
                            <IconButton
                                icon="heart-outline"
                                color={Colors.red500}
                                size={20}
                                onPress={() => console.log('Pressed')}
                            />
                            <Caption>
                                Uploader: {route.params.waifu.owner}
                            </Caption>
                        </Card.Actions>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        </View> 
    )
}
const styles = StyleSheet.create({
    image:{
        width: Dimensions.get('window').width,
        height: 400
    },
    appbar: {
        marginTop: Constants.statusBarHeight,
    },
    appHeader:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF"
    },
    detailedText:{
        fontSize: 20,
        fontWeight: "bold",

    }
})
export default WaifuDetails