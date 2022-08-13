
import React from 'react';
import { StyleSheet, StatusBar , Dimensions } from 'react-native';
//import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createStackNavigator } from '@react-navigation/stack';


import { Fontisto , MaterialCommunityIcons , AntDesign , FontAwesome5 } from '@expo/vector-icons';
import AudioList from '../screens/AudioList';
import PlayList from '../screens/PlayList';
import Player from '../screens/Player';

const screen = Dimensions.get('window');

/*
const Tab = createBottomTabNavigator();

const AppNagivator = () => {
    
    return (
    <Tab.Navigator style={styles.container} >
        <Tab.Screen
            options={{ title: ({color , focus}) => {
                return <Fontisto name="headphone" size={24} color={ focus ? 'blue' : '#272727' } />
            } }}
            name="AudioList" component={AudioList} />
        <Tab.Screen 
            options={{ title: ({color , focus}) => {
                return <FontAwesome5 name="compact-disc" size={24} color={ focus ? 'blue' : '#272727' } />
            } }}
            name="Player" component={Player} />
        <Tab.Screen    
            options={{ title: ({color , focus}) => {
                return <MaterialCommunityIcons name="playlist-music" size={24} color={ focus ? 'blue' : '#272727' } />
            } }}
            name="PlayList" 
            component={PlayList} />

    </Tab.Navigator>
    
    )
}

export default AppNagivator;


const styles =  StyleSheet.create({
    
})

*/


const Tab = createBottomTabNavigator();

export default function AppNagivator() {
  return (
    <Tab.Navigator
      initialRouteName="AudioList"
      screenOptions={{
        tabBarStyle: { borderTopColor: 'tomato' , borderTopWidth: '0.2px' },
        tabBarActiveTintColor: 'tomato',
      }}
      
    >
      <Tab.Screen
        name="AudioList"
        component={AudioList}
        options={{
        headerStyle: {
            backgroundColor: 'tomato',
            },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold'},

        tabBarLabel: 'AudioList',
        tabBarIcon: ({ color, size }) => (
        <Fontisto name="headphone" size={24} color={color} />
        ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
            headerStyle: {
                backgroundColor: 'tomato',
                },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold'},
            tabBarLabel: 'PlayList',
            tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="compact-disc" size={24} color={color} />
                ),
        }}
      />
      <Tab.Screen
        name="PlayList"
        component={PlayList}
        options={{
            headerStyle: {
                backgroundColor: 'tomato',
                },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold'},
            tabBarLabel: 'PlayList',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="playlist-music" size={24} color={color} />
                ),
        }}
      />
    </Tab.Navigator>
  );
}