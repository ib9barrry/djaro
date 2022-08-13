import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAudioForNextOpening = async (audio , index) => {

    try {
      await AsyncStorage.setItem("previousAudio" , JSON.stringify({ audio , index }));
    } catch (e) {
      // saving error
      console.log("error : , ", e);
    }
  }


export const convertTime = seconds => {
      seconds = Number(seconds);
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor((seconds % 3600) % 60);

      const hrs = h > 0 ? (h < 10 ? `0${h}:` : `${h}:`) : '';
      const mins = m > 0 ? (m < 10 ? `0${m}:` : `${m}:`) : '00:';
      const scnds = s > 0 ? (s < 10 ? `0${s}` : s) : '00';
      return `${hrs}${mins}${scnds}`;
  }