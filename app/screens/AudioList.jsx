import React from 'react';
import { Text, StyleSheet,Button, View, Dimensions , ScrollView , TouchableWithoutFeedback, StatusBar , SafeAreaView  } from 'react-native'
import * as MediaLibrary from 'expo-media-library';
import { AudioContext } from '../context/AudioProvider';
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';
import OptionModal from './OptionModal';
import { Audio } from 'expo-av';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { storeAudioForNextOpening } from '../misc/helper';


export class AudioList extends React.Component {

    static contextType = AudioContext

    constructor(props){
        super(props);
        
        this.state = {
            isVisibleModal : false,
            fontActiveColor: color.ACTIVE_BG,
            fontNoActiveColor: color.FONT_LIGTH,
            currentId: 0,

        }
    }

   
    componentDidMount() {
        console.log("contex" , this.context)
        this.context.loadPreviousAudio();
    }

    convertTime = seconds => {
        /*
        if(minutes){
            const hrs = minutes / 60;
            const minutes = hrs.toString().split('.')[0];
            const percent = parseInt(hrs.toString().split('.')[1].slice(0,2));
            const sec = Math.ceil((60 * percent) / 100);
            
            if(parseInt(minutes) < 10 && sec < 10) {
                return `0${minutes}:0${sec}`;
            }

            if(parseInt(minutes) < 10) {
                return `0${minutes}:${sec}`;
            }

            if(sec < 10) {
                return `${minutes}:0${sec}`;
            }

            return `${minutes}:${sec}`;
        }*/

        seconds = Number(seconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor((seconds % 3600) % 60);

        const hrs = h > 0 ? (h < 10 ? `0${h}:` : `${h}:`) : '';
        const mins = m > 0 ? (m < 10 ? `0${m}:` : `${m}:`) : '00:';
        const scnds = s > 0 ? (s < 10 ? `0${s}` : s) : '00';
        return `${hrs}${mins}${scnds}`;
    }

    onOptionPress = ()=> {
        console.log("vous avez cliquer sur option");
        this.setState({isVisibleModal: true})
    }

    closeModal = () => {
        console.log("vous avez cliquer pour fermer ");
        this.setState({isVisibleModal : false})
    }

    onPlaybackStatusUpdate = async (playbackStatus) => {

        if(playbackStatus.isLoaded && playbackStatus.isPlaying){
            this.context.updateState({
                playbackPosition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis,
            })
        }

        if(playbackStatus.didJustFinish){
            console.log("time is finished .");

            let maxId = this.context.audioFiles.length-1;
            let nextAudioIndex = this.context.currentId + 1; 
            console.log("this.context.currentId: ",this.context.currentId , ";\n this.context.audioFiles.length:",this.context.audioFiles.length)

            if( maxId === this.context.currentId){
                console.log("\n\n==== cool audio est la fin, \nthis.context.currentId:",this.context.currentId , ";this.context.audioFiles.length:",this.context.audioFiles.length)
                nextAudioIndex = 0;
            }
            
            const audio = this.context.audioFiles[nextAudioIndex] 
            console.log("audio : " , audio , "f\n\nf\n")
            try {
                this.context.playbackObj.stopAsync();
                this.context.playbackObj.unloadAsync();
                const playbackObj = new Audio.Sound();
                const status = await playbackObj.loadAsync({ uri : audio.url } , { shouldPlay: true, progressUpdateIntervalMillis: 1000 });
                // modifier isPlaying shouldPlay
                status.isPlaying = true ;
                status.shouldPlay = true ;
                console.log(" donc playing next audio apres fin du temps  ", status);
                this.context.updateState( {currentId: nextAudioIndex , activeListItem : true , isPlaying: true , currentAudio: audio ,  playbackObj: playbackObj , soundObj: status } )
                playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
                let indexOfAudio = nextAudioIndex;
                return await storeAudioForNextOpening(audio , indexOfAudio );

              } catch (error) 
              {
                console.log("error was detectd ,  " , error.message);
              }
        }
    }

    audioPressed = async (audio) => {
        // si this.state.soundObj === null , alors on n'a pas de son qui joue d'abord
        // donc playing audio for the first time
        const indexOfAudio = this.context.audioFiles.indexOf(audio);
        this.context.updateState( { currentId: indexOfAudio } )
        if(this.context.soundObj === null){
            const playbackObj = new Audio.Sound();
            const status = await playbackObj.loadAsync({ uri : audio.url } , { shouldPlay: true, progressUpdateIntervalMillis: 1000 });
            // modifier isPlaying shouldPlay
            
            status.isPlaying = true ;
            status.shouldPlay = true ;
            console.log(" donc playing audio for the first time ", status);
            this.context.updateState( {  currentId: audio.id, activeListItem : true , isPlaying: true , currentAudio: audio ,  playbackObj: playbackObj , soundObj: status } )

            playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
            return storeAudioForNextOpening(audio , indexOfAudio );
            //console.log(" donc playing audio for the first time ", status);
            //return this.setState({ ...this.state , activeListItem : true , isPlaying: true , currentAudio: audio ,  playbackObj: playbackObj , soundObj: status });
            }
        // Pause the audio 
        if(this.context.soundObj.isLoaded && this.context.soundObj.isPlaying){
            const status = await this.context.playbackObj.setStatusAsync({ shouldPlay: false });
            // modifier isPlaying shouldPlay
            status.isPlaying = false ;
            status.shouldPlay = false ;
            return this.context.updateState({  currentId: indexOfAudio, activeListItem : true , isPlaying: false , soundObj: status });

            //console.log("audio is already playing  , mettre pausse...  " , status);
            //return this.setState({ ...this.state , activeListItem : false , isPlaying: false , soundObj: status });
        }
        
        // Resume the audio  audio is loading but is not playing
        if(this.context.soundObj.isLoaded && !this.context.soundObj.isPlaying 
            && this.context.currentAudio.id === audio.id){
            const status = await this.context.playbackObj.playAsync();
            // modifier isPlaying shouldPlay
            status.isPlaying = true ;
            status.shouldPlay = true ;
            return this.context.updateState( {  currentId: indexOfAudio , activeListItem : true , isPlaying: true , soundObj: status } )
            //console.log("audio is already playing  , mettre sur play apres une pausse... , ",status);
            //return this.setState({ ...this.state ,activeListItem : true , isPlaying: true , soundObj: status });
        }
        
        if(this.context.currentAudio.id !== audio.id){
             
            try {
                this.context.playbackObj.stopAsync();
                this.context.playbackObj.unloadAsync();
                const playbackObj = new Audio.Sound();
                const status = await playbackObj.loadAsync({ uri : audio.url } , { shouldPlay: true, progressUpdateIntervalMillis: 1000 });
                // modifier isPlaying shouldPlay
                status.isPlaying = true ;
                status.shouldPlay = true ;
                console.log(" donc playing next audio apres fin du temps  ", status);
                this.context.updateState( {currentId: audio.id, activeListItem : true , isPlaying: true , currentAudio: audio ,  playbackObj: playbackObj , soundObj: status } )
                playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
                return storeAudioForNextOpening(audio , indexOfAudio );

              } catch (error) 
              {
                console.log("error was detectd ,  " , error.message);
              }
        }
    }

   
    renderPlayIcon = isPlaying =>{
        if(!isPlaying){
            return <Entypo name="controller-play" size={25} color="white" />
        }else{
            return <Entypo name="controller-paus" size={25} color="white" />
        }
    }


    render() {

        let currentId = this.context.currentId;
        console.log("currentId dans render " , this.context.currentId)
       
        return (
            <View>
                <ScrollView >
                    <View style={{flex:1 , flexDirection:'column', marginTop:5 }}>
                        
                    {
                        this.context.audioFiles.map((item)=> {
                            return(
                                <View key={item.id}>
                                    <TouchableWithoutFeedback onPress={ ()=> this.audioPressed(item) }>
                                        <View  style={styles.container}>
                                            <View style={styles.leftContainer}>
                                                <View style={styles.thumbnail} >
                                                    <Text style={styles.thumbnailText}> 
                                                   
                                                    { ((currentId === item.id)) ?  this.renderPlayIcon(this.context.isPlaying) : (item.title[0]) }
                                                    </Text>
                                                </View>
                                                <View style={styles.titleContainer}>
                                                    <Text numberOfLines={1} style={styles.title}>
                                                        {item.title}
                                                    </Text>
                                                    <Text style={styles.timeText}> {this.convertTime(item.duration)} </Text>
                                                </View>
                                            </View>
                                            <View style={styles.rightContainer} > 
                                                <Entypo 
                                                    name='dots-three-vertical'
                                                    size={20}
                                                    color={color.FONT_MEDIUM}
                                                    onPress={() => console.log("option point")}
                                                />
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={styles.separator}></View>
                                </View>
                            );
                        })
                    }
                        
                    </View>
                </ScrollView>
    
                <View>
                    <OptionModal 
                        visible={this.state.isVisibleModal} 
                        onClose={this.closeModal}
                        currentAudio={this.state.currentAudio}
                    />
                </View>
                
            </View>
        )
    }
}

export default AudioList

const { width , height } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: width-10,
        marginTop:2
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
        borderRadius: 25, // 25 pour le cercle
        marginTop: 2,
      
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


