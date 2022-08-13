import React from 'react';
import {Dimensions, Text, View , Modal , StyleSheet , TouchableOpacity} from 'react-native'
import color from '../misc/color';


const { width , height } = Dimensions.get('window');


const OptionModal = ({visible , onClose}) => {

   
        return (
            <>
                <Modal animationType={"slide"} 
                visible={visible} 
                transparent={true}
                > 
                    <View style={styles.modal}>
                        <View style={{ flex:1 , flexDirection:'column' , justifyContent: 'flex-start' }}> 
                            <View style={{flex:1 , flexDirection: 'row' , justifyContent:'space-around' , alignItems: 'flex-start' }}>
                                <View>
                                    <Text style={styles.title} numberOfLines={1} >
                                        Dynamic title for or audio
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={ ()=> onClose() } style={{ borderWidth:0 , margin:0,padding:0 }}>
                                    <Text style={{ color: 'black' , fontSize: 30, fontWeight:'bold' }}>X</Text>
                                </TouchableOpacity>
                            </View>
                            <View> 
                                <View style={styles.optionContainer} >
                                    <Text style={styles.option} > Play </Text>
                                    <Text style={styles.option} > Add to Playlist </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
}

export default OptionModal;

const styles = StyleSheet.create({
    modal: {
        position: 'relative',
        margin: 'auto',
        height: height / 1.5,
        marginRight:0,
        marginLeft:0,
        backgroundColor: 'gray',
        backgroundColor: color.APP_BG,
        borderRadius: 20,
    },
    optionContainer: {
        padding: '20'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 0,
        color : color.FONT_MEDIUM,
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.FONT,
        paddingVertical: 10,
        letterSpacing: 1,
        justifyContent: 'space-around'
    },

 })