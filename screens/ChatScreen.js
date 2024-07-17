import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import io from "socket.io-client";
import axios from "axios";
import CustomHeader from "../components/CustomHeader";
const socket = io("http://localhost:8080");

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { username, score: initialScore } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [diagnosisScore, setDiagnosisScore] = useState(0);
  const [labScore, setLabScore] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <CustomHeader username={username} />,
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <Text style={styles.headerRightText}>Score: {totalScore}/10</Text>
        </View>
      ),
    });
  }, [navigation, username, totalScore]);
  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await axios.get("http://localhost:8080/patients/case");
        const patient = response.data.patient;

        // Initial greeting message without "Senior AI Doctor"
        const initialGreeting = `Hi, Dr. ${username}. Good to see you.I've been having ${patient.symptoms} lately, and I've noticed I'm experiencing ${patient.additional_info}.`;

        // Dynamic patient-specific message

        const question = response.data.message;
        // Push initial greeting separately
        setMessages([
          { text: initialGreeting, fromUser: false, initial: true },
        ]);

        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: question, fromUser: false },
          ]);
        }, 1000);

        setPatientId(patient.id);
      } catch (error) {
        console.error("Error fetching initial message:", error.message);
      }
    };

    fetchInitialMessage();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, fromUser: false },
      ]);
      if (data.response.includes("Total score:")) {
        const score = data.response.match(/Total score: (\d+)/);
        if (score) {
          setTotalScore(parseInt(score[1]));
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("totalScore", (data) => {
      console.log("total", data);
      setTotalScore(data.totalScore);
    });
    socket.on("labScore", (data) => {
      console.log("labScore", data);
      setLabScore(data.labScore);
    });
    socket.on("diagnosisScore", (data) => {
      console.log("diagnosisScore", data);
      setDiagnosisScore(data.diagnosisScore);
    });


    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("disconnect");
    };
  }, []);

  const sendMessage = () => {
    if (patientId) {
      const newMessages = [
        ...messages,
        { text: input, fromUser: true, initial: false },
      ];
      setMessages(newMessages);

      socket.emit("message", { userId: patientId, input: input }); // Use stored patient ID
      setInput("");
    } else {
      console.error("Patient ID is not set.");
    }
  };

  const navigateToReportCard = () => {
    // Navigate to ReportCard screen and pass necessary props
    navigation.navigate('ReportCard', {
      totalScore: labScore+diagnosisScore, // Pass total score as prop
      labScore: labScore, // Pass lab score as prop (if applicable)
      diagnosisScore: diagnosisScore, // Pass diagnosis score as prop (if applicable)
    });
  };



  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={item.fromUser ? styles.userMessage : styles.botMessage}>
            {!item.initial && !item.fromUser && (
              <div
                style={{ display: "flex", gap: "5px", flexDirection: "column" }}
              >
                <div style={{ display: "flex", gap: "5px" }}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/40" }}
                    style={styles.profilePic}
                  />
                  <Text>Senior AI Doctor</Text>
                </div>
                <Text>{item.text}</Text>
              </div>
            )}
            {item.fromUser && (
              <div
                style={{ display: "flex", gap: "5px", flexDirection: "column" }}
              >
                <div style={{ display: "flex", gap: "5px" }}>
                  <div>You</div>
                  <Image
                    source={{ uri: "https://via.placeholder.com/40" }}
                    style={styles.profilePic}
                  />
                </div>
                <div>{item.text}</div>
              </div>
            )}
            {item.initial && <Text>{item.text}</Text>}
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
      {/* <Text style={styles.scoreText}>Total Score: {totalScore}/10</Text> */}
      <TouchableOpacity onPress={navigateToReportCard}>
        <Text>View Report Card</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userMessage: {
    alignSelf: "flex-end",
    // backgroundColor: "#DCF8C6",
    backgroundColor: "#ECECEC",
    borderRadius: 5,
    margin: 4,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
    borderRadius: 5,
    margin: 4,
    padding: 8,
  },
  headerRightText: {
    borderWidth: 1,

    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#1C91F2",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
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
  scoreText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
