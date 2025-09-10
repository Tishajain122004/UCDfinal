// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import Block from './src/screens/block.jsx'
// import More from './src/screens/more.jsx'

// const Home = ({navigation}) => {
//   return (
//     <View style = {{width: '100%', height : "20%", backgroundColor : "skyblue", justifyContent : "center"}}>
//       <Text>home</Text>
//       <Button title='Block' onPress={() => navigation.navigate("block")}/>
//       <Button title='More' onPress={() => navigation.navigate("more")}/>
//     </View>
//   )
// }

// export default Home
// const styles = StyleSheet.create({})

import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'

const Home = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "skyblue" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Home</Text>

      <Button
        title="Go to Block"
        onPress={() => navigation.navigate("block")}
      />

      <Button
        title="Go to More"
        onPress={() => navigation.navigate("more")}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})
