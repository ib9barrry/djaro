import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import AudioProvider from './app/context/AudioProvider';

export default function App() {
  return (
   <AudioProvider>
     <NavigationContainer>
       <AppNavigator />
     </NavigationContainer>
   </AudioProvider>
   
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
