import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios'
import ErrorMessage from '../components/ErrorMessage';
import { DevState } from '../constants';
export default function LoginView({ navigation }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    /*
      Checks if there is a user currently logged in. If there is, goto Home Screen
    */
    useEffect(() => {
      axios({
        method: "get",
        withCredentials: true,
        url: DevState+"user"
      })
      .then(res => {
        if (res.data){
          navigation.navigate('Home')
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          })
        }
      })
      .catch(err => console.log(err))
    }, [])


    const login = () => {
      axios({
        method: "post",
        data: {
          username: username,
          password: password
        },
        withCredentials: true,
        url: DevState + "login"
      })
      .then(res => {
        navigation.navigate('Home')
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
        })
      })
      .catch(err => {
        console.log(err)
        setError(err.response.data.message)
      })
    }

    const gotoRegister = () => {
      navigation.navigate('Register')
      navigation.reset({
        index: 0,
        routes: [{name: 'Register'}],
      });
    }

    return (
      <View>
        <TextInput placeholder='Username' onChangeText={setUsername} value={username} style={styles.input}/>
        <TextInput placeholder='Password' onChangeText={setPassword} value={password} style={styles.input} secureTextEntry={true}/>
        <Button icon="login" mode="contained" onPress={login} style={styles.button}>
        Login
        </Button>
        <ErrorMessage error={error} />
        <Text style={styles.text}> 
          Don't have an account?  
          <Text style={styles.linkText} onPress={gotoRegister}> Sign up </Text>
        </Text>
      </View>
    );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.0)'
  },
  button: {
    margin: 20,
    marginBottom: 10
  },
  text: {
    fontSize: 13,
    textAlign: "center"
  },
  linkText: {
    color: "#86c5da"
  }
})