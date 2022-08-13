import React, { Component , createContext } from 'react';
import { Text, View } from 'react-native';
import { Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Audio} from 'expo-av';


const Tracks = [
    {
        id: 0,
        url: 'https://www.chosic.com/wp-content/uploads/2021/07/The-Epic-Hero-Epic-Cinematic-Keys-of-Moon-Music.mp3',
        title: 'Keys of moon',
        artist: 'The Epic Hero',
        artwork: 'https://picsum.photos/id/1003/200/300',
        album: '',
        duration: 149,
    },
    {
        id: 1,
        url: 'https://www.chosic.com/wp-content/uploads/2021/07/The-Epic-Hero-Epic-Cinematic-Keys-of-Moon-Music.mp3',
        title: 'Keys of moon 2',
        artist: 'The Epic Hero',
        artwork: 'https://picsum.photos/id/1003/200/300',
        album: '',
        duration: 149,
    },
    {
        id: 2,
        url: 'https://www.chosic.com/wp-content/uploads/2021/07/Raindrops-on-window-sill.mp3',
        title: 'Raindrops on window sill',
        artist: 'The Epic Hero',
        artwork: 'https://picsum.photos/id/10/200/300',
        album: 'Chosic',
        duration: 119,
    },
    {
        id: 3,
        url: 'https://www.chosic.com/wp-content/uploads/2021/07/purrple-cat-equinox.mp3',
        title: 'Equinox',
        artist: 'Purple Cat',
        artwork: 'https://picsum.photos/id/1016/200/300',
        album: '',
        duration: 140,
    },
    {
        id: 4,
        url: 'https://www.chosic.com/wp-content/uploads/2021/04/And-So-It-Begins-Inspired-By-Crush-Sometimes.mp3',
        title: 'And So It Begins',
        artist: 'The Epic Hero',
        artwork: 'https://picsum.photos/id/1019/200/300',
        album: 'Artificial Music',
        duration: 208,
    },
    {
        id: 5,
        url: 'https://www.chosic.com/wp-content/uploads/2021/05/inossi-got-you.mp3',
        title: 'Got You',
        artist: 'The Epic Hero',
        artwork: 'https://picsum.photos/id/103/200/300',
        album: 'INOSSI',
        duration: 178,
    },
    {
        id: 6,
        url: 'https://www.chosic.com/wp-content/uploads/2021/04/kvgarlic__largestreamoverloginforestmarch.mp3',
        title: 'Peaceful water stream',
        artist: 'Purple Cat',
        artwork: 'https://picsum.photos/id/1038/200/300',
        album: 'Chosic',
        duration: 66,
    },
    {
        id: 7,
        url: 'https://www.chosic.com/wp-content/uploads/2021/04/kvgarlic__largestreamoverloginforestmarch.mp3',
        title: 'Peaceful water stream',
        artist: 'Purple Cat',
        artwork: 'https://picsum.photos/id/1038/200/300',
        album: 'Chosic',
        duration: 66,
    },
    {
        id: 8,
        url: 'https://www.chosic.com/wp-content/uploads/2021/07/Raindrops-on-window-sill.mp3',
        title: 'Raindrops on window sill',
        artist: 'The Epic Hero',
        artwork: 'https://picsum.photos/id/10/200/300',
        album: 'Chosic',
        duration: 119,
    },
    {
        id: 9,
        url: 'https://www.chosic.com/wp-content/uploads/2021/04/kvgarlic__largestreamoverloginforestmarch.mp3',
        title: 'Peaceful water stream',
        artist: 'Purple Cat',
        artwork: 'https://picsum.photos/id/1038/200/300',
        album: 'Chosic',
        duration: 66,
    },
   
];


export const AudioContext = createContext();

export default class AudioProvider extends Component {

    constructor(props){
        super(props);
        this.state = {
            audioFiles: Tracks,
            permissionError: false,
            playbackObj : null , 
            soundObj : null,
            currentAudio : Tracks[0],
            isPlaying : false,
            currentId : 0,
            activeListItem: false,
            playbackPosition: null,
            playbackDuration: null,
        }
    }

    _permissionAlert = ()=>{
        Alert.alert("Permission required" , "this app needs to read audios files" , [ 
            { text: "I am ready" , onPress: ()=> this._getPermission() } ,
            { text: "C ancel" , onPress: ()=> this._permissionAlert() }
         ])
    }

    _getPermission = async () => {
        /*
            "canAskAgain": true,
            "expires": "never",
            "granted": false,
            "status": "undetermined",
        */
        const permission = await MediaLibrary.getPermissionsAsync();
        if(permission.granted){
            //we want to get all the audio files
            this._getAudioFiles()
        }
        if(!permission.granted && permission.canAskAgain){
            const { status , canAskAgain } = await MediaLibrary.requestPermissionsAsync();
            if(status === 'denied' && canAskAgain){
                // we are going to display alert that user must allow this permission to work this app
                this._permissionAlert()
            }
            if(status === 'granted'){
                //we want to get all the audio files
                this._getAudioFiles()
            }
            if(status === 'denied' && !canAskAgain){
                //we want to display some error to the user
            }
        }
    }

    loadPreviousAudio = async () =>{
        let previousAudio = await AsyncStorage.getItem('previousAudio');

        let currentAudio;
        let currentId;

        if(previousAudio == null){
            currentAudio = this.state.audioFiles[0];
            currentId = 0;
        }else {
            previousAudio = JSON.parse(previousAudio);
            currentAudio = previousAudio.audio;
            currentId = previousAudio.index;
        }
        this.setState({ ...this.state , currentAudio , currentId } )

    }

    componentDidMount() {
        //this._getPermission();
        this._getAudioFiles();
        if( this.state.playbackObj === null ){
            this.setState( { ...this.state , playbackObj : new Audio.Sound()})
        }
    }

    _getAudioFiles = async ()=>{
        console.log("get audio files")
    };  

    updateState = ( newState ) =>{
        this.setState({...this.state , ...newState });
    }
    
    render() {
        const { 
            soundObj, 
            isPlaying, 
            currentId,  
            audioFiles, 
            playbackObj, 
            currentAudio, 
            activeListItem,
            permissionError,
            playbackDuration, 
            playbackPosition,
        } = this.state;
        
        if(permissionError){
            return(
                <View
                    style={{
                        flex:1,
                        justifyContent:'center',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{fontSize:25, textAlign:'center',color:'red'}}>
                        It looks like you haven't accept the permission.
                    </Text>
                </View>
            );
        }
        return (
            <AudioContext.Provider value={{ 
                    playbackDuration,
                    playbackPosition, 
                    audioFiles, 
                    isPlaying, 
                    currentId, 
                    playbackObj, 
                    soundObj,
                    activeListItem, 
                    currentAudio, 
                    loadPreviousAudio: this.loadPreviousAudio, 
                    updateState: this.updateState,

                }}
                    >
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}
