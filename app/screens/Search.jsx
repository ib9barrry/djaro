import React from 'react'
import { View, Text } from 'react-native'

const Search = () => {
    return (
        <View style={styles.container} >
            <Text>Search</Text>
        </View>
    )
}

export default Search;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
})
