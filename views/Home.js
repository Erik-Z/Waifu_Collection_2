import React, {useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import axios from 'axios'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import CreateWaifuForm from './CreateWaifuForm';
import HomeDetailsNavigator from './HomeDetailsNavigator';
import AllWaifuDetailsNavigator from './AllWaifuDetailsNavigator';
import UserProfile from './UserProfile';

// TODO:
// User Profiles: Show waifus uploaded by user
// followed Users
// Implement edit waifu
// Implement liked waifu page.

const Home = ({ navigation }) => {
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        axios({
          method: "get",
          withCredentials: true,
          url: "http://192.168.1.199:3000/user"
        })
        .then(res => {
          if (!res.data){
            navigation.navigate('Login')
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            })
          } else {
              setUserData(res.data)
          }
        })
        .catch(err => console.log(err))
    }, [])

    const logout = () => {
        axios({
            method: "get",
            withCredentials: true,
            url: "http://192.168.1.199:3000/logout"
        })
        .then(() => {
            navigation.navigate('Login')
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            })
        })
    }

    const LogoutTab = (props) => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem label="Logout" onPress={logout}/>
        </DrawerContentScrollView>
      )
    }

    const MyProfileTab = () => {
      if(userData){
        return (
          <Drawer.Screen name="My Profile">
            {props => (<UserProfile {...props} userData={userData} currentUser={userData.username} />)}
          </Drawer.Screen>
        )
      }  
    }

    const Drawer = createDrawerNavigator()

    return(        
        <Drawer.Navigator initialRouteName="Home" drawerContent={props => <LogoutTab {...props} />}>
            <Drawer.Screen name="Home">
              {() => (<HomeDetailsNavigator userData={userData}/>)}
            </Drawer.Screen>
            {MyProfileTab()}
            <Drawer.Screen name="Create Waifu">
              {props => (<CreateWaifuForm {...props} userData={userData} />)}
            </Drawer.Screen>
            <Drawer.Screen name="All Waifus">
              {() => (<AllWaifuDetailsNavigator userData={userData} />)}
            </Drawer.Screen>
        </Drawer.Navigator>
    )
}

export default Home