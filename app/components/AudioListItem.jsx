import React from 'react'
import { Text, StyleSheet, View, Dimensions , ScrollView , StatusBar , SafeAreaView  } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';

const AudioListItem = ({items}) => {
        
    console.log("aidio",items)

        return (
            <ScrollView>
                <Text> Hello </Text>
            </ScrollView>     
        )
    }
export default AudioListItem;

const { width , height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: width-80,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, 
    },
    rightContainer:{
        flexBasis: 50,
        height: 50,
        alignItems:'center',
        paddingTop:10

    },
    thumbnail:{
        height: 50,
        backgroundColor: color.FONT_LIGTH,
        flexBasis: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
      
    },
    thumbnailText:{
        fontSize:22,
        fontWeight: 'bold',
        color: color.FONT,
    },
    titleContainer:{
        width: width - 180,
        paddingLeft: 10
    },
    title: {
        fontSize: 16,
        color: color.FONT,
    },
    separator: {
        width: width - 80,
        backgroundColor: '#333',
        opacity: 0.3,
        height: 0.5,
        alignSelf: 'center',
        marginTop: 10,
    },
    timeText: {
        fontSize: 14,
        color: color.FONT_LIGTH,

    }
    



})
