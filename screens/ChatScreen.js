import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8080');

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await axios.get('http://localhost:8080/patients/case');
        const initialMessage = { text: response.data.message, fromUser: false };
        setMessages([initialMessage]);
        setPatientId(response.data.patient.id); // Store the patient ID
      } catch (error) {
        console.error('Error fetching initial message:', error.message);
      }
    };

    fetchInitialMessage();

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('message', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, fromUser: false },
      ]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('disconnect');
    };
  }, []);
console.log("msgg",messages)
console.log("input",input)
  const sendMessage = () => {
    if (patientId) {
      const newMessages = [...messages, { text: input, fromUser: true }];
      setMessages(newMessages);
   

      socket.emit('message', { userId:patientId, input:input }); // Use stored patient ID
      setInput('');
    } else {
      console.error('Patient ID is not set.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={item.fromUser ? styles.userMessage : styles.botMessage}>
            <Text>{item.text}</Text>
            {item.fromUser && <Image source="https://via.placeholder.com/40"style={styles.profilePic} />}
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Type your message here..."
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 5,
    margin: 4,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    margin: 4,
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 8,
  },
});

















