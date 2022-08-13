// play audio 
export const play = async ( playbackObj , uri ) => {
    try {
        return await playbackObj.loadAsync(
            { uri : audio.url } , 
            { shouldPlay: true }
        );
    } catch (error) {
        console.log(" error inside player helper methode" , error.message);
    }
}


// pause audio 
export const pause = async ( playbackObj ) => {
    try {
        return await playbackObj.setStatusAsync({
           shouldPlay: false
        });
    } catch (error) {
        console.log(" error inside pause helper methode" , error.message);
    }
}


// Resume the audio  audio is loading but is not playing
export const resume = async ( playbackObj ) => {
    try {
        return await playbackObj.playAsync();
    } catch (error) {
        console.log(" error inside resume helper methode" , error.message);
    }
}