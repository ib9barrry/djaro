import React , {useState ,useEffect, useContext} from 'react';
import {  Text, View, StyleSheet, Button , Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import color from '/home/barry/djaro/djaro_trois/app/misc/color.js';
import Slider from '@react-native-community/slider';
import PlayerButton from './PlayerButton';
import {AudioContext} from "../context/AudioProvider"
import { storeAudioForNextOpening } from '../misc/helper';
import {convertTime} from '../misc/helper.js'
const { width , height } = Dimensions.get('window');

export default function Player() {
  
  const context = useContext(AudioContext);
  const  {  playbackDuration, playbackPosition  } = context;

  useEffect(()=> {
    console.log("contex dans player : ," , context);
    context.loadPreviousAudio();
    
  } , []);

  const onPlaybackStatusUpdate = async (playbackStatus) => {

    if(playbackStatus.isLoaded && playbackStatus.isPlaying){
        context.updateState({
            playbackPosition: playbackStatus.positionMillis,
            playbackDuration: playbackStatus.durationMillis,
        })
    }

    if(playbackStatus.didJustFinish){
        let maxId = context.audioFiles.length-1;
        let nextAudioIndex = context.currentId + 1; 
        console.log("time is finish this.context.currentId: ",context.currentId , ";\n this.context.audioFiles.length:",context.audioFiles.length)
    
        if( maxId === context.currentId){
            console.log("\n\n==== cool audio est la fin, \nthis.context.currentId:",context.currentId , ";this.context.audioFiles.length:",context.audioFiles.length)
            nextAudioIndex = 0;
        }
  
        console.log("time is finished .");
        const audio = context.audioFiles[nextAudioIndex] 
        console.log("audio : " , audio , "f\n\nf\n")
        try {
            context.playbackObj.stopAsync();
            context.playbackObj.unloadAsync();

            const playbackObj = new Audio.Sound();
            const status = await playbackObj.loadAsync({ uri : audio.url } , { shouldPlay: true });
            // modifier isPlaying shouldPlay
            status.isPlaying = true ;
            status.shouldPlay = true ;
            console.log(" donc playing next audio apres fin du temps  ", status);
            context.updateState( {currentId: nextAudioIndex , activeListItem : true , isPlaying: true , currentAudio: audio ,  playbackObj: playbackObj , soundObj: status})
            setTimeout(function() {
              console.log("Good Night!");
              playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            }, 500);
            //await playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            let indexOfAudio = nextAudioIndex;
            return await storeAudioForNextOpening(audio , indexOfAudio );

        } catch (error) 
        {
          console.log("error was detectd ,  " , error.message);
        }
      }
    }

  const handlePlayPause = async () =>{
    const audio = context.currentAudio;
    const indexOfAudio = audio.id;
    console.log("indexOfAudio ,  ", indexOfAudio)
    // play 
    if(context.soundObj === null){
      const playbackObj = new Audio.Sound();
      const status = await playbackObj.loadAsync({ uri : audio.url } , { shouldPlay: true });
      // modifier isPlaying shouldPlay
      status.isPlaying = true ;
      status.shouldPlay = true ;
      context.updateState( {  currentId: indexOfAudio, activeListItem : true , isPlaying: true , currentAudio: audio ,  playbackObj: playbackObj , soundObj: status } )
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      return await storeAudioForNextOpening(audio , indexOfAudio );
    }
    // pause
    if(context.soundObj.isLoaded && context.soundObj.isPlaying){
      const status = await context.playbackObj.setStatusAsync({ shouldPlay: false });
      // modifier isPlaying shouldPlay
      status.isPlaying = false ;
      status.shouldPlay = false ;
      return context.updateState({  currentId: indexOfAudio, activeListItem : true , isPlaying: false , soundObj: status });
    }
    // resume 
    if(context.soundObj.isLoaded && !context.soundObj.isPlaying 
      && context.currentAudio.id === audio.id){
      const status = await context.playbackObj.playAsync();
      // modifier isPlaying shouldPlay
      status.isPlaying = true ;
      status.shouldPlay = true ;
      return context.updateState( {  currentId: indexOfAudio , activeListItem : true , isPlaying: true , soundObj: status } )
    }
  }

  const handleNext = async ()=>{
    let maxId = context.audioFiles.length-1;
    let nextAudioIndex = context.currentId + 1; 
    console.log("this.context.currentId: ",context.currentId , ";\n this.context.audioFiles.length:",context.audioFiles.length)

    if( maxId === context.currentId){
        console.log("\n\n==== cool audio est la fin, \nthis.context.currentId:",context.currentId , ";this.context.audioFiles.length:",context.audioFiles.length)
        nextAudioIndex = 0;
    }

    console.log("time is finished .");
    const audio = context.audioFiles[nextAudioIndex] 
    console.log("audio : " , audio , "f\n\nf\n")
    try {
        context.playbackObj.stopAsync();
        context.playbackObj.unloadAsync();

        const playbackObj = new Audio.Sound();
        const status = await playbackObj.loadAsync({ uri : audio.url } , { shouldPlay: true });
        // modifier isPlaying shouldPlay
        status.isPlaying = true ;
        status.shouldPlay = true ;
        console.log(" donc playing nextAudioIndex audio  ", status);
        context.updateState( {currentId: nextAudioIndex , activeListItem : true , isPlaying: true , currentAudio: audio ,  playbackObj: playbackObj , soundObj: status } )
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        let indexOfAudio = nextAudioIndex;
        return await storeAudioForNextOpening(audio , indexOfAudio);

    } catch (error) 
    {
      console.log("error was detectd ,  " , error.message);
    }
  }
  const handlePrev = async ()=>{
    let min = 0;
    let max = context.audioFiles.length;
    let prevAudioIndex = context.currentId - 1;
    if( prevAudioIndex >= min ){
        console.log("cool prevAudioIndex est <= a max " , prevAudioIndex  , "| max = ", min)
    }else {
      prevAudioIndex = max-1;
    }
    console.log("time is finished .");
    const audio = context.audioFiles[prevAudioIndex] 
    console.log("audio : " , audio , "f\n\nf\n")
    try {
        context.playbackObj.stopAsync();
        context.playbackObj.unloadAsync();

        const playbackObj = new Audio.Sound();
        const status = await playbackObj.loadAsync({ uri : audio.url } , { shouldPlay: true });
        // modifier isPlaying shouldPlay
        status.isPlaying = true ;
        status.shouldPlay = true ;
        console.log(" donc playing prevAudioIndex audio   ", status);
        context.updateState( {currentId: prevAudioIndex , activeListItem : true , isPlaying: true , currentAudio: audio ,  playbackObj: playbackObj , soundObj: status } )
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        let indexOfAudio = prevAudioIndex;
        return await storeAudioForNextOpening(audio , indexOfAudio);

    } catch (error) 
    {
      console.log("error was detectd ,  " , error.message);
    }
  } 
  const calculateSeebBar = () =>{
    if(playbackPosition !==null && playbackDuration!==null){
      return playbackPosition / playbackDuration;
    }
    return 0;
  }

  const renderCurrentTime = ()=>{
    return convertTime(context.playbackPosition / 1000) ;
  }


  if(!context.currentAudio) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.audioCount}> 1 / 99 </Text>
      <View style={styles.midBannerContainer}>
        <MaterialCommunityIcons name="music-circle" size={300} 
        color={ context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM} 
        />
      </View>
      <View style={styles.audioPlayerContainer} > 
        <Text numberOfLines={1} style={styles.audioTitle} > {context.currentAudio.title} </Text>
        <View style={{
          flexDirection:'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}>
         
        </View>
        <Slider
        style={{width: width, height: 40}}
        minimumValue={0}
        maximumValue={1}
        value={calculateSeebBar()}
        minimumTrackTintColor={color.FONT_MEDIUM}
        maximumTrackTintColor={color.ACTIVE_BG}
      />
      </View>
      <View style={styles.audioControllers}> 
          <PlayerButton 
          onPress={ handlePrev }
          iconType="PREV" 
          />

          <PlayerButton 
          onPress={ handlePlayPause } 
          style={{ marginHorizontal: 15 }} 
          iconType={ context.isPlaying ? "PLAY" : "PAUSE"} 
          />
          
          <PlayerButton 
          onPress={ handleNext }
          iconType="NEXT" 
          />
      </View>   
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      audioCount: {
        textAlign: 'right',
        padding:15,
        color: color.FONT_LIGHT,
        fontSize:14,
      },
      midBannerContainer:{
        flex: 1 ,
        justifyContent:'center',
        alignItems: 'center',
      },
      audioTitle: {
        fontSize:16,
        color: color.FONT,
        padding: 15, 
      },
      audioControllers:{
        width: width,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingBottom: 20,

      }

})