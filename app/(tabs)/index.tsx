import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import ChatScreen from '../../screens/ChatScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
