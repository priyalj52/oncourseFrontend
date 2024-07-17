// // screens/HomeScreen.js
// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// export default function HomeScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text>Welcome to Digital OPD</Text>
//       <Button
//         title="Start Chat"
        
//         onPress={() => navigation.navigate('Chat')}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });




// HomeScreen.js
import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const initialScore = 0; // Or fetch the initial score if needed

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />
      <Button
        title="Start Chat"
        onPress={() => navigation.navigate('Chat', { username, score: initialScore })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});

export default HomeScreen;

