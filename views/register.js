import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios'
import ErrorMessage from '../components/ErrorMessage';
import { DevState } from '../constants';
export default function RegisterView({ navigation }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const register = () => {
      if (confirmPassword == password){
        axios({
          method: "post",
          data: {
            username: username,
            password: password
          },
          withCredentials: true,
          url: DevState + "register"
        })
        .then(res => {
          console.log(res.data)
          axios({
            method: "post",
            data: {
              username: username,
              password: password
            },
            withCredentials: true,
            url: DevState + "login"
          }).then(() => {
            gotoHome()
          })
          
        })
        .catch(err => {
          setError(err.response.data.message)
        })
      } else {
        setError("Passwords Do Not Match")
      }
    }
    
    const gotoLogin = () => {
      navigation.navigate('Login')
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }

    const gotoHome = () => {
      navigation.navigate('Home')
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      })
    }

    return (
      <View>
        <TextInput placeholder='Username' onChangeText={setUsername} value={username} style={styles.input}/>
        <TextInput placeholder='Password' onChangeText={setPassword} value={password} style={styles.input} secureTextEntry={true}/>
        <TextInput placeholder='Confirm Password' onChangeText={setConfirmPassword} value={confirmPassword} style={styles.input} secureTextEntry={true}/>
        <Button icon="account-edit" mode="contained" onPress={register} style={styles.button}>Register</Button>
        
        <ErrorMessage error={error}/>
        
        <Text style={styles.text}> 
          Already have an account?  
          <Text style={styles.linkText} onPress={gotoLogin}> Sign in </Text>
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